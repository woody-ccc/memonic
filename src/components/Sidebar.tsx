import { useState, useRef } from 'react'
import type { Note, ViewType } from '../types'
import { TAG_COLORS } from '../data/mockData'
import { AllNotesIcon, StarIcon, TrashIcon, FolderIcon, PlusIcon, SettingsIcon, SearchIcon } from './icons'
import { useTooltip } from '../hooks/useTooltip'
import styles from './Sidebar.module.css'

interface Props {
  visible: boolean
  view: ViewType
  allTags: string[]
  notes: Note[]
  onViewChange: (v: ViewType) => void
  onCreateFolder: (name: string) => void
  onOpenSearch: () => void
}

export default function Sidebar({ visible, view, allTags, notes, onViewChange, onCreateFolder, onOpenSearch }: Props) {
  const { showTip } = useTooltip()
  const [addingFolder, setAddingFolder] = useState(false)
  const [folderInput, setFolderInput] = useState('')
  const folderInputRef = useRef<HTMLInputElement>(null)

  const starredCount = notes.filter(n => n.starred && !n.deleted).length
  const trashCount   = notes.filter(n => n.deleted).length
  const totalCount   = notes.filter(n => !n.deleted).length

  function item(label: string, icon: React.ReactNode, v: ViewType, count?: number) {
    const active = view === v
    return (
      <div className={`${styles.item} ${active ? styles.on : ''}`} onClick={() => onViewChange(v)}>
        {icon}
        {label}
        {count !== undefined && count > 0 && <span className={styles.count}>{count}</span>}
      </div>
    )
  }

  function startAddFolder() {
    setAddingFolder(true)
    setFolderInput('')
    setTimeout(() => folderInputRef.current?.focus(), 50)
  }

  function confirmFolder() {
    const name = folderInput.trim()
    if (name) {
      onCreateFolder(name)
      onViewChange(`folder:${name}`)
    }
    setAddingFolder(false)
    setFolderInput('')
  }

  const folders = Array.from(new Set(
    notes.filter(n => !n.deleted && n.folder && n.folder !== '未分类').map(n => n.folder)
  ))

  return (
    <nav className={`${styles.sidebar} ${!visible ? styles.hide : ''}`}>
      {/* Search */}
      <div className={styles.search} onClick={onOpenSearch}>
        <SearchIcon />
        <span className={styles.searchTxt}>搜索...</span>
        <span className={styles.kbd}>⌘K</span>
      </div>

      {/* Main nav */}
      <div className={styles.group}>
        {item('全部笔记', <AllNotesIcon />, 'all', totalCount)}
        {item('收藏', <StarIcon />, 'starred', starredCount)}
        {item('废纸篓', <TrashIcon />, 'trash', trashCount || undefined)}
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className={styles.group}>
          <div className={styles.label}>标签</div>
          {allTags.map(tag => {
            const c = TAG_COLORS[tag] ?? { color: '#6366F1', bg: '#EEF2FF' }
            const count = notes.filter(n => n.tags.includes(tag) && !n.deleted).length
            return (
              <div
                key={tag}
                className={`${styles.item} ${view === `tag:${tag}` ? styles.on : ''}`}
                onClick={() => onViewChange(`tag:${tag}`)}
              >
                <span className={styles.pip} style={{ background: c.color }} />
                {tag}
                {count > 0 && <span className={styles.count}>{count}</span>}
              </div>
            )
          })}
        </div>
      )}

      {/* Folders */}
      <div className={styles.group}>
        <div className={styles.label}>文件夹</div>
        {folders.map(folder => {
          const count = notes.filter(n => n.folder === folder && !n.deleted).length
          return (
            <div
              key={folder}
              className={`${styles.item} ${view === `folder:${folder}` ? styles.on : ''}`}
              onClick={() => onViewChange(`folder:${folder}`)}
            >
              <FolderIcon />
              {folder}
              {count > 0 && <span className={styles.count}>{count}</span>}
            </div>
          )
        })}

        {addingFolder ? (
          <div className={styles.folderInputRow}>
            <FolderIcon />
            <input
              ref={folderInputRef}
              className={styles.folderInput}
              value={folderInput}
              placeholder="文件夹名称..."
              onChange={e => setFolderInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') confirmFolder()
                if (e.key === 'Escape') { setAddingFolder(false); setFolderInput('') }
              }}
              onBlur={confirmFolder}
            />
          </div>
        ) : (
          <div className={`${styles.item} ${styles.muted}`} onClick={startAddFolder}>
            <PlusIcon /> 新建文件夹
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.item} onClick={() => showTip('设置（开发中）')}>
          <SettingsIcon /> 设置
        </div>
      </div>
    </nav>
  )
}
