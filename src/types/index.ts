export interface Note {
  id: string
  title: string
  content: string        // HTML content from Tiptap
  preview: string        // plain text snippet
  tags: string[]
  starred: boolean
  folder: string
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface PanelState {
  sidebar: boolean
  noteList: boolean
  rightPanel: boolean
}

export type SortType = 'latest' | 'modified' | 'title'
export type ViewMode = 'edit' | 'preview' | 'split'
