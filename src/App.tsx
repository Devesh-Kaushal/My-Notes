import React, { useEffect, useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Editor } from './components/Editor/Editor';
import { useWorkspaceStore } from './store/workspaceStore';
import { Loader2, MoreHorizontal, Type, Minimize2, Maximize2 } from 'lucide-react';
import { debounce } from 'lodash';
import tippy from 'tippy.js';

const App: React.FC = () => {
    const { loadNotes, isLoading, selectedNoteId, notes, updateNote, theme } = useWorkspaceStore();
    const [title, setTitle] = useState('');
    const [showPageMenu, setShowPageMenu] = useState(false);

    useEffect(() => {
        loadNotes();
    }, []);

    // Apply theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const currentNote = notes.find(n => n.id === selectedNoteId);

    useEffect(() => {
        if (currentNote) {
            setTitle(currentNote.metadata.title);
        }
    }, [selectedNoteId, currentNote]);

    // Create a debounced save function
    const debouncedSave = useCallback(
        debounce((id: string, content: string, newTitle: string, metadata: any) => {
            if (!currentNote) return;
            updateNote({
                ...currentNote,
                id,
                content,
                metadata: {
                    ...currentNote.metadata,
                    ...metadata,
                    title: newTitle
                }
            });
        }, 500),
        [currentNote, updateNote]
    );

    const handleContentChange = (newContent: string) => {
        if (currentNote) {
            debouncedSave(currentNote.id, newContent, title, currentNote.metadata);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (currentNote) {
            debouncedSave(currentNote.id, currentNote.content, newTitle, currentNote.metadata);
        }
    };

    const toggleMetadata = (key: string, value: any) => {
        if (currentNote) {
            const newMeta = { ...currentNote.metadata, [key]: value };
            // Update immediately for UI responsiveness
            updateNote({ ...currentNote, metadata: newMeta });
            // Save is handled by updateNote store logic (which calls saveNote)
        }
    };

    // Derived styles
    const fontClass = currentNote?.metadata.font === 'serif' ? 'font-serif' : currentNote?.metadata.font === 'mono' ? 'font-mono' : 'font-sans';
    const widthClass = currentNote?.metadata.fullWidth ? 'max-w-none px-12' : 'max-w-3xl px-12';
    const textClass = currentNote?.metadata.smallText ? 'text-sm' : 'text-base';

    return (
        <div className={`flex h-screen w-full bg-primary text-text-primary ${fontClass} ${textClass} transition-colors duration-200`}>
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-primary relative">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin text-text-secondary" />
                    </div>
                ) : selectedNoteId && currentNote ? (
                    <>
                        {/* Top Bar for Page Settings */}
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setShowPageMenu(!showPageMenu)}
                                className="p-1 hover:bg-hover rounded text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            {showPageMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-secondary border border-border rounded shadow-xl py-1 z-20">
                                    <div className="px-3 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Style</div>
                                    <div className="px-2 flex gap-1 mb-2">
                                        <button
                                            onClick={() => toggleMetadata('font', 'sans')}
                                            className={`flex-1 py-1 text-xs border rounded ${currentNote.metadata.font !== 'serif' && currentNote.metadata.font !== 'mono' ? 'bg-hover border-blue-500 text-text-primary' : 'border-border text-text-secondary'}`}
                                        >Sans</button>
                                        <button
                                            onClick={() => toggleMetadata('font', 'serif')}
                                            className={`flex-1 py-1 text-xs border rounded font-serif ${currentNote.metadata.font === 'serif' ? 'bg-hover border-blue-500 text-text-primary' : 'border-border text-text-secondary'}`}
                                        >Serif</button>
                                        <button
                                            onClick={() => toggleMetadata('font', 'mono')}
                                            className={`flex-1 py-1 text-xs border rounded font-mono ${currentNote.metadata.font === 'mono' ? 'bg-hover border-blue-500 text-text-primary' : 'border-border text-text-secondary'}`}
                                        >Mono</button>
                                    </div>

                                    <div className="h-px bg-border my-1"></div>

                                    <button
                                        onClick={() => toggleMetadata('smallText', !currentNote.metadata.smallText)}
                                        className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-hover flex items-center justify-between"
                                    >
                                        <span>Small Text</span>
                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${currentNote.metadata.smallText ? 'bg-blue-500' : 'bg-gray-600'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${currentNote.metadata.smallText ? 'left-4.5' : 'left-0.5'}`}></div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => toggleMetadata('fullWidth', !currentNote.metadata.fullWidth)}
                                        className="w-full text-left px-3 py-1.5 text-sm text-text-primary hover:bg-hover flex items-center justify-between"
                                    >
                                        <span>Full Width</span>
                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${currentNote.metadata.fullWidth ? 'bg-blue-500' : 'bg-gray-600'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${currentNote.metadata.fullWidth ? 'left-4.5' : 'left-0.5'}`}></div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Editor Scroll Area */}
                        <div
                            className="flex-1 h-full overflow-y-auto"
                            onClick={() => setShowPageMenu(false)} // Close menu on click outside
                        >
                            <div className={`mx-auto w-full pt-20 pb-24 transition-all duration-300 ${widthClass}`}>
                                {/* Title Input */}
                                <input
                                    type="text"
                                    className="w-full bg-transparent text-4xl font-bold text-text-primary placeholder:text-text-secondary focus:outline-none mb-4"
                                    placeholder="Untitled"
                                    value={title}
                                    onChange={handleTitleChange}
                                />

                                {/* Tiptap Editor */}
                                <Editor
                                    content={currentNote.content}
                                    onChange={handleContentChange}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-text-secondary flex-col gap-2">
                        <div className="text-4xl font-bold opacity-20 select-none">My Notes</div>
                    </div>
                )}
            </main>
        </div>
    )
}
export default App;
