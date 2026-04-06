export interface Note {
  id: string
  title: string
  preview: string
  date: string
  tags: Tag[]
  starred: boolean
  folder?: string
  content?: string
  wordCount?: number
  charCount?: number
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
  color: string
  bg: string
}

export interface Folder {
  id: string
  name: string
  count: number
}

export interface PanelState {
  sidebar: boolean
  noteList: boolean
  rightPanel: boolean
}

export type SortType = 'latest' | 'modified' | 'title'
export type ViewMode = 'edit' | 'preview' | 'split'
