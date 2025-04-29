
import React, { useState, useEffect } from 'react';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ResizableLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  children?: React.ReactNode;
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
  onToggleLeftPanel?: () => void;
  onToggleRightPanel?: () => void;
  rightPanelTitle?: string;
};

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  left,
  right,
  initialLeftWidth = 20,
  minLeftWidth = 15,
  maxLeftWidth = 40,
  children,
  showLeftPanel = true,
  showRightPanel = true,
  onToggleLeftPanel,
  onToggleRightPanel,
  rightPanelTitle = 'Panel',
}) => {
  // Track panel sizes for restoration when panels are toggled
  const [leftPanelSize, setLeftPanelSize] = useState(initialLeftWidth);
  const [rightPanelSize, setRightPanelSize] = useState(30);
  
  // Handle panel resizing events to store sizes
  const handlePanelResize = (panelId: string, size: number) => {
    if (panelId === 'left-panel') {
      setLeftPanelSize(size);
    } else if (panelId === 'right-panel') {
      setRightPanelSize(size);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {children && (
        <div className="w-full border-b border-border">
          {children}
        </div>
      )}
      
      <ResizablePanelGroup 
        direction="horizontal" 
        className="flex-1"
        onLayout={(sizes) => {
          // Handle layout changes if needed
        }}
      >
        {/* Left panel with toggle button */}
        {showLeftPanel ? (
          <>
            <ResizablePanel 
              defaultSize={leftPanelSize} 
              minSize={minLeftWidth} 
              maxSize={maxLeftWidth}
              className="h-full overflow-hidden relative"
              id="left-panel"
              onResize={(size) => handlePanelResize('left-panel', size)}
            >
              {left}
              {onToggleLeftPanel && (
                <div className="absolute top-1/2 right-0 -translate-y-1/2 transform z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full bg-accent opacity-70 hover:opacity-100 transition-opacity"
                    onClick={onToggleLeftPanel}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </ResizablePanel>
            
            <ResizableHandle withHandle className="transition-colors hover:bg-primary/20" />
          </>
        ) : (
          <div className="flex items-center pl-1 border-r border-border">
            {onToggleLeftPanel && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-accent transition-colors"
                onClick={onToggleLeftPanel}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        {/* Center content panel - always present */}
        <ResizablePanel 
          className="h-full overflow-hidden"
          id="center-panel"
          defaultSize={showLeftPanel && showRightPanel ? 50 : showLeftPanel || showRightPanel ? 70 : 100}
        />
        
        {/* Right panel with toggle button */}
        {showRightPanel ? (
          <>
            <ResizableHandle withHandle className="transition-colors hover:bg-primary/20" />
            <ResizablePanel 
              className="h-full overflow-hidden relative" 
              id="right-panel"
              defaultSize={rightPanelSize}
              onResize={(size) => handlePanelResize('right-panel', size)}
            >
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                {rightPanelTitle && (
                  <div className="text-xs font-medium text-muted-foreground bg-background/50 px-2 py-1 rounded-sm">
                    {rightPanelTitle}
                  </div>
                )}
                {onToggleRightPanel && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full bg-accent opacity-70 hover:opacity-100 transition-opacity"
                    onClick={onToggleRightPanel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {right}
            </ResizablePanel>
          </>
        ) : (
          <div className="flex items-center justify-end pr-1">
            {onToggleRightPanel && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-accent transition-colors"
                onClick={onToggleRightPanel}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default ResizableLayout;
