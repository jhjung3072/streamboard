'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import type { ReportContentJson } from '@/features/reports/types';

interface EditorProps {
  contentJson: ReportContentJson;
  onChange: (value: ReportContentJson) => void;
  editable?: boolean;
}

export default function ReportEditor({ contentJson, onChange, editable = true }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),
    ],
    content: contentJson,
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'tiptap min-h-[320px] w-full px-4 py-4 text-sm text-slate-100 outline-none',
      },
    },
    onUpdate({ editor: tiptap }) {
      onChange(tiptap.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(contentJson)) {
      editor.commands.setContent(contentJson);
    }
  }, [contentJson, editor]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-200">내용</p>
        <div className="rounded-lg border border-slate-800/80 bg-slate-950/70 shadow-inner shadow-slate-950/80">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 px-3 py-2 text-xs text-slate-300">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor}
              className={`rounded-md px-2 py-1 transition ${
                editor?.isActive('bold')
                  ? 'bg-cyan-400/20 text-cyan-200'
                  : 'hover:bg-slate-800/70'
              }`}
            >
              굵게
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor}
              className={`rounded-md px-2 py-1 transition ${
                editor?.isActive('italic')
                  ? 'bg-cyan-400/20 text-cyan-200'
                  : 'hover:bg-slate-800/70'
              }`}
            >
              기울임
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={!editor}
              className={`rounded-md px-2 py-1 transition ${
                editor?.isActive('bulletList')
                  ? 'bg-cyan-400/20 text-cyan-200'
                  : 'hover:bg-slate-800/70'
              }`}
            >
              글머리
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={!editor}
              className={`rounded-md px-2 py-1 transition ${
                editor?.isActive('orderedList')
                  ? 'bg-cyan-400/20 text-cyan-200'
                  : 'hover:bg-slate-800/70'
              }`}
            >
              번호 목록
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              disabled={!editor}
              className={`rounded-md px-2 py-1 transition ${
                editor?.isActive('heading', { level: 2 })
                  ? 'bg-cyan-400/20 text-cyan-200'
                  : 'hover:bg-slate-800/70'
              }`}
            >
              헤딩
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={!editor}
              className={`rounded-md px-2 py-1 transition ${
                editor?.isActive('blockquote')
                  ? 'bg-cyan-400/20 text-cyan-200'
                  : 'hover:bg-slate-800/70'
              }`}
            >
              인용
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              disabled={!editor}
              className={`rounded-md px-2 py-1 transition ${
                editor?.isActive('codeBlock')
                  ? 'bg-cyan-400/20 text-cyan-200'
                  : 'hover:bg-slate-800/70'
              }`}
            >
              코드 블록
            </button>
          </div>
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">편집기 로딩 중...</div>
          )}
        </div>
        <p className="text-xs text-slate-500">
          본문은 서식형 편집기로 작성됩니다.
        </p>
      </div>
    </div>
  );
}
