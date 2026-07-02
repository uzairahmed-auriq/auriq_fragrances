const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  let token = '';
  if (typeof window !== 'undefined') {
    token = sessionStorage.getItem('adminToken') || '';
  }
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const adminStoryService = {
  updateStory: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_URL}/admin/story`, {
        method: 'PUT',
        headers: getHeaders(), // Note: Do NOT set Content-Type to application/json for FormData, let browser set multipart/form-data boundary
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating story:', error);
      return { success: false, message: 'Network error' };
    }
  }
};
