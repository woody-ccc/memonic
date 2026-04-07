import { useState, useEffect, useRef, useCallback } from 'react'
import type { Note } from '../types'
import styles from './SearchModal.module.css'

interface Props {
  notes: Note[]
  onSelect: (id: string) => void
  onClose: () => void
}

function stripHtml(html: string) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent ?? ''
}

function highlight(text: string, query: string) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    text.slice(0, idx) +
    '\x00' + text.slice(idx, idx + query.length) + '\x01' +
    text.slice(idx + query.length)
  )
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const h = highlight(text, query)
  const parts = h.split(/\x00|\x01/)
  // pattern: normal, highlighted, normal, highlighted...
  return (
    <>
      {parts.map((p, i) => {
        const isHighlight = h.indexOf('\x00') !== -1 && i % 2 === 1
        return isHighlight
          ? <mark key={i} className={styles.mark}>{p}</mark>
          : <span key={i}>{p}</span>
      })}
    </>
  )
}

export default function SearchModal({ notes, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const q = query.trim()
  const results = q
    ? notes
        .filter(n => !n.deleted)
        .map(n => {
          const plain = stripHtml(n.content)
          const titleMatch = n.title.toLowerCase().includes(q.toLowerCase())
          const contentIdx = plain.toLowerCase().indexOf(q.toLowerCase())
          const snippet = contentIdx !== -1
            ? plain.slice(Math.max(0, contentIdx - 20), contentIdx + 60).trim()
            : plain.slice(0, 60).trim()
          return { note: n, titleMatch, snippet, contentIdx }
        })
        .filter(r => r.titleMatch || r.contentIdx !== -1)
        .sort((a, b) => (b.titleMatch ? 1 : 0) - (a.titleMatch ? 1 : 0))
    : []

  useEffect(() => { setActive(0) }, [q])
  useEffect(() => { inputRef.current?.focus() }, [])

  const confirm = useCallback((idx: number) => {
    const r = results[idx]
    if (r) { onSelect(r.note.id); onClose() }
  }, [results, onSelect, onClose])

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(v => Math.min(v + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(v => Math.max(v - 1, 0)) }
    if (e.key === 'Enter')     { confirm(active) }
    if (e.key === 'Escape')    { onClose() }
  }

  // scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <svg className={styles.icon} width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="搜索笔记..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey}
          />
          {query && (
            <span className={styles.clear} onClick={() => setQuery('')}>×</span>
          )}
        </div>

        <div ref={listRef} className={styles.list}>
          {!q && (
            <div className={styles.hint}>输入关键词搜索标题或正文</div>
          )}
          {q && results.length === 0 && (
            <div className={styles.hint}>未找到「{q}」相关笔记</div>
          )}
          {results.map((r, i) => (
            <div
              key={r.note.id}
              data-idx={i}
              className={`${styles.item} ${i === active ? styles.on : ''}`}
              onClick={() => confirm(i)}
              onMouseEnter={() => setActive(i)}
            >
              <div className={styles.itemTitle}>
                <HighlightText text={r.note.title || '未命名笔记'} query={q} />
              </div>
              {r.snippet && (
                <div className={styles.itemSnippet}>
                  <HighlightText text={r.snippet} query={q} />
                </div>
              )}
              <div className={styles.itemMeta}>
                <span>{r.note.folder || '未分类'}</span>
                <span>·</span>
                <span>{r.note.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span><kbd>↑↓</kbd> 导航</span>
          <span><kbd>↵</kbd> 打开</span>
          <span><kbd>Esc</kbd> 关闭</span>
        </div>
      </div>
    </div>
  )
}
