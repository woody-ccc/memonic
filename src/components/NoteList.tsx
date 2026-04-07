import { useState } from 'react'
import type { Note, SortType, ViewType } from '../types'
import { TAG_COLORS } from '../data/mockData'
import { FilterIcon, PlusIcon } from './icons'
import { useTooltip } from '../hooks/useTooltip'
import styles from './NoteList.module.css'

interface Props {
  visible: boolean
  notes: Note[]
  activeId: string | null
  view: ViewType
  onSelect: (id: string) => void
  onCreate: () => void
  onTrash: (id: string) => void
  onRestore: (id: string) => void
  onDeletePermanent: (id: string) => void
  onToggleStar: (id: string) => void
}

const VIEW_TITLES: Partial<Record<ViewType, string>> = {
  all: '全部笔记',
  starred: '收藏',
  trash: '废纸篓',
}

export default function NoteList({
  visible, notes, activeId, view,
  onSelect, onCreate, onTrash, onRestore, onDeletePermanent, onToggleStar,
}: Props) {
  const [sort, setSort] = useState<SortType>('latest')
  const [menuId, setMenuId] = useState<string | null>(null)
  const { showTip } = useTooltip()
  const isTrash = view === 'trash'

  const title = VIEW_TITLES[view]
    ?? (view.startsWith('tag:') ? `#${view.slice(4)}` : view.startsWith('folder:') ? view.slice(7) : '笔记')

  const sorted = [...notes].sort((a, b) => {
    if (sort === 'title')    return a.title.localeCompare(b.title, 'zh')
    if (sort === 'modified') return b.updatedAt.localeCompare(a.updatedAt)
    return b.createdAt.localeCompare(a.createdAt)
  })

  return (
    <div className={`${styles.list} ${!visible ? styles.hide : ''}`}>
      <div className={styles.head}>
        <span className={styles.title}>
          {title}
          <span className={styles.cnt}>{notes.length}</span>
        </span>
        <div className={styles.actions}>
          {!isTrash && (
            <>
              <button className={styles.iconBtn} onClick={() => showTip('筛选（开发中）')}>
                <FilterIcon />
              </button>
              <button className={styles.iconBtn} onClick={onCreate} title="新建笔记 ⌘N">
                <PlusIcon />
              </button>
            </>
          )}
          {isTrash && notes.length > 0 && (
            <button
              className={styles.clearBtn}
              onClick={() => {
                if (confirm('彻底清空废纸篓？此操作不可撤销')) {
                  notes.forEach(n => onDeletePermanent(n.id))
                }
              }}
            >
              清空
            </button>
          )}
        </div>
      </div>

      {!isTrash && (
        <div className={styles.sort}>
          {(['latest', 'modified', 'title'] as SortType[]).map(s => (
            <div key={s} className={`${styles.chip} ${sort === s ? styles.on : ''}`}
              onClick={() => setSort(s)}>
              {s === 'latest' ? '最新' : s === 'modified' ? '修改' : '标题'}
            </div>
          ))}
        </div>
      )}

      <div className={styles.items}>
        {sorted.length === 0 && (
          <div className={styles.empty}>
            <p>{isTrash ? '废纸篓是空的' : '这里还没有笔记'}</p>
            {!isTrash && <button onClick={onCreate}>+ 新建第一篇</button>}
          </div>
        )}

        {sorted.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            active={note.id === activeId}
            isTrash={isTrash}
            showMenu={menuId === note.id}
            onClick={() => { onSelect(note.id); setMenuId(null) }}
            onContextMenu={() => setMenuId(menuId === note.id ? null : note.id)}
            onTrash={() => { onTrash(note.id); setMenuId(null) }}
            onRestore={() => { onRestore(note.id); setMenuId(null) }}
            onDeletePermanent={() => { onDeletePermanent(note.id); setMenuId(null) }}
            onToggleStar={(e) => { e.stopPropagation(); onToggleStar(note.id) }}
          />
        ))}
      </div>

      {menuId && <div className={styles.overlay} onClick={() => setMenuId(null)} />}
    </div>
  )
}

interface ItemProps {
  note: Note
  active: boolean
  isTrash: boolean
  showMenu: boolean
  onClick: () => void
  onContextMenu: () => void
  onTrash: () => void
  onRestore: () => void
  onDeletePermanent: () => void
  onToggleStar: (e: React.MouseEvent) => void
}

function NoteItem({ note, active, isTrash, showMenu, onClick, onContextMenu, onTrash, onRestore, onDeletePermanent, onToggleStar }: ItemProps) {
  return (
    <div
      className={`${styles.item} ${active ? styles.active : ''}`}
      onClick={onClick}
      onContextMenu={e => { e.preventDefault(); onContextMenu() }}
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
        {/* Star button — only outside trash */}
        {!isTrash && (
          <span
            className={`${styles.star} ${note.starred ? styles.starOn : ''}`}
            onClick={onToggleStar}
            title={note.starred ? '取消收藏' : '收藏'}
          >
            <svg width="12" height="12" viewBox="0 0 16 16"
              fill={note.starred ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="1.3">
              <path d="M8 1l1.8 3.6 4 .58-2.9 2.82.68 3.98L8 11.1l-3.58 1.88.68-3.98L2.2 6.18l4-.58z"/>
            </svg>
          </span>
        )}
        {/* Trash inline restore */}
        {isTrash && (
          <span className={styles.restoreBtn} onClick={e => { e.stopPropagation(); onRestore() }}>
            恢复
          </span>
        )}
      </div>

      {/* Context menu */}
      {showMenu && (
        <div className={styles.menu} onClick={e => e.stopPropagation()}>
          {!isTrash && (
            <>
              <div className={styles.menuItem} onClick={() => { onToggleStar(new MouseEvent('click') as unknown as React.MouseEvent) }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M8 1l1.8 3.6 4 .58-2.9 2.82.68 3.98L8 11.1l-3.58 1.88.68-3.98L2.2 6.18l4-.58z"/>
                </svg>
                {note.starred ? '取消收藏' : '加入收藏'}
              </div>
              <div className={`${styles.menuItem} ${styles.menuDanger}`} onClick={onTrash}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 4h10M6 4V3h4v1M5.5 4l.5 8h4l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                移到废纸篓
              </div>
            </>
          )}
          {isTrash && (
            <>
              <div className={styles.menuItem} onClick={onRestore}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8a5 5 0 105-5H5M5 3L3 5.5 5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                恢复笔记
              </div>
              <div className={`${styles.menuItem} ${styles.menuDanger}`} onClick={onDeletePermanent}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 4h10M6 4V3h4v1M5.5 4l.5 8h4l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                彻底删除
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
