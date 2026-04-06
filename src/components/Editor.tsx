import { useState } from 'react'
import type { ViewMode } from '../types'
import { useTooltip } from '../hooks/useTooltip'
import styles from './Editor.module.css'

const TOOLS = [
  { label: 'I', style: { fontStyle: 'italic', fontSize: '13px' }, tip: '斜体 ⌘I' },
  { label: 'B', style: { fontWeight: 800 }, tip: '加粗 ⌘B' },
  { label: 'U', style: { textDecoration: 'underline' }, tip: '下划线 ⌘U' },
  { label: 'S', style: { textDecoration: 'line-through' }, tip: '删除线' },
]

const VIEWS: ViewMode[] = ['edit', 'preview', 'split']
const VIEW_LABELS: Record<ViewMode, string> = { edit: '编辑', preview: '预览', split: '分栏' }

export default function Editor() {
  const [view, setView] = useState<ViewMode>('edit')
  const { showTip } = useTooltip()

  return (
    <div className={styles.area}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        {TOOLS.map(t => (
          <button
            key={t.label}
            className={styles.toolBtn}
            style={t.style as React.CSSProperties}
            onClick={() => showTip(t.tip)}
          >
            {t.label}
          </button>
        ))}

        <div className={styles.div} />

        <button className={styles.toolBtn} style={{ fontSize: '11px', fontWeight: 700, minWidth: 30 }} onClick={() => showTip('标题 1')}>H1</button>
        <button className={styles.toolBtn} style={{ fontSize: '11px', fontWeight: 700, minWidth: 30 }} onClick={() => showTip('标题 2')}>H2</button>

        <div className={styles.div} />

        {/* List */}
        <button className={styles.toolBtn} onClick={() => showTip('列表')}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="5" r="1.2" fill="currentColor"/>
            <circle cx="3" cy="9" r="1.2" fill="currentColor"/>
            <circle cx="3" cy="13" r="1.2" fill="currentColor"/>
            <rect x="6" y="4.2" width="8.5" height="1.5" rx=".75" fill="currentColor"/>
            <rect x="6" y="8.2" width="8.5" height="1.5" rx=".75" fill="currentColor"/>
            <rect x="6" y="12.2" width="5" height="1.5" rx=".75" fill="currentColor"/>
          </svg>
        </button>
        {/* Todo */}
        <button className={styles.toolBtn} onClick={() => showTip('待办')}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="4" width="4" height="4" rx=".8" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M7.5 6h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <rect x="2" y="10" width="4" height="4" rx=".8" fill="currentColor" opacity=".25"/>
            <path d="M3.5 12l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 12h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>
        {/* Code */}
        <button className={styles.toolBtn} onClick={() => showTip('代码块')}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M5 5l-3 3 3 3M11 5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 4l-3 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".5"/>
          </svg>
        </button>
        {/* Quote */}
        <button className={styles.toolBtn} onClick={() => showTip('引用')}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 5h3v3.5H4.5L6 11H4L2.5 9V5zM9 5h3v3.5H10.5L12 11h-2L8.5 9V5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className={styles.div} />

        {/* Link */}
        <button className={styles.toolBtn} onClick={() => showTip('链接 ⌘K')}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M7 9a3.2 3.2 0 004.5 0l2-2a3.2 3.2 0 00-4.5-4.5L7.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M9 7a3.2 3.2 0 00-4.5 0l-2 2a3.2 3.2 0 004.5 4.5L8.5 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>

        <span className={styles.wordCount}>432 字</span>

        <div className={styles.right}>
          <div className={styles.viewToggle}>
            {VIEWS.map(v => (
              <div
                key={v}
                className={`${styles.viewBtn} ${view === v ? styles.on : ''}`}
                onClick={() => { setView(v); showTip(`切换到${VIEW_LABELS[v]}模式`) }}
              >
                {VIEW_LABELS[v]}
              </div>
            ))}
          </div>
          <button className={styles.shareBtn} onClick={() => showTip('生成分享链接')}>
            分享
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.scroll}>
        <div className={styles.inner}>
          <div className={styles.breadcrumb}>
            <span className={styles.bcItem}>工作</span>
            <span className={styles.bcSep}>›</span>
            <span className={`${styles.bcItem} ${styles.bcCur}`}>产品设计反思：从 0 到 1 的决策框架</span>
          </div>

          <div
            className={styles.docTitle}
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
          >
            产品设计反思：从 0 到 1 的决策框架
          </div>

          <div className={styles.docMeta}>
            <span className={styles.docDate}>2026年4月5日</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.docDate}>工作</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.chip} style={{ background: '#EEF2FF', color: '#6366F1' }}>#产品</span>
            <span className={styles.chip} style={{ background: '#ECFDF5', color: '#059669' }}>#设计</span>
            <span className={styles.addTag}>+ 标签</span>
          </div>

          <div className={styles.body}>
            <p>当我们在谈论「产品决策」时，我们究竟在谈论什么？过去一年里我参与了从 0 到 1 的三个产品，每次都会在某个关键节点卡住——不是因为没有想法，而是因为想法太多，却缺乏一个可以让团队对齐的框架。</p>

            <blockquote>设计不是让事情看起来好看，而是让事情运作起来。</blockquote>

            <h2>一、决策的三个层次</h2>
            <p>我把产品决策拆分成三个层次，从宏观到微观依次递减：</p>
            <ul>
              <li><strong>战略层</strong>：我们要解决什么问题？目标用户是谁？</li>
              <li><strong>体验层</strong>：用户路径是什么？关键时刻如何设计？</li>
              <li><strong>执行层</strong>：用什么技术？怎么上线？灰度策略是什么？</li>
            </ul>
            <p>大多数争论，其实是在不同层次之间跳跃，而对话者自己并不知道。这是效率低下的根本原因。</p>

            <h2>二、验证优先的思维模型</h2>
            <p>Eric Ries 的 Lean Startup 给了我们「最小可行产品」的工具，但很多团队把 MVP 做成了功能删减版，而不是<strong>假设验证器</strong>。</p>

            <div className={styles.callout}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--blue)', marginTop: 1 }}>
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M8 7v4.5M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div>真正的 MVP 应该回答：<em>「这个核心假设是否成立？」</em></div>
            </div>

            <TodoItem text="明确核心假设（用户是否有这个痛点）" defaultDone />
            <TodoItem text="定义验证指标（什么数据证明假设成立）" defaultDone />
            <TodoItem text="设计最小实验（最快速最便宜的验证方式）" />
            <TodoItem text="建立反馈机制（如何收集真实用户反馈）" />

            <h2>三、决策质量的心智模型</h2>
            <p>贝佐斯有一个著名的框架：<strong>Type 1 vs Type 2 决策</strong>。Type 1 是不可逆的，要慎重；Type 2 是可逆的，要快。</p>

            <pre><code>{`function evaluate(decision) {
  const reversibility = calcReversibility(decision)
  const speed = reversibility > 0.7 ? 'fast' : 'slow'
  return { speed, framework: speed === 'fast'
    ? 'bias-to-action' : 'consensus' }
}`}</code></pre>

            <h3>工具推荐</h3>
            <p>几个实际在用的工具：<a href="#">RICE 评分框架</a>、<a href="#">Jobs-to-be-Done 访谈</a>，以及 Marty Cagan 在 <a href="#">Inspired</a> 里提到的 Discovery vs Delivery 双轨制。</p>

            <hr />
            <p style={{ color: 'var(--t4)', fontSize: 13 }}>持续更新中 · 上次修改于 2026-04-05</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TodoItem({ text, defaultDone = false }: { text: string; defaultDone?: boolean }) {
  const [done, setDone] = useState(defaultDone)
  return (
    <div className={styles.todo}>
      <div className={`${styles.check} ${done ? styles.checkDone : ''}`} onClick={() => setDone(!done)} />
      <span className={`${styles.todoText} ${done ? styles.todoDone : ''}`}>{text}</span>
    </div>
  )
}
