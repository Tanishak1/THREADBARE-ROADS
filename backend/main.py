from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from functools import lru_cache
import json
from typing import Literal

import httpx
import jwt
from fastapi import Body, Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from pgvector.sqlalchemy import Vector
from passlib.context import CryptContext
from pydantic import AliasChoices, BaseModel, ConfigDict, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import Boolean, ForeignKey, Integer, String, Text, create_engine, or_, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/tourism"
    groq_api_key: str | None = None
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    frontend_origin: str = "http://localhost:5173"
    bhashini_transcribe_url: str | None = None
    bhashini_api_key: str | None = None
    jwt_secret_key: str | None = Field(default=None, min_length=32)
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
engine_connect_args = {"timeout": 5} if settings.database_url.startswith("sqlite") else {"connect_timeout": 5}
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    connect_args=engine_connect_args,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
password_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


class Base(DeclarativeBase):
    pass


class LocalPlace(Base):
    """A monument or vendor document used as RAG context."""

    __tablename__ = "local_places"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    destination: Mapped[str] = mapped_column(String(120), index=True)
    name: Mapped[str] = mapped_column(String(200))
    place_type: Mapped[str] = mapped_column(String(40))
    description: Mapped[str] = mapped_column(Text)
    embedding: Mapped[list[float]] = mapped_column(Vector(384))


class VendorUser(Base):
    __tablename__ = "vendor_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    business_name: Mapped[str] = mapped_column(String(160), nullable=False)
    business_type: Mapped[str] = mapped_column(String(80), nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=False, default="")


class CustomerUser(Base):
    __tablename__ = "customer_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)


class VendorListing(Base):
    __tablename__ = "vendor_listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    vendor_id: Mapped[int] = mapped_column(ForeignKey("vendor_users.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    listing_type: Mapped[str] = mapped_column(String(40), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)
    location: Mapped[str] = mapped_column(String(160), nullable=False)
    weekend_price: Mapped[float] = mapped_column(nullable=False, default=0)
    tax_percent: Mapped[float] = mapped_column(nullable=False, default=12)
    room_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    available_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    max_guests: Mapped[int] = mapped_column(Integer, nullable=False, default=2)
    size_sqm: Mapped[float] = mapped_column(nullable=False, default=0)
    amenities: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class VendorRegisterRequest(BaseModel):
    phone_number: str = Field(min_length=7, max_length=20)
    password: str = Field(min_length=8, max_length=128)
    business_name: str = Field(min_length=2, max_length=160)
    business_type: str = Field(min_length=2, max_length=80)
    city: str = Field(min_length=2, max_length=120)


class VendorLoginRequest(BaseModel):
    phone_number: str = Field(min_length=7, max_length=20)
    password: str = Field(min_length=1, max_length=128)


class CustomerRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=8, max_length=128)


class CustomerLoginRequest(BaseModel):
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=1, max_length=128)


class CustomerProfile(BaseModel):
    id: int
    name: str
    email: str


class CustomerAuthResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: CustomerProfile


class VendorProfile(BaseModel):
    id: int
    phone_number: str
    business_name: str
    business_type: str
    city: str


class VendorAuthResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    vendor: VendorProfile


