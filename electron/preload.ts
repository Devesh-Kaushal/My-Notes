import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    notes: {
        getAll: () => ipcRenderer.invoke('notes:getAll'),
        save: (note: any) => ipcRenderer.invoke('notes:save', note),
        create: (note: any) => ipcRenderer.invoke('notes:create', note),
        delete: (path: string) => ipcRenderer.invoke('notes:delete', path),
    }
});
