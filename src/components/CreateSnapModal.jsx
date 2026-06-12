import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'rust',
  'sql',
  'go',
  'java',
  'cpp',
]

const EMPTY_FORM = {
  title: '',
  code_content: '',
  language: 'javascript',
}

export default function CreateSnapModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && !isSubmitting) onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose, isSubmitting])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    const result = await onSubmit(form)

    setIsSubmitting(false)

    if (result?.success === false) {
      setSubmitError(result.error ?? 'Failed to publish snap. Please try again.')
      return
    }

    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-snap-title"
    >
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        disabled={isSubmitting}
      />

      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-surface shadow-modal">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 id="create-snap-title" className="text-lg font-medium text-white">
              Create New Snap
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Capture a breakthrough snippet for your engineering ledger.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isSubmitting}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-white disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Title
            </span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="What did you learn or fix?"
              className="w-full rounded-lg border border-border bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-accent-cyan/50"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Language
            </span>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-black px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent-cyan/50"
            >
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Code Content
            </span>
            <textarea
              name="code_content"
              value={form.code_content}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Paste your snippet here..."
              className="w-full resize-y rounded-lg border border-border bg-black px-3 py-2.5 font-mono text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-accent-cyan/50"
            />
          </label>

          {submitError && (
            <p className="rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-2 text-xs text-red-400">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-accent-cyan px-5 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Snap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
