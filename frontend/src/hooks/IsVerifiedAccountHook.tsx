import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { API_ENDPOINTS } from '../api/EndPoints'
import { AxiosHook } from '../api/AxiosHook'
import { useAuth } from '../context/AuthContext'


export const IsVerifiedAccountHook = () => {

  const [user, setUser] = useState<any>({})

  const { authTokens }: any = useAuth()

  const run = async () => {
    const response = await AxiosHook(authTokens, API_ENDPOINTS.getLoggedUser, 'GET', null)
    if (response.status == 200) {
      setUser(response.data)
    }
  }

  useEffect(() => {
    run()
  }, [])


  if (user?.email) {
    if (user?.status == 'V') {
      return <Outlet />
    } else {
      return <Navigate to={'/verified'} />
    }
  } else {
    return <Navigate to={'/'} />
  }

}

