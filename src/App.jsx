import { useEffect, useMemo, useState } from 'react'
import { Code2, Search, Zap } from 'lucide-react'
import Sidebar from './components/Sidebar'
import SnapCard from './components/SnapCard'
import CreateSnapModal from './components/CreateSnapModal'
import FloatingActionButton from './components/FloatingActionButton'
import { supabase } from './supabaseClient'

const TAB_CONFIG = {
  feed: {
    eyebrow: 'Developer Feed',
    title: 'Engineering Ledger',
    description: (count) =>
      `${count} snap${count === 1 ? '' : 's'} in your timeline`,
  },
  explore: {
    eyebrow: 'Explore',
    title: 'Discover Snippets',
    description: (count) => `${count} snap${count === 1 ? '' : 's'} across the community`,
  },
  languages: {
    eyebrow: 'Languages',
    title: 'Browse by Language',
    description: (count) =>
      `${count} snap${count === 1 ? '' : 's'} matching your language filter`,
  },
  til: {
    eyebrow: 'TIL Archive',
    title: 'Today I Learned',
    description: (count) =>
      `${count} learning moment${count === 1 ? '' : 's'} archived`,
  },
  trending: {
    eyebrow: 'Trending',
    title: 'Hot Snippets',
    description: (count) => `${count} trending snap${count === 1 ? '' : 's'} this week`,
  },
  collections: {
    eyebrow: 'Collections',
    title: 'Curated Stacks',
    description: (count) => `${count} language collection${count === 1 ? '' : 's'}`,
  },
  settings: {
    eyebrow: 'Preferences',
    title: 'Settings',
    description: () => 'Customize your DevSnap workspace',
  },
}

const TIL_KEYWORDS = /\b(learn|fix|memoize|parse|validate|index|race condition|til)\b/i

