import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Note, NoteMetadata } from '../../src/types';

export class FileSystemService {

    async ensureDirectory(dirPath: string): Promise<void> {
        try {
            await fs.access(dirPath);
        } catch {
            await fs.mkdir(dirPath, { recursive: true });
        }
    }

    async getNotes(directory: string): Promise<Note[]> {
        await this.ensureDirectory(directory);
        const files = await fs.readdir(directory);
        const notes: Note[] = [];

        for (const file of files) {
            if (!file.endsWith('.md')) continue;

            const filePath = path.join(directory, file);
            try {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const { data, content } = matter(fileContent);

                notes.push({
                    id: file.replace('.md', ''),
                    content,
                    metadata: data as NoteMetadata,
                    path: filePath
                });
            } catch (error) {
                console.error(`Error reading file ${file}:`, error);
            }
        }

        return notes;
    }

    async saveNote(directory: string, note: Note): Promise<void> {
        await this.ensureDirectory(directory);
        const filePath = path.join(directory, `${note.id}.md`);

        // update updated_at
        const metadata = {
            ...note.metadata,
            updated_at: new Date().toISOString()
        };

        const fileContent = matter.stringify(note.content, metadata);
        await fs.writeFile(filePath, fileContent, 'utf-8');
    }

    async deleteNote(filePath: string): Promise<void> {
        await fs.unlink(filePath);
    }

    async createNote(directory: string, note: Note): Promise<Note> {
        await this.ensureDirectory(directory);
        if (!note.metadata.created_at) {
            note.metadata.created_at = new Date().toISOString();
        }
        await this.saveNote(directory, note);
        return note;
    }
}
