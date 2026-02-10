'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

export type UserOption = {
  id: number
  label: string
}

type Props = {
  options: UserOption[]
  selectedIds: number[]
  onChangeSelectedIds: (ids: number[]) => void
  placeholder?: string
  disabled?: boolean
}

export default function ContributorsSelect({
  options,
  selectedIds,
  onChangeSelectedIds,
  placeholder = 'Search by name/email...',
  disabled,
}: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const selected = useMemo(() => {
    const map = new Map(options.map((o) => [o.id, o]))
    return selectedIds.map((id) => map.get(id)).filter(Boolean) as UserOption[]
  }, [options, selectedIds])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = options.filter((o) => !selectedIds.includes(o.id))

    // Show first 8 users on focus even when query is empty (nice UX)
    if (!q) return pool.slice(0, 8)

    return pool
      .filter((o) => o.label.toLowerCase().includes(q))
      .slice(0, 12)
  }, [options, selectedIds, query])

  function add(id: number) {
    if (disabled) return
    if (selectedIds.includes(id)) return
    onChangeSelectedIds([...selectedIds, id])
    setQuery('')
    setOpen(true)
    setActiveIndex(-1)
  }

  function remove(id: number) {
    if (disabled) return
    onChangeSelectedIds(selectedIds.filter((x) => x !== id))
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && filtered[activeIndex]) add(filtered[activeIndex].id)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className="space-y-2">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />

        {open && filtered.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md overflow-hidden">
            {filtered.map((u, i) => (
              <button
                key={u.id}
                type="button"
                className={`w-full px-3 py-2 text-left text-sm hover:bg-muted/40 ${
                  i === activeIndex ? 'bg-muted/30' : ''
                }`}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => add(u.id)}
              >
                {u.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((u) => (
            <Badge key={u.id} variant="secondary" className="gap-1">
              {u.label}
              <button type="button" className="ml-1" onClick={() => remove(u.id)} aria-label="Remove contributor">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-foreground/60">No contributors added yet.</p>
      )}
    </div>
  )
}
