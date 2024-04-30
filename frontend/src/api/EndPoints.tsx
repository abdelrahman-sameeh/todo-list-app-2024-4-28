export const BackendUrl = import.meta.env.VITE_BACKEND_URL

export const API_ENDPOINTS = {
  register: `${BackendUrl}/register/`,
  login: `${BackendUrl}/token/`,
  getLoggedUser: `${BackendUrl}/user/`,
  verifiedAccount: `${BackendUrl}/verification-account/`,
  changePassword: `${BackendUrl}/change-password/`,
}