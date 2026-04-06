import { FOLDERS, TAGS } from '../data/mockData'
import { AllNotesIcon, StarIcon, ClockIcon, TrashIcon, FolderIcon, PlusIcon, SettingsIcon, SearchIcon } from './icons'
import { useTooltip } from '../hooks/useTooltip'
import styles from './Sidebar.module.css'

interface Props {
  visible: boolean
}

export default function Sidebar({ visible }: Props) {
  const { showTip } = useTooltip()

  return (
    <nav className={`${styles.sidebar} ${!visible ? styles.hide : ''}`}>
      {/* Search */}
      <div className={styles.search} onClick={() => showTip('⌘K 全局搜索')}>
        <SearchIcon />
        <span className={styles.searchTxt}>搜索...</span>
        <span className={styles.kbd}>⌘K</span>
      </div>

      {/* Main nav */}
      <div className={styles.group}>
        <div className={`${styles.item} ${styles.on}`}>
          <AllNotesIcon /> 全部笔记 <span className={styles.count}>24</span>
        </div>
        <div className={styles.item}>
          <StarIcon /> 收藏 <span className={styles.count}>5</span>
        </div>
        <div className={styles.item}>
          <ClockIcon /> 最近编辑
        </div>
        <div className={styles.item}>
          <TrashIcon /> 废纸篓
        </div>
      </div>

      {/* Folders */}
      <div className={styles.group}>
        <div className={styles.label}>文件夹</div>
        {FOLDERS.map(f => (
          <div key={f.id} className={styles.item}>
            <FolderIcon /> {f.name} <span className={styles.count}>{f.count}</span>
          </div>
        ))}
        <div className={`${styles.item} ${styles.muted}`}>
          <PlusIcon /> 新建文件夹
        </div>
      </div>

      {/* Tags */}
      <div className={styles.group}>
        <div className={styles.label}>标签</div>
        {TAGS.map(t => (
          <div key={t.id} className={styles.item}>
            <span className={styles.pip} style={{ background: t.color }} />
            {t.name} <span className={styles.count}>
              {t.id === 'product' ? 6 : t.id === 'design' ? 4 : t.id === 'reading' ? 9 : 3}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.item} onClick={() => showTip('设置')}>
          <SettingsIcon /> 设置
        </div>
      </div>
    </nav>
  )
}
