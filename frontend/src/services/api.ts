export interface Resource {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = 'http://localhost:3000';

// Fetch all resources
export const getResources = async (): Promise<Resource[]> => {
  const response = await fetch(`${API_BASE_URL}/resources`);
  if (!response.ok) {
    throw new Error(`Failed to fetch resources: ${response.statusText}`);
  }
  return response.json();
};

// Create a new resource
export const createResource = async (resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource> => {
  const response = await fetch(`${API_BASE_URL}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resourceData),
  });
  if (!response.ok) {
    // Attempt to parse error message from backend if available
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Failed to create resource: ${errorBody.message || response.statusText}`);
  }
  return response.json();
};

// Update an existing resource
export const updateResource = async (id: number, resourceData: Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Resource> => {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resourceData),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Failed to update resource: ${errorBody.message || response.statusText}`);
  }
  return response.json();
};

// Delete a resource
export const deleteResource = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok && response.status !== 204) { // 204 No Content is a success for delete
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Failed to delete resource: ${errorBody.message || response.statusText}`);
  }
  // No need to return response.json() for a 204 response
}; 