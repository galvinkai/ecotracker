import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export const ApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      // Direct test of the API endpoint without using our service functions
      const data = await api.get('/transactions');
      setResponse({
        status: data.status,
        statusText: data.statusText,
        data: data.data
      });
    } catch (err: any) {
      console.error('API Test Error:', err);
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError(`Failed to connect to the API server at ${api.defaults.baseURL}. Make sure the server is running.`);
      } else if (err.response) {
        setError(`Server responded with error: ${err.response.status} ${err.response.statusText}`);
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-2">
          This will test the connection to the Python server on port 5050. Make sure the server is running.
        </div>
        
        <Button 
          onClick={testApi} 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : 'Test API Connection'}
        </Button>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
            {error}
          </div>
        )}

        {response && (
          <div className="p-4 rounded-lg bg-success/10 text-success">
            <p>Connection successful! Status: {response.status} {response.statusText}</p>
            <pre className="mt-2 text-xs overflow-auto max-h-40 bg-card p-2 rounded">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
