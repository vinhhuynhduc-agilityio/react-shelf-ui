// API request function
export const apiRequest = async <T, K>(
  method: string, 
  url: string, 
  data?: T
): Promise<K> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
