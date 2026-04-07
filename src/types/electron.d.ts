interface ElectronAPI {
  notes: {
    list:   () => Promise<import('./index').Note[]>
    get:    (id: string) => Promise<import('./index').Note | null>
    save:   (note: import('./index').Note) => Promise<boolean>
    delete: (id: string) => Promise<boolean>
  }
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
