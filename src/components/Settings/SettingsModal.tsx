import React from 'react';
import { X, Moon, Sun, Monitor } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Theme } from '../../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme } = useWorkspaceStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-secondary w-[500px] rounded-xl shadow-2xl border border-border overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">Appearance</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`
                                        flex flex-col items-center gap-2 p-3 rounded-lg border transition-all
                                        ${theme === t ? 'bg-hover border-blue-500 text-text-primary' : 'border-border text-text-secondary hover:bg-hover hover:text-text-primary'}
                                    `}
                                >
                                    {t === 'light' && <Sun size={24} />}
                                    {t === 'dark' && <Moon size={24} />}
                                    {t === 'system' && <Monitor size={24} />}
                                    <span className="capitalize text-sm">{t}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">About</h3>
                        <div className="text-sm text-text-secondary">
                            <p>MyNotes v1.0.0</p>
                            <p className="mt-1">Offline-first, durable note taking.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
