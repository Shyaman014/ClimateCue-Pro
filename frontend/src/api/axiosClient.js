import axios from 'axios';

// The base API URL defaults to the VITE_API_URL environment variable.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://climatecue-pro-production.up.railway.app/api/weather';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to log requests
axiosClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url || ''}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling and exponential backoff retry
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;

    // Log the exact API URL and failed request for debugging
    console.error(`[API Error] Request to ${config?.baseURL}${config?.url || ''} failed.`, error.message);

    if (error.response) {
      console.error(`[API Error] Response Status: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('[API Error] No response received from backend (possible CORS, Network error, or Backend Sleeping).');
    }

    // Set up retry logic with exponential backoff
    if (!config || !config.retry) {
      // Initialize retry configuration if not present
      if (config) {
        config.retry = 3; // Max 3 retries
        config.retryCount = 0;
        config.retryDelay = 1000; // Start with 1 second delay
      }
    }

    if (config && config.retryCount < config.retry) {
      config.retryCount += 1;
      
      // Exponential backoff
      const delay = config.retryDelay * Math.pow(2, config.retryCount - 1);
      console.log(`[API Retry] Retrying request to ${config.url} in ${delay}ms... (Attempt ${config.retryCount} of ${config.retry})`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return axiosClient(config);
    }

    // If max retries reached or no config, parse error nicely
    let userFriendlyMessage = 'An unexpected error occurred.';
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        userFriendlyMessage = 'Request Timeout. The server might be asleep or overloaded.';
      } else {
        userFriendlyMessage = 'Network Error. The backend is unavailable or a CORS error occurred. Ensure your internet connection is active.';
      }
    } else {
      if (error.response.status === 404) {
        userFriendlyMessage = 'City or location not found.';
      } else if (error.response.status >= 500) {
        userFriendlyMessage = 'Backend service is temporarily unavailable. It might be starting up from sleep mode.';
      } else {
        userFriendlyMessage = error.response.data?.message || `API Error: ${error.response.status}`;
      }
    }
    
    // Attach the user-friendly message for components to read
    error.userFriendlyMessage = userFriendlyMessage;
    
    return Promise.reject(error);
  }
);

export default axiosClient;
