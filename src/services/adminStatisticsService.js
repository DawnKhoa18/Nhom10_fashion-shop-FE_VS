import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin/statistics';

export const getAdminStatistics = async ({ fromDate, toDate } = {}) => {
  const response = await axios.get(API_URL, {
    params: {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined
    }
  });
  return response.data;
};
