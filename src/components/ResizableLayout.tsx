
import React, { useState } from 'react';
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
};

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  left,
  right,
  initialLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70,
  children,
  showLeftPanel = true,
  showRightPanel = true,
  onToggleLeftPanel,
  onToggleRightPanel,
}) => {
  return (
    <div className="flex flex-col h-full">
      {children && (
        <div className="w-full border-b border-border">
          {children}
        </div>
      )}
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left panel with toggle button */}
        {showLeftPanel ? (
          <>
            <ResizablePanel 
              defaultSize={initialLeftWidth} 
              minSize={minLeftWidth} 
              maxSize={maxLeftWidth}
              className="h-full overflow-hidden relative"
            >
              {left}
              {onToggleLeftPanel && (
                <div className="absolute top-1/2 right-0 -translate-y-1/2 transform z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full bg-accent opacity-80 hover:opacity-100"
                    onClick={onToggleLeftPanel}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </ResizablePanel>
            
            <ResizableHandle withHandle />
          </>
        ) : (
          <div className="flex items-center pl-1 border-r border-border">
            {onToggleLeftPanel && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onToggleLeftPanel}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        {/* Right panel with toggle button */}
        {showRightPanel ? (
          <ResizablePanel className="h-full overflow-hidden relative">
            {right}
            {onToggleRightPanel && (
              <div className="absolute top-2 right-2 z-10">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full bg-accent opacity-80 hover:opacity-100"
                  onClick={onToggleRightPanel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </ResizablePanel>
        ) : (
          <div className="flex items-center justify-end pr-1">
            {onToggleRightPanel && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
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