class VendorListingRequest(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    listing_type: Literal["room", "local_product", "food", "experience"]
    description: str = Field(min_length=5, max_length=2000)
    price: float = Field(gt=0, le=10_000_000)
    location: str = Field(min_length=2, max_length=160)
    weekend_price: float | None = Field(default=None, gt=0, le=10_000_000)
    tax_percent: float = Field(default=12, ge=0, le=100)
    room_count: int = Field(default=1, ge=1, le=10_000)
    available_count: int | None = Field(default=None, ge=0, le=10_000)
    max_guests: int = Field(default=2, ge=1, le=20)
    size_sqm: float = Field(default=0, ge=0, le=10_000)
    amenities: list[str] = Field(default_factory=list, max_length=20)
    image_url: str | None = Field(default=None, max_length=500)
    is_active: bool = True


class VendorListingResponse(BaseModel):
    id: int
    vendor_id: int
    title: str
    listing_type: str
    description: str
    price: float
    location: str
    weekend_price: float
    tax_percent: float
    room_count: int
    available_count: int
    max_guests: int
    size_sqm: float
    amenities: list[str]
    image_url: str | None
    is_active: bool
    vendor_name: str | None = None


class ItineraryRequest(BaseModel):
    destination: str = Field(min_length=2, max_length=120)
    days: int = Field(ge=1, le=30)
    budget: str = Field(min_length=1, max_length=40)
    accommodation: Literal['local_homestay', 'budget_hotel', 'luxury', 'hostel'] = Field(
        validation_alias=AliasChoices('accommodation', 'accommodation_preference')
    )
    transport: Literal['local_auto_rickshaw', 'cab', 'public_transit', 'walking'] = Field(
        validation_alias=AliasChoices('transport', 'transport_mode')
    )
    interests: list[str] = Field(default_factory=list, max_length=10)


class Activity(BaseModel):
    name: str
    type: str
    description: str
    location: str
    transit_to_next: str


class AccommodationRecommendation(BaseModel):
    name: str
    type: str
    reason: str


class ItineraryDay(BaseModel):
    day: int
    theme: str
    accommodation: AccommodationRecommendation
    activities: list[Activity]


class ItineraryResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    destination: str
    summary: str
    days: list[ItineraryDay]


@lru_cache(maxsize=1)
def get_embeddings() -> Embeddings:
    return HuggingFaceEmbeddings(model_name=settings.embedding_model)


def retrieve_local_context(request: ItineraryRequest) -> str:
    query_text = f"{request.destination}: {', '.join(request.interests) or 'local culture and highlights'}"
    query_embedding = get_embeddings().embed_query(query_text)
    distance = LocalPlace.embedding.cosine_distance(query_embedding)

    with SessionLocal() as session:
        statement = (
            select(LocalPlace)
            .where(
                or_(
                    LocalPlace.destination.ilike(f"%{request.destination}%"),
                    LocalPlace.destination.ilike("%India%"),
                )
            )
            .order_by(distance)
            .limit(12)
        )
        places = session.scalars(statement).all()

    if not places:
        return "No local place records matched. Do not invent specific monument or vendor facts."

    return "\n".join(
        f"- {place.name} ({place.place_type}) in {place.destination}: {place.description}"
        for place in places
    )


planner_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a careful local travel planner. Create a practical day-wise itinerary using only the supplied retrieval context for specific monuments and vendors. Respect the requested number of days, budget, interests, accommodation choice, and transport choice. Return only the structured JSON response required by the schema.

Every day must include an accommodation recommendation for a local homestay or hotel that matches the user's budget and accommodation preference. Use a retrieved place as the name only when it is present in the context; otherwise use a generic recommendation such as 'A budget hotel near the main market' and clearly explain that it is a type recommendation.

Every activity must include transit_to_next. It must give practical instructions between that waypoint and the next waypoint, using the user's preferred transport mode and a realistic approximate duration, for example: 'Take a local auto-rickshaw for about 10 minutes to reach the next spot.' For the final activity of the day, describe how to return to the recommended accommodation or write 'No onward transfer planned.' Never omit this field.""",
        ),
        (
            "human",
            """Destination: {destination}
Days: {days}
Budget: {budget}
Accommodation preference: {accommodation}
Preferred mode of transport: {transport}
Interests: {interests}

Retrieved local context:
{context}""",
        ),
    ]
)


@lru_cache(maxsize=1)
def build_planner_chain():
    if not settings.groq_api_key:
        raise RuntimeError("GROQ_API_KEY is not configured.")

    model = ChatGroq(
        model="llama-3.1-70b-versatile",
        temperature=0.2,
        api_key=settings.groq_api_key,
    )
    return planner_prompt | model.with_structured_output(ItineraryResponse)


def normalize_phone_number(phone_number: str) -> str:
    return "".join(character for character in phone_number.strip() if character.isdigit() or character == "+")


def normalize_email(email: str) -> str:
    return email.strip().lower()


def require_jwt_secret() -> str:
    if not settings.jwt_secret_key:
        raise HTTPException(status_code=503, detail="JWT authentication is not configured.")
    return settings.jwt_secret_key


