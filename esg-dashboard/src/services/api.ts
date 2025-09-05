import { api } from '@/lib/axios';

export interface ProductionData {
  good_used: string;
  'quantity_used (tons)': number;
  'carbon_emission (tons CO2)': number;
  'water_usage (liters)': number;
  'waste_generated (tons)': number;
}

export interface PredictionResponse {
  prediction: 'High' | 'Low';
  recommendation: string;
}

export interface ChatMessage {
  message: string;
}

export const esgApi = {
  predict: async (data: ProductionData): Promise<PredictionResponse> => {
    const response = await api.post<PredictionResponse>('/predict', data);
    return response.data;
  },

  chat: async (message: string) => {
    const response = await api.post('/conversation', { message });
    return response.data;
  },
};