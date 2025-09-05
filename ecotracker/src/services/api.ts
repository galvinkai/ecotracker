import { api, serverStatus } from '@/lib/axios';

export interface TransactionData {
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface CarbonImpactResponse {
  carbon: number;
  impact_level: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface PredictionResponse {
  prediction: 'High' | 'Low';
  recommendation: string;
}

export interface ChatMessage {
  message: string;
}

export const ecoTrackerApi = {
  // Get carbon impact prediction for a transaction
  getCarbonImpact: async (data: TransactionData): Promise<CarbonImpactResponse> => {
    console.log('Getting carbon impact for transaction:', data);
    const response = await api.post<CarbonImpactResponse>('/predict', {
      good_used: data.category,
      'quantity_used (tons)': data.amount * 0.001, // Convert to tons for backend
      'carbon_emission (tons CO2)': 0, // These will be calculated by backend
      'water_usage (liters)': 0,      // or can be set to estimated values
      'waste_generated (tons)': 0     // based on category
    });
    return response.data;
  },

  // Get all transactions
  getTransactions: async () => {
    console.log('Fetching transactions. Server online status:', serverStatus.isOnline);
    try {
      const response = await api.get('/transactions');
      console.log('Transaction response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getTransactions:', error);
      throw error;
    }
  },

  // Add a new transaction
  addTransaction: async (data: TransactionData) => {
    console.log('Adding transaction:', data);
    const response = await api.post('/transactions', data);
    return response.data;
  },

  // Chat with AI assistant
  chat: async (message: string) => {
    console.log('Sending chat message:', message);
    const response = await api.post('/conversation', { message });
    return response.data;
  },

  // Get insights based on transactions
  getInsights: async () => {
    console.log('Getting insights. Server online status:', serverStatus.isOnline);
    const response = await api.get('/insights');
    return response.data;
  }
};
