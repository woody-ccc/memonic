import { useState } from 'react'
import type { Note } from '../types'
import { LinkIcon } from './icons'
import styles from './RightPanel.module.css'

interface Props {
  visible: boolean
  note: Note | null
}

export default function RightPanel({ visible, note }: Props) {
  const [activeOutline, setActiveOutline] = useState(0)

  // Parse h2/h3 from note content
  const outline = (() => {
    if (!note?.content) return []
    const div = document.createElement('div')
    div.innerHTML = note.content
    return Array.from(div.querySelectorAll('h1,h2,h3')).map(el => ({
      text: el.textContent ?? '',
      level: el.tagName.toLowerCase() as 'h1' | 'h2' | 'h3',
    }))
  })()

  return (
    <div className={`${styles.panel} ${!visible ? styles.hide : ''}`}>

      {/* Outline */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>文档大纲</div>
        {outline.length === 0 && (
          <div className={styles.empty}>使用标题 H1/H2 创建大纲</div>
        )}
        {outline.map((item, i) => (
          <div
            key={i}
            className={`${styles.outlineItem} ${styles[item.level]} ${i === activeOutline ? styles.act : ''}`}
            onClick={() => setActiveOutline(i)}
          >
            {item.text}
          </div>
        ))}
      </section>

      {/* Stats */}
      {note && (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>文档统计</div>
          <div className={styles.statsGrid}>
            <StatCard value={String(note.wordCount ?? 0)} label="字数" />
            <StatCard value={`${Math.max(1, Math.ceil((note.wordCount ?? 0) / 200))} min`} label="阅读时间" />
            <StatCard value={String(outline.length)} label="标题数" />
            <StatCard value={note.tags.length > 0 ? note.tags.length.toString() : '0'} label="标签" />
          </div>
        </section>
      )}

      {/* Backlinks placeholder */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>反向链接</div>
        <div className={styles.empty}>暂无反向链接</div>
      </section>

      {/* Meta */}
      {note && (
        <section className={`${styles.section} ${styles.meta}`}>
          <div className={styles.sectionTitle}>元信息</div>
          <div className={styles.metaList}>
            <MetaRow k="创建" v={note.createdAt} />
            <MetaRow k="修改" v={note.updatedAt} />
            <MetaRow k="文件夹" v={note.folder || '未分类'} />
          </div>
        </section>
      )}

    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statVal}>{value}</div>
      <div className={styles.statLbl}>{label}</div>
    </div>
  )
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaKey}>{k}</span>
      <span className={styles.metaVal}>{v}</span>
    </div>
  )
}

// keep LinkIcon import used
export { LinkIcon }
