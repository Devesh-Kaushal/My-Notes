import { create } from 'zustand';
import { Note, Theme } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface WorkspaceState {
    notes: Note[];
    selectedNoteId: string | null;
    isLoading: boolean;
    theme: Theme;

    loadNotes: () => Promise<void>;
    selectNote: (id: string | null) => void;
    createNote: (parentId?: string) => Promise<Note | undefined>;
    updateNote: (note: Note) => Promise<void>;
    deleteNote: (id: string, path: string) => Promise<void>;
    setTheme: (theme: Theme) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    notes: [],
    selectedNoteId: null,
    isLoading: false,
    theme: 'dark',

    loadNotes: async () => {
        set({ isLoading: true });
        try {
            const notes = await window.api.notes.getAll();
            notes.sort((a, b) => {
                const dateA = new Date(a.metadata.updated_at || 0).getTime();
                const dateB = new Date(b.metadata.updated_at || 0).getTime();
                return dateB - dateA;
            });
            set({ notes, isLoading: false });
        } catch (error) {
            console.error("Failed to load notes:", error);
            set({ isLoading: false });
        }
    },

    selectNote: (id) => set({ selectedNoteId: id }),

    createNote: async (parentId?: string) => {
        const id = uuidv4();
        const newNote: Note = {
            id,
            content: '',
            metadata: {
                title: 'Untitled',
                emoji: '📄',
                parentId: parentId || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            path: ''
        };

        try {
            const created = await window.api.notes.create(newNote);
            set(state => ({
                notes: [created, ...state.notes],
                selectedNoteId: created.id
            }));
            return created;
        } catch (err) {
            console.error("Failed to create note", err);
            return undefined;
        }
    },

    updateNote: async (updatedNote) => {
        // Optimistic update
        set(state => ({
            notes: state.notes.map(n => n.id === updatedNote.id ? updatedNote : n)
        }));
        try {
            await window.api.notes.save(updatedNote);
        } catch (err) {
            console.error("Failed to save note", err);
        }
    },

    deleteNote: async (id, path) => {
        try {
            await window.api.notes.delete(path);
            set(state => ({
                notes: state.notes.filter(n => n.id !== id),
                selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId
            }));
        } catch (err) {
            console.error("Failed to delete note", err);
        }
    },

    setTheme: (theme) => set({ theme })
}));
