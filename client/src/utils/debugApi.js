// Debug utility to check API configuration
export const debugApi = () => {
  console.log('🔍 API Debug Information:');
  console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Current URL:', window.location.href);
  
  // Test API connection
  const testApiConnection = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('✅ API Connection Test:', response.status, response.statusText);
      return response;
    } catch (error) {
      console.error('❌ API Connection Test Failed:', error);
      return null;
    }
  };
  
  return testApiConnection();
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.debugApi = debugApi;
}
