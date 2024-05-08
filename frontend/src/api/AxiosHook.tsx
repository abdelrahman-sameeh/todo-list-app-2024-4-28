import axios, { AxiosRequestConfig } from 'axios';
type MethodType = "GET" | "POST" | "PUT" | "DELETE";
type ContentType = 'application/json' | 'multipart/form-data';

export const AxiosHook = async (needToken: boolean, url: string, method: MethodType, data: any, contentType: ContentType = 'application/json', timeout: number = 60 * 1000): Promise<any> => {
  const headers: any = {
    'Content-Type': contentType,
  }

  if (needToken && localStorage?.authTokens) {
    const token = JSON.parse(localStorage?.authTokens)?.access
    headers['Authorization'] = `Bearer ${token}`
  }else if(needToken && !localStorage?.authTokens){
    return
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
