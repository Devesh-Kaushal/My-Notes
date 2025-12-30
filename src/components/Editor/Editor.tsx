import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useEffect } from 'react';
import { SlashCommand, getSuggestionItems, renderItems } from './SlashCommand';
import { PageLink } from './PageLink';

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
}

export const Editor: React.FC<EditorProps> = ({ content, onChange, editable = true }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Placeholder.configure({
                placeholder: "Type '/' for commands",
            }),
            Image,
            Dropcursor,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            SlashCommand.configure({
                suggestion: {
                    items: getSuggestionItems,
                    render: renderItems
                }
            })
        ],
        content: content,
        editable: editable,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[calc(100vh-200px)]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return <EditorContent editor={editor} />;
};
