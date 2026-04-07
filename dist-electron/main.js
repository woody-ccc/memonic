"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const fs_1 = require("fs");
const isDev = process.env.NODE_ENV === 'development';
// ── Note storage (userData/notes/*.json) ────────────────────────────
const notesDir = (0, path_1.join)(electron_1.app.getPath('userData'), 'notes');
if (!(0, fs_1.existsSync)(notesDir))
    (0, fs_1.mkdirSync)(notesDir, { recursive: true });
function notePath(id) {
    return (0, path_1.join)(notesDir, `${id}.json`);
}
// IPC handlers
electron_1.ipcMain.handle('notes:list', (_e) => {
    const files = (0, fs_1.readdirSync)(notesDir).filter(f => f.endsWith('.json'));
    return files.map(f => {
        try {
            return JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(notesDir, f), 'utf-8'));
        }
        catch {
            return null;
        }
    }).filter(Boolean);
});
electron_1.ipcMain.handle('notes:get', (_e, id) => {
    const p = notePath(id);
    return (0, fs_1.existsSync)(p) ? JSON.parse((0, fs_1.readFileSync)(p, 'utf-8')) : null;
});
electron_1.ipcMain.handle('notes:save', (_e, note) => {
    (0, fs_1.writeFileSync)(notePath(note.id), JSON.stringify(note, null, 2));
    return true;
});
electron_1.ipcMain.handle('notes:delete', (_e, id) => {
    const p = notePath(id);
    if ((0, fs_1.existsSync)(p))
        (0, fs_1.unlinkSync)(p);
    return true;
});
// ── Window ───────────────────────────────────────────────────────────
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1280,
        height: 820,
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hiddenInset', // macOS native traffic lights
        trafficLightPosition: { x: 16, y: 16 },
        backgroundColor: '#FFFFFF',
        webPreferences: {
            preload: (0, path_1.join)(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        show: false,
    });
    // Open external links in system browser
    win.webContents.setWindowOpenHandler(({ url }) => {
        electron_1.shell.openExternal(url);
        return { action: 'deny' };
    });
    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools({ mode: 'detach' });
    }
    else {
        win.loadFile((0, path_1.join)(__dirname, '../dist/index.html'));
    }
    win.once('ready-to-show', () => win.show());
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
