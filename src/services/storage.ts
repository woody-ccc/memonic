import type { Note } from '../types'
import { INITIAL_NOTES } from '../data/mockData'

const isElectron = !!window.electronAPI
const KEY = (id: string) => `memonic:note:${id}`
const INDEX_KEY = 'memonic:index'

function textFromHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return (div.textContent || '').trim().slice(0, 80)
}

// ── Seed on first run ──────────────────────────────────────────────
async function seedIfEmpty(): Promise<void> {
  if (isElectron) {
    const existing = await window.electronAPI!.notes.list()
    if (existing.length === 0) {
      for (const n of INITIAL_NOTES) {
        await window.electronAPI!.notes.save(n)
      }
    }
  } else {
    if (!localStorage.getItem('memonic:seeded')) {
      INITIAL_NOTES.forEach(n => localStorage.setItem(KEY(n.id), JSON.stringify(n)))
      const ids = INITIAL_NOTES.map(n => n.id)
      localStorage.setItem(INDEX_KEY, JSON.stringify(ids))
      localStorage.setItem('memonic:seeded', '1')
    }
  }
}

// ── Public API ─────────────────────────────────────────────────────
export async function loadNotes(): Promise<Note[]> {
  await seedIfEmpty()
  if (isElectron) {
    const list = await window.electronAPI!.notes.list()
    return (list as Note[]).sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
  }
  const ids: string[] = JSON.parse(localStorage.getItem(INDEX_KEY) || '[]')
  return ids
    .map(id => {
      const raw = localStorage.getItem(KEY(id))
      return raw ? (JSON.parse(raw) as Note) : null
    })
    .filter(Boolean) as Note[]
}

export async function saveNote(note: Note): Promise<void> {
  const updated: Note = {
    ...note,
    preview: textFromHtml(note.content),
    updatedAt: new Date().toISOString().split('T')[0],
  }
  if (isElectron) {
    await window.electronAPI!.notes.save(updated)
  } else {
    localStorage.setItem(KEY(note.id), JSON.stringify(updated))
    const ids: string[] = JSON.parse(localStorage.getItem(INDEX_KEY) || '[]')
    if (!ids.includes(note.id)) {
      localStorage.setItem(INDEX_KEY, JSON.stringify([note.id, ...ids]))
    }
  }
}

export async function deleteNote(id: string): Promise<void> {
  if (isElectron) {
    await window.electronAPI!.notes.delete(id)
  } else {
    localStorage.removeItem(KEY(id))
    const ids: string[] = JSON.parse(localStorage.getItem(INDEX_KEY) || '[]')
    localStorage.setItem(INDEX_KEY, JSON.stringify(ids.filter(i => i !== id)))
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function countWords(html: string): number {
  const div = document.createElement('div')
  div.innerHTML = html
  const text = div.textContent || ''
  // count CJK characters + latin words
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const latin = (text.match(/\b[a-zA-Z]+\b/g) || []).length
  return cjk + latin
}
