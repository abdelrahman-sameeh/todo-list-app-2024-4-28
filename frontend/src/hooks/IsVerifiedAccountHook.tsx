import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { API_ENDPOINTS } from '../api/EndPoints'
import { AxiosHook } from '../api/AxiosHook'

export const IsVerifiedAccountHook = () => {

  const [user, setUser] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const run = async () => {
    const response = await AxiosHook(true, API_ENDPOINTS.getLoggedUser, 'GET', null)
    if (response?.status == 200) {
      setUser(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    run()
  }, [])

  if (loading == false) {
    if (user?.status == 'V') {
      return <Outlet />
    } else if (user?.status == 'N') {
      return <Navigate to={'/verified'} />
    } else if (!user?.email) {
      return <Navigate to='/login' />
    }
  }

}

