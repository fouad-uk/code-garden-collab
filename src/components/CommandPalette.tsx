
import React, { useState, useEffect } from 'react';
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
import {
  FolderOpen,
  TerminalSquare,
  LayoutPanelLeft,
  Maximize,
  MinusSquare,
  Play,
  Save,
  Search,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  commands: {
    type: string;
    items: {
      id: string;
      icon: React.ReactNode;
      label: string;
      shortcut?: string;
      action: () => void;
      active?: boolean;
    }[];
  }[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onOpenChange,
  commands,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Handle keyboard shortcuts to close the command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput 
          placeholder="Type a command or search..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {commands.map((group) => (
            <CommandGroup heading={group.type} key={group.type}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    item.action();
                    onOpenChange(false);
                  }}
                  className={item.active ? "bg-accent/20" : ""}
                >
                  <span className="mr-2 h-4 w-4 flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default CommandPalette;
