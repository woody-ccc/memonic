import type { PanelState } from '../types'
import { SidebarIcon, ListIcon, PanelIcon } from './icons'
import styles from './Titlebar.module.css'

interface Props {
  panels: PanelState
  onToggle: (key: keyof PanelState) => void
}

export default function Titlebar({ panels, onToggle }: Props) {
  return (
    <div className={styles.titlebar}>
      <div className={styles.dots}>
        <div className={`${styles.dot} ${styles.r}`} />
        <div className={`${styles.dot} ${styles.y}`} />
        <div className={`${styles.dot} ${styles.g}`} />
      </div>

      <span className={styles.center}>memonic</span>

      <div className={styles.right}>
        <button
          className={`${styles.btn} ${panels.sidebar ? styles.on : ''}`}
          onClick={() => onToggle('sidebar')}
          title="侧边栏 ⌘\"
        >
          <SidebarIcon />
        </button>
        <button
          className={`${styles.btn} ${panels.noteList ? styles.on : ''}`}
          onClick={() => onToggle('noteList')}
          title="笔记列表 ⌘⇧L"
        >
          <ListIcon />
        </button>
        <button
          className={`${styles.btn} ${panels.rightPanel ? styles.on : ''}`}
          onClick={() => onToggle('rightPanel')}
          title="信息面板 ⌘⇧I"
        >
          <PanelIcon />
        </button>
      </div>
    </div>
  )
}