function matchesSearch(snap, query) {
  if (!query) return true
  const haystack = `${snap.title} ${snap.username} ${snap.language}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

function getSnapsForTab(snaps, tab) {
  switch (tab) {
    case 'explore':
      return [...snaps].sort((a, b) => a.language.localeCompare(b.language))
    case 'til':
      return snaps.filter((snap) => TIL_KEYWORDS.test(snap.title))
    case 'trending':
      return [...snaps]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
    default:
      return snaps
  }
}

function ToggleRow({ label, description, enabled, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-black px-4 py-4 transition-colors hover:border-zinc-800">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          enabled ? 'bg-accent-cyan' : 'bg-zinc-800'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            enabled ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </label>
  )
}

function AuthOverlay({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  authError,
  isAuthSubmitting,
  onSubmit,
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-modal">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10">
            <Code2 className="h-5 w-5 text-accent-cyan" strokeWidth={2.2} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">DevSnap</h1>
          <p className="mt-2 text-sm text-zinc-500">
            {authMode === 'signin'
              ? 'Sign in to access your engineering ledger.'
              : 'Create an account to start documenting snippets.'}
          </p>
        </div>

        <div className="mb-6 flex rounded-lg border border-border bg-black p-1">
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              authMode === 'signin'
                ? 'bg-zinc-900 text-accent-cyan'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              authMode === 'signup'
                ? 'bg-zinc-900 text-accent-cyan'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={onSubmit} autoComplete="off" className="space-y-4">
          {authError && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-300">
              {authError}
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="new-password"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-border bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-accent-cyan/50"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-border bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-accent-cyan/50"
            />
          </label>

          <button
            type="submit"
            disabled={isAuthSubmitting}
            className="mt-2 w-full rounded-lg bg-accent-cyan py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isAuthSubmitting
              ? 'Please wait...'
              : authMode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authMode, setAuthMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false)

  const [snaps, setSnaps] = useState([])
  const [isLoadingSnaps, setIsLoadingSnaps] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [currentTab, setCurrentTab] = useState('feed')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [compactFeed, setCompactFeed] = useState(false)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return undefined

    async function fetchSnaps() {
      setIsLoadingSnaps(true)
      setFetchError('')

      const { data, error } = await supabase
        .from('dev_snaps')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setFetchError(error.message)
        setSnaps([])
      } else {
        setSnaps(data ?? [])
      }

      setIsLoadingSnaps(false)
    }

    fetchSnaps()
  }, [user])

  const languages = useMemo(
    () => [...new Set(snaps.map((snap) => snap.language))].sort(),
    [snaps],
  )

  const tabSnaps = useMemo(() => getSnapsForTab(snaps, currentTab), [snaps, currentTab])

  const languageFilteredSnaps = useMemo(() => {
    if (currentTab !== 'languages' || selectedLanguage === 'all') return tabSnaps
    return tabSnaps.filter((snap) => snap.language === selectedLanguage)
  }, [tabSnaps, currentTab, selectedLanguage])

  const filteredSnaps = useMemo(() => {
    const baseSnaps = currentTab === 'languages' ? languageFilteredSnaps : tabSnaps
    return baseSnaps.filter((snap) => matchesSearch(snap, query))
  }, [languageFilteredSnaps, tabSnaps, currentTab, query])

  const collections = useMemo(() => {
    const grouped = filteredSnaps.reduce((acc, snap) => {
      if (!acc[snap.language]) acc[snap.language] = []
      acc[snap.language].push(snap)
      return acc
    }, {})

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredSnaps])

  const tabMeta = TAB_CONFIG[currentTab] ?? TAB_CONFIG.feed
  const isSettingsView = currentTab === 'settings'

  function handleTabChange(tab) {
    setCurrentTab(tab)
    setQuery('')
    if (tab !== 'languages') setSelectedLanguage('all')
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    setAuthError('')
    setIsAuthSubmitting(true)

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }

      setPassword('')
    } catch (error) {
      setAuthError(error.message ?? 'Authentication failed. Please try again.')
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  async function handleLogout() {
    setAuthError('')
    setSnaps([])
    setFetchError('')
    await supabase.auth.signOut()
    setCurrentTab('feed')
    setIsModalOpen(false)
  }

  async function handleCreateSnap(formData) {
    if (!user?.email) {
      return { success: false, error: 'You must be signed in to publish a snap.' }
    }

    const { data, error } = await supabase
      .from('dev_snaps')
      .insert({
        username: user.email,
        title: formData.title,
        code_content: formData.code_content,
        language: formData.language,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to publish snap:', error.message)
      return { success: false, error: error.message }
    }

    setSnaps((current) => [data, ...current])
    return { success: true }
  }

  function renderSettingsPanel() {
    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-sm font-medium text-white">Account</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Your authenticated identity is linked to every snap you publish.
          </p>
          <div className="mt-5 rounded-lg border border-border bg-black px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
              Email
            </p>
            <p className="mt-1 truncate text-sm text-accent-cyan">{user?.email}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-sm font-medium text-white">Interface</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Personalize how DevSnap looks and feels while you browse.
          </p>

          <div className="mt-5 space-y-3">
            <ToggleRow
              label="Compact feed"
              description="Reduce spacing between snap cards for a denser timeline."
              enabled={compactFeed}
              onChange={setCompactFeed}
            />
            <ToggleRow
              label="Show line numbers"
              description="Display IDE-style line numbers inside code blocks."
              enabled={showLineNumbers}
              onChange={setShowLineNumbers}
            />
            <ToggleRow
              label="Reduce motion"
              description="Minimize transitions and hover animations across the UI."
              enabled={reducedMotion}
              onChange={setReducedMotion}
            />
          </div>
        </section>
      </div>
    )
  }

  function renderMainContent() {
    if (isSettingsView) return renderSettingsPanel()

    if (isLoadingSnaps) {
      return (
        <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
          <p className="text-sm text-zinc-500">Loading snaps from the cloud...</p>
        </div>
      )
    }

    if (fetchError) {
      return (
        <div className="rounded-2xl border border-red-900/40 bg-surface px-6 py-16 text-center">
          <p className="text-sm text-red-400">Could not load snaps: {fetchError}</p>
        </div>
      )
    }

    if (currentTab === 'collections') {
      if (collections.length === 0) {
        return (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <p className="text-sm text-zinc-500">No collections match your search.</p>
          </div>
        )
      }

      return collections.map(([language, languageSnaps]) => (
        <section key={language} className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-sm uppercase tracking-wider text-accent-yellow">
              {language}
            </h2>
            <span className="text-xs text-zinc-600">
              {languageSnaps.length} snap{languageSnaps.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className={`flex flex-col ${compactFeed ? 'gap-4' : 'gap-6'}`}>
            {languageSnaps.map((snap) => (
              <SnapCard key={snap.id} snap={snap} showLineNumbers={showLineNumbers} />
            ))}
          </div>
        </section>
      ))
    }

    if (filteredSnaps.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="text-sm text-zinc-500">
            {currentTab === 'til'
              ? 'No TIL snaps match your search yet.'
              : 'No snaps match your current view.'}
          </p>
        </div>
      )
    }

    return filteredSnaps.map((snap) => (
      <SnapCard key={snap.id} snap={snap} showLineNumbers={showLineNumbers} />
    ))
  }

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <p className="text-sm text-zinc-500">Loading session...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <AuthOverlay
        authMode={authMode}
        setAuthMode={(mode) => {
          setAuthMode(mode)
          setAuthError('')
        }}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        authError={authError}
        isAuthSubmitting={isAuthSubmitting}
        onSubmit={handleAuthSubmit}
      />
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-border bg-canvas px-6 py-5 lg:px-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-accent-yellow">
                <Zap className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
                  {tabMeta.eyebrow}
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {tabMeta.title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {isSettingsView
                  ? tabMeta.description()
                  : tabMeta.description(filteredSnaps.length)}
              </p>
            </div>

            {!isSettingsView && (
              <label className="relative block w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search snaps..."
                  className="w-full rounded-xl border border-border bg-black py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-accent-cyan/40"
                />
              </label>
            )}
          </div>

          {currentTab === 'languages' && (
            <div className="mx-auto mt-5 flex max-w-3xl flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedLanguage('all')}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedLanguage === 'all'
                    ? 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan'
                    : 'border-border bg-black text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                All languages
              </button>
              {languages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => setSelectedLanguage(language)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-xs uppercase transition-colors ${
                    selectedLanguage === language
                      ? 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan'
                      : 'border-border bg-black text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </header>

        <main
          className={`min-h-0 flex-1 overflow-y-auto px-6 py-8 lg:px-10 ${
            reducedMotion ? '[&_*]:!transition-none' : ''
          }`}
        >
          <div
            className={`mx-auto flex max-w-3xl flex-col ${compactFeed ? 'gap-4' : 'gap-6'}`}
          >
            {renderMainContent()}
          </div>
        </main>
      </div>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <CreateSnapModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateSnap}
        />
      )}
    </div>
  )
}

export default App
