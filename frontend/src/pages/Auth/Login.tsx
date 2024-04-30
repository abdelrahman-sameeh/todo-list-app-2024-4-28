import { Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { isValidEmail } from '../../utils/validation'
import { AxiosHook } from '../../api/AxiosHook'
import { API_ENDPOINTS } from '../../api/EndPoints'
import { useNavigate } from 'react-router-dom'
import { notify } from '../../components/utils/Notify'


const validation = (email: string, password: string, setErrors: any) => {

  const newErrors = new Map()
  if (!email) {
    newErrors.set('email', 'Email is required')
  }
  if (email && !isValidEmail(email)) {
    newErrors.set('email', 'Enter a valid email')
  }
  if (!password) {
    newErrors.set('password', 'Password is required')
  }


  if (newErrors.size) {
    setErrors(newErrors)
    return false
  }

  return true

}

export const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const isValid = validation(email, password, setErrors)

    if (!isValid) {
      return false
    }

    const data = {
      email,
      password,
    }

    setLoading(true)
    const response = await AxiosHook(null, API_ENDPOINTS.login, 'POST', data)
    if (response.status === 200) {
      notify('logged in successfully', 'success')
      localStorage.setItem('authTokens', JSON.stringify(response?.data))
      navigate('/todos')
    } else if (response.status == 401) {
      notify('Email or Password is incorrect', 'error')
    } else {
      notify('Something went wrong', 'error')
    }
    setLoading(false)
  }


  return (
    <Container >
      <Paper sx={{ background: '#f9f9f9' }} >
        <form style={{ marginTop: '60px', padding: '10px', borderRadius: '6px' }} >
          <Typography variant='h2' sx={{ textAlign: 'center' }} > Login </Typography>
          <TextField
            fullWidth
            label="email"
            sx={{ mt: 2, background: 'white' }}
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              errors.has('email') && errors.delete('email')
              setEmail(e.target.value)
            }}
            error={errors.has('email')}
            helperText={errors.get('email')}
          />

          <TextField
            sx={{ mt: 2, background: 'white' }}
            fullWidth
            label="password"
            value={password}
            type={'password'}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              errors.has('password') && errors.delete('password')
              setPassword(e.target.value)
            }}
            error={errors.has('password')}
            helperText={errors.get('password')}
          />
          <Button onClick={handleSubmit} disabled={loading} type={'submit'} fullWidth variant='contained' sx={{ mt: 2, }}  >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
