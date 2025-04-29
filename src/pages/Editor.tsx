
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
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';
import EditorToolbar from '@/components/EditorToolbar';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, 
  TerminalSquare, 
  Panelize, 
  Maximize,
  MinusSquare,
  Plus,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  CommandDialog, 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

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

// Mock active users data with avatar URLs
const ACTIVE_USERS = [
  { id: 'user1', username: 'Alice', color: '#10b981', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Alice' },
  { id: 'user2', username: 'Bob', color: '#3b82f6', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Bob' },
  { id: 'user3', username: 'Charlie', color: '#8b5cf6', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Charlie' },
  { id: 'user4', username: 'David', color: '#ec4899', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=David' },
];

const Editor = () => {
  const { toast } = useToast();
  const [roomId] = useState(getOrCreateRoomId);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState('javascript');
  const [activeUsers] = useState(ACTIVE_USERS);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [rightPanelView, setRightPanelView] = useState<'preview' | 'assistant'>('preview');
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [editorLayout, setEditorLayout] = useState<'normal' | 'zen'>('normal');

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
  
  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setCommandDialogOpen(true);
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setShowFileExplorer(prev => !prev);
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        setShowTerminal(prev => !prev);
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setEditorLayout(prev => prev === 'normal' ? 'zen' : 'normal');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Toggle zen mode
  const toggleZenMode = () => {
    setEditorLayout(prev => prev === 'normal' ? 'zen' : 'normal');
    if (editorLayout === 'normal') {
      setShowFileExplorer(false);
      setShowRightPanel(false);
      setShowTerminal(false);
    } else {
      setShowFileExplorer(true);
      setShowRightPanel(true);
      setShowTerminal(true);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        roomId={roomId} 
        activeUsers={activeUsers.length} 
        onRun={handleRunCode} 
        onSave={handleSaveCode} 
      />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* File Explorer Panel */}
        {showFileExplorer && (
          <>
            <ResizablePanel 
              defaultSize={20} 
              minSize={15} 
              maxSize={30}
              className="h-full overflow-hidden"
            >
              <FileExplorer 
                onFileSelect={handleFileSelect}
                selectedFileId={selectedFileId}
                onClose={() => setShowFileExplorer(false)}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        
        {/* Main Editor Area */}
        <ResizablePanel
          className="flex flex-col"
        >
          <EditorToolbar 
            activeUsers={activeUsers} 
            onToggleTerminal={() => setShowTerminal(!showTerminal)}
            showingTerminal={showTerminal}
          />
          
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Code Editor */}
            <ResizablePanel defaultSize={70} className="h-full overflow-hidden">
              <div className="flex flex-col h-full">
                <CodeEditor 
                  initialCode={code} 
                  language={language}
                  onCodeChange={handleCodeChange}
                  onLanguageChange={handleLanguageChange}
                />
                
                {/* Terminal Panel */}
                {showTerminal && (
                  <>
                    <ResizablePanelGroup direction="vertical">
                      <ResizableHandle withHandle />
                      <ResizablePanel defaultSize={25} minSize={10} maxSize={40} className="relative">
                        <Terminal code={code} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                          onClick={() => setShowTerminal(false)}
                        >
                          <X size={14} />
                        </Button>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </>
                )}
              </div>
            </ResizablePanel>
            
            {/* Preview/AI Assistant Panel */}
            {showRightPanel ? (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel className="h-full overflow-hidden">
                  <div className="flex flex-col h-full">
                    <div className="border-b border-border p-1">
                      <div className="flex items-center justify-between">
                        <Tabs defaultValue={rightPanelView} className="w-full">
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
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-1"
                          onClick={() => setShowRightPanel(false)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
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
              </>
            ) : null}
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Floating Action Buttons when panels are closed */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {!showFileExplorer && (
          <Button 
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={() => setShowFileExplorer(true)}
            title="Show File Explorer"
          >
            <FolderOpen size={18} />
          </Button>
        )}
        
        {!showTerminal && (
          <Button 
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={() => setShowTerminal(true)}
            title="Show Terminal"
          >
            <TerminalSquare size={18} />
          </Button>
        )}
        
        {!showRightPanel && (
          <Button 
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg"
            onClick={() => setShowRightPanel(true)}
            title="Show Preview/Assistant"
          >
            <Panelize size={18} />
          </Button>
        )}
        
        <Button 
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={toggleZenMode}
          title={editorLayout === 'normal' ? "Enter Zen Mode" : "Exit Zen Mode"}
        >
          {editorLayout === 'normal' ? <Maximize size={18} /> : <MinusSquare size={18} />}
        </Button>
      </div>
      
      {/* Command Dialog for quick actions */}
      <CommandDialog open={commandDialogOpen} onOpenChange={setCommandDialogOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="View">
              <CommandItem 
                onSelect={() => {
                  setShowFileExplorer(prev => !prev);
                  setCommandDialogOpen(false);
                }}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>{showFileExplorer ? 'Hide' : 'Show'} File Explorer</span>
                <CommandShortcut>Ctrl+B</CommandShortcut>
              </CommandItem>
              <CommandItem 
                onSelect={() => {
                  setShowTerminal(prev => !prev);
                  setCommandDialogOpen(false);
                }}
              >
                <TerminalSquare className="mr-2 h-4 w-4" />
                <span>{showTerminal ? 'Hide' : 'Show'} Terminal</span>
                <CommandShortcut>Ctrl+J</CommandShortcut>
              </CommandItem>
              <CommandItem 
                onSelect={() => {
                  setShowRightPanel(prev => !prev);
                  setCommandDialogOpen(false);
                }}
              >
                <Panelize className="mr-2 h-4 w-4" />
                <span>{showRightPanel ? 'Hide' : 'Show'} Preview/Assistant</span>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CommandItem 
                onSelect={() => {
                  toggleZenMode();
                  setCommandDialogOpen(false);
                }}
              >
                {editorLayout === 'normal' ? (
                  <Maximize className="mr-2 h-4 w-4" />
                ) : (
                  <MinusSquare className="mr-2 h-4 w-4" />
                )}
                <span>{editorLayout === 'normal' ? 'Enter' : 'Exit'} Zen Mode</span>
                <CommandShortcut>Ctrl+K</CommandShortcut>
              </CommandItem>
              <CommandItem 
                onSelect={() => {
                  handleRunCode();
                  setCommandDialogOpen(false);
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                <span>Run Code</span>
              </CommandItem>
              <CommandItem 
                onSelect={() => {
                  handleSaveCode();
                  setCommandDialogOpen(false);
                }}
              >
                <Save className="mr-2 h-4 w-4" />
                <span>Save Code</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default Editor;

// Icons to import
function Play(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function Save(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
