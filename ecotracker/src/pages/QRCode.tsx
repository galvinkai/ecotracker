import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const QRCodePage = () => {
  return (
    <div className="min-h-screen bg-gradient-accent dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Share EcoTracker</CardTitle>
            <CardDescription className="text-center">
              Scan this QR code to access EcoTracker on your mobile device
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <QRCodeDisplay 
              appUrl="https://ecotracker-vercel.vercel.app/" 
              apiUrl="https://ecotracker-api.fly.dev"
              title="EcoTracker App"
              color="28a745"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How to use the QR code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Scan with your phone</h3>
              <p className="text-muted-foreground">
                Open your phone's camera app and point it at the QR code. Tap the notification that appears.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Share with friends</h3>
              <p className="text-muted-foreground">
                Use the "Customize" tab to create a personalized QR code, then download or print it to share with others.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Print for events</h3>
              <p className="text-muted-foreground">
                Click "Open Printable Version" to get a printer-friendly page that you can use at events or in public spaces.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodePage;
