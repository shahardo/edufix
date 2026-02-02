export const handleApiResponse = async (response: Response, errorMessage: string) => {
  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json();
};