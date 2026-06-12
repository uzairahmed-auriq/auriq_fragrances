import { apiFetch } from '../utils/api';

const getGuestSessionId = () => {
  let sessionId = '';
  if (typeof window !== 'undefined') {
    sessionId = localStorage.getItem('auriqGuestSessionId') || '';
  }
  return sessionId;
};

const getHeaders = () => {
  return {
    'x-guest-session-id': getGuestSessionId(),
  };
};

export const createOrder = async (orderData: any) => {
  return await apiFetch('/orders', { 
    method: 'POST',
    body: JSON.stringify(orderData),
    headers: getHeaders() 
  });
};

export const getMyOrders = async () => {
  return await apiFetch('/orders/my-orders', { headers: getHeaders() });
};

export const getOrderById = async (id: string) => {
  return await apiFetch(`/orders/${id}`, { headers: getHeaders() });
};
