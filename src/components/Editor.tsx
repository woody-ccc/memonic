import { useEffect, useRef, useCallback, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Typography from '@tiptap/extension-typography'
import type { Note } from '../types'
import { countWords } from '../services/storage'
import { useTooltip } from '../hooks/useTooltip'
import styles from './Editor.module.css'

interface Props {
  note: Note | null
  onUpdate: (patch: Partial<Note>) => void
  inTrash?: boolean
}

export default function Editor({ note, onUpdate, inTrash }: Props) {
  const { showTip } = useTooltip()
  const titleRef = useRef<HTMLDivElement>(null)
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const tagInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      Placeholder.configure({ placeholder: '开始写作...' }),
    ],
    content: note?.content ?? '',
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onUpdate({ content: html, wordCount: countWords(html) })
    },
    editorProps: {
      attributes: {
        class: styles.tiptap,
        spellcheck: 'false',
      },
    },
  })

  // Sync editor content when switching notes
  useEffect(() => {
    if (!editor || !note) return
    const current = editor.getHTML()
    if (current !== note.content) {
      editor.commands.setContent(note.content || '')
    }
  }, [note?.id]) // only re-sync on note switch

  // Sync title element
  useEffect(() => {
    if (!titleRef.current || !note) return
    if (titleRef.current.textContent !== note.title) {
      titleRef.current.textContent = note.title
    }
  }, [note?.id])

  const handleTitleInput = useCallback(() => {
    const text = titleRef.current?.textContent ?? ''
    onUpdate({ title: text })
  }, [onUpdate])

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      editor?.commands.focus('start')
    }
  }, [editor])

  const cmd = (action: string, tip: string) => () => {
    showTip(tip)
    if (!editor) return
    switch (action) {
      case 'bold':         editor.chain().focus().toggleBold().run(); break
      case 'italic':       editor.chain().focus().toggleItalic().run(); break
      case 'strike':       editor.chain().focus().toggleStrike().run(); break
      case 'code':         editor.chain().focus().toggleCode().run(); break
      case 'h1':           editor.chain().focus().toggleHeading({ level: 1 }).run(); break
      case 'h2':           editor.chain().focus().toggleHeading({ level: 2 }).run(); break
      case 'ul':           editor.chain().focus().toggleBulletList().run(); break
      case 'ol':           editor.chain().focus().toggleOrderedList().run(); break
      case 'task':         editor.chain().focus().toggleTaskList().run(); break
      case 'blockquote':   editor.chain().focus().toggleBlockquote().run(); break
      case 'codeBlock':    editor.chain().focus().toggleCodeBlock().run(); break
      case 'hr':           editor.chain().focus().setHorizontalRule().run(); break
    }
  }

  const isActive = (type: string, attrs?: Record<string, unknown>) =>
    editor?.isActive(type, attrs) ?? false

  if (!note) {
    return (
      <div className={styles.area}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="6" width="24" height="28" rx="3" stroke="#CBD5E1" strokeWidth="1.5"/>
              <path d="M14 14h12M14 19h12M14 24h8" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className={styles.emptyText}>选择一篇笔记开始阅读</p>
          <p className={styles.emptyHint}>或点击左侧 <strong>+</strong> 新建</p>
        </div>
      </div>
    )
  }

  const wordCount = note.wordCount ?? 0

  return (
    <div className={styles.area}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button
          className={`${styles.tb} ${isActive('bold') ? styles.on : ''}`}
          onClick={cmd('bold', '加粗 ⌘B')} title="加粗"
        ><b>B</b></button>
        <button
          className={`${styles.tb} ${isActive('italic') ? styles.on : ''}`}
          onClick={cmd('italic', '斜体 ⌘I')} title="斜体"
        ><i>I</i></button>
        <button
          className={`${styles.tb} ${isActive('strike') ? styles.on : ''}`}
          onClick={cmd('strike', '删除线')} title="删除线"
          style={{ textDecoration: 'line-through' }}
        >S</button>
        <button
          className={`${styles.tb} ${isActive('code') ? styles.on : ''}`}
          onClick={cmd('code', '行内代码')} title="行内代码"
        >{'</>'}</button>

        <div className={styles.div} />

        <button
          className={`${styles.tb} ${isActive('heading', { level: 1 }) ? styles.on : ''}`}
          onClick={cmd('h1', '标题 1')} title="标题 1"
          style={{ fontSize: 11, fontWeight: 700, minWidth: 28 }}
        >H1</button>
        <button
          className={`${styles.tb} ${isActive('heading', { level: 2 }) ? styles.on : ''}`}
          onClick={cmd('h2', '标题 2')} title="标题 2"
          style={{ fontSize: 11, fontWeight: 700, minWidth: 28 }}
        >H2</button>

        <div className={styles.div} />

        <button className={`${styles.tb} ${isActive('bulletList') ? styles.on : ''}`} onClick={cmd('ul', '无序列表')} title="列表">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="5" r="1.2" fill="currentColor"/><circle cx="3" cy="9" r="1.2" fill="currentColor"/><circle cx="3" cy="13" r="1.2" fill="currentColor"/><rect x="6" y="4.2" width="8.5" height="1.5" rx=".75" fill="currentColor"/><rect x="6" y="8.2" width="8.5" height="1.5" rx=".75" fill="currentColor"/><rect x="6" y="12.2" width="5" height="1.5" rx=".75" fill="currentColor"/></svg>
        </button>
        <button className={`${styles.tb} ${isActive('orderedList') ? styles.on : ''}`} onClick={cmd('ol', '有序列表')} title="有序列表">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><text x="1" y="6" fontSize="5" fill="currentColor" fontWeight="700">1.</text><text x="1" y="10" fontSize="5" fill="currentColor" fontWeight="700">2.</text><text x="1" y="14" fontSize="5" fill="currentColor" fontWeight="700">3.</text><rect x="7" y="4.2" width="7.5" height="1.5" rx=".75" fill="currentColor"/><rect x="7" y="8.2" width="7.5" height="1.5" rx=".75" fill="currentColor"/><rect x="7" y="12.2" width="5" height="1.5" rx=".75" fill="currentColor"/></svg>
        </button>
        <button className={`${styles.tb} ${isActive('taskList') ? styles.on : ''}`} onClick={cmd('task', '待办列表')} title="待办">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="4" height="4" rx=".8" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 6h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><rect x="2" y="10" width="4" height="4" rx=".8" fill="currentColor" opacity=".25"/><path d="M3.5 12l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 12h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        </button>
        <button className={`${styles.tb} ${isActive('blockquote') ? styles.on : ''}`} onClick={cmd('blockquote', '引用')} title="引用">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 5h3v3.5H4.5L6 11H4L2.5 9V5zM9 5h3v3.5H10.5L12 11h-2L8.5 9V5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
        </button>
        <button className={`${styles.tb} ${isActive('codeBlock') ? styles.on : ''}`} onClick={cmd('codeBlock', '代码块')} title="代码块">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M5 5l-3 3 3 3M11 5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 4l-3 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".5"/></svg>
        </button>

        <span className={styles.wc}>{wordCount} 字</span>

      </div>

      {/* Content */}
      <div className={styles.scroll}>
        <div className={styles.inner}>
          {/* Breadcrumb */}
          <div className={styles.bc}>
            <span>{note.folder || '未分类'}</span>
            <span className={styles.bcSep}>›</span>
            <span className={styles.bcCur}>{note.title || '未命名笔记'}</span>
          </div>

          {/* Title */}
          <div
            ref={titleRef}
            className={styles.title}
            contentEditable
            suppressContentEditableWarning
            onInput={handleTitleInput}
            onKeyDown={handleTitleKeyDown}
            data-placeholder="无标题"
          />

          {/* Meta */}
          <div className={styles.meta}>
            <span className={styles.metaDate}>{note.updatedAt}</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.metaDate}>{note.folder || '未分类'}</span>

            {/* Tags */}
            {note.tags.map(tag => (
              <span key={tag} className={styles.tagChip}>
                #{tag}
                {!inTrash && (
                  <span
                    className={styles.tagRemove}
                    onClick={() => onUpdate({ tags: note.tags.filter(t => t !== tag) })}
                    title="删除标签"
                  >×</span>
                )}
              </span>
            ))}

            {/* Add tag */}
            {!inTrash && !showTagInput && (
              <span className={styles.addTag} onClick={() => {
                setShowTagInput(true)
                setTimeout(() => tagInputRef.current?.focus(), 50)
              }}>
                + 标签
              </span>
            )}
            {!inTrash && showTagInput && (
              <input
                ref={tagInputRef}
                className={styles.tagInput}
                value={tagInput}
                placeholder="标签名..."
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    const t = tagInput.trim()
                    if (!note.tags.includes(t)) {
                      onUpdate({ tags: [...note.tags, t] })
                    }
                    setTagInput('')
                    setShowTagInput(false)
                  }
                  if (e.key === 'Escape') {
                    setTagInput('')
                    setShowTagInput(false)
                  }
                }}
                onBlur={() => {
                  if (tagInput.trim() && !note.tags.includes(tagInput.trim())) {
                    onUpdate({ tags: [...note.tags, tagInput.trim()] })
                  }
                  setTagInput('')
                  setShowTagInput(false)
                }}
              />
            )}
          </div>

          {/* Trash notice */}
          {inTrash && (
            <div className={styles.trashNotice}>
              此笔记在废纸篓中，只可查看不可编辑。
            </div>
          )}

          {/* Tiptap editor */}
          <EditorContent editor={editor} className={styles.editorWrap} />
        </div>
      </div>
    </div>
  )
}
