import { Plus } from 'lucide-react'

export default function FloatingActionButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Create new snap"
      className="group fixed bottom-8 right-8 z-40 flex h-14 items-center gap-2 overflow-hidden rounded-full border border-accent-cyan/30 bg-accent-cyan pl-4 pr-5 text-sm font-medium text-black shadow-glow transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(34,211,238,0.25)]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10">
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="hidden sm:inline">New Snap</span>
    </button>
  )
}
