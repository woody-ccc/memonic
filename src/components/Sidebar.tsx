import { AllNotesIcon, StarIcon, ClockIcon, TrashIcon, FolderIcon, PlusIcon, SettingsIcon, SearchIcon } from './icons'
import { useTooltip } from '../hooks/useTooltip'
import styles from './Sidebar.module.css'

interface Props { visible: boolean }

const FOLDERS = ['工作', '学习', '生活']
const TAGS = [
  { name: '产品', color: '#6366F1' },
  { name: '设计', color: '#059669' },
  { name: '读书', color: '#D97706' },
  { name: '想法', color: '#DB2777' },
]

export default function Sidebar({ visible }: Props) {
  const { showTip } = useTooltip()

  return (
    <nav className={`${styles.sidebar} ${!visible ? styles.hide : ''}`}>
      <div className={styles.search} onClick={() => showTip('⌘K 全局搜索（开发中）')}>
        <SearchIcon />
        <span className={styles.searchTxt}>搜索...</span>
        <span className={styles.kbd}>⌘K</span>
      </div>

      <div className={styles.group}>
        <div className={`${styles.item} ${styles.on}`}>
          <AllNotesIcon /> 全部笔记
        </div>
        <div className={styles.item} onClick={() => showTip('收藏（开发中）')}>
          <StarIcon /> 收藏
        </div>
        <div className={styles.item} onClick={() => showTip('最近编辑（开发中）')}>
          <ClockIcon /> 最近编辑
        </div>
        <div className={styles.item} onClick={() => showTip('废纸篓（开发中）')}>
          <TrashIcon /> 废纸篓
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.label}>文件夹</div>
        {FOLDERS.map(f => (
          <div key={f} className={styles.item} onClick={() => showTip(`${f}（开发中）`)}>
            <FolderIcon /> {f}
          </div>
        ))}
        <div className={`${styles.item} ${styles.muted}`} onClick={() => showTip('新建文件夹（开发中）')}>
          <PlusIcon /> 新建文件夹
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.label}>标签</div>
        {TAGS.map(t => (
          <div key={t.name} className={styles.item} onClick={() => showTip(`#${t.name}（开发中）`)}>
            <span className={styles.pip} style={{ background: t.color }} />
            {t.name}
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <div className={styles.item} onClick={() => showTip('设置（开发中）')}>
          <SettingsIcon /> 设置
        </div>
      </div>
    </nav>
  )
}
