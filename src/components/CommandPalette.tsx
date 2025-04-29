
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
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FolderOpen,
  TerminalSquare,
  LayoutPanelLeft,
  Maximize,
  MinusSquare,
  Play,
  Save,
  Search,
  PanelTop,
  PanelRight,
  PanelLeft,
  PanelBottom,
  Move,
  Maximize2,
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
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(() => {
    const saved = localStorage.getItem('commandPalette-recent');
    return saved ? JSON.parse(saved) : [];
  });
  
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

  // Handle command selection and track recently used commands
  const handleCommandSelect = (commandId: string, action: () => void) => {
    // Add to recently used
    const newRecentlyUsed = [
      commandId,
      ...recentlyUsed.filter(id => id !== commandId)
    ].slice(0, 5); // Keep only last 5 used commands
    
    setRecentlyUsed(newRecentlyUsed);
    localStorage.setItem('commandPalette-recent', JSON.stringify(newRecentlyUsed));
    
    // Execute command action
    action();
    onOpenChange(false);
  };

  // Flatten all commands to search by id and prepare for recently used display
  const allCommandsMap = commands.reduce((acc, group) => {
    group.items.forEach(item => {
      acc[item.id] = item;
    });
    return acc;
  }, {} as Record<string, typeof commands[0]['items'][0]>);

  // Get recent commands
  const getRecentCommands = () => {
    return recentlyUsed
      .map(id => allCommandsMap[id])
      .filter(Boolean);
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput 
            placeholder="Type a command or search..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Recently Used Section */}
          {getRecentCommands().length > 0 && searchTerm.length === 0 && (
            <>
              <CommandGroup heading="Recently Used">
                {getRecentCommands().map((item) => (
                  <CommandItem
                    key={`recent-${item.id}`}
                    onSelect={() => handleCommandSelect(item.id, item.action)}
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
              <CommandSeparator />
            </>
          )}
          
          {/* Main Commands */}
          <ScrollArea className="h-[300px]">
            {commands.map((group) => (
              <CommandGroup heading={group.type} key={group.type}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleCommandSelect(item.id, item.action)}
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
          </ScrollArea>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default CommandPalette;
