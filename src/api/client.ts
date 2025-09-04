import { API_BASE_URL } from '../constants';

// API Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiClientError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

// Request configuration interface
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

// Response wrapper interface
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// API Client class
export class ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 10000; // 10 seconds
  private defaultRetries: number = 3;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Request interceptor - can be extended for auth tokens, etc.
  private async requestInterceptor(config: RequestConfig): Promise<RequestConfig> {
    // Add auth token if available
    const token = await this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Set default headers
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    return config;
  }

  // Response interceptor
  private async responseInterceptor<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorCode: string | undefined;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.code;
      } catch {
        // If response is not JSON, use default message
      }

      throw new ApiClientError(errorMessage, response.status, errorCode);
    }

    try {
      return await response.json();
    } catch {
      throw new ApiClientError('Invalid JSON response', response.status);
    }
  }

  // Get auth token from storage (implement based on your storage solution)
  private async getAuthToken(): Promise<string | null> {
    // This should be implemented based on your auth storage solution
    // For now, returning null - you can integrate with your auth provider
    return null;
  }

  // Retry logic
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(requestFn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  // Check if error is retryable
  private isRetryableError(error: any): boolean {
    if (error instanceof ApiClientError) {
      return error.status >= 500 || error.status === 429; // Server errors or rate limiting
    }
    return false;
  }

  // Main request method
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      ...requestConfig
    } = config;

    const url = `${this.baseURL}${endpoint}`;

    const makeRequest = async (): Promise<T> => {
      // Apply request interceptor
      const finalConfig = await this.requestInterceptor(requestConfig);

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...finalConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return await this.responseInterceptor<T>(response);
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new ApiClientError('Request timeout', 408);
          }
          throw error;
        }
        throw new ApiClientError('Network error occurred', 0);
      }
    };

    return this.retryRequest(makeRequest, retries);
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
