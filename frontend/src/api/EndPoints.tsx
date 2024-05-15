export const BackendUrl = import.meta.env.VITE_BACKEND_URL

export const API_ENDPOINTS = {
  register: `${BackendUrl}/register/`,
  login: `${BackendUrl}/token/`,
  getUpdateLoggedUser: `${BackendUrl}/user/`,
  verifiedAccount: `${BackendUrl}/verification-account/`,
  changePassword: `${BackendUrl}/change-password/`,
  forgetPassword: `${BackendUrl}/forgot-password/`,
  resetPassword: `${BackendUrl}/reset-password/`,

  // list todos
  getTodos: (qs: string) => `${BackendUrl}/todos/${qs}`,
  createTodo: `${BackendUrl}/todos/`,
  updateDeleteTodo: (id: any) => `${BackendUrl}/todos/${id}/`

}