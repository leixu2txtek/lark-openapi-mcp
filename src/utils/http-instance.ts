import axios, { AxiosRequestConfig } from 'axios';
import { ProxyAgent } from 'proxy-agent';
import { USER_AGENT } from './constants';

const proxyAgent = new ProxyAgent();

let customHeaders: Record<string, string> = {};

/**
 * Set custom headers to be applied to all HTTP requests.
 * @param headers Key-value pairs of custom headers
 */
export const setCustomHeaders = (headers: Record<string, string>) => {
  customHeaders = headers;
};

const traceMiddleware = <T extends AxiosRequestConfig>(request: T) => {
  if (request.headers) {
    request.headers['User-Agent'] = USER_AGENT;
    for (const [key, value] of Object.entries(customHeaders)) {
      request.headers[key] = value;
    }
  }
  return request;
};

export const commonHttpInstance = axios.create({ proxy: false, httpAgent: proxyAgent, httpsAgent: proxyAgent });
commonHttpInstance.interceptors.request.use(traceMiddleware, undefined, { synchronous: true });

export const oapiHttpInstance = axios.create({ proxy: false, httpAgent: proxyAgent, httpsAgent: proxyAgent });
oapiHttpInstance.interceptors.request.use(traceMiddleware, undefined, { synchronous: true });
oapiHttpInstance.interceptors.response.use((response) => response.data);
