
import React, { useState } from 'react';

type ResizableLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftWidth?: string;
  minLeftWidth?: string;
  maxLeftWidth?: string;
};

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  left,
  right,
  initialLeftWidth = '50%',
  minLeftWidth = '30%',
  maxLeftWidth = '70%',
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return;
    
    const container = e.currentTarget as HTMLDivElement;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Apply min/max constraints
    const minWidthPercent = parseFloat(minLeftWidth);
    const maxWidthPercent = parseFloat(maxLeftWidth);
    const clampedWidth = Math.max(minWidthPercent, Math.min(maxWidthPercent, newLeftWidth));
    
    setLeftWidth(`${clampedWidth}%`);
  };

  const handleMouseUp = () => {
    if (isResizing) {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  };

  return (
    <div 
      className="flex h-full"
      onMouseMove={isResizing ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="h-full overflow-hidden" style={{ width: leftWidth }}>
        {left}
      </div>
      
      <div 
        className="w-1 bg-border hover:bg-primary cursor-ew-resize flex-shrink-0 relative"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 flex items-center justify-center">
          <div className="w-0.5 h-6 bg-muted-foreground rounded-full"></div>
        </div>
      </div>
      
      <div className="flex-grow h-full overflow-hidden">
        {right}
      </div>
    </div>
  );
};

export default ResizableLayout;
