'use client'

import { useMemo, useState } from 'react'
import Autocomplete from '@/components/ui/autocomplete'
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

export default function MultiUserAutocomplete({
  options,
  selectedIds,
  onChangeSelectedIds,
  placeholder = 'Search users...',
  disabled,
}: Props) {
  const [query, setQuery] = useState('')

  const labelOptions = useMemo(() => options.map((o) => o.label), [options])

  const selected = useMemo(() => {
    const map = new Map(options.map((o) => [o.id, o]))
    return selectedIds.map((id) => map.get(id)).filter(Boolean) as UserOption[]
  }, [options, selectedIds])

  function addByExactLabel(label: string) {
    const found = options.find((o) => o.label === label)
    if (!found) return
    if (!Number.isFinite(found.id)) return
    if (selectedIds.includes(found.id)) return
    onChangeSelectedIds([...selectedIds, found.id])
    setQuery('')
  }

  function remove(id: number) {
    onChangeSelectedIds(selectedIds.filter((x) => x !== id))
  }

  return (
    <div className="space-y-2 opacity-100">
      <Autocomplete
        value={query}
        onChange={(v) => {
          if (disabled) return
          setQuery(v)
          // When user clicks a suggestion, Autocomplete sets v to that exact label.
          // So we immediately add it.
          addByExactLabel(v)
        }}
        options={labelOptions}
        placeholder={placeholder}
        required={false}
      />

      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
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
