import { apiFetch } from '../utils/api';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getGuestSessionId = () => {
  let sessionId = '';
  if (typeof window !== 'undefined') {
    sessionId = localStorage.getItem('auriqGuestSessionId') || '';
    if (!sessionId) {
      sessionId = generateId();
      localStorage.setItem('auriqGuestSessionId', sessionId);
    }
  }
  return sessionId;
};

const getHeaders = () => {
  return {
    'x-guest-session-id': getGuestSessionId(),
  };
};

export const getCart = async () => {
  return await apiFetch('/cart', { headers: getHeaders() });
};

export const addToCart = async (variantId?: number, bundleId?: number, quantity: number = 1) => {
  return await apiFetch('/cart', { 
    method: 'POST',
    body: JSON.stringify({ variantId, bundleId, quantity }),
    headers: getHeaders() 
  });
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  return await apiFetch(`/cart/${itemId}`, { 
    method: 'PUT',
    body: JSON.stringify({ quantity }),
    headers: getHeaders() 
  });
};

export const removeFromCart = async (itemId: number) => {
  return await apiFetch(`/cart/${itemId}`, { 
    method: 'DELETE',
    headers: getHeaders() 
  });
};
