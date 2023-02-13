import axios from 'axios';

interface QueryOptions {
  queryKey: string;
}

const fetcher = async ({ queryKey }: { queryKey: string }) => {
  const response = await axios.get(queryKey, {
    baseURL: 'http://localhost:3055',
    withCredentials: true,
  });

  return response.data;
};

export default fetcher;
