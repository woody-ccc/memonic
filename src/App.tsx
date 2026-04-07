import { useState, useEffect, useCallback, useRef } from 'react'
import type { Note, PanelState } from './types'
import { loadNotes, saveNote, deleteNote, generateId } from './services/storage'
import Titlebar from './components/Titlebar'
import Sidebar from './components/Sidebar'
import NoteList from './components/NoteList'
import Editor from './components/Editor'
import RightPanel from './components/RightPanel'
import './styles/globals.css'

const DEFAULT_PANELS: PanelState = { sidebar: true, noteList: true, rightPanel: true }
const AUTOSAVE_DELAY = 800 // ms

export default function App() {
  const [panels, setPanels]       = useState<PanelState>(DEFAULT_PANELS)
  const [notes, setNotes]         = useState<Note[]>([])
  const [activeId, setActiveId]   = useState<string | null>(null)
  const [loading, setLoading]     = useState(true)
  const saveTimer                 = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Load notes on mount
  useEffect(() => {
    loadNotes().then(list => {
      setNotes(list)
      if (list.length > 0) setActiveId(list[0].id)
      setLoading(false)
    })
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === '\\')                   { e.preventDefault(); toggle('sidebar') }
      if (mod && e.shiftKey && e.key === 'L')       { e.preventDefault(); toggle('noteList') }
      if (mod && e.shiftKey && e.key === 'I')       { e.preventDefault(); toggle('rightPanel') }
      if (mod && e.key === 'n')                     { e.preventDefault(); handleCreate() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [notes])

  function toggle(key: keyof PanelState) {
    setPanels(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Create new note
  const handleCreate = useCallback(() => {
    const now = new Date().toISOString().split('T')[0]
    const newNote: Note = {
      id: generateId(),
      title: '',
      content: '',
      preview: '',
      tags: [],
      starred: false,
      folder: '未分类',
      wordCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    setNotes(prev => [newNote, ...prev])
    setActiveId(newNote.id)
    saveNote(newNote)
  }, [])

  // Update active note (called by Editor on every keystroke, debounced to disk)
  const handleUpdate = useCallback((patch: Partial<Note>) => {
    if (!activeId) return
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, ...patch } : n))

    // Debounced save to disk
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setNotes(prev => {
        const note = prev.find(n => n.id === activeId)
        if (note) saveNote({ ...note, ...patch })
        return prev
      })
    }, AUTOSAVE_DELAY)
  }, [activeId])

  // Delete note
  const handleDelete = useCallback((id: string) => {
    deleteNote(id)
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id)
      if (activeId === id) {
        setActiveId(next.length > 0 ? next[0].id : null)
      }
      return next
    })
  }, [activeId])

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
          <Sidebar visible={panels.sidebar} />
          <NoteList
            visible={panels.noteList}
            notes={notes}
            activeId={activeId}
            onSelect={setActiveId}
            onCreate={handleCreate}
            onDelete={handleDelete}
          />
          <Editor note={activeNote} onUpdate={handleUpdate} />
          <RightPanel visible={panels.rightPanel} note={activeNote} />
        </div>
      </div>
      <div id="tip" className="tip" />
    </>
  )
}
