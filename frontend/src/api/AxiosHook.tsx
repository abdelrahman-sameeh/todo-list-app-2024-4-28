import axios, { AxiosRequestConfig } from 'axios';
type MethodType = "GET" | "POST" | "PUT" | "DELETE";
type ContentType = 'application/json' | 'multipart/form-data';

export const AxiosHook = async (authTokens: any, url: string, method: MethodType, data: any, contentType: ContentType = 'application/json', timeout: number = 60 * 1000): Promise<any> => {

  const token = authTokens?.access

  const headers: any = {
    'Content-Type': contentType,
  }
  if (authTokens) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config: AxiosRequestConfig = {
    method,
    url,
    headers,
    timeout,
    data
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error: any) {
    return error.response
  }
}
