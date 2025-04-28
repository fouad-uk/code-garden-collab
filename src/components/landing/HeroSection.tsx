
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const codeSnippet = `// A collaborative coding experience
function createProject() {
  const project = new CodeGarden({
    realtime: true,
    collaboration: true,
    languages: ['js', 'html', 'css']
  });
  
  project.invite(teammates);
  project.start();
  
  // Start coding together!
}

createProject();`;

const HeroSection = () => {
  const [typedCode, setTypedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < codeSnippet.length) {
      const timeout = setTimeout(() => {
        setTypedCode(prev => prev + codeSnippet[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Adjust typing speed
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <section className="py-20 px-4 sm:py-32 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -left-1/4 top-1/3 w-1/2 h-96 bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute -right-1/4 top-1/2 w-1/2 h-96 bg-purple-500 rounded-full blur-[120px]" />
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Hero Text */}
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight animate-fade-in">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Collaborative Coding
            </span>
            <br />
            <span className="text-foreground">Made Simple</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Code together in real-time. Share ideas, solve problems, and build amazing applications with your team, all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/editor">
              <Button size="lg" variant="outline" className="border-primary hover:bg-primary/10">
                Try Editor Now
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Code Preview */}
        <div className="lg:w-1/2 animate-fade-in">
          <div className="rounded-xl bg-card border border-border shadow-xl overflow-hidden">
            {/* Code Editor Header */}
            <div className="bg-card border-b border-border p-4 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs font-mono bg-accent text-accent-foreground rounded-md px-2 py-1">
                collaborative-project.js
              </div>
            </div>
            
            {/* Code Content */}
            <div className="bg-card p-4">
              <pre className="language-javascript">
                <code className="text-sm sm:text-base font-mono">
                  {typedCode}
                  <span className="animate-pulse">|</span>
                </code>
              </pre>
            </div>
            
            {/* User Avatars */}
            <div className="bg-card border-t border-border p-3 flex items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">JD</div>
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">SK</div>
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">AM</div>
              </div>
              <span className="text-xs text-muted-foreground ml-2">3 users editing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
