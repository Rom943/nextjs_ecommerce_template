/**
 * Utility for making authenticated API requests to the admin API
 * Handles authentication tokens and error responses
 */

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Performs an authenticated request to the admin API
 * 
 * @param endpoint - API endpoint path (should start with /)
 * @param options - Request options
 * @returns Response data or error
 */
export async function adminApiRequest<T = any>(
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    // Set default options
    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
    };

    // Add request body if present
    if (options.body) {
      requestOptions.body = JSON.stringify(options.body);
    }

    // Make the request
    const response = await fetch(`/api/admin${endpoint}`, requestOptions);
    const status = response.status;
    
    // Handle successful responses
    if (response.ok) {
      const data = await response.json();
      return { data, error: null, status };
    }
    
    // Handle error responses
    try {
      const errorData = await response.json();
      return { 
        data: null, 
        error: errorData.message || 'An unknown error occurred', 
        status 
      };
    } catch {
      // If error response cannot be parsed as JSON
      return { 
        data: null, 
        error: `HTTP Error ${response.status}: ${response.statusText}`, 
        status 
      };
    }
  } catch (error) {
    // Network errors or other exceptions
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Network error',
      status: 0
    };
  }
}
