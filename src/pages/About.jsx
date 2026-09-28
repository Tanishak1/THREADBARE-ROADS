import { Link } from 'react-router-dom'

const stack = ['React + Vite', 'FastAPI', 'PostgreSQL + pgvector', 'LangChain + Groq', 'JWT Auth', 'Google Maps']

export default function About() {
  return (
    <div>
      <section className="bg-night text-paper">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-marigold text-xs uppercase tracking-[.2em]">Smart India Hackathon · SIH 26204</p>
          <h1 className="font-display text-5xl md:text-6xl mt-4">One journey. One platform. More local opportunity.</h1>
          <p className="mt-6 text-paper/70 text-lg max-w-3xl leading-relaxed">
            THREADBARE ROADS is an India-focused tourism platform that brings discovery,
            AI-assisted planning, stays, local mobility and local vendors into a connected traveller experience.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-vermillion text-xs uppercase tracking-widest font-semibold">The problem</p>
          <h2 className="font-display text-3xl mt-2">Travel planning is fragmented.</h2>
          <p className="mt-4 text-ink/70 leading-relaxed">Travellers jump between sources to understand a destination, build an itinerary, find a stay and arrange local movement. At the same time, smaller local tourism businesses can be disconnected from that digital journey.</p>
        </div>
        <div>
          <p className="text-teal-dark text-xs uppercase tracking-widest font-semibold">Our approach</p>
          <h2 className="font-display text-3xl mt-2">Connect the journey end to end.</h2>
          <p className="mt-4 text-ink/70 leading-relaxed">The prototype combines city discovery, structured AI itinerary planning, authenticated travel services, booking history and a vendor onboarding/listing flow within one product architecture.</p>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/30">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <p className="text-xs uppercase tracking-widest text-ink/50">Prototype technology</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {stack.map((item) => <span key={item} className="border border-ink/15 bg-paper px-4 py-2 text-sm font-medium">{item}</span>)}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="font-display text-3xl">What judges can demonstrate</h2>
        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            ['Explore', 'Cities, heritage, food and local context.'],
            ['Plan', 'Constraint-based AI itinerary workflow.'],
            ['Travel', 'Stay, movement and traveller booking flows.'],
            ['Vendor', 'Local business onboarding and listings.'],
          ].map(([title, copy]) => <div key={title} className="border-t-2 border-night pt-4"><h3 className="font-display text-2xl">{title}</h3><p className="mt-2 text-sm text-ink/65">{copy}</p></div>)}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/plan" className="bg-night text-paper px-5 py-3 font-semibold">Try AI Planner →</Link>
          <Link to="/vendor" className="border border-night px-5 py-3 font-semibold">Open Vendor Portal</Link>
        </div>
      </section>
    </div>
  )
}
