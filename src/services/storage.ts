/**
 * Storage service — uses Electron IPC when running as desktop app,
 * falls back to localStorage when running in a plain browser.
 */
import type { Note } from '../types'
import { NOTES } from '../data/mockData'

const isElectron = !!window.electronAPI

// ── Seed localStorage with mock data on first run ──────────────────
function seedIfEmpty() {
  if (localStorage.getItem('memonic:seeded')) return
  NOTES.forEach(n => localStorage.setItem(`memonic:note:${n.id}`, JSON.stringify(n)))
  localStorage.setItem('memonic:seeded', '1')
}

// ── Public API ─────────────────────────────────────────────────────
export async function listNotes(): Promise<Note[]> {
  if (isElectron) {
    const notes = await window.electronAPI!.notes.list()
    // seed on first run
    if (notes.length === 0) {
      await Promise.all(NOTES.map(n => window.electronAPI!.notes.save(n as unknown as Record<string, unknown>)))
      return NOTES
    }
    return notes
  }
  seedIfEmpty()
  return Object.keys(localStorage)
    .filter(k => k.startsWith('memonic:note:'))
    .map(k => JSON.parse(localStorage.getItem(k)!))
    .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
}

export async function getNote(id: string): Promise<Note | null> {
  if (isElectron) return window.electronAPI!.notes.get(id)
  const raw = localStorage.getItem(`memonic:note:${id}`)
  return raw ? JSON.parse(raw) : null
}

export async function saveNote(note: Note): Promise<void> {
  const updated = { ...note, updatedAt: new Date().toISOString().split('T')[0] }
  if (isElectron) {
    await window.electronAPI!.notes.save(updated as unknown as Record<string, unknown>)
  } else {
    localStorage.setItem(`memonic:note:${note.id}`, JSON.stringify(updated))
  }
}

export async function deleteNote(id: string): Promise<void> {
  if (isElectron) {
    await window.electronAPI!.notes.delete(id)
  } else {
    localStorage.removeItem(`memonic:note:${id}`)
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
