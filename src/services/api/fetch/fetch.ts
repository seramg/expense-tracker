export interface FetchApiConfig {
  headers?: HeadersInit;
  revalidate?: number | false;
  tags?: string[];
  baseUrl: string;
}

export type Middleware<T> = (context: T) => T | Promise<T>;

export interface IResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface IError {
  status: number;
  message: string;
  data?: {
    [key: string]: string[] | boolean;
  };
}

export interface FetchRequestConfig extends RequestInit {
  sensitive?: boolean; // custom flag to control cache
}

class FetchApi {
  protected apiConfig: FetchApiConfig;
  protected baseUrl: string;

  constructor(config: FetchApiConfig) {
    this.baseUrl = config.baseUrl;
    this.apiConfig = config;
  }

  //Middleware functiins
  protected onRequest: Middleware<RequestInit> = async (config) => config;
  protected onResponse: Middleware<Response> = async (response) => response;
  protected onError: Middleware<unknown> = async (error) => {
    throw error;
  };

  //Method to set middlewares
  setOnRequest(middleware: Middleware<RequestInit>) {
    this.onRequest = middleware;
  }

  setOnResponse(middleware: Middleware<Response>) {
    this.onResponse = middleware;
  }

  setOnError(middleware: Middleware<unknown>) {
    this.onError = middleware;
  }

  /**
   * Core request method for all HTTP verbs.
   * Handles:
   * - Automatic cookie/session sending (NextAuth)
   * - Optional JWT header (if using token-based auth)
   * - Automatic no-store caching for sensitive endpoints
   */
  async request<T>(
    path: string,
    requestConfig: FetchRequestConfig = {},
  ): Promise<T> {
    const { method = "GET", body, sensitive = false, ...rest } = requestConfig;

    const headers: HeadersInit = {
      ...this.apiConfig.headers,
      ...rest.headers,
    };

    //apply onreq middleware
    const modifiedConfig = await this.onRequest({
      method,
      body,
      headers: headers,
      ...rest,
      cache: sensitive ? "no-store" : (rest.cache ?? "force-cache"),
      credentials: "include",
    });

    let fetchBody: BodyInit | undefined;

    if (modifiedConfig.body instanceof FormData) {
      fetchBody = modifiedConfig.body; // keep FormData
    } else if (modifiedConfig.body !== undefined) {
      fetchBody = JSON.stringify(modifiedConfig.body); // convert objects to JSON
    } else {
      fetchBody = undefined; // no body
    }

    // 3. Perform fetch
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...modifiedConfig,
      body: fetchBody,
    });

    //apply onresponse middleware
    const modifiedResponse = await this.onResponse(response);

    // 4. Parse response
    const data = await modifiedResponse.json();

    // 5. Error handling
    if (!modifiedResponse.ok) {
      await this.onError(data);
      throw {
        status: response.status,
        message: data?.message || response.statusText,
      } as IError;
    }

    return data as T;
  }

  // HTTP methods
  get<T>(path: string, config: FetchRequestConfig = {}): Promise<IResponse<T>> {
    return this.request<IResponse<T>>(path, { ...config, method: "GET" });
  }

  post<T, TBody>(
    path: string,
    body: TBody,
    config: FetchRequestConfig = {},
  ): Promise<IResponse<T>> {
    return this.request<IResponse<T>>(path, {
      ...config,
      method: "POST",
      body: body as ReadableStream,
    });
  }

  put<T, TBody>(
    path: string,
    body: TBody,
    config: FetchRequestConfig = {},
  ): Promise<IResponse<T>> {
    return this.request<IResponse<T>>(path, {
      ...config,
      method: "PUT",
      body: body as ReadableStream,
    });
  }

  delete<T>(
    path: string,
    config: FetchRequestConfig = {},
  ): Promise<IResponse<T>> {
    return this.request<IResponse<T>>(path, { ...config, method: "DELETE" });
  }
}

export default FetchApi;
