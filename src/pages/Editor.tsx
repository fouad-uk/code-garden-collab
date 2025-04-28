
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import PreviewPanel from '@/components/PreviewPanel';
import ResizableLayout from '@/components/ResizableLayout';
import { generateRoomId } from '@/utils/generateRoomId';
import { useToast } from '@/hooks/use-toast';

// Get room ID from URL or generate new one
const getOrCreateRoomId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  
  if (roomParam) {
    return roomParam;
  }
  
  const newRoomId = generateRoomId();
  // Update URL with the new room ID
  const url = new URL(window.location.href);
  url.searchParams.set('room', newRoomId);
  window.history.pushState({}, '', url);
  
  return newRoomId;
};

const DEFAULT_CODE = `function helloWorld() {
  console.log("Hello from CodeGarden!");
  
  // Try modifying this code and see the results
  // in the preview panel on the right
  const colors = ["red", "green", "blue"];
  colors.forEach(color => {
    console.log(\`I love \${color}!\`);
  });
}

helloWorld();`;

const Editor = () => {
  const { toast } = useToast();
  const [roomId] = useState(getOrCreateRoomId);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState('javascript');
  const [activeUsers] = useState(2); // Mock value for demo

  // Handle code execution
  const handleRunCode = () => {
    // This is handled automatically in the preview component
    toast({
      description: "Code executed successfully",
    });
  };

  // Handle saving code
  const handleSaveCode = () => {
    // In a real app, this would save to a database
    localStorage.setItem(`code-${roomId}`, code);
    toast({
      description: "Code saved successfully",
    });
  };

  // Check for saved code on component mount
  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${roomId}`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [roomId]);

  // Handle code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // In a real app, would broadcast changes to other users
  };

  // Handle language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // In a real app, would broadcast language change to other users
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        roomId={roomId} 
        activeUsers={activeUsers} 
        onRun={handleRunCode} 
        onSave={handleSaveCode} 
      />
      
      <div className="flex-1 overflow-hidden">
        <ResizableLayout 
          left={
            <CodeEditor 
              initialCode={code} 
              language={language}
              onCodeChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
            />
          }
          right={
            <PreviewPanel 
              code={code} 
              language={language}
            />
          }
        />
      </div>
    </div>
  );
};

export default Editor;
