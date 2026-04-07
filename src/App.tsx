import { useState, useEffect, useCallback, useRef } from 'react'
import type { Note, PanelState, ViewType } from './types'
import { loadNotes, saveNote, deleteNote, generateId } from './services/storage'
import Titlebar from './components/Titlebar'
import Sidebar from './components/Sidebar'
import NoteList from './components/NoteList'
import Editor from './components/Editor'
import RightPanel from './components/RightPanel'
import './styles/globals.css'

const DEFAULT_PANELS: PanelState = { sidebar: true, noteList: true, rightPanel: true }
const AUTOSAVE_DELAY = 800

export default function App() {
  const [panels, setPanels]     = useState<PanelState>(DEFAULT_PANELS)
  const [notes, setNotes]       = useState<Note[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [view, setView]         = useState<ViewType>('all')
  const [loading, setLoading]   = useState(true)
  const saveTimer               = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    loadNotes().then(list => {
      // migrate old notes that don't have deleted field
      const migrated = list.map(n => ({ ...n, deleted: n.deleted ?? false }))
      setNotes(migrated)
      const first = migrated.find(n => !n.deleted)
      if (first) setActiveId(first.id)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === '\\')             { e.preventDefault(); toggle('sidebar') }
      if (mod && e.shiftKey && e.key === 'L'){ e.preventDefault(); toggle('noteList') }
      if (mod && e.shiftKey && e.key === 'I'){ e.preventDefault(); toggle('rightPanel') }
      if (mod && e.key === 'n')              { e.preventDefault(); handleCreate() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [notes, view])

  function toggle(key: keyof PanelState) {
    setPanels(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // ── Filtered notes for current view ───────────────────────────────
  const filteredNotes = notes.filter(n => {
    if (view === 'trash')   return n.deleted
    if (view === 'starred') return n.starred && !n.deleted
    if (view.startsWith('tag:')) {
      const tag = view.slice(4)
      return n.tags.includes(tag) && !n.deleted
    }
    if (view.startsWith('folder:')) {
      const folder = view.slice(7)
      return n.folder === folder && !n.deleted
    }
    return !n.deleted // 'all'
  })

  // ── All tags across non-deleted notes (for sidebar) ────────────────
  const allTags = Array.from(new Set(notes.filter(n => !n.deleted).flatMap(n => n.tags)))

  // ── Create ─────────────────────────────────────────────────────────
  const handleCreate = useCallback(() => {
    if (view === 'trash') return   // don't create in trash view
    const now = new Date().toISOString().split('T')[0]
    const folder = view.startsWith('folder:') ? view.slice(7) : '未分类'
    const tag    = view.startsWith('tag:')    ? view.slice(4)  : undefined
    const newNote: Note = {
      id: generateId(),
      title: '',
      content: '',
      preview: '',
      tags: tag ? [tag] : [],
      starred: view === 'starred',
      deleted: false,
      folder,
      wordCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    setNotes(prev => [newNote, ...prev])
    setActiveId(newNote.id)
    saveNote(newNote)
  }, [view])

  // ── Update (debounced save) ─────────────────────────────────────────
  const handleUpdate = useCallback((patch: Partial<Note>) => {
    if (!activeId) return
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, ...patch } : n))
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setNotes(prev => {
        const note = prev.find(n => n.id === activeId)
        if (note) saveNote({ ...note, ...patch })
        return prev
      })
    }, AUTOSAVE_DELAY)
  }, [activeId])

  // ── Soft delete → trash ────────────────────────────────────────────
  const handleTrash = useCallback((id: string) => {
    setNotes(prev => {
      const next = prev.map(n => n.id === id ? { ...n, deleted: true } : n)
      const note = next.find(n => n.id === id)
      if (note) saveNote(note)
      // switch selection
      if (activeId === id) {
        const remaining = next.filter(n => !n.deleted)
        setActiveId(remaining.length > 0 ? remaining[0].id : null)
      }
      return next
    })
  }, [activeId])

  // ── Restore from trash ─────────────────────────────────────────────
  const handleRestore = useCallback((id: string) => {
    setNotes(prev => {
      const next = prev.map(n => n.id === id ? { ...n, deleted: false } : n)
      const note = next.find(n => n.id === id)
      if (note) saveNote(note)
      return next
    })
  }, [])

  // ── Permanent delete ───────────────────────────────────────────────
  const handleDeletePermanent = useCallback((id: string) => {
    deleteNote(id)
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id)
      if (activeId === id) setActiveId(null)
      return next
    })
  }, [activeId])

  // ── Toggle star ────────────────────────────────────────────────────
  const handleToggleStar = useCallback((id: string) => {
    setNotes(prev => {
      const next = prev.map(n => n.id === id ? { ...n, starred: !n.starred } : n)
      const note = next.find(n => n.id === id)
      if (note) saveNote(note)
      return next
    })
  }, [])

  const activeNote = notes.find(n => n.id === activeId) ?? null

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
        height:'100vh', background:'#F5F7FA', fontSize:13, color:'#94A3B8' }}>
        正在加载...
      </div>
    )
  }

  return (
    <>
      <div className="window">
        <Titlebar panels={panels} onToggle={toggle} />
        <div className="main">
          <Sidebar
            visible={panels.sidebar}
            view={view}
            allTags={allTags}
            notes={notes}
            onViewChange={(v) => {
              setView(v)
              // auto-select first note in new view
              const first = notes.find(n => {
                if (v === 'trash')   return n.deleted
                if (v === 'starred') return n.starred && !n.deleted
                if (v.startsWith('tag:'))    return n.tags.includes(v.slice(4)) && !n.deleted
                if (v.startsWith('folder:')) return n.folder === v.slice(7) && !n.deleted
                return !n.deleted
              })
              setActiveId(first?.id ?? null)
            }}
          />
          <NoteList
            visible={panels.noteList}
            notes={filteredNotes}
            activeId={activeId}
            view={view}
            onSelect={setActiveId}
            onCreate={handleCreate}
            onTrash={handleTrash}
            onRestore={handleRestore}
            onDeletePermanent={handleDeletePermanent}
            onToggleStar={handleToggleStar}
          />
          <Editor note={activeNote} onUpdate={handleUpdate} inTrash={view === 'trash'} />
          <RightPanel visible={panels.rightPanel} note={activeNote} />
        </div>
      </div>
      <div id="tip" className="tip" />
    </>
  )
}
