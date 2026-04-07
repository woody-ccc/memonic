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
  onRenameFolder: (oldName: string, newName: string) => void
  onDeleteFolder: (name: string) => void
  onOpenSearch: () => void
}

export default function Sidebar({
  visible, view, allTags, notes, onViewChange,
  onCreateFolder, onRenameFolder, onDeleteFolder, onOpenSearch,
}: Props) {
  const { showTip } = useTooltip()
  const [addingFolder, setAddingFolder] = useState(false)
  const [folderInput, setFolderInput] = useState('')
  const folderInputRef = useRef<HTMLInputElement>(null)
  const [menuFolder, setMenuFolder] = useState<string | null>(null)
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null)
  const [renameInput, setRenameInput] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

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

  function startRename(folder: string) {
    setMenuFolder(null)
    setRenamingFolder(folder)
    setRenameInput(folder)
    setTimeout(() => renameInputRef.current?.focus(), 50)
  }

  function confirmRename() {
    if (renamingFolder) onRenameFolder(renamingFolder, renameInput)
    setRenamingFolder(null)
    setRenameInput('')
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
          const isRenaming = renamingFolder === folder
          return (
            <div key={folder} style={{ position: 'relative' }}>
              {isRenaming ? (
                <div className={styles.folderInputRow}>
                  <FolderIcon />
                  <input
                    ref={renameInputRef}
                    className={styles.folderInput}
                    value={renameInput}
                    onChange={e => setRenameInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') confirmRename()
                      if (e.key === 'Escape') { setRenamingFolder(null) }
                    }}
                    onBlur={confirmRename}
                  />
                </div>
              ) : (
                <div
                  className={`${styles.item} ${view === `folder:${folder}` ? styles.on : ''}`}
                  onClick={() => { onViewChange(`folder:${folder}`); setMenuFolder(null) }}
                  onContextMenu={e => { e.preventDefault(); setMenuFolder(menuFolder === folder ? null : folder) }}
                >
                  <FolderIcon />
                  {folder}
                  {count > 0 && <span className={styles.count}>{count}</span>}
                </div>
              )}

              {menuFolder === folder && (
                <>
                  <div className={styles.folderMenuOverlay} onClick={() => setMenuFolder(null)} />
                  <div className={styles.folderMenu}>
                    <div className={styles.folderMenuItem} onClick={() => startRename(folder)}>
                      重命名
                    </div>
                    <div
                      className={`${styles.folderMenuItem} ${styles.folderMenuDanger}`}
                      onClick={() => {
                        setMenuFolder(null)
                        if (confirm(`删除文件夹「${folder}」？笔记将移至未分类`)) {
                          onDeleteFolder(folder)
                        }
                      }}
                    >
                      删除文件夹
                    </div>
                  </div>
                </>
              )}
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
