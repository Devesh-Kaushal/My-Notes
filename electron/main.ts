import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'node:path';
import { FileSystemService } from './services/FileSystemService';
import { Note } from '../src/types';
import os from 'os';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const fileService = new FileSystemService();

// Default Workspace Path (Documents/MyNotes)
const getWorkspacePath = () => {
    return path.join(app.getPath('documents'), 'MyNotes');
};

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        titleBarStyle: 'hiddenInset', // Mac-like style for cleaner look (works on Ubuntu too usually)
        autoHideMenuBar: true,
        backgroundColor: '#191919', // Dark mode default
    });

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString());
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        // Retry logic for dev server
        const loadURL = () => {
            win?.loadURL(process.env.VITE_DEV_SERVER_URL as string).catch((e) => {
                console.log('Failed to load URL, retrying in 500ms...', e);
                setTimeout(loadURL, 500);
            });
        }
        loadURL();
    } else {
        win.loadFile(path.join(process.env.DIST, 'index.html'));
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(() => {
    createWindow();

    // --- IPC Handlers ---
    const workspacePath = getWorkspacePath();

    // Create workspace if needed
    fileService.ensureDirectory(workspacePath).catch(err => console.error("Failed to create workspace", err));

    ipcMain.handle('notes:getAll', async () => {
        return await fileService.getNotes(workspacePath);
    });

    ipcMain.handle('notes:save', async (_, note: Note) => {
        return await fileService.saveNote(workspacePath, note);
    });

    ipcMain.handle('notes:create', async (_, note: Note) => {
        return await fileService.createNote(workspacePath, note);
    });

    ipcMain.handle('notes:delete', async (_, filePath: string) => {
        // Security check: ensure filePath is within workspace
        if (!filePath.startsWith(workspacePath)) {
            throw new Error("Unauthorized file access");
        }
        return await fileService.deleteNote(filePath);
    });
});
