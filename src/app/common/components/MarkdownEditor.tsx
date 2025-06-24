import { memo, useRef, useEffect } from "react";
import "@/app/common/styles/MarkdownEditor.css";
import dynamic from "next/dynamic";
import type SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const SimpleMDEEditor = dynamic<React.ComponentProps<typeof SimpleMDE>>(
  () => import("react-simplemde-editor"),
  { ssr: false }
);

export const MarkdownEditor = memo(function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const editorRef = useRef<any>(null);

  // Solución 1: Usar useCallback para estabilizar la función onChange
  const handleChange = useRef(onChange);
  
  useEffect(() => {
    handleChange.current = onChange;
  }, [onChange]);

  const stableOnChange = useRef((val: string) => {
    handleChange.current(val);
  }).current;

  // Solución 2: Configurar opciones más estables
  const editorOptions = useRef({
    placeholder: "Escribe tu contenido…",
    spellChecker: false,
    toolbar: [
      "bold",
      "italic", 
      "heading",
      "|",
      "code",
      "quote",
      "unordered-list",
      "ordered-list",
      "|",
    ] as const,
    autofocus: false,
    status: false,
    autoDownloadFontAwesome: true,
    minHeight: "200px",
    maxHeight: "300px",
    element: undefined,
    lineWrapping: true,
    tabSize: 2,
    previewClass: "editor-preview",
  }).current;

  return (
    <div className="w-full ">
      <SimpleMDEEditor
        className="custom-editor"
        ref={editorRef}
        value={value}
        onChange={stableOnChange}
        options={editorOptions}
      />
    </div>
  );
});