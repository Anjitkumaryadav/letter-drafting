import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface EditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export interface EditorHandle {
    getEditor: () => Quill | null;
}

const Editor = forwardRef<EditorHandle, EditorProps>(({ value, onChange, placeholder, className }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<Quill | null>(null);
    const isInternalChange = useRef(false);

    useImperativeHandle(ref, () => ({
        getEditor: () => quillInstance.current
    }));

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: placeholder,
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'align': [] }],
                        ['clean']
                    ]
                }
            });

            quillInstance.current.on('text-change', () => {
                if (onChange) {
                    isInternalChange.current = true;
                    // Get HTML content
                    const content = editorRef.current?.querySelector('.ql-editor')?.innerHTML || '';
                    onChange(content);
                }
            });
        }
    }, []);

    // Update content when value prop changes (and not from internal edit)
    useEffect(() => {
        if (quillInstance.current && value !== undefined) {
            const currentContent = editorRef.current?.querySelector('.ql-editor')?.innerHTML || '';
            if (value !== currentContent && !isInternalChange.current) {
                quillInstance.current.clipboard.dangerouslyPasteHTML(value);
            }
            isInternalChange.current = false;
        }
    }, [value]);

    return <div ref={editorRef} className={className} />;
});

export default Editor;
