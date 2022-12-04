import { MONACO_OPTIONS } from '@/utils/const';
import type { editor } from 'monaco-editor';
import type { ChangeHandler, EditorDidMount, MonacoEditorProps } from 'react-monaco-editor';
import MonacoEditor from 'react-monaco-editor';

const Editor: React.FC<{
  width?: string;
  height: string;
  value: string;
  language: string;
  editorRef?: React.MutableRefObject<editor.IStandaloneCodeEditor>;
  monacoRef?: React.MutableRefObject<MonacoEditorProps>;
  onChange?: ChangeHandler;
  readOnly?: boolean;
}> = ({ width, height, value, language, monacoRef, editorRef, onChange, readOnly }) => {
  const editorDidMountHandle: EditorDidMount = (editor, monaco) => {
    editor.getAction('editor.action.formatDocument').run(); // 格式化
    editor.setValue(editor.getValue()); // 再次设置
    editor.focus();
    if (monacoRef) monacoRef.current = monaco;
    if (editorRef) editorRef.current = editor;
  };
  return (
    <MonacoEditor
      width={width || '100%'}
      height={height}
      theme="vs-dark"
      value={value}
      language={language}
      options={{ ...MONACO_OPTIONS, readOnly }}
      editorDidMount={editorDidMountHandle}
      onChange={onChange}
    />
  );
};

export default Editor;
