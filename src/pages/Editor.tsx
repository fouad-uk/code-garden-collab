
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import PreviewPanel from '@/components/PreviewPanel';
import { generateRoomId } from '@/utils/generateRoomId';
import { useToast } from '@/hooks/use-toast';
import { Toast } from "@/components/ui/toast";
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
  PanelTop,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Move,
  Maximize,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [showTerminal, setShowTerminal] = useState(false);
  const [showTopPanel, setShowTopPanel] = useState(false);
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [editorLayout, setEditorLayout] = useState<'normal' | 'zen'>('normal');
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  // Handle code execution
  const handleRunCode = useCallback(() => {
    toast({
      description: "Code executed successfully",
    });
  }, [toast]);

  // Handle saving code
  const handleSaveCode = useCallback(() => {
    localStorage.setItem(`code-${roomId}`, code);
    toast({
      description: "Code saved successfully",
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
      setShowTopPanel(false);
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
          icon: <PanelLeft className="h-4 w-4" />,
          label: `${showFileExplorer ? 'Hide' : 'Show'} File Explorer`,
          shortcut: "Ctrl+B",
          action: () => setShowFileExplorer(prev => !prev),
          active: showFileExplorer
        },
        {
          id: "terminal",
          icon: <PanelBottom className="h-4 w-4" />,
          label: `${showTerminal ? 'Hide' : 'Show'} Terminal`,
          shortcut: "Ctrl+J",
          action: () => setShowTerminal(prev => !prev),
          active: showTerminal
        },
        {
          id: "right-panel",
          icon: <PanelRight className="h-4 w-4" />,
          label: `${showRightPanel ? 'Hide' : 'Show'} ${rightPanelView === 'preview' ? 'Preview' : 'Assistant'}`,
          action: () => setShowRightPanel(prev => !prev),
          active: showRightPanel
        },
        {
          id: "top-panel",
          icon: <PanelTop className="h-4 w-4" />,
          label: `${showTopPanel ? 'Hide' : 'Show'} Top Panel`,
          action: () => setShowTopPanel(prev => !prev),
          active: showTopPanel
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

  // Render a panel toggle button
  const renderPanelToggleButton = (
    isVisible: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    title: string
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg animate-fade-in"
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Main code editor component
  const CodeEditorComponent = (
    <div className="flex-1 overflow-hidden relative">
      <CodeEditor 
        initialCode={code} 
        language={language}
        onCodeChange={handleCodeChange}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );

  // Get right panel content based on the current view
  const getRightPanelContent = () => {
    return rightPanelView === 'preview' ? (
      <PreviewPanel code={code} language={language} />
    ) : (
      <AiAssistant />
    );
  };

  // Get top panel content - can be expanded to show different tools
  const getTopPanelContent = () => (
    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
      <p>Optional top panel for future tools</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header 
        roomId={roomId} 
        activeUsers={activeUsers.length} 
        onRun={handleRunCode} 
        onSave={handleSaveCode} 
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        <ResizableLayout
          left={<FileExplorer onFileSelect={handleFileSelect} selectedFileId={selectedFileId} />}
          right={getRightPanelContent()}
          top={getTopPanelContent()}
          bottom={<Terminal code={code} />}
          center={<div className="h-full flex flex-col">
            <EditorToolbar 
              activeUsers={activeUsers} 
              onToggleTerminal={() => setShowTerminal(!showTerminal)}
              showingTerminal={showTerminal}
            />
            {CodeEditorComponent}
          </div>}
          showLeftPanel={showFileExplorer}
          showRightPanel={showRightPanel}
          showTopPanel={showTopPanel}
          showBottomPanel={showTerminal}
          onToggleLeftPanel={() => setShowFileExplorer(!showFileExplorer)}
          onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
          onToggleTopPanel={() => setShowTopPanel(!showTopPanel)}
          onToggleBottomPanel={() => setShowTerminal(!showTerminal)}
          leftPanelTitle="Explorer"
          rightPanelTitle={rightPanelView === 'preview' ? 'Preview' : 'AI Assistant'}
          bottomPanelTitle="Terminal"
          topPanelTitle="Tools"
        />
      </div>
      
      {/* Floating Action Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        {!showFileExplorer && (
          renderPanelToggleButton(
            showFileExplorer,
            () => setShowFileExplorer(true),
            <PanelLeft size={18} />,
            "Show File Explorer"
          )
        )}
        
        {!showTerminal && (
          renderPanelToggleButton(
            showTerminal,
            () => setShowTerminal(true),
            <PanelBottom size={18} />,
            "Show Terminal"
          )
        )}
        
        {!showRightPanel && (
          renderPanelToggleButton(
            showRightPanel,
            () => setShowRightPanel(true),
            <PanelRight size={18} />,
            `Show ${rightPanelView === 'preview' ? 'Preview' : 'AI Assistant'}`
          )
        )}
        
        {!showTopPanel && (
          renderPanelToggleButton(
            showTopPanel,
            () => setShowTopPanel(true),
            <PanelTop size={18} />,
            "Show Top Panel"
          )
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg animate-fade-in"
                onClick={toggleZenMode}
              >
                {editorLayout === 'normal' ? <Maximize2 size={18} /> : <MinusSquare size={18} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{editorLayout === 'normal' ? "Enter Zen Mode" : "Exit Zen Mode"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Active users indicator */}
      <div className="absolute bottom-4 left-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg relative"
              >
                <Users size={18} />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                  {activeUsers.length}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{activeUsers.length} active users</p>
              <div className="mt-1 space-y-1">
                {activeUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: user.color }}></div>
                    <span className="text-xs">{user.username}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
