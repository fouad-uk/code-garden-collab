
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalProps {
  code: string;
}

const Terminal: React.FC<TerminalProps> = ({ code }) => {
  const [output, setOutput] = useState<string[]>([
    '> Welcome to CodeGarden Terminal',
    '> Type "help" for available commands'
  ]);
  const [command, setCommand] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const executeCommand = () => {
    if (!command.trim()) return;
    
    setOutput(prev => [...prev, `$ ${command}`]);
    
    // Simple command processing
    switch (command.toLowerCase()) {
      case 'help':
        setOutput(prev => [...prev, '> Available commands: help, clear, run']);
        break;
      case 'clear':
        setOutput(['> Terminal cleared']);
        break;
      case 'run':
        try {
          // This is a simplified example - in a real app, would need proper sandboxing
          setOutput(prev => [...prev, '> Running code...']);
          // Simulate output with console.log extraction
          const logOutput = extractConsoleLogs(code);
          setOutput(prev => [...prev, ...logOutput]);
        } catch (error) {
          setOutput(prev => [...prev, `> Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        }
        break;
      default:
        setOutput(prev => [...prev, `> Command not found: ${command}`]);
    }
    
    setCommand('');
  };

  // Extract console.log statements from code (simplified)
  const extractConsoleLogs = (sourceCode: string): string[] => {
    const logs: string[] = [];
    
    // This is a very simplified regex to extract console.log statements
    // In a real app, you would use a proper parser or sandbox execution
    const regex = /console\.log\(['"](.+?)['"]\)/g;
    let match;
    
    while ((match = regex.exec(sourceCode)) !== null) {
      if (match[1]) {
        logs.push(`> ${match[1]}`);
      }
    }
    
    return logs.length ? logs : ['> No console output found'];
  };

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className={`flex flex-col bg-black text-green-400 rounded-md border border-border overflow-hidden ${isExpanded ? 'h-96' : 'h-48'}`}>
      <div className="flex items-center justify-between p-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} />
          <span className="text-sm font-mono">Terminal</span>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-zinc-800 text-zinc-400"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-zinc-800 text-zinc-400"
            onClick={() => setOutput(['> Terminal cleared'])}
          >
            <X size={14} />
          </Button>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-sm bg-black"
      >
        {output.map((line, index) => (
          <div key={index} className={line.startsWith('$') ? 'text-blue-400' : ''}>
            {line}
          </div>
        ))}
      </div>
      
      <div className="flex items-center border-t border-zinc-800 bg-zinc-900">
        <span className="px-2 text-green-400 font-mono">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
          className="flex-1 bg-transparent border-none outline-none p-2 font-mono text-sm text-green-400"
          placeholder="Type command..."
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Terminal;
