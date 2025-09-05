import { AlertCircle, RefreshCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface QRCodeProps {
  appUrl?: string;
  apiUrl?: string;
  title?: string;
  color?: string;
}

const QRCodeDisplay: React.FC<QRCodeProps> = ({
  appUrl = 'https://ecotracker-vercel.vercel.app/',
  apiUrl = 'https://ecotracker-api.fly.dev',
  title = 'EcoTracker App',
  color = '28a745',
}) => {
  const [customUrl, setCustomUrl] = useState(appUrl);
  const [customTitle, setCustomTitle] = useState(title);
  const [customColor, setCustomColor] = useState(color);
  const [qrLoaded, setQrLoaded] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Remove the # from the color if present
  const formattedColor = customColor.startsWith('#') ? customColor.substring(1) : customColor;
  
  // Generate QR code URLs with cache-busting
  const qrImageUrl = `${apiUrl}/qrcode?url=${encodeURIComponent(customUrl)}&title=${encodeURIComponent(customTitle)}&color=${encodeURIComponent(formattedColor)}&v=${refreshKey}`;
  const qrHtmlUrl = `${apiUrl}/qrcode-html?url=${encodeURIComponent(customUrl)}&title=${encodeURIComponent(customTitle)}&color=${encodeURIComponent(formattedColor)}`;
  
  // Function to check if API is accessible
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/transactions`);
        if (!response.ok) {
          throw new Error(`API returned ${response.status} ${response.statusText}`);
        }
        setQrLoaded(true);
        setErrorMsg('');
      } catch (error) {
        setQrLoaded(false);
        setErrorMsg(`Could not connect to API: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    checkApiStatus();
  }, [apiUrl]);
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  const handleImageError = () => {
    setQrLoaded(false);
    setErrorMsg('Could not load QR code image. Please ensure the API is running.');
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>EcoTracker QR Code</CardTitle>
        <CardDescription>Scan to access EcoTracker on your mobile device</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="display">
          <TabsList className="mb-4">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>
          
          <TabsContent value="display" className="flex flex-col items-center">
            {!qrLoaded && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorMsg || 'Could not load QR code. Please try again later.'}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mb-4 border rounded p-2 bg-white">
              {qrLoaded ? (
                <img 
                  src={qrImageUrl} 
                  alt="EcoTracker QR Code" 
                  className="w-64 h-64"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-gray-100">
                  <div className="text-center p-4">
                    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">QR code could not be loaded</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={handleRefresh}
                    >
                      <RefreshCcw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center text-sm text-gray-500 mb-4">
              Scan this code with your phone's camera to access EcoTracker
            </div>
            
            <div className="flex gap-2">
              <Button asChild variant="outline" disabled={!qrLoaded}>
                <a href={qrHtmlUrl} target="_blank" rel="noopener noreferrer">
                  Open Printable Version
                </a>
              </Button>
              
              <Button asChild disabled={!qrLoaded}>
                <a href={qrImageUrl} download="ecotracker-qrcode.png">
                  Download
                </a>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="customize">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">App URL</Label>
                <Input 
                  id="url" 
                  value={customUrl} 
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://your-app-url.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={customTitle} 
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="EcoTracker App" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color (hex)</Label>
                <div className="flex gap-2">
                  <Input 
                    id="color" 
                    value={customColor} 
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="#28a745" 
                  />
                  <div 
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: customColor.startsWith('#') ? customColor : `#${customColor}` }}
                  ></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={() => {
          setCustomUrl(appUrl);
          setCustomTitle(title);
          setCustomColor(color);
        }}>
          Reset
        </Button>
        <Button asChild variant="default" disabled={!qrLoaded}>
          <a href={qrHtmlUrl} target="_blank" rel="noopener noreferrer">
            Open Full Page
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeDisplay;
