
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "CodeGarden has transformed how our team collaborates on projects. The real-time editing and preview features have made our development process so much more efficient.",
    author: "Sarah Johnson",
    role: "Senior Frontend Developer",
    avatar: "SJ",
    avatarColor: "bg-blue-500"
  },
  {
    quote: "I use CodeGarden for teaching my web development courses. My students love how easily they can share code and work together, even remotely.",
    author: "Michael Chen",
    role: "Computer Science Professor",
    avatar: "MC",
    avatarColor: "bg-purple-500"
  },
  {
    quote: "As a freelancer, I can quickly prototype ideas with clients and make changes on the spot. CodeGarden has become an essential tool in my workflow.",
    author: "Alex Rivera",
    role: "Freelance Web Developer",
    avatar: "AR",
    avatarColor: "bg-green-500"
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Developers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our users have to say about their experience with CodeGarden.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 border hover:shadow-md transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-foreground mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-white font-medium`}>
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
