import { useState } from 'react'
import { LinkIcon } from './icons'
import styles from './RightPanel.module.css'

const OUTLINE = [
  { text: '一、决策的三个层次', level: 'h2' },
  { text: '二、验证优先的思维模型', level: 'h2' },
  { text: '三、决策质量的心智模型', level: 'h2' },
  { text: '工具推荐', level: 'h3' },
]

const BACKLINKS = [
  '构建第二大脑：工具与工作流',
  'Memonic 产品 Roadmap Q2',
  'Weekly Reflection · W13',
]

interface Props {
  visible: boolean
}

export default function RightPanel({ visible }: Props) {
  const [activeOutline, setActiveOutline] = useState(0)

  return (
    <div className={`${styles.panel} ${!visible ? styles.hide : ''}`}>

      {/* Outline */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>文档大纲</div>
        {OUTLINE.map((item, i) => (
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
      <section className={styles.section}>
        <div className={styles.sectionTitle}>文档统计</div>
        <div className={styles.statsGrid}>
          <StatCard value="432"  label="字数" />
          <StatCard value="2 min" label="阅读时间" />
          <StatCard value="4"   label="待办" />
          <StatCard value="3"   label="标题" />
        </div>
      </section>

      {/* Backlinks */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>反向链接 · {BACKLINKS.length}</div>
        {BACKLINKS.map((b, i) => (
          <div key={i} className={styles.backlink}>
            <LinkIcon />
            {b}
          </div>
        ))}
      </section>

      {/* Meta */}
      <section className={`${styles.section} ${styles.meta}`}>
        <div className={styles.sectionTitle}>元信息</div>
        <div className={styles.metaList}>
          <MetaRow k="创建" v="2026-03-20" />
          <MetaRow k="修改" v="2026-04-05" />
          <MetaRow k="字符数" v="1,248" />
        </div>
      </section>

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
