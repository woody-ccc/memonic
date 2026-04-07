'use strict'
const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development'

// ── Note storage ─────────────────────────────────────────────────────
const notesDir = path.join(app.getPath('userData'), 'notes')
if (!fs.existsSync(notesDir)) fs.mkdirSync(notesDir, { recursive: true })

function notePath(id) {
  return path.join(notesDir, `${id}.json`)
}

ipcMain.handle('notes:list', () => {
  try {
    return fs.readdirSync(notesDir)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try { return JSON.parse(fs.readFileSync(path.join(notesDir, f), 'utf-8')) }
        catch { return null }
      })
      .filter(Boolean)
      .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1))
  } catch { return [] }
})

ipcMain.handle('notes:get', (_e, id) => {
  const p = notePath(id)
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : null
})

ipcMain.handle('notes:save', (_e, note) => {
  fs.writeFileSync(notePath(note.id), JSON.stringify(note, null, 2))
  return true
})

ipcMain.handle('notes:delete', (_e, id) => {
  const p = notePath(id)
  if (fs.existsSync(p)) fs.unlinkSync(p)
  return true
})

// ── Window ────────────────────────────────────────────────────────────
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 860,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: '#FFFFFF',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.once('ready-to-show', () => win.show())
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
