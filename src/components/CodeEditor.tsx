
import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import UserCursor from './UserCursor';
import UserSelection from './UserSelection';
import LanguageSelector from './LanguageSelector';

// Define mock remote users for preview purposes
const MOCK_REMOTE_USERS = [
  {
    id: 'user1',
    username: 'Alice',
    color: '#10b981',
    position: { x: 150, y: 100 },
    selection: { x: 160, y: 100, width: 120, height: 18 }
  },
  {
    id: 'user2',
    username: 'Bob',
    color: '#3b82f6',
    position: { x: 200, y: 160 },
    selection: null
  }
];

type CodeEditorProps = {
  initialCode: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
};

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode, 
  language,
  onCodeChange,
  onLanguageChange
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [remoteUsers] = useState(MOCK_REMOTE_USERS);
  
  // Initialize Monaco Editor
  useEffect(() => {
    if (editorRef.current && !monacoRef.current) {
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: initialCode,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
          enabled: false
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        padding: {
          top: 10,
          bottom: 10
        }
      });

      // Listen for content changes
      monacoRef.current.onDidChangeModelContent(() => {
        const value = monacoRef.current?.getValue() || '';
        onCodeChange(value);
      });
      
      // Handle editor disposal
      return () => {
        if (monacoRef.current) {
          monacoRef.current.dispose();
          monacoRef.current = null;
        }
      };
    }
  }, [initialCode, onCodeChange]);

  // Update language when it changes
  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card p-2 border-b border-border">
        <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
      </div>
      <div className="relative flex-1">
        <div ref={editorRef} className="h-full w-full" />
        
        {/* Render remote user cursors and selections */}
        {remoteUsers.map(user => (
          <React.Fragment key={user.id}>
            <UserCursor
              username={user.username}
              color={user.color}
              position={user.position}
            />
            {user.selection && (
              <UserSelection
                color={user.color}
                position={user.selection}
                size={{ width: user.selection.width, height: user.selection.height }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CodeEditor;
