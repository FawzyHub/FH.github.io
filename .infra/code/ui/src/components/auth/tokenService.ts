const TOKEN_KEY = 'mock_access_token';

export const getAccessToken = async (): Promise<string|null> => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
