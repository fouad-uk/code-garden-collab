
import React, { useState, useRef, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, FilePlus, FolderPlus, Search, X, Trash, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Define the FileNode interface explicitly with proper types
interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  language?: string;
  children?: FileNode[];
}

// Mock file structure - in a real app, this would come from a backend
const initialFiles: FileNode[] = [
  {
    id: '1',
    name: 'Project',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '2',
        name: 'src',
        type: 'folder',
        expanded: true,
        children: [
          {
            id: '3',
            name: 'App.tsx',
            type: 'file',
            language: 'typescript'
          },
          {
            id: '4',
            name: 'main.tsx',
            type: 'file',
            language: 'typescript'
          }
        ]
      },
      {
        id: '5',
        name: 'package.json',
        type: 'file',
        language: 'json'
      },
      {
        id: '6',
        name: 'README.md',
        type: 'file',
        language: 'markdown'
      }
    ]
  }
];

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  selectedFileId: string | null;
  onClose?: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect, selectedFileId, onClose }) => {
  const [files, setFiles] = useState<FileNode[]>(initialFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'addFile' | 'addFolder' | 'rename'>('addFile');
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Focus on search input when pressing Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFolder = (id: string) => {
    const toggleNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === id && node.type === 'folder') {
          return { ...node, expanded: !node.expanded };
        } else if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };
    setFiles(toggleNode(files));
  };

  const openAddFileDialog = (parentId: string) => {
    setDialogMode('addFile');
    setCurrentParentId(parentId);
    setNewName('');
    setDialogOpen(true);
  };

  const openAddFolderDialog = (parentId: string) => {
    setDialogMode('addFolder');
    setCurrentParentId(parentId);
    setNewName('');
    setDialogOpen(true);
  };

  const openRenameDialog = (node: FileNode) => {
    setDialogMode('rename');
    setCurrentNodeId(node.id);
    setNewName(node.name);
    setDialogOpen(true);
  };

  const handleDelete = (nodeId: string) => {
    const deleteNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter(node => {
        if (node.id === nodeId) {
          return false;
        }
        if (node.children) {
          node.children = deleteNode(node.children);
        }
        return true;
      });
    };
    
    const newFiles = deleteNode(files);
    setFiles(newFiles);
    
    toast({
      description: "Item deleted successfully",
    });
  };

  const handleDialogSubmit = () => {
    if (!newName.trim()) {
      toast({
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (dialogMode === 'rename' && currentNodeId) {
      const renameNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === currentNodeId) {
            return { ...node, name: newName };
          } else if (node.children) {
            return { ...node, children: renameNode(node.children) };
          }
          return node;
        });
      };
      
      setFiles(renameNode(files));
      toast({
        description: "Item renamed successfully",
      });
    } else if (currentParentId) {
      const addNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === currentParentId) {
            const newId = `${Date.now()}`;
            const newNode: FileNode = dialogMode === 'addFile' 
              ? { id: newId, name: newName, type: 'file', language: getLanguageFromFileName(newName) }
              : { id: newId, name: newName, type: 'folder', expanded: true, children: [] };
            
            return { 
              ...node, 
              expanded: true,
              children: [...(node.children || []), newNode]
            };
          } else if (node.children) {
            return { ...node, children: addNode(node.children) };
          }
          return node;
        });
      };
      
      setFiles(addNode(files));
      toast({
        description: `${dialogMode === 'addFile' ? 'File' : 'Folder'} created successfully`,
      });
    }
    
    setDialogOpen(false);
  };

  const getLanguageFromFileName = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => {
      // Filter based on search
      if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        if (!node.children?.some(child => {
          const childMatches = child.name.toLowerCase().includes(searchQuery.toLowerCase());
          if (child.children && !childMatches) {
            return child.children.some(grandChild => 
              grandChild.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          return childMatches;
        })) {
          return null;
        }
      }

      const isSelected = node.id === selectedFileId;

      if (node.type === 'folder') {
        return (
          <ContextMenu key={node.id}>
            <ContextMenuTrigger>
              <div>
                <div 
                  className={cn(
                    "flex items-center gap-1.5 py-1 px-2 cursor-pointer rounded-md hover:bg-sidebar-accent group",
                    level > 0 && "ml-3",
                    "transition-colors duration-150 ease-in-out",
                  )}
                  onClick={() => toggleFolder(node.id)}
                >
                  <span className="text-muted-foreground">
                    {node.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                  <Folder size={16} className="text-blue-500" />
                  <span className="text-sm select-none group-hover:text-accent-foreground">{node.name}</span>
                </div>
                {node.expanded && node.children && (
                  <div className="pl-2">
                    {renderFileTree(node.children, level + 1)}
                  </div>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => openAddFileDialog(node.id)}>
                <FilePlus className="mr-2 h-4 w-4" />
                Add File
              </ContextMenuItem>
              <ContextMenuItem onClick={() => openAddFolderDialog(node.id)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Add Folder
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => openRenameDialog(node)}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </ContextMenuItem>
              <ContextMenuItem 
                className="text-destructive focus:text-destructive" 
                onClick={() => handleDelete(node.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      } else {
        return (
          <ContextMenu key={node.id}>
            <ContextMenuTrigger>
              <div 
                className={cn(
                  "flex items-center gap-1.5 py-1 px-2 cursor-pointer rounded-md hover:bg-sidebar-accent group ml-3",
                  level > 0 && "ml-6",
                  isSelected && "bg-sidebar-accent text-sidebar-accent-foreground",
                  "transition-colors duration-150 ease-in-out",
                )}
                onClick={() => onFileSelect(node)}
              >
                <File size={16} className="text-muted-foreground" />
                <span className="text-sm select-none group-hover:text-accent-foreground">{node.name}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => openRenameDialog(node)}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </ContextMenuItem>
              <ContextMenuItem 
                className="text-destructive focus:text-destructive" 
                onClick={() => handleDelete(node.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      }
    }).filter(Boolean);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-border flex items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 bg-card pl-8 pr-8"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 absolute right-2.5 top-2.5" 
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 ml-1" 
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center px-2 py-1 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground">FILES</span>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => openAddFileDialog('1')}
            title="Add file"
          >
            <FilePlus size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => openAddFolderDialog('1')}
            title="Add folder"
          >
            <FolderPlus size={14} />
          </Button>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 py-2">
        {renderFileTree(files)}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'addFile' && 'Add New File'}
              {dialogMode === 'addFolder' && 'Add New Folder'}
              {dialogMode === 'rename' && 'Rename Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={dialogMode === 'addFile' ? 'filename.js' : 'folder name'}
              className="w-full"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleDialogSubmit()}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit}>
              {dialogMode === 'rename' ? 'Rename' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileExplorer;
