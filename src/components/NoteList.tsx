import { useState } from 'react'
import type { Note, SortType } from '../types'
import { NOTES } from '../data/mockData'
import { FilterIcon, PlusIcon, StarIcon } from './icons'
import { useTooltip } from '../hooks/useTooltip'
import styles from './NoteList.module.css'

interface Props {
  visible: boolean
  activeId: string
  onSelect: (id: string) => void
}

const SORT_LABELS: { key: SortType; label: string }[] = [
  { key: 'latest',   label: '最新' },
  { key: 'modified', label: '修改' },
  { key: 'title',    label: '标题' },
]

export default function NoteList({ visible, activeId, onSelect }: Props) {
  const [sort, setSort] = useState<SortType>('latest')
  const { showTip } = useTooltip()

  const sorted = [...NOTES].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  return (
    <div className={`${styles.list} ${!visible ? styles.hide : ''}`}>
      <div className={styles.head}>
        <span className={styles.title}>全部笔记</span>
        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={() => showTip('筛选')}>
            <FilterIcon />
          </button>
          <button className={styles.iconBtn} onClick={() => showTip('新建笔记 ⌘N')}>
            <PlusIcon />
          </button>
        </div>
      </div>

      <div className={styles.sort}>
        {SORT_LABELS.map(s => (
          <div
            key={s.key}
            className={`${styles.chip} ${sort === s.key ? styles.on : ''}`}
            onClick={() => setSort(s.key)}
          >
            {s.label}
          </div>
        ))}
      </div>

      <div className={styles.items}>
        {sorted.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            active={note.id === activeId}
            onClick={() => onSelect(note.id)}
          />
        ))}
      </div>
    </div>
  )
}

function NoteItem({ note, active, onClick }: { note: Note; active: boolean; onClick: () => void }) {
  return (
    <div className={`${styles.item} ${active ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.itemTitle}>{note.title}</div>
      <div className={styles.itemPreview}>{note.preview}</div>
      <div className={styles.itemFoot}>
        <span className={styles.date}>{note.date}</span>
        {note.tags.map(t => (
          <span key={t.id} className={styles.tag} style={{ background: t.bg, color: t.color }}>
            #{t.name}
          </span>
        ))}
        {note.starred && (
          <span className={styles.star}>
            <StarIcon filled />
          </span>
        )}
      </div>
    </div>
  )
}
