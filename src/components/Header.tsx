
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Code, 
  Save, 
  Play, 
  Users
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

type HeaderProps = {
  roomId: string;
  activeUsers: number;
  onRun: () => void;
  onSave: () => void;
};

const Header: React.FC<HeaderProps> = ({ roomId, activeUsers, onRun, onSave }) => {
  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?room=${roomId}`);
  };

  return (
    <header className="bg-card border-b border-border p-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Code size={22} className="text-primary" />
        <h1 className="font-bold text-lg md:text-xl">CodeGarden</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground">
          <Users size={16} />
          <span>{activeUsers} online</span>
        </div>
        
        <Button variant="secondary" size="sm" className="hidden sm:flex" onClick={onSave}>
          <Save size={16} className="mr-2" />
          Save
        </Button>
        
        <Button variant="secondary" size="sm" className="sm:hidden" onClick={onSave}>
          <Save size={16} />
        </Button>
        
        <Button variant="secondary" size="sm" className="hidden sm:flex" onClick={onRun}>
          <Play size={16} className="mr-2" />
          Run
        </Button>
        
        <Button variant="secondary" size="sm" className="sm:hidden" onClick={onRun}>
          <Play size={16} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={copyShareLink}>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
