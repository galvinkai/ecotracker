import React from 'react';
import QRCodeDisplayEnhanced from '../components/QRCodeDisplayEnhanced';

const QRCodePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">EcoTracker QR Code</h1>
      <p className="text-center mb-8 text-gray-600">
        Share this QR code to give others quick access to the EcoTracker app.
      </p>
      
      <div className="flex justify-center">
        <QRCodeDisplayEnhanced />
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>The QR code will direct users to the EcoTracker web application.</p>
        <p>You can customize the QR code using the options in the "Customize" tab.</p>
      </div>
    </div>
  );
};

export default QRCodePage;
