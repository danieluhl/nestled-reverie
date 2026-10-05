import { X } from 'lucide-react'
import { useId, useState } from 'react'

/** Type a topic and press Enter (or a comma). Existing topics are suggested as you type. */
export function TagInput({
  value,
  onChange,
  suggestions,
}: {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions: string[]
}) {
  const [draft, setDraft] = useState('')
  const listId = useId()
  const lower = value.map((v) => v.toLowerCase())

  function add(raw: string) {
    const name = raw.replace(/,/g, '').trim()
    if (name && !lower.includes(name.toLowerCase())) {
      // Reuse the existing spelling of a topic if there is one.
      const existing = suggestions.find((s) => s.toLowerCase() === name.toLowerCase())
      onChange([...value, existing ?? name])
    }
    setDraft('')
  }

  return (
    <div className="ad-tags">
      {value.map((t) => (
        <span key={t} className="ad-chip">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((v) => v !== t))}>
            <X />
          </button>
        </span>
      ))}
      <input
        list={listId}
        value={draft}
        placeholder={value.length ? 'Add another' : 'Add topics, like Career or Motherhood'}
        aria-label="Topics"
        onChange={(e) => {
          const v = e.target.value
          if (v.endsWith(',')) add(v)
          else setDraft(v)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            add(draft)
          } else if (e.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={() => draft && add(draft)}
      />
      <datalist id={listId}>
        {suggestions
          .filter((s) => !lower.includes(s.toLowerCase()))
          .map((s) => (
            <option key={s} value={s} />
          ))}
      </datalist>
    </div>
  )
}
