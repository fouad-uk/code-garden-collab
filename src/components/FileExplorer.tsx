
import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, FilePlus, FolderPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock file structure - in a real app, this would come from a backend
const initialFiles = [
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

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  language?: string;
  children?: FileNode[];
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  selectedFileId: string | null;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect, selectedFileId }) => {
  const [files, setFiles] = useState<FileNode[]>(initialFiles);
  const [searchQuery, setSearchQuery] = useState('');

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

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => {
      // Filter based on search
      if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        if (!node.children?.some(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
          return null;
        }
      }

      const isSelected = node.id === selectedFileId;

      if (node.type === 'folder') {
        return (
          <div key={node.id}>
            <div 
              className={cn(
                "flex items-center gap-1.5 py-1 px-2 cursor-pointer rounded-md hover:bg-sidebar-accent group",
                level > 0 && "ml-3",
              )}
              onClick={() => toggleFolder(node.id)}
            >
              <span className="text-muted-foreground">{node.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
              <Folder size={16} className="text-blue-500" />
              <span className="text-sm select-none">{node.name}</span>
            </div>
            {node.expanded && node.children && (
              <div className="pl-2">
                {renderFileTree(node.children, level + 1)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={node.id}
            className={cn(
              "flex items-center gap-1.5 py-1 px-2 cursor-pointer rounded-md hover:bg-sidebar-accent group ml-3",
              level > 0 && "ml-6",
              isSelected && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            onClick={() => onFileSelect(node)}
          >
            <File size={16} className="text-muted-foreground" />
            <span className="text-sm select-none">{node.name}</span>
          </div>
        );
      }
    }).filter(Boolean);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-border">
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 bg-card"
        />
      </div>
      <div className="flex justify-between items-center px-2 py-1 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground">FILES</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <FilePlus size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <FolderPlus size={14} />
          </Button>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 py-2">
        {renderFileTree(files)}
      </div>
    </div>
  );
};

export default FileExplorer;
