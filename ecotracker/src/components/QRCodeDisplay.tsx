import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
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
  
  // Remove the # from the color if present
  const formattedColor = customColor.startsWith('#') ? customColor.substring(1) : customColor;
  
  // Generate QR code URLs
  const qrImageUrl = `${apiUrl}/qrcode?url=${encodeURIComponent(customUrl)}&title=${encodeURIComponent(customTitle)}&color=${encodeURIComponent(formattedColor)}`;
  const qrHtmlUrl = `${apiUrl}/qrcode-html?url=${encodeURIComponent(customUrl)}&title=${encodeURIComponent(customTitle)}&color=${encodeURIComponent(formattedColor)}`;
  
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
            <div className="mb-4 border rounded p-2 bg-white">
              <img 
                src={qrImageUrl} 
                alt="EcoTracker QR Code" 
                className="w-64 h-64"
              />
            </div>
            
            <div className="text-center text-sm text-gray-500 mb-4">
              Scan this code with your phone's camera to access EcoTracker
            </div>
            
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <a href={qrHtmlUrl} target="_blank" rel="noopener noreferrer">
                  Open Printable Version
                </a>
              </Button>
              
              <Button asChild>
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
        <Button asChild variant="default">
          <a href={qrHtmlUrl} target="_blank" rel="noopener noreferrer">
            Open Full Page
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeDisplay;
