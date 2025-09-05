import { ChatAssistant } from "@/components/ChatAssistant";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-accent p-4 pb-20 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      {/* Floating Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="max-w-3xl mx-auto space-y-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-medium text-primary">EcoTracker</span>
          </div>
        </div>
        
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            EcoTracker Assistant
          </h1>
          <p className="text-muted-foreground">
            Get personalized advice to reduce your carbon footprint
          </p>
        </div>
        
        <ChatAssistant />
      </div>
    </div>
  );
};

export default ChatPage;
