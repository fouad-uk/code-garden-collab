
import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useTextSize } from '@/hooks/useTextSize';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sun, Moon, CircleUser, AlignJustify } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  activeUsers?: Array<{
    id: string;
    username: string;
    color: string;
  }>;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  activeUsers = [] 
}) => {
  const { theme, setTheme } = useTheme();
  const { textSize, setTextSize } = useTextSize();

  return (
    <div className="w-full flex items-center justify-between px-3 py-1.5">
      <div className="flex items-center gap-4">
        <div>
          <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value)}>
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
          <ToggleGroup type="single" value={textSize} onValueChange={(value) => value && setTextSize(value)}>
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
      </div>
      
      <div className="flex items-center -space-x-2">
        {activeUsers.map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-7 w-7 border-2 border-background transition-all hover:scale-110 hover:z-10">
                <AvatarFallback style={{ backgroundColor: user.color }}>
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{user.username}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default EditorToolbar;
