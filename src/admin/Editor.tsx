import Image from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extensions'
import { EditorContent, type Editor as TiptapEditor, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from 'lucide-react'
import { type ReactNode, useRef, useState } from 'react'
import { uploadImage } from './upload'

interface Props {
  content: string
  onChange: (html: string) => void
}

/**
 * The essay editor. Deliberately small: headings, emphasis, lists, quotes, links and images.
 * Images can be added with the toolbar button, pasted, or dragged straight in.
 */
export function Editor({ content, onChange }: Props) {
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState('')
  // Paste and drop handlers are created once, so they reach the editor through a ref.
  const editorRef = useRef<TiptapEditor | null>(null)

  async function insertImages(editor: TiptapEditor, files: File[], pos?: number) {
    const images = files.filter((f) => f.type.startsWith('image/'))
    if (!images.length) return false
    setError('')
    for (const file of images) {
      setUploading((n) => n + 1)
      try {
        const src = await uploadImage(file)
        const chain = editor.chain().focus()
        ;(pos === undefined ? chain : chain.setTextSelection(pos)).setImage({ src, alt: '' }).run()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'That image could not be uploaded.')
      } finally {
        setUploading((n) => n - 1)
      }
    }
    return true
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image,
      Placeholder.configure({ placeholder: 'Begin writing…' }),
    ],
    content,
    editorProps: {
      attributes: { class: 'gs-prose ad-prose', 'aria-label': 'Essay' },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? [])
        if (!files.some((f) => f.type.startsWith('image/')) || !editorRef.current) return false
        void insertImages(editorRef.current, files)
        return true
      },
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? [])
        if (!files.some((f) => f.type.startsWith('image/')) || !editorRef.current) return false
        event.preventDefault()
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
        void insertImages(editorRef.current, files, pos)
        return true
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  })
  editorRef.current = editor

  return (
    <div className="ad-editor">
      {editor && <Toolbar editor={editor} onImages={(files) => insertImages(editor, files)} />}
      {(uploading > 0 || error) && (
        <output className="ad-editor-note">{uploading > 0 ? 'Adding your image…' : error}</output>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}

function Toolbar({ editor, onImages }: { editor: TiptapEditor; onImages: (files: File[]) => void }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      paragraph: e.isActive('paragraph'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  function setLink() {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link address', previous ?? 'https://')
    if (url === null) return
    if (url.trim() === '' || url.trim() === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const c = () => editor.chain().focus()

  return (
    <div className="ad-toolbar" role="toolbar" aria-label="Formatting">
      <Btn label="Body text" active={state.paragraph} onClick={() => c().setParagraph().run()}>
        <Pilcrow />
      </Btn>
      <Btn label="Heading" active={state.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}>
        <Heading2 />
      </Btn>
      <Btn label="Subheading" active={state.h3} onClick={() => c().toggleHeading({ level: 3 }).run()}>
        <Heading3 />
      </Btn>
      <Sep />
      <Btn label="Bold (⌘B)" active={state.bold} onClick={() => c().toggleBold().run()}>
        <Bold />
      </Btn>
      <Btn label="Italic (⌘I)" active={state.italic} onClick={() => c().toggleItalic().run()}>
        <Italic />
      </Btn>
      <Btn label="Underline (⌘U)" active={state.underline} onClick={() => c().toggleUnderline().run()}>
        <Underline />
      </Btn>
      <Btn label="Link" active={state.link} onClick={setLink}>
        <Link2 />
      </Btn>
      <Sep />
      <Btn label="Bulleted list" active={state.bullet} onClick={() => c().toggleBulletList().run()}>
        <List />
      </Btn>
      <Btn label="Numbered list" active={state.ordered} onClick={() => c().toggleOrderedList().run()}>
        <ListOrdered />
      </Btn>
      <Btn label="Quote" active={state.quote} onClick={() => c().toggleBlockquote().run()}>
        <Quote />
      </Btn>
      <Btn label="Divider" onClick={() => c().setHorizontalRule().run()}>
        <Minus />
      </Btn>
      <Btn label="Add a photo" onClick={() => fileInput.current?.click()}>
        <ImagePlus />
      </Btn>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          onImages(Array.from(e.target.files ?? []))
          e.target.value = ''
        }}
      />
      <span className="ad-toolbar-spacer" />
      <Btn label="Undo (⌘Z)" disabled={!state.canUndo} onClick={() => c().undo().run()}>
        <Undo2 />
      </Btn>
      <Btn label="Redo (⇧⌘Z)" disabled={!state.canRedo} onClick={() => c().redo().run()}>
        <Redo2 />
      </Btn>
    </div>
  )
}

function Btn({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className="ad-tool"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span className="ad-toolbar-sep" aria-hidden="true" />
}
