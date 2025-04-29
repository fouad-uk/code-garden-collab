
import React from 'react';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';
import EditorToolbar from './EditorToolbar';

type ResizableLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  children?: React.ReactNode;
};

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  left,
  right,
  initialLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70,
  children,
}) => {
  return (
    <div className="flex flex-col h-full">
      {children && (
        <div className="w-full border-b border-border">
          {children}
        </div>
      )}
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel 
          defaultSize={initialLeftWidth} 
          minSize={minLeftWidth} 
          maxSize={maxLeftWidth}
          className="h-full overflow-hidden"
        >
          {left}
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel className="h-full overflow-hidden">
          {right}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ResizableLayout;
