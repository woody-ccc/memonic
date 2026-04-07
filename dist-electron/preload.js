"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    notes: {
        list: () => electron_1.ipcRenderer.invoke('notes:list'),
        get: (id) => electron_1.ipcRenderer.invoke('notes:get', id),
        save: (note) => electron_1.ipcRenderer.invoke('notes:save', note),
        delete: (id) => electron_1.ipcRenderer.invoke('notes:delete', id),
    },
});
