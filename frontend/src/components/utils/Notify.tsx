import { toast } from "react-toastify";


type statusType = 'success' | 'warn' | 'error'

export const notify = (message: string, status: statusType) => {
  toast[status](message)
}