def get_authenticated_vendor(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> VendorUser:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="A vendor bearer token is required.")

    try:
        payload = jwt.decode(
            credentials.credentials,
            require_jwt_secret(),
            algorithms=[settings.jwt_algorithm],
        )
        if payload.get("type") != "vendor" or not payload.get("sub"):
            raise ValueError("Invalid vendor token claims")
        vendor_id = int(payload["sub"])
    except (jwt.InvalidTokenError, TypeError, ValueError) as error:
        raise HTTPException(status_code=401, detail="Invalid or expired vendor token.") from error

    ensure_vendor_table()
    with SessionLocal() as session:
        vendor = session.get(VendorUser, vendor_id)
    if not vendor:
        raise HTTPException(status_code=401, detail="Vendor account no longer exists.")
    return vendor


def create_access_token(vendor: VendorUser) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": str(vendor.id),
        "phone_number": vendor.phone_number,
        "type": "vendor",
        "exp": expires_at,
    }
    return jwt.encode(payload, require_jwt_secret(), algorithm=settings.jwt_algorithm)


def vendor_profile(vendor: VendorUser) -> VendorProfile:
    return VendorProfile(
        id=vendor.id,
        phone_number=vendor.phone_number,
        business_name=vendor.business_name,
        business_type=vendor.business_type,
        city=vendor.city,
    )


def customer_profile(user: CustomerUser) -> CustomerProfile:
    return CustomerProfile(id=user.id, name=user.name, email=user.email)


def create_customer_access_token(user: CustomerUser) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": str(user.id), "email": user.email, "type": "customer", "exp": expires_at}
    return jwt.encode(payload, require_jwt_secret(), algorithm=settings.jwt_algorithm)


def ensure_vendor_table() -> None:
    try:
        VendorUser.__table__.create(bind=engine, checkfirst=True)
        ensure_sqlite_columns("vendor_users", {"city": "VARCHAR(120) NOT NULL DEFAULT ''"})
    except Exception as error:
        raise HTTPException(status_code=503, detail="Vendor database is unavailable.") from error


def ensure_customer_table() -> None:
    try:
        CustomerUser.__table__.create(bind=engine, checkfirst=True)
    except Exception as error:
        raise HTTPException(status_code=503, detail="Account database is unavailable.") from error


def ensure_listing_table() -> None:
    try:
        VendorListing.__table__.create(bind=engine, checkfirst=True)
        ensure_sqlite_columns(
            "vendor_listings",
            {
                "weekend_price": "FLOAT NOT NULL DEFAULT 0",
                "tax_percent": "FLOAT NOT NULL DEFAULT 12",
                "room_count": "INTEGER NOT NULL DEFAULT 1",
                "available_count": "INTEGER NOT NULL DEFAULT 1",
                "max_guests": "INTEGER NOT NULL DEFAULT 2",
                "size_sqm": "FLOAT NOT NULL DEFAULT 0",
                "amenities": "TEXT NOT NULL DEFAULT '[]'",
                "image_url": "VARCHAR(500)",
            },
        )
    except Exception as error:
        raise HTTPException(status_code=503, detail="Vendor listing database is unavailable.") from error


def ensure_sqlite_columns(table_name: str, columns: dict[str, str]) -> None:
    if engine.dialect.name != "sqlite":
        return
    with engine.connect() as connection:
        existing = {row[1] for row in connection.execute(text(f"PRAGMA table_info({table_name})"))}
        for column_name, column_definition in columns.items():
            if column_name not in existing:
                connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}"))
        connection.commit()


def listing_response(listing: VendorListing) -> VendorListingResponse:
    try:
        amenities = json.loads(listing.amenities or "[]")
    except (TypeError, ValueError):
        amenities = []
    return VendorListingResponse(
        id=listing.id,
        vendor_id=listing.vendor_id,
        title=listing.title,
        listing_type=listing.listing_type,
        description=listing.description,
        price=listing.price,
        location=listing.location,
        weekend_price=listing.weekend_price or listing.price,
        tax_percent=listing.tax_percent,
        room_count=listing.room_count,
        available_count=min(listing.available_count, listing.room_count),
        max_guests=listing.max_guests,
        size_sqm=listing.size_sqm,
        amenities=amenities,
        image_url=listing.image_url,
        is_active=listing.is_active,
    )


