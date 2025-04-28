
import React, { useEffect, useRef } from 'react';

type PreviewPanelProps = {
  code: string;
  language: string;
};

const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, language }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      if (language === 'html') {
        iframeDoc.open();
        iframeDoc.write(code);
        iframeDoc.close();
      } else if (language === 'javascript') {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>JavaScript Preview</title>
            </head>
            <body>
              <div id="output"></div>
              <script>
                // Override console methods
                const output = document.getElementById('output');
                const originalConsole = console;
                console = {
                  ...originalConsole,
                  log: function(...args) {
                    originalConsole.log(...args);
                    const el = document.createElement('div');
                    el.textContent = args.map(arg => 
                      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                    ).join(' ');
                    output.appendChild(el);
                  },
                  error: function(...args) {
                    originalConsole.error(...args);
                    const el = document.createElement('div');
                    el.style.color = 'red';
                    el.textContent = args.map(arg => 
                      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                    ).join(' ');
                    output.appendChild(el);
                  }
                };
                
                try {
                  ${code}
                } catch (err) {
                  console.error(err.message);
                }
              </script>
            </body>
          </html>
        `);
        iframeDoc.close();
      } else if (language === 'css') {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>CSS Preview</title>
              <style>${code}</style>
            </head>
            <body>
              <div class="example">Example Div</div>
              <p>Example paragraph with <a href="#">link</a></p>
              <button>Example Button</button>
            </body>
          </html>
        `);
        iframeDoc.close();
      } else {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Preview</title>
            </head>
            <body>
              <div style="padding: 20px; font-family: sans-serif;">
                <h3>Code (${language}):</h3>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow: auto;">${
                  code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                }</pre>
                <p style="color: #666;">Preview not available for ${language}</p>
              </div>
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    } catch (e) {
      // Handle cross-origin error by displaying error message in the panel
      console.error("Failed to access iframe content:", e);
      
      // Create a fallback display when iframe access is blocked
      if (iframe && iframe.parentElement) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = "flex items-center justify-center h-full bg-white p-4";
        fallbackDiv.innerHTML = `
          <div class="text-center">
            <h3 class="font-medium mb-2">Preview Unavailable</h3>
            <p class="text-muted-foreground text-sm">
              Cannot display preview due to browser security restrictions.
              <br />Please run code to see results in the console.
            </p>
          </div>
        `;
        
        // Clear iframe parent and append fallback
        const parent = iframe.parentElement;
        parent.innerHTML = '';
        parent.appendChild(fallbackDiv);
      }
    }
  };

  // Update preview when code or language changes
  useEffect(() => {
    // Use a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      runCode();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [code, language]);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-card p-2 border-b border-border">
        <h3 className="font-medium text-sm">Preview</h3>
      </div>
      <div className="flex-1 bg-white">
        <iframe
          ref={iframeRef}
          title="code-preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-modals"
          src="about:blank"
        />
      </div>
    </div>
  );
};

export default PreviewPanel;
