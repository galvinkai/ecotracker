import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { serverStatus } from "@/lib/axios";
import { ecoTrackerApi } from "@/services/api";
import {
  AlertCircle,
  ExternalLink,
  Leaf,
  Lightbulb,
  MessageCircle,
  Send,
  Target,
  TrendingDown
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Insight {
  type: string;
  title: string;
  description: string;
  impact: string;
  priority: string;
}

interface AiMessage {
  message: string;
  timestamp: string;
  isUser?: boolean;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-destructive text-destructive-foreground';
    case 'medium': return 'bg-warning text-warning-foreground';
    case 'positive': return 'bg-success text-success-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'recommendation': return Lightbulb;
    case 'achievement': return Target;
    case 'tip': return Leaf;
    default: return Lightbulb;
  }
};

export const InsightsPanel = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [showChatInput, setShowChatInput] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await ecoTrackerApi.getInsights();
        if (data && data.insights) {
          setInsights(data.insights);
        }
        if (data && data.messages) {
          setAiMessages(data.messages);
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
        setError("Failed to load insights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const handleChatRequest = async () => {
    // If no message provided, use a default one
    const messageToSend = chatMessage.trim() || "What tips do you have for reducing my carbon footprint?";
    
    setChatLoading(true);
    try {
      console.log("Sending chat request with message:", messageToSend);
      
      try {
        // Add the user's message immediately for better UX
        const userMsg: AiMessage = {
          message: messageToSend,
          timestamp: "Just now",
          isUser: true
        };
        
        setAiMessages(prev => [userMsg, ...prev]);
        
        const response = await ecoTrackerApi.chat(messageToSend);
        console.log("Chat response received:", response);
        
        // Add the AI's response
        const aiMsg: AiMessage = {
          message: response.response[response.response.length - 1].content,
          timestamp: "Just now"
        };
        
        setAiMessages(prev => [aiMsg, ...prev]);
      } catch (apiError) {
        console.error("API Error:", apiError);
        
        // Fallback to a mock response if API fails
        const fallbackMsg: AiMessage = {
          message: "I'm sorry, I'm having trouble connecting to the server right now. Here's a general tip: Consider using public transportation or carpooling to reduce your carbon footprint from daily commutes. This can significantly lower your emissions.",
          timestamp: "Just now"
        };
        
        setAiMessages(prev => [fallbackMsg, ...prev]);
      }
      
      setChatMessage("");
      setShowChatInput(false); // Hide the input after sending
    } catch (error) {
      console.error("Error in chat flow:", error);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Assistant */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between dark:text-gray-200">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary dark:text-green-400" />
              <span>AI Assistant</span>
            </div>
            {!serverStatus.isOnline && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-300">
                Offline Mode
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Personalized insights powered by your spending patterns
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" text="Loading insights..." />
            </div>
          ) : error ? (
            <div className="text-sm text-destructive mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 dark:bg-destructive/20">
              {error}
            </div>
          ) : aiMessages.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground dark:text-gray-400">
              <p>No messages yet</p>
              <p className="text-sm mt-1">Ask a question to get started</p>
            </div>
          ) : (
            aiMessages.map((message, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${message.isUser 
                  ? 'bg-primary text-primary-foreground ml-8' 
                  : 'bg-accent/50 border dark:bg-gray-800/90 dark:text-gray-100 dark:border-gray-700'}`}
              >
                <div className="text-sm mb-2">{message.message}</div>
                <div className={`text-xs ${message.isUser 
                  ? 'text-primary-foreground/80' 
                  : 'text-muted-foreground'}`}>{message.timestamp}</div>
              </div>
            ))
          )}
          
          {showChatInput ? (
            <div className="flex w-full items-center space-x-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask something..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleChatRequest();
                  }
                }}
                disabled={chatLoading}
              />
              <Button 
                onClick={handleChatRequest} 
                disabled={chatLoading}
                size="icon"
                className="shrink-0"
              >
                {chatLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                if (chatLoading) return;
                setShowChatInput(true);
              }}
              disabled={chatLoading}
            >
              {chatLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with AI Assistant
                </>
              )}
            </Button>
          )}
          
          <Link to="/chat" className="w-full block">
            <Button 
              variant="default" 
              className="w-full mt-2"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Open Full Chat Experience
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between dark:text-gray-200">
            <span>Smart Insights</span>
            {!serverStatus.isOnline && (
              <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-300">
                Limited
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Data-driven recommendations to reduce your footprint
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" text="Loading insights..." />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-center">
              <div>
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground dark:text-gray-400">
              <p>No insights available</p>
              <p className="text-sm mt-1">Add more transactions to get personalized insights</p>
            </div>
          ) : (
            insights.map((insight, index) => {
              const Icon = getTypeIcon(insight.type);
              return (
                <div 
                  key={index} 
                  className="p-4 rounded-lg border bg-card/50 space-y-3 hover:bg-accent/10 transition-colors dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary dark:text-green-400" />
                      <h3 className="font-semibold text-sm dark:text-gray-200">{insight.title}</h3>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(insight.priority)}`}
                    >
                      {insight.priority === 'positive' ? 'Achievement' : insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">{insight.impact}</span>
                    <Button variant="ghost" size="sm">
                      Learn more
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-gray-200">
            <TrendingDown className="h-5 w-5 text-primary dark:text-green-400" />
            <span>This Month's Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm dark:text-gray-200">Reduce transport emissions</span>
              <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">75%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm dark:text-gray-200">Use sustainable alternatives</span>
              <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">60%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm dark:text-gray-200">Meet monthly target</span>
              <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">85%</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600">
            <Target className="h-4 w-4 mr-2" />
            Set New Goals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};