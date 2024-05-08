import { Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isValidEmail } from '../../utils/validation'
import { AxiosHook } from '../../api/AxiosHook'
import { API_ENDPOINTS } from '../../api/EndPoints'
import { notify } from '../../components/utils/Notify'


const validation = (email: string, setErrors: any) => {

  const newErrors = new Map()
  if (!email) {
    newErrors.set('email', 'Email is required')
  }
  if (email && !isValidEmail(email)) {
    newErrors.set('email', 'Enter a valid email')
  }

  if (newErrors.size) {
    setErrors(newErrors)
    return false
  }

  return true

}


export const ForgetPassword = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const isValid = validation(email, setErrors)

    if (!isValid) {
      return false
    }

    const data = {
      email,
    }

    setLoading(true)
    const response = await AxiosHook(false, API_ENDPOINTS.forgetPassword, 'POST', data)
    if (response.status == 200) {
      localStorage.setItem('email', email)
      notify('Reset code successfully sent.', 'success')
      navigate('/reset-password')
    } else if (response?.data?.detail?.startsWith('No User matches the given query.')) {
      notify('No user match this email', 'error')
      setErrors(new Map(errors).set('email', 'No user match this email'))
    } else if (response?.data?.error?.startsWith('You must verify your account before performing this action')) {
      notify('This account is not verified', 'error')
    } else {
      notify('Something went wrong', 'error')
    }

    setLoading(false)

  }
  return (
    <Container >
      <Paper sx={{ background: '#f9f9f9' }} >
        <form style={{ marginTop: '60px', padding: '10px', borderRadius: '6px' }} >
          <Typography variant='h2' sx={{ textAlign: 'center' }} > Forget Password </Typography>
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
          <Button onClick={handleSubmit} disabled={loading} type={'submit'} fullWidth variant='contained' sx={{ mt: 2, }}  >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
