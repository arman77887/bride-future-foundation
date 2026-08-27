import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export async function checkApiHealth(): Promise<{ success: boolean; message: string; timestamp: string }> {
  const response = await api.get('/health');
  return response.data;
}

export default api;
