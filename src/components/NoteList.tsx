import { useState } from 'react'
import type { Note, SortType } from '../types'
import { TAG_COLORS } from '../data/mockData'
import { FilterIcon, PlusIcon } from './icons'
import { useTooltip } from '../hooks/useTooltip'
import styles from './NoteList.module.css'

interface Props {
  visible: boolean
  notes: Note[]
  activeId: string | null
  onSelect: (id: string) => void
  onCreate: () => void
  onDelete: (id: string) => void
}

export default function NoteList({ visible, notes, activeId, onSelect, onCreate, onDelete }: Props) {
  const [sort, setSort] = useState<SortType>('latest')
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const { showTip } = useTooltip()

  const sorted = [...notes].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title, 'zh')
    if (sort === 'modified') return b.updatedAt.localeCompare(a.updatedAt)
    return b.createdAt.localeCompare(a.createdAt)
  })

  return (
    <div className={`${styles.list} ${!visible ? styles.hide : ''}`}>
      <div className={styles.head}>
        <span className={styles.title}>全部笔记 <span className={styles.cnt}>{notes.length}</span></span>
        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={() => showTip('筛选（开发中）')}>
            <FilterIcon />
          </button>
          <button className={styles.iconBtn} onClick={onCreate} title="新建笔记 ⌘N">
            <PlusIcon />
          </button>
        </div>
      </div>

      <div className={styles.sort}>
        {(['latest', 'modified', 'title'] as SortType[]).map(s => (
          <div key={s} className={`${styles.chip} ${sort === s ? styles.on : ''}`}
            onClick={() => setSort(s)}>
            {s === 'latest' ? '最新' : s === 'modified' ? '修改' : '标题'}
          </div>
        ))}
      </div>

      <div className={styles.items}>
        {sorted.length === 0 && (
          <div className={styles.empty}>
            <p>还没有笔记</p>
            <button onClick={onCreate}>+ 新建第一篇</button>
          </div>
        )}
        {sorted.map(note => (
          <div
            key={note.id}
            className={`${styles.item} ${note.id === activeId ? styles.active : ''}`}
            onClick={() => { onSelect(note.id); setShowMenu(null) }}
            onContextMenu={e => { e.preventDefault(); setShowMenu(note.id) }}
          >
            <div className={styles.itemTitle}>{note.title || '未命名笔记'}</div>
            <div className={styles.itemPreview}>{note.preview || '暂无内容...'}</div>
            <div className={styles.itemFoot}>
              <span className={styles.date}>{note.updatedAt}</span>
              {note.tags.slice(0, 1).map(tag => {
                const c = TAG_COLORS[tag] ?? { color: '#6366F1', bg: '#EEF2FF' }
                return (
                  <span key={tag} className={styles.tag} style={{ background: c.bg, color: c.color }}>
                    #{tag}
                  </span>
                )
              })}
              {note.starred && (
                <span className={styles.star}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1l1.8 3.6 4 .58-2.9 2.82.68 3.98L8 11.1l-3.58 1.88.68-3.98L2.2 6.18l4-.58z"/>
                  </svg>
                </span>
              )}
            </div>

            {/* Context menu */}
            {showMenu === note.id && (
              <div className={styles.menu} onClick={e => e.stopPropagation()}>
                <div className={styles.menuItem} onClick={() => { onDelete(note.id); setShowMenu(null) }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 4h10M6 4V3h4v1M5.5 4l.5 8h4l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  删除笔记
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Close context menu on outside click */}
      {showMenu && (
        <div className={styles.overlay} onClick={() => setShowMenu(null)} />
      )}
    </div>
  )
}
