import { MarkdownMessage } from '@/components/MarkdownMessage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { ecoTrackerApi } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { ArrowDownCircle, Loader2, MessageCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SuggestedQuestions } from './SuggestedQuestions';
import './chat-animations.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isNew?: boolean;
}

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your EcoTracker assistant. I can help you understand your carbon footprint and provide personalized recommendations to reduce your environmental impact. How can I assist you today?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 1000 * 60),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (!loading) {
      scrollToBottom();
    }
  }, [messages, loading]);
  
  useEffect(() => {
    // Handle scroll event to show/hide scroll to bottom button
    const handleScroll = () => {
      if (!scrollAreaRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };
    
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
      isNew: true,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      console.log("ChatAssistant: Sending message:", input);
      
      try {
        const response = await ecoTrackerApi.chat(input);
        console.log("ChatAssistant: Received response:", response);
        
        // Get the latest assistant response
        const latestResponse = response.response[response.response.length - 1];
        
        if (latestResponse && latestResponse.content) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: latestResponse.content,
            role: 'assistant',
            timestamp: new Date(),
            isNew: true,
          };
          
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        
        // Generate a fallback response based on the input
        let fallbackResponse = 'I apologize, but I\'m having trouble connecting to the server right now. ';
        
        if (input.toLowerCase().includes('carbon') || input.toLowerCase().includes('footprint')) {
          fallbackResponse += 'Here\'s a general tip about reducing your carbon footprint: Consider eating less meat, especially beef, as livestock agriculture is a major source of greenhouse gas emissions. Even reducing meat consumption by one day per week can make a significant difference.';
        } else if (input.toLowerCase().includes('energy') || input.toLowerCase().includes('electricity')) {
          fallbackResponse += 'To reduce energy usage, consider switching to LED bulbs, unplugging devices when not in use, and using smart power strips to eliminate phantom energy usage.';
        } else if (input.toLowerCase().includes('transport') || input.toLowerCase().includes('car') || input.toLowerCase().includes('travel')) {
          fallbackResponse += 'For transportation, consider carpooling, using public transit, biking for short trips, or combining errands to minimize driving. If possible, consider an electric vehicle for your next car purchase.';
        } else {
          fallbackResponse += 'Some general sustainability tips include: reduce single-use plastics, compost food waste, buy local and seasonal produce, and choose products with minimal packaging.';
        }
        
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: fallbackResponse,
          role: 'assistant',
          timestamp: new Date(),
          isNew: true,
        };
        
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('Error in chat flow:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span>EcoTracker Assistant</span>
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } ${message.isNew ? 'animate-fadeIn' : ''}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className={message.role === 'assistant' ? 'bg-primary' : 'bg-muted'}>
                  <AvatarFallback>
                    {message.role === 'assistant' ? 'ET' : 'ME'}
                  </AvatarFallback>
                </Avatar>
                
                <div
                  className={`space-y-1 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground dark:bg-gray-800/90 dark:text-gray-100'
                  } p-3 rounded-lg`}
                >
                  <div className="whitespace-pre-wrap">
                    <MarkdownMessage content={message.content} />
                  </div>
                  <div className={`text-xs opacity-80 text-right ${
                    message.role === 'user' ? 'text-primary-foreground' : ''
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <Avatar className="bg-primary">
                  <AvatarFallback>ET</AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {messages.length === 1 && !loading && (
            <SuggestedQuestions onSelectQuestion={(question) => setInput(question)} />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-20 right-6 rounded-full opacity-80 hover:opacity-100"
          onClick={scrollToBottom}
        >
          <ArrowDownCircle className="h-5 w-5" />
        </Button>
      )}
      
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your carbon footprint or sustainable tips..."
            className="min-h-10 flex-1 resize-none"
            rows={1}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={loading || !input.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
