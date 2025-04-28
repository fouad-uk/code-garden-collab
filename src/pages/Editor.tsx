
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
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';

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
    // This is handled automatically in the preview component
    toast({
      description: "Code executed successfully",
    });
  };

  // Handle saving code
  const handleSaveCode = () => {
    // In a real app, this would save to a database
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
    // In a real app, would broadcast changes to other users
  };

  // Handle language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // In a real app, would broadcast language change to other users
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
    <SidebarProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header 
          roomId={roomId} 
          activeUsers={activeUsers} 
          onRun={handleRunCode} 
          onSave={handleSaveCode} 
        />
        
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <Sidebar collapsible="icon" variant="sidebar">
            <SidebarContent>
              <FileExplorer 
                onFileSelect={handleFileSelect}
                selectedFileId={selectedFileId}
              />
            </SidebarContent>
          </Sidebar>
          
          <SidebarTrigger />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Code Editor */}
            <div className="flex-1 overflow-hidden">
              <CodeEditor 
                initialCode={code} 
                language={language}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            
            {/* Terminal */}
            <Terminal code={code} />
          </div>
          
          {/* Right Panel (Preview/AI Assistant) */}
          <div className="w-1/3 border-l border-border flex flex-col">
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
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Editor;
