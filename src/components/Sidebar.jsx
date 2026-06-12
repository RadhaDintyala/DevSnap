import {
  BookOpen,
  Code2,
  Flame,
  Home,
  Layers,
  LogOut,
  Settings,
  Sparkles,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'feed', label: 'Feed', icon: Home },
  { id: 'explore', label: 'Explore', icon: Sparkles },
  { id: 'languages', label: 'Languages', icon: Code2 },
  { id: 'til', label: 'TIL Archive', icon: BookOpen },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'collections', label: 'Collections', icon: Layers },
]

export default function Sidebar({ currentTab, onTabChange, user, onLogout }) {
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-canvas px-4 py-6">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-cyan/30 bg-accent-cyan/10">
          <Code2 className="h-4 w-4 text-accent-cyan" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">DevSnap</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-600">
            Snippet Diary
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            aria-current={currentTab === id ? 'page' : undefined}
            className={`nav-item ${currentTab === id ? 'nav-item-active' : ''}`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <button
          type="button"
          onClick={() => onTabChange('settings')}
          aria-current={currentTab === 'settings' ? 'page' : undefined}
          className={`nav-item ${currentTab === 'settings' ? 'nav-item-active' : ''}`}
        >
          <Settings className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          <span>Settings</span>
        </button>

        {user && (
          <div className="mt-4 rounded-lg border border-border bg-surface px-3 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
              Signed in as
            </p>
            <p className="mt-1 truncate text-xs text-accent-cyan" title={user.email}>
              {user.email}
            </p>
            <button
              type="button"
              onClick={onLogout}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-black px-2 py-1.5 text-[11px] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
            >
              <LogOut className="h-3 w-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
