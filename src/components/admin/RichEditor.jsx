import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Code, Undo, Redo, Link as LinkIcon, ImageIcon,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getImageUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

function ToolbarButton({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn('rounded p-1.5 hover:bg-gray-100', active && 'bg-gray-200 text-primary')}
    >
      {children}
    </button>
  )
}

export default function RichEditor({ value, onChange, bucket = 'blogs' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  })

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('Enter URL')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files[0]
      if (!file) return
      const fileName = `${Date.now()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from(bucket).upload(fileName, file)
      if (error) return
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
      editor.chain().focus().setImage({ src: getImageUrl(publicUrl) }).run()
    }
    input.click()
  }

  return (
    <div className="rounded-lg border">
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1"><Heading1 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2"><Heading2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3"><Heading3 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code"><Code className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={addLink} title="Link"><LinkIcon className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={addImage} title="Image"><ImageIcon className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="h-4 w-4" /></ToolbarButton>
      </div>
      <EditorContent editor={editor} className="prose min-h-[300px] max-w-none p-4 focus:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror]:outline-none" />
    </div>
  )
}
