
import React from 'react';
import { Code, Users, Globe, Zap, Lock, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: <Code className="h-10 w-10 text-blue-500" />,
    title: 'Live Code Editing',
    description: 'Edit code in real-time with syntax highlighting for multiple languages including JavaScript, HTML, CSS and more.'
  },
  {
    icon: <Users className="h-10 w-10 text-purple-500" />,
    title: 'Collaborative Workspaces',
    description: 'Invite team members to your workspace and collaborate on code in real-time with live cursors and edits.'
  },
  {
    icon: <Layout className="h-10 w-10 text-green-500" />,
    title: 'Interactive Previews',
    description: 'See your code come to life with instant previews that update as you type, perfect for front-end development.'
  },
  {
    icon: <Globe className="h-10 w-10 text-indigo-500" />,
    title: 'Share & Embed',
    description: 'Share your projects with a simple URL or embed them directly into your website or documentation.'
  },
  {
    icon: <Zap className="h-10 w-10 text-yellow-500" />,
    title: 'Fast Performance',
    description: 'Built with performance in mind, CodeGarden works smoothly even with large files and multiple collaborators.'
  },
  {
    icon: <Lock className="h-10 w-10 text-red-500" />,
    title: 'Secure Environment',
    description: 'Your code is protected with enterprise-grade security, giving you peace of mind while you work.'
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Developers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to code collaboratively, all in one platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border bg-card/50 hover:shadow-md transition-all hover:border-primary/20">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
