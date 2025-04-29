
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Move,
  PanelTop, 
  PanelLeft, 
  PanelRight, 
  PanelBottom,
  LayoutPanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export type PanelPosition = 'left' | 'right' | 'top' | 'bottom';

interface DockableItem {
  id: string;
  title: string;
  content: React.ReactNode;
  initialPosition?: PanelPosition;
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  isVisible?: boolean;
}

interface ResizableLayoutProps {
  left?: ReactNode;
  right?: ReactNode;
  top?: ReactNode;
  bottom?: ReactNode;
  center: ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  initialRightWidth?: number;
  initialBottomHeight?: number;
  initialTopHeight?: number;
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
  showTopPanel?: boolean;
  showBottomPanel?: boolean;
  onToggleLeftPanel?: () => void;
  onToggleRightPanel?: () => void;
  onToggleTopPanel?: () => void;
  onToggleBottomPanel?: () => void;
  leftPanelTitle?: string;
  rightPanelTitle?: string;
  topPanelTitle?: string;
  bottomPanelTitle?: string;
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  left,
  right,
  top,
  bottom,
  center,
  initialLeftWidth = 20,
  minLeftWidth = 15,
  maxLeftWidth = 40,
  initialRightWidth = 30,
  initialBottomHeight = 30,
  initialTopHeight = 20,
  showLeftPanel = false,
  showRightPanel = false,
  showTopPanel = false,
  showBottomPanel = false,
  onToggleLeftPanel,
  onToggleRightPanel,
  onToggleTopPanel,
  onToggleBottomPanel,
  leftPanelTitle = 'Explorer',
  rightPanelTitle = 'Panel',
  topPanelTitle = 'Top',
  bottomPanelTitle = 'Terminal',
}) => {
  // Track panel sizes for restoration when panels are toggled
  const [leftPanelSize, setLeftPanelSize] = useState(initialLeftWidth);
  const [rightPanelSize, setRightPanelSize] = useState(initialRightWidth);
  const [topPanelSize, setTopPanelSize] = useState(initialTopHeight);
  const [bottomPanelSize, setBottomPanelSize] = useState(initialBottomHeight);
  const { toast } = useToast();
  
  // Handle panel resizing events to store sizes
  const handlePanelResize = (panelId: string, size: number) => {
    switch (panelId) {
      case 'left-panel':
        setLeftPanelSize(size);
        break;
      case 'right-panel':
        setRightPanelSize(size);
        break;
      case 'top-panel':
        setTopPanelSize(size);
        break;
      case 'bottom-panel':
        setBottomPanelSize(size);
        break;
    }
  };
  
  // Render a panel with title and controls
  const renderPanelHeader = (
    title: string, 
    onClose?: () => void, 
    position: PanelPosition = 'left'
  ) => {
    const PositionIcon = {
      left: <PanelLeft className="h-4 w-4" />,
      right: <PanelRight className="h-4 w-4" />,
      top: <PanelTop className="h-4 w-4" />,
      bottom: <PanelBottom className="h-4 w-4" />
    }[position];

    return (
      <div className="flex items-center justify-between p-2 border-b border-border bg-card/30">
        <div className="flex items-center gap-1.5">
          {PositionIcon}
          <span className="text-xs font-medium">{title}</span>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full hover:bg-accent opacity-70 hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ResizablePanelGroup direction="vertical" className="h-full">
        {/* Top panel (optional) */}
        {showTopPanel && (
          <>
            <ResizablePanel
              defaultSize={topPanelSize}
              minSize={10}
              maxSize={40}
              onResize={(size) => handlePanelResize('top-panel', size)}
              className="relative"
            >
              <div className="h-full flex flex-col">
                {renderPanelHeader(topPanelTitle, onToggleTopPanel, 'top')}
                <div className="flex-1 overflow-auto">
                  {top}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="transition-colors hover:bg-primary/20" />
          </>
        )}

        {/* Middle content with optional left and right panels */}
        <ResizablePanel defaultSize={showTopPanel || showBottomPanel ? 60 : 100}>
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left panel (optional) */}
            {showLeftPanel && (
              <>
                <ResizablePanel
                  defaultSize={leftPanelSize}
                  minSize={minLeftWidth}
                  maxSize={maxLeftWidth}
                  className="h-full flex flex-col"
                  onResize={(size) => handlePanelResize('left-panel', size)}
                  id="left-panel"
                >
                  <div className="h-full flex flex-col">
                    {renderPanelHeader(leftPanelTitle, onToggleLeftPanel, 'left')}
                    <div className="flex-1 overflow-auto">
                      {left}
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 transform z-10">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full bg-accent opacity-70 hover:opacity-100 transition-opacity"
                            onClick={onToggleLeftPanel}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Hide panel</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle className="transition-colors hover:bg-primary/20" />
              </>
            )}

            {/* Center content - always present */}
            <ResizablePanel className="h-full overflow-hidden">
              {center}
            </ResizablePanel>

            {/* Right panel (optional) */}
            {showRightPanel && (
              <>
                <ResizableHandle withHandle className="transition-colors hover:bg-primary/20" />
                <ResizablePanel
                  defaultSize={rightPanelSize}
                  className="h-full flex flex-col"
                  onResize={(size) => handlePanelResize('right-panel', size)}
                  id="right-panel"
                >
                  <div className="h-full flex flex-col">
                    {renderPanelHeader(rightPanelTitle, onToggleRightPanel, 'right')}
                    <div className="flex-1 overflow-auto">
                      {right}
                    </div>
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>

        {/* Bottom panel (optional) */}
        {showBottomPanel && (
          <>
            <ResizableHandle withHandle className="transition-colors hover:bg-primary/20" />
            <ResizablePanel
              defaultSize={bottomPanelSize}
              minSize={10}
              maxSize={50}
              onResize={(size) => handlePanelResize('bottom-panel', size)}
              className="relative"
            >
              <div className="h-full flex flex-col">
                {renderPanelHeader(bottomPanelTitle, onToggleBottomPanel, 'bottom')}
                <div className="flex-1 overflow-auto">
                  {bottom}
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default ResizableLayout;
