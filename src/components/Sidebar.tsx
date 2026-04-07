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
}

export default function Sidebar({ visible, view, allTags, notes, onViewChange }: Props) {
  const { showTip } = useTooltip()

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

  return (
    <nav className={`${styles.sidebar} ${!visible ? styles.hide : ''}`}>
      {/* Search */}
      <div className={styles.search} onClick={() => showTip('全局搜索（开发中）')}>
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
        {Array.from(new Set(notes.filter(n => !n.deleted && n.folder && n.folder !== '未分类').map(n => n.folder))).map(folder => {
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
        <div className={`${styles.item} ${styles.muted}`} onClick={() => showTip('新建文件夹（开发中）')}>
          <PlusIcon /> 新建文件夹
        </div>
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
