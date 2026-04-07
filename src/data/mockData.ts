import type { Note } from '../types'

export const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: '产品设计反思：从 0 到 1 的决策框架',
    content: `<h2>一、决策的三个层次</h2><p>我把产品决策拆分成三个层次，从宏观到微观依次递减：</p><ul><li><strong>战略层</strong>：我们要解决什么问题？目标用户是谁？</li><li><strong>体验层</strong>：用户路径是什么？关键时刻如何设计？</li><li><strong>执行层</strong>：用什么技术？怎么上线？灰度策略是什么？</li></ul><h2>二、验证优先的思维模型</h2><p>Eric Ries 的 Lean Startup 给了我们「最小可行产品」的工具，但很多团队把 MVP 做成了功能删减版，而不是<strong>假设验证器</strong>。</p><h2>三、决策质量的心智模型</h2><p>贝佐斯有一个著名的框架：<strong>Type 1 vs Type 2 决策</strong>。Type 1 是不可逆的，要慎重；Type 2 是可逆的，要快。</p>`,
    preview: '当我们在谈论产品决策时，我们究竟在谈论什么...',
    tags: ['产品'],
    starred: true,
    folder: '工作',
    wordCount: 180,
    createdAt: '2026-03-20',
    updatedAt: '2026-04-05',
  },
  {
    id: '2',
    title: '《人月神话》读书笔记',
    content: `<p>没有银弹——这是 Frederick Brooks 在 1975 年提出的论断，至今仍然成立。</p><p>软件工程的本质复杂性（Essential Complexity）无法消除，只有偶然复杂性（Accidental Complexity）可以被工具和方法改善。</p><h2>核心观点</h2><ul><li>增加人手到一个已经延迟的项目只会让它更加延迟</li><li>概念完整性是系统设计的最重要考虑</li><li>外科手术式团队优于普通团队</li></ul>`,
    preview: '没有银弹，软件工程的本质复杂性...',
    tags: ['读书'],
    starred: false,
    folder: '学习',
    wordCount: 120,
    createdAt: '2026-04-01',
    updatedAt: '2026-04-03',
  },
  {
    id: '3',
    title: '设计系统的颜色哲学',
    content: `<p>语义化颜色 vs. 字面量颜色的边界到底在哪里？</p><p>字面量颜色（Literal Colors）：<code>blue-500</code>、<code>#3B82F6</code></p><p>语义化颜色（Semantic Colors）：<code>primary</code>、<code>destructive</code>、<code>muted</code></p><h2>我的结论</h2><p>设计系统应该同时维护两个层次。字面量颜色作为调色板，语义化颜色作为使用规范。组件只引用语义化颜色，主题切换只修改语义层的映射。</p>`,
    preview: '语义化颜色 vs. 字面量颜色的边界在哪里...',
    tags: ['设计'],
    starred: false,
    folder: '工作',
    wordCount: 95,
    createdAt: '2026-03-28',
    updatedAt: '2026-04-01',
  },
]

export const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  '产品': { color: '#6366F1', bg: '#EEF2FF' },
  '设计': { color: '#059669', bg: '#ECFDF5' },
  '读书': { color: '#D97706', bg: '#FFFBEB' },
  '想法': { color: '#DB2777', bg: '#FDF2F8' },
  '工作': { color: '#0284C7', bg: '#E0F2FE' },
  '学习': { color: '#7C3AED', bg: '#EDE9FE' },
}
