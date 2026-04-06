import { useState, useEffect } from 'react'
import type { PanelState } from './types'
import Titlebar from './components/Titlebar'
import Sidebar from './components/Sidebar'
import NoteList from './components/NoteList'
import Editor from './components/Editor'
import RightPanel from './components/RightPanel'
import './styles/globals.css'

const DEFAULT_PANELS: PanelState = { sidebar: true, noteList: true, rightPanel: true }

export default function App() {
  const [panels, setPanels] = useState<PanelState>(DEFAULT_PANELS)
  const [activeNote, setActiveNote] = useState('1')

  function togglePanel(key: keyof PanelState) {
    setPanels(prev => ({ ...prev, [key]: !prev[key] }))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === '\\') { e.preventDefault(); togglePanel('sidebar') }
      if (mod && e.shiftKey && e.key === 'L') { e.preventDefault(); togglePanel('noteList') }
      if (mod && e.shiftKey && e.key === 'I') { e.preventDefault(); togglePanel('rightPanel') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className="window">
        <Titlebar panels={panels} onToggle={togglePanel} />
        <div className="main">
          <Sidebar visible={panels.sidebar} />
          <NoteList visible={panels.noteList} activeId={activeNote} onSelect={setActiveNote} />
          <Editor />
          <RightPanel visible={panels.rightPanel} />
        </div>
      </div>
      <div id="tip" className="tip" />
    </>
  )
}