def public_listing_response(listing: VendorListing, vendor_name: str) -> VendorListingResponse:
    response = listing_response(listing)
    return response.model_copy(update={"vendor_name": vendor_name})


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app = FastAPI(title="Tourism Itinerary API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/vendor/register", response_model=VendorAuthResponse, status_code=201)
def register_vendor(request: VendorRegisterRequest) -> VendorAuthResponse:
    ensure_vendor_table()
    phone_number = normalize_phone_number(request.phone_number)
    if len(phone_number) < 7:
        raise HTTPException(status_code=422, detail="Enter a valid phone number.")

    vendor = VendorUser(
        phone_number=phone_number,
        password_hash=password_context.hash(request.password),
        business_name=request.business_name.strip(),
        business_type=request.business_type.strip(),
        city=request.city.strip(),
    )
    with SessionLocal() as session:
        try:
            session.add(vendor)
            session.commit()
            session.refresh(vendor)
        except IntegrityError as error:
            session.rollback()
            raise HTTPException(status_code=409, detail="A vendor account already exists for this phone number.") from error
        except Exception as error:
            session.rollback()
            raise HTTPException(status_code=503, detail="Vendor database is unavailable.") from error

    return VendorAuthResponse(access_token=create_access_token(vendor), vendor=vendor_profile(vendor))


@app.post("/api/auth/signup", response_model=CustomerAuthResponse, status_code=201)
def register_customer(request: CustomerRegisterRequest) -> CustomerAuthResponse:
    ensure_customer_table()
    email = normalize_email(request.email)
    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    user = CustomerUser(
        name=request.name.strip(),
        email=email,
        password_hash=password_context.hash(request.password),
    )
    with SessionLocal() as session:
        try:
            session.add(user)
            session.commit()
            session.refresh(user)
        except IntegrityError as error:
            session.rollback()
            raise HTTPException(status_code=409, detail="An account already exists for this email.") from error
        except Exception as error:
            session.rollback()
            raise HTTPException(status_code=503, detail="Account database is unavailable.") from error
    return CustomerAuthResponse(access_token=create_customer_access_token(user), user=customer_profile(user))


