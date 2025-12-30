import React, { useState } from 'react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Plus, Trash2, FileText, Settings, Search } from 'lucide-react';
import { SettingsModal } from '../Settings/SettingsModal';

export const Sidebar: React.FC = () => {
    const { notes, createNote, selectNote, selectedNoteId, deleteNote } = useWorkspaceStore();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <aside className="w-60 bg-secondary flex flex-col h-full border-r border-border select-none transition-colors duration-200">
                {/* User / Workspace Switcher */}
                <div className="p-3 hover:bg-hover cursor-pointer transition-colors m-2 rounded text-sm font-medium flex items-center gap-2 text-text-secondary hover:text-text-primary">
                    <div className="w-5 h-5 bg-blue-500 rounded text-xs flex items-center justify-center text-white">W</div>
                    <span>My Workspace</span>
                </div>

                {/* Quick Actions */}
                <div className="px-3 mb-2 space-y-0.5">
                    <div className="flex items-center gap-2 px-2 py-1 text-text-secondary hover:bg-hover hover:text-text-primary rounded text-sm cursor-pointer transition-colors">
                        <Search size={16} />
                        <span>Search</span>
                    </div>
                    <div
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 px-2 py-1 text-text-secondary hover:bg-hover hover:text-text-primary rounded text-sm cursor-pointer transition-colors"
                    >
                        <Settings size={16} />
                        <span>Settings</span>
                    </div>
                    <div
                        onClick={() => createNote()}
                        className="flex items-center gap-2 px-2 py-1 text-text-secondary hover:bg-hover hover:text-text-primary rounded text-sm cursor-pointer transition-colors"
                    >
                        <Plus size={16} />
                        <span>New Page</span>
                    </div>
                </div>

                {/* Pages List */}
                <div className="flex-1 overflow-y-auto px-2 pt-2 scrollbar-hide">
                    <h3 className="text-xs font-semibold text-text-secondary px-2 mb-1 uppercase tracking-wider">Private</h3>
                    {notes.length === 0 && (
                        <div className="text-xs text-text-secondary px-3 py-2">No pages created</div>
                    )}
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => selectNote(note.id)}
                            className={`
               group flex items-center justify-between px-2 py-1 mb-0.5 rounded cursor-pointer text-sm transition-colors
               ${selectedNoteId === note.id ? 'bg-hover text-text-primary font-medium' : 'text-text-secondary hover:bg-hover hover:text-text-primary'}
             `}
                        >
                            <div className="flex items-center gap-2 overflow-hidden flex-1">
                                <FileText size={14} className="opacity-70 shrink-0" />
                                <span className="truncate">{note.metadata.title || 'Untitled'}</span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteNote(note.id, note.path); }}
                                className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-400 p-0.5 rounded transition-opacity"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </aside>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
};
