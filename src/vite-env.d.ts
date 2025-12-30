/// <reference types="vite/client" />

import { Note } from './types';

declare global {
    interface Window {
        api: {
            notes: {
                getAll: () => Promise<Note[]>;
                save: (note: Note) => Promise<void>;
                create: (note: Note) => Promise<Note>;
                delete: (path: string) => Promise<void>;
            }
        }
    }
}