@app.post("/api/auth/login", response_model=CustomerAuthResponse)
def login_customer(request: CustomerLoginRequest) -> CustomerAuthResponse:
    ensure_customer_table()
    email = normalize_email(request.email)
    with SessionLocal() as session:
        user = session.scalar(select(CustomerUser).where(CustomerUser.email == email))
    if not user or not password_context.verify(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    return CustomerAuthResponse(access_token=create_customer_access_token(user), user=customer_profile(user))


@app.post("/api/vendor/login", response_model=VendorAuthResponse)
def login_vendor(request: VendorLoginRequest) -> VendorAuthResponse:
    ensure_vendor_table()
    phone_number = normalize_phone_number(request.phone_number)
    with SessionLocal() as session:
        vendor = session.scalar(select(VendorUser).where(VendorUser.phone_number == phone_number))

    if not vendor or not password_context.verify(request.password, vendor.password_hash):
        raise HTTPException(status_code=401, detail="Invalid phone number or password.")

    return VendorAuthResponse(access_token=create_access_token(vendor), vendor=vendor_profile(vendor))


@app.post("/api/vendor/listings", response_model=VendorListingResponse, status_code=201)
def create_vendor_listing(
    request: VendorListingRequest,
    vendor: VendorUser = Depends(get_authenticated_vendor),
) -> VendorListingResponse:
    ensure_listing_table()
    listing_location = request.location.strip()
    if listing_location.casefold() != vendor.city.strip().casefold():
        raise HTTPException(
            status_code=422,
            detail=f"This listing must be registered in {vendor.city}.",
        )
    available_count = request.available_count if request.available_count is not None else request.room_count
    if available_count > request.room_count:
        raise HTTPException(status_code=422, detail="Available rooms cannot exceed total rooms.")
    listing = VendorListing(
        vendor_id=vendor.id,
        title=request.title.strip(),
        listing_type=request.listing_type,
        description=request.description.strip(),
        price=request.price,
        location=listing_location,
        weekend_price=request.weekend_price or request.price,
        tax_percent=request.tax_percent,
        room_count=request.room_count,
        available_count=available_count,
        max_guests=request.max_guests,
        size_sqm=request.size_sqm,
        amenities=json.dumps(request.amenities),
        image_url=request.image_url,
        is_active=request.is_active,
    )
    with SessionLocal() as session:
        try:
            session.add(listing)
            session.commit()
            session.refresh(listing)
        except Exception as error:
            session.rollback()
            raise HTTPException(status_code=503, detail="Vendor listing could not be saved.") from error

    return listing_response(listing)


@app.get("/api/hotels", response_model=list[VendorListingResponse])
def search_public_hotels(city: str = "") -> list[VendorListingResponse]:
    requested_city = city.strip()
    if len(requested_city) < 2:
        return []
    ensure_listing_table()
    with SessionLocal() as session:
        rows = session.execute(
            select(VendorListing, VendorUser.business_name)
            .join(VendorUser, VendorUser.id == VendorListing.vendor_id)
            .where(
                VendorListing.listing_type == "room",
                VendorListing.is_active.is_(True),
                VendorListing.available_count > 0,
                VendorListing.location.ilike(requested_city),
                VendorUser.city.ilike(requested_city),
            )
            .order_by(VendorListing.price.asc())
        ).all()
    return [public_listing_response(listing, business_name) for listing, business_name in rows]


@app.patch("/api/vendor/listings/{listing_id}/availability", response_model=VendorListingResponse)
def update_listing_availability(
    listing_id: int,
    available_count: int = Body(..., embed=True, ge=0),
    vendor: VendorUser = Depends(get_authenticated_vendor),
) -> VendorListingResponse:
    ensure_listing_table()
    with SessionLocal() as session:
        listing = session.scalar(
            select(VendorListing).where(
                VendorListing.id == listing_id,
                VendorListing.vendor_id == vendor.id,
            )
        )
        if not listing:
            raise HTTPException(status_code=404, detail="Room type not found.")
        if available_count > listing.room_count:
            raise HTTPException(status_code=422, detail="Available rooms cannot exceed total rooms.")
        listing.available_count = available_count
        session.commit()
        session.refresh(listing)
    return listing_response(listing)


@app.get("/api/vendor/listings", response_model=list[VendorListingResponse])
def list_vendor_listings(
    vendor: VendorUser = Depends(get_authenticated_vendor),
) -> list[VendorListingResponse]:
    ensure_listing_table()
    with SessionLocal() as session:
        listings = session.scalars(
            select(VendorListing)
            .where(VendorListing.vendor_id == vendor.id)
            .order_by(VendorListing.id.desc())
        ).all()
    return [listing_response(listing) for listing in listings]


@app.delete("/api/vendor/listings/{listing_id}", status_code=204)
def delete_vendor_listing(
    listing_id: int,
    vendor: VendorUser = Depends(get_authenticated_vendor),
) -> None:
    ensure_listing_table()
    with SessionLocal() as session:
        listing = session.scalar(
            select(VendorListing).where(
                VendorListing.id == listing_id,
                VendorListing.vendor_id == vendor.id,
            )
        )
        if not listing:
            raise HTTPException(status_code=404, detail="Room type not found.")
        session.delete(listing)
        session.commit()


@app.post("/api/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    if not settings.bhashini_transcribe_url or not settings.bhashini_api_key:
        raise HTTPException(
            status_code=503,
            detail="Bhashini is not configured. Set BHASHINI_TRANSCRIBE_URL and BHASHINI_API_KEY.",
        )

    audio_bytes = await audio.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="The uploaded recording is empty.")

    headers = {"Authorization": settings.bhashini_api_key}
    files = {"audio": (audio.filename or "recording.webm", audio_bytes, audio.content_type or "audio/webm")}
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(settings.bhashini_transcribe_url, headers=headers, files=files)
        response.raise_for_status()
        result = response.json()
    except (httpx.HTTPError, ValueError) as error:
        raise HTTPException(status_code=502, detail="Bhashini transcription failed.") from error

    transcript = result.get("text") or result.get("transcript")
    if not transcript:
        raise HTTPException(status_code=502, detail="Bhashini returned no transcript text.")
    return {"text": transcript}


@app.post("/api/generate-itinerary", response_model=ItineraryResponse)
def generate_itinerary(request: ItineraryRequest) -> ItineraryResponse:
    try:
        context = retrieve_local_context(request)
        chain = build_planner_chain()
        return chain.invoke(
            {
                "destination": request.destination,
                "days": request.days,
                "budget": request.budget,
                "accommodation": request.accommodation,
                "transport": request.transport,
                "interests": ", ".join(request.interests) or "none specified",
                "context": context,
            }
        )
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="The itinerary service is temporarily unavailable.",
        ) from error