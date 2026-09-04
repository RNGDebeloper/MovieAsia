import axios, {
  type AxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

/**
 * @class BaseService
 */
class BaseService {
  constructor() {
    if (this.constructor === BaseService) {
      throw new Error("Classes can't be instantiated.");
    }
  }

  static axios(baseUrl: string) {
    const isTmdbRequest = baseUrl.includes('themoviedb.org');
    // Client components use our server-side proxy so a TMDB credential is
    // never bundled into JavaScript sent to the browser.
    const resolvedBaseUrl =
      isTmdbRequest && typeof window !== 'undefined' ? '/api/tmdb' : baseUrl;
    const instanceConfig: AxiosRequestConfig = this.getConfig(resolvedBaseUrl);
    const instance: AxiosInstance = axios.create(instanceConfig);

    const onRequest = (
      config: InternalAxiosRequestConfig,
    ): InternalAxiosRequestConfig => {
      if (config.baseURL?.includes('themoviedb.org')) {
        const token = process.env.TMDB_API_TOKEN;
        if (!token) {
          throw new Error(
            'TMDB_API_TOKEN is required to make TMDB API requests. Set it in the deployment environment (and pass it as a Docker build argument when build-time requests are enabled).',
          );
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };

    const onErrorResponse = (
      error: AxiosError | Error,
    ): Promise<AxiosError> => {
      console.error(`error in request: ${error.message}`);
      return Promise.reject(error);
    };

    instance.interceptors.request.use(onRequest, onErrorResponse);

    return instance;
  }

  static getConfig(baseUrl: string): AxiosRequestConfig {
    return {
      timeout: 15000,
      baseURL: baseUrl,
      responseType: 'json',
      maxContentLength: 100000,
      validateStatus: (status: number) => status >= 200 && status < 300,
      maxRedirects: 5,
    };
  }

  static isRejected = (
    input: PromiseSettledResult<unknown>,
  ): input is PromiseRejectedResult => input.status === 'rejected';

  static isFulfilled = <T>(
    input: PromiseSettledResult<T>,
  ): input is PromiseFulfilledResult<T> => input.status === 'fulfilled';
}

export default BaseService;
