import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/lib/axios';
import { cn } from '@/lib/utils';
import { CheckCircle2, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus = ({ className }: ConnectionStatusProps) => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('checking');
        await api.get('/transactions', { timeout: 5000 });
        setStatus('connected');
        
        // Auto-hide the notification after 3 seconds if connected
        setTimeout(() => {
          if (status === 'connected') setExpanded(false);
        }, 3000);
      } catch (error) {
        setStatus('disconnected');
        setExpanded(true);
      }
    };

    // Check immediately and then every 30 seconds
    checkConnection();
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (status === 'checking' || (status === 'connected' && !expanded)) {
    return null;
  }

  return (
    <Alert 
      variant={status === 'connected' ? 'default' : 'destructive'}
      className={cn('fixed bottom-4 left-4 max-w-md z-50 shadow-lg transition-all duration-300 cursor-pointer', 
        className,
        status === 'connected' ? 'bg-green-500/90 text-white border-green-600' : ''
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center space-x-2">
        {status === 'connected' ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <AlertDescription className="font-medium">
          {status === 'connected' 
            ? 'Connected to server' 
            : 'Cannot connect to server. Check if the backend is running.'}
        </AlertDescription>
      </div>
      {status === 'disconnected' && (
        <div className="mt-2 text-sm opacity-90">
          <p>The app will function with limited capabilities. Data will not be saved.</p>
          <p className="mt-1">Make sure the server is running on port 5050.</p>
        </div>
      )}
    </Alert>
  );
};
