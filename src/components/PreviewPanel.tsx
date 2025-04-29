
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface PreviewPanelProps {
  code: string;
  language: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, language }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Don't try to render if not JavaScript or HTML
    if (!['javascript', 'typescript', 'html'].includes(language)) {
      setError(`Preview not available for ${language} files`);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Small delay to ensure iframe is ready
    setTimeout(() => {
      try {
        // Generate HTML with theme awareness
        const html = generateHtml(code, language, theme);
        
        if (iframeRef.current) {
          // Set sandbox attribute to limit iframe capabilities for security
          iframeRef.current.setAttribute('sandbox', 'allow-scripts');
          iframeRef.current.srcdoc = html;
        }
      } catch (err) {
        setError(`Error rendering preview: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  }, [code, language, theme]);

  const generateHtml = (code: string, language: string, currentTheme: string): string => {
    if (language === 'html') {
      return code;
    }

    // Background and text colors based on theme
    const bgColor = currentTheme === 'dark' ? '#1e1e2e' : '#ffffff';
    const textColor = currentTheme === 'dark' ? '#ffffff' : '#333333';
    const outputBgColor = currentTheme === 'dark' ? '#2a2a3a' : '#f5f5f5';

    // Wrap JavaScript/TypeScript in HTML document
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              margin: 20px;
              color: ${textColor};
              background-color: ${bgColor};
              transition: background-color 0.3s ease, color 0.3s ease;
            }
            .output {
              padding: 10px;
              background-color: ${outputBgColor};
              border-radius: 4px;
              margin-top: 10px;
              white-space: pre-wrap;
              font-family: monospace;
              transition: background-color 0.3s ease;
            }
          </style>
        </head>
        <body>
          <div id="app"></div>
          <div class="output" id="output"></div>
          <script>
            // Capture console.log output
            const output = document.getElementById('output');
            const originalConsoleLog = console.log;
            console.log = function() {
              originalConsoleLog.apply(console, arguments);
              const args = Array.from(arguments);
              const text = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' ');
              const logLine = document.createElement('div');
              logLine.textContent = '> ' + text;
              output.appendChild(logLine);
            };

            try {
              // Execute the code
              ${code}
            } catch (error) {
              console.log('Error: ' + error.message);
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading preview...</div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md text-sm">
            {error}
          </div>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          title="Code Preview"
          className="flex-1 w-full border-none"
          sandbox="allow-scripts"
        />
      )}
    </div>
  );
};

export default PreviewPanel;
