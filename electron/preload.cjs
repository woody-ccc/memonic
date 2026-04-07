'use strict'
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  notes: {
    list:   ()     => ipcRenderer.invoke('notes:list'),
    get:    (id)   => ipcRenderer.invoke('notes:get', id),
    save:   (note) => ipcRenderer.invoke('notes:save', note),
    delete: (id)   => ipcRenderer.invoke('notes:delete', id),
  },
})
