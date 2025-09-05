import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { esgApi } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProductionData {
  branch_name: string;
  good_used: string;
  'quantity_used (tons)': number;
  'carbon_emission (tons CO2)': number;
  'water_usage (liters)': number;
  'waste_generated (tons)': number;
}

const mockData: ProductionData[] = [
  {
    branch_name: 'Oneal Manufacturing',
    good_used: 'Timber',
    'quantity_used (tons)': 2944.14,
    'carbon_emission (tons CO2)': 6248.8,
    'water_usage (liters)': 19790696.04,
    'waste_generated (tons)': 335.37,
  },
  {
    branch_name: 'Wright PLC',
    good_used: 'Glass',
    'quantity_used (tons)': 2168.68,
    'carbon_emission (tons CO2)': 2057.79,
    'water_usage (liters)': 16929505.9,
    'waste_generated (tons)': 786.12,
  },
  {
    branch_name: 'PetroTech Industries',
    good_used: 'Petroleum Products',
    'quantity_used (tons)': 5500.0,
    'carbon_emission (tons CO2)': 12750.5,
    'water_usage (liters)': 25890000.0,
    'waste_generated (tons)': 890.45,
  },
  {
    branch_name: 'EcoFiber Textiles',
    good_used: 'Cotton',
    'quantity_used (tons)': 1850.25,
    'carbon_emission (tons CO2)': 2890.3,
    'water_usage (liters)': 31250000.0,
    'waste_generated (tons)': 225.8,
  },
  {
    branch_name: 'MetalWorks Corp',
    good_used: 'Steel',
    'quantity_used (tons)': 4200.0,
    'carbon_emission (tons CO2)': 9850.75,
    'water_usage (liters)': 15780000.0,
    'waste_generated (tons)': 645.9,
  },
  {
    branch_name: 'PlastiCorp Global',
    good_used: 'Plastic',
    'quantity_used (tons)': 3800.5,
    'carbon_emission (tons CO2)': 8950.25,
    'water_usage (liters)': 22450000.0,
    'waste_generated (tons)': 925.6,
  },
  {
    branch_name: 'AgriGrain Solutions',
    good_used: 'Wheat',
    'quantity_used (tons)': 2750.8,
    'carbon_emission (tons CO2)': 1890.45,
    'water_usage (liters)': 28950000.0,
    'waste_generated (tons)': 185.3,
  },
];

export function ProductionDataTable() {
  const navigate = useNavigate();
  const [isAnalysing, setIsAnalysing] = useState(false);

  const handleAnalyse = async (data: ProductionData) => {
    if (isAnalysing) return;

    const toastId = toast(
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Analysing data...</span>
      </div>,
    );

    setIsAnalysing(true);

    try {
      // Destructure branch_name out and only send required fields
      const { branch_name, ...apiData } = data;
      const responseData = await esgApi.predict(apiData);

      const formattedData = {
        ...data, // Keep branch_name for display in chat
        prediction: responseData.prediction,
        recommendation: responseData.recommendation,
      };

      toast.dismiss(toastId);
      toast.success('Analysis complete');
      navigate('/chatbot', { state: { formData: formattedData } });
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss(toastId);
      toast.error('Failed to analyse data');
    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Branch Name</TableHead>
            <TableHead>Material Used</TableHead>
            <TableHead className="text-right">Quantity (tons)</TableHead>
            <TableHead className="text-right">Carbon Emission (tons CO2)</TableHead>
            <TableHead className="text-right">Water Usage (liters)</TableHead>
            <TableHead className="text-right">Waste Generated (tons)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((row, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium">{row.branch_name}</TableCell>
              <TableCell className="font-medium text-green-600">{row.good_used}</TableCell>
              <TableCell className="text-right">
                {row['quantity_used (tons)'].toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {row['carbon_emission (tons CO2)'].toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {row['water_usage (liters)'].toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {row['waste_generated (tons)'].toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:border-green-600 hover:bg-green-50 hover:text-green-600"
                  onClick={() => handleAnalyse(row)}
                  disabled={isAnalysing}
                >
                  Analyse
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
