
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import PreviewPanel from '@/components/PreviewPanel';
import { generateRoomId } from '@/utils/generateRoomId';
import { useToast } from '@/hooks/use-toast';
import FileExplorer from '@/components/FileExplorer';
import AiAssistant from '@/components/AiAssistant';
import Terminal from '@/components/Terminal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResizableLayout from '@/components/ResizableLayout';
import EditorToolbar from '@/components/EditorToolbar';
import { Button } from '@/components/ui/button';
import CommandPalette from '@/components/CommandPalette';
import { 
  FolderOpen, 
  TerminalSquare, 
  LayoutPanelLeft, 
  Maximize2,
  MinusSquare,
  Play,
  Save,
  X,
  Users,
  Zap,
} from 'lucide-react';

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
  const handleRunCode = useCallback(() => {
    toast({
      description: "Code executed successfully",
      icon: <Zap size={16} className="text-yellow-500" />
    });
  }, [toast]);

  // Handle saving code
  const handleSaveCode = useCallback(() => {
    localStorage.setItem(`code-${roomId}`, code);
    toast({
      description: "Code saved successfully",
      icon: <Save size={16} className="text-green-500" />
    });
  }, [code, roomId, toast]);

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
    if (!file.id) return; // Skip if file has no ID
    
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
        toggleZenMode();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveCode();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRunCode, handleSaveCode]);
  
  // Toggle zen mode
  const toggleZenMode = () => {
    setEditorLayout(prev => prev === 'normal' ? 'zen' : 'normal');
    if (editorLayout === 'normal') {
      // Enter zen mode - hide panels
      setShowFileExplorer(false);
      setShowRightPanel(false);
      setShowTerminal(false);
    } else {
      // Exit zen mode - restore panels
      setShowFileExplorer(true);
      setShowRightPanel(true);
    }
  };
  
  // Command palette items
  const commandItems = [
    {
      type: "View",
      items: [
        {
          id: "file-explorer",
          icon: <FolderOpen className="h-4 w-4" />,
          label: `${showFileExplorer ? 'Hide' : 'Show'} File Explorer`,
          shortcut: "Ctrl+B",
          action: () => setShowFileExplorer(prev => !prev),
          active: showFileExplorer
        },
        {
          id: "terminal",
          icon: <TerminalSquare className="h-4 w-4" />,
          label: `${showTerminal ? 'Hide' : 'Show'} Terminal`,
          shortcut: "Ctrl+J",
          action: () => setShowTerminal(prev => !prev),
          active: showTerminal
        },
        {
          id: "preview",
          icon: <LayoutPanelLeft className="h-4 w-4" />,
          label: `${showRightPanel ? 'Hide' : 'Show'} ${rightPanelView === 'preview' ? 'Preview' : 'Assistant'}`,
          action: () => setShowRightPanel(prev => !prev),
          active: showRightPanel
        },
        {
          id: "zen-mode",
          icon: editorLayout === 'normal' ? <Maximize2 className="h-4 w-4" /> : <MinusSquare className="h-4 w-4" />,
          label: `${editorLayout === 'normal' ? 'Enter' : 'Exit'} Zen Mode`,
          shortcut: "Ctrl+K",
          action: toggleZenMode,
          active: editorLayout === 'zen'
        }
      ]
    },
    {
      type: "Actions",
      items: [
        {
          id: "run-code",
          icon: <Play className="h-4 w-4" />,
          label: "Run Code",
          shortcut: "Ctrl+Enter",
          action: handleRunCode
        },
        {
          id: "save-code",
          icon: <Save className="h-4 w-4" />,
          label: "Save Code",
          shortcut: "Ctrl+S",
          action: handleSaveCode
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header 
        roomId={roomId} 
        activeUsers={activeUsers.length} 
        onRun={handleRunCode} 
        onSave={handleSaveCode} 
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* File Explorer */}
        {showFileExplorer && (
          <div className="w-64 h-full border-r border-border bg-card/50 flex flex-col">
            <FileExplorer 
              onFileSelect={handleFileSelect}
              selectedFileId={selectedFileId}
              onClose={() => setShowFileExplorer(false)}
            />
          </div>
        )}
        
        {/* Main Editor Area with optional terminal */}
        <div className="flex-1 h-full flex flex-col overflow-hidden">
          <EditorToolbar 
            activeUsers={activeUsers} 
            onToggleTerminal={() => setShowTerminal(!showTerminal)}
            showingTerminal={showTerminal}
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden relative">
              <CodeEditor 
                initialCode={code} 
                language={language}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            
            {/* Terminal Panel */}
            {showTerminal && (
              <div className="h-48 border-t border-border relative">
                <Terminal code={code} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-70 hover:opacity-100 z-10"
                  onClick={() => setShowTerminal(false)}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Panel (Preview or AI Assistant) */}
        {showRightPanel && (
          <div className="w-96 h-full border-l border-border bg-card/50 flex flex-col">
            <div className="border-b border-border p-1">
              <Tabs 
                defaultValue={rightPanelView}
                value={rightPanelView}
                onValueChange={(value) => setRightPanelView(value as 'preview' | 'assistant')}
                className="w-full"
              >
                <div className="flex items-center justify-between">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger 
                      value="preview" 
                      className="transition-all data-[state=active]:animate-fade-in"
                    >
                      Preview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="assistant" 
                      className="transition-all data-[state=active]:animate-fade-in"
                    >
                      AI Assistant
                    </TabsTrigger>
                  </TabsList>
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ml-1"
                    onClick={() => setShowRightPanel(false)}
                  >
                    <X size={14} />
                  </Button>
                </div>
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
        )}
      </div>
      
      {/* Floating Action Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {!showFileExplorer && (
          <Button 
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg animate-fade-in"
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
            className="rounded-full shadow-lg animate-fade-in"
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
            className="rounded-full shadow-lg animate-fade-in"
            onClick={() => setShowRightPanel(true)}
            title={`Show ${rightPanelView === 'preview' ? 'Preview' : 'AI Assistant'}`}
          >
            <LayoutPanelLeft size={18} />
          </Button>
        )}
        
        <Button 
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg animate-fade-in"
          onClick={toggleZenMode}
          title={editorLayout === 'normal' ? "Enter Zen Mode" : "Exit Zen Mode"}
        >
          {editorLayout === 'normal' ? <Maximize2 size={18} /> : <MinusSquare size={18} />}
        </Button>
      </div>
      
      {/* Active users indicator */}
      <div className="absolute bottom-4 left-4">
        <Button 
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg relative"
          title={`${activeUsers.length} active users`}
        >
          <Users size={18} />
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
            {activeUsers.length}
          </span>
        </Button>
      </div>
      
      {/* Command Palette */}
      <CommandPalette
        isOpen={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
        commands={commandItems}
      />
    </div>
  );
};

export default Editor;
