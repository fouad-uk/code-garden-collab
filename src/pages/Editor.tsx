
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import PreviewPanel from '@/components/PreviewPanel';
import { generateRoomId } from '@/utils/generateRoomId';
import { useToast } from '@/hooks/use-toast';
import FileExplorer from '@/components/FileExplorer';
import AiAssistant from '@/components/AiAssistant';
import Terminal from '@/components/Terminal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ResizableLayout from '@/components/ResizableLayout';
import EditorToolbar from '@/components/EditorToolbar';

// Get room ID from URL or generate new one
const getOrCreateRoomId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  
  if (roomParam) {
    return roomParam;
  }
  
  const newRoomId = generateRoomId();
  // Update URL with the new room ID
  const url = new URL(window.location.href);
  url.searchParams.set('room', newRoomId);
  window.history.pushState({}, '', url);
  
  return newRoomId;
};

const DEFAULT_CODE = `function helloWorld() {
  console.log("Hello from CodeGarden!");
  
  // Try modifying this code and see the results
  // in the preview panel on the right
  const colors = ["red", "green", "blue"];
  colors.forEach(color => {
    console.log(\`I love \${color}!\`);
  });
}

helloWorld();`;

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  language?: string;
  children?: FileNode[];
}

// Mock active users data
const ACTIVE_USERS = [
  { id: 'user1', username: 'Alice', color: '#10b981' },
  { id: 'user2', username: 'Bob', color: '#3b82f6' },
  { id: 'user3', username: 'Charlie', color: '#8b5cf6' },
  { id: 'user4', username: 'David', color: '#ec4899' },
];

const Editor = () => {
  const { toast } = useToast();
  const [roomId] = useState(getOrCreateRoomId);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState('javascript');
  const [activeUsers] = useState(ACTIVE_USERS);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [rightPanelView, setRightPanelView] = useState<'preview' | 'assistant'>('preview');

  // Handle code execution
  const handleRunCode = () => {
    toast({
      description: "Code executed successfully",
    });
  };

  // Handle saving code
  const handleSaveCode = () => {
    localStorage.setItem(`code-${roomId}`, code);
    toast({
      description: "Code saved successfully",
    });
  };

  // Check for saved code on component mount
  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${roomId}`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [roomId]);

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  // Handle language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  // Handle file selection
  const handleFileSelect = (file: FileNode) => {
    setSelectedFileId(file.id);
    if (file.language) {
      setLanguage(file.language);
    }
    toast({
      description: `Opened ${file.name}`,
    });
  };

  // Left panel content - File Explorer
  const leftPanelContent = (
    <FileExplorer 
      onFileSelect={handleFileSelect}
      selectedFileId={selectedFileId}
    />
  );

  // Right panel content - Preview/AI Assistant
  const rightPanelContent = (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-1">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger 
              value="preview" 
              onClick={() => setRightPanelView('preview')}
              className="transition-all data-[state=active]:animate-fade-in"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="assistant" 
              onClick={() => setRightPanelView('assistant')}
              className="transition-all data-[state=active]:animate-fade-in"
            >
              AI Assistant
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {rightPanelView === 'preview' ? (
          <PreviewPanel code={code} language={language} />
        ) : (
          <AiAssistant />
        )}
      </div>
    </div>
  );

  // Main content - Code Editor and Terminal
  const mainContent = (
    <ResizableLayout
      left={<CodeEditor 
        initialCode={code} 
        language={language}
        onCodeChange={handleCodeChange}
        onLanguageChange={handleLanguageChange}
      />}
      right={<Terminal code={code} />}
      initialLeftWidth={75}
      minLeftWidth={50}
      maxLeftWidth={85}
    />
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        roomId={roomId} 
        activeUsers={activeUsers.length} 
        onRun={handleRunCode} 
        onSave={handleSaveCode} 
      />
      
      <ResizableLayout
        left={leftPanelContent}
        right={rightPanelContent}
        initialLeftWidth={70}
        minLeftWidth={30}
        maxLeftWidth={85}
      >
        <EditorToolbar activeUsers={activeUsers} />
      </ResizableLayout>
    </div>
  );
};

export default Editor;
