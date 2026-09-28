// A circular "passport stamp" badge standing in for the usual five-star row —
// ties visually to the travel-journal theme and reads at a glance.
export default function RatingStamp({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2 text-teal">
      <div className="stamp w-12 h-12 flex flex-col items-center justify-center shrink-0 rotate-[-6deg]">
        <span className="font-display font-semibold text-sm leading-none">
          {rating.toFixed(1)}
        </span>
      </div>
      <span className="text-xs text-ink/60 leading-tight">
        {reviews.toLocaleString('en-IN')}
        <br />
        reviews
      </span>
    </div>
  )
}
