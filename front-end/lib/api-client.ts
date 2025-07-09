import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  progress?: number;
}

class ApiClient {
  private client: AxiosInstance;
  private isServer: boolean;

  constructor(baseURL?: string, isServer = false) {
    this.isServer = isServer;
    this.client = axios.create({
      baseURL:
        baseURL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        let token: string | undefined;

        if (this.isServer) {
          const session = await getServerSession(authOptions);
          token = session?.accessToken;
        } else {
          const session = await getSession();
          token = session?.accessToken;
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        config.params = {
          ...config.params,
          _t: Date.now(),
        };

        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: unknown) => {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
              errors?: Record<string, string[]>;
            };
            status?: number;
          };
          message?: string;
        };

        const apiError: ApiError = {
          message:
            axiosError.response?.data?.message ||
            axiosError.message ||
            "An error occurred",
          status: axiosError.response?.status || 500,
          errors: axiosError.response?.data?.errors,
        };

        if (axiosError.response?.status === 401) {
          if (!this.isServer) {
            const { signOut } = await import("next-auth/react");
            await signOut({ callbackUrl: "/" });
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.client.defaults.headers, headers);
  }
}

export const apiClient = new ApiClient();
export const serverApiClient = new ApiClient(process.env.API_URL, true);

export default apiClient;
