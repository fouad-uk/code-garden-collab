
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useTextSize } from '@/hooks/useTextSize';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sun, Moon, CircleUser, AlignJustify, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EditorToolbarProps {
  activeUsers?: Array<{
    id: string;
    username: string;
    color: string;
    avatar?: string;
  }>;
  onToggleTerminal?: () => void;
  showingTerminal?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  activeUsers = [],
  onToggleTerminal,
  showingTerminal 
}) => {
  const { theme, setTheme } = useTheme();
  const { textSize, setTextSize } = useTextSize();

  return (
    <div className="w-full flex items-center justify-between px-3 py-1.5 bg-card/40 backdrop-blur-sm transition-all duration-300 border-b border-border">
      <div className="flex items-center gap-4">
        <div>
          <ToggleGroup type="single" value={theme} onValueChange={(value) => {
            // Make sure value is of type Theme before setting
            if (value === 'light' || value === 'dark' || value === 'system') {
              setTheme(value);
            }
          }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value="system" 
                  aria-label="System theme"
                  className={cn(
                    "transition-all data-[state=on]:bg-muted data-[state=on]:text-foreground",
                    "hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <CircleUser className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>System theme</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value="light" 
                  aria-label="Light theme"
                  className={cn(
                    "transition-all data-[state=on]:bg-muted data-[state=on]:text-foreground",
                    "hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <Sun className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Light theme</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value="dark" 
                  aria-label="Dark theme"
                  className={cn(
                    "transition-all data-[state=on]:bg-muted data-[state=on]:text-foreground",
                    "hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <Moon className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Dark theme</TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
        
        <div>
          <ToggleGroup type="single" value={textSize} onValueChange={(value) => {
            // Make sure value is of type TextSize before setting
            if (value === 'sm' || value === 'md' || value === 'lg') {
              setTextSize(value);
            }
          }}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value="sm" 
                  aria-label="Small text"
                  className={cn(
                    "transition-all data-[state=on]:bg-muted data-[state=on]:text-foreground",
                    "hover:bg-muted/80 hover:text-foreground text-xs"
                  )}
                >
                  A
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Small text</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value="md" 
                  aria-label="Medium text"
                  className={cn(
                    "transition-all data-[state=on]:bg-muted data-[state=on]:text-foreground",
                    "hover:bg-muted/80 hover:text-foreground text-sm"
                  )}
                >
                  A
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Medium text</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value="lg" 
                  aria-label="Large text"
                  className={cn(
                    "transition-all data-[state=on]:bg-muted data-[state=on]:text-foreground",
                    "hover:bg-muted/80 hover:text-foreground text-base"
                  )}
                >
                  A
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Large text</TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </div>
        
        {onToggleTerminal && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showingTerminal ? "outline" : "ghost"} 
                size="icon"
                onClick={onToggleTerminal}
                className={cn(
                  "h-8 w-8 transition-all",
                  showingTerminal && "border-primary/30"
                )}
              >
                <AlignJustify size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Terminal</TooltipContent>
          </Tooltip>
        )}
      </div>
      
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center -space-x-2 cursor-pointer">
              {activeUsers.map((user, idx) => (
                <Avatar key={user.id} className={cn(
                  "h-7 w-7 border-2 border-background transition-all hover:scale-110 hover:z-10",
                  idx === 0 && "z-3",
                  idx === 1 && "z-2",
                  idx === 2 && "z-1"
                )}>
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.username} />
                  ) : (
                    <AvatarFallback style={{ backgroundColor: user.color }}>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Active Users</span>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {activeUsers.length} online
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activeUsers.map((user) => (
              <DropdownMenuItem key={user.id} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.username} />
                  ) : (
                    <AvatarFallback style={{ backgroundColor: user.color }}>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="flex-1">{user.username}</span>
                <div 
                  className="h-2 w-2 rounded-full bg-green-500"
                  title="Online"
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EditorToolbar;
