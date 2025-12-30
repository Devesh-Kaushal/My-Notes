export interface NoteMetadata {
  title: string;
  emoji?: string;
  parentId?: string | null;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface Note {
  id: string; // The filename without extension
  content: string;
  metadata: NoteMetadata;
  path: string; // Absolute path (or relative to workspace)
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  parentId: string | null;
  children?: FileNode[];
  metadata?: NoteMetadata;
}

export type Theme = 'light' | 'dark' | 'system';
