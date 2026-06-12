import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

function formatTimestamp(isoString) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(isoString))
}

export default function SnapCard({ snap, showLineNumbers = true }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snap.code_content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className="group rounded-2xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-zinc-800">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-accent-cyan">
              @{snap.username}
            </span>
            <span className="text-xs text-zinc-600">{formatTimestamp(snap.created_at)}</span>
          </div>
          <h2 className="text-lg font-medium tracking-tight text-white">{snap.title}</h2>
        </div>
        <span className="shrink-0 rounded-md border border-border bg-black px-2 py-1 font-mono text-[11px] uppercase text-accent-yellow">
          {snap.language}
        </span>
      </header>

      <div className="ide-window">
        <div className="ide-titlebar">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 truncate font-mono text-[11px] text-zinc-500">
            {snap.language} — snippet
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
            className="ml-auto flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-accent-cyan" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        </div>

        <SyntaxHighlighter
          language={snap.language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem 1rem',
            background: '#1e1e1e',
            fontSize: '0.8125rem',
            lineHeight: '1.65',
          }}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={
            showLineNumbers
              ? {
                  minWidth: '2.5em',
                  paddingRight: '1em',
                  color: '#4b5563',
                  userSelect: 'none',
                }
              : undefined
          }
        >
          {snap.code_content}
        </SyntaxHighlighter>
      </div>
    </article>
  )
}
