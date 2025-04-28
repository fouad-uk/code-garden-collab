
import React from 'react';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';

type ResizableLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
};

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  left,
  right,
  initialLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70,
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
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
  );
};

export default ResizableLayout;
