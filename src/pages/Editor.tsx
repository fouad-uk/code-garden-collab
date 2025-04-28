
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
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';

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

const Editor = () => {
  const { toast } = useToast();
  const [roomId] = useState(getOrCreateRoomId);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState('javascript');
  const [activeUsers] = useState(2); // Mock value for demo
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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        roomId={roomId} 
        activeUsers={activeUsers} 
        onRun={handleRunCode} 
        onSave={handleSaveCode} 
      />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* File Explorer Panel */}
        <ResizablePanel defaultSize={15} minSize={10} maxSize={30} className="bg-card border-r border-border">
          <FileExplorer 
            onFileSelect={handleFileSelect}
            selectedFileId={selectedFileId}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Main Editor Panel */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            {/* Code Editor */}
            <ResizablePanel defaultSize={75} minSize={30}>
              <CodeEditor 
                initialCode={code} 
                language={language}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Terminal */}
            <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
              <Terminal code={code} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right Panel (Preview/AI Assistant) */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <div className="flex flex-col h-full">
            <div className="border-b border-border p-1">
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger 
                    value="preview" 
                    className="flex-1"
                    onClick={() => setRightPanelView('preview')}
                  >
                    Preview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="assistant" 
                    className="flex-1"
                    onClick={() => setRightPanelView('assistant')}
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Editor;
