import { Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import { isValidEmail } from '../../utils/validation'
import { useNavigate } from 'react-router-dom'
import { AxiosHook } from '../../api/AxiosHook'
import { API_ENDPOINTS } from '../../api/EndPoints'
import { notify } from '../../components/utils/Notify'


const validation = (email: string, newPassword: string, resetCode: string, setErrors: any, navigate: any) => {
  const newErrors = new Map()
  if (!email) {
    newErrors.set('email', 'Email is required')
    navigate('/forget-password')
  }
  if (email && !isValidEmail(email)) {
    newErrors.set('email', 'Email is not valid')
    navigate('/forget-password')
  }
  if (!newPassword) {
    newErrors.set('newPassword', 'New password is required')
  }
  if (!resetCode) {
    newErrors.set('resetCode', 'Reset code is required')
  }
  if (resetCode && resetCode.length < 6) {
    newErrors.set('resetCode', 'The reset code must contain at least 6 characters.')
  }

  if (newErrors.size) {
    setErrors(newErrors)
    return false
  }

  return true

}


export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [errors, setErrors] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const email = localStorage?.email

    const isValid = validation(email, newPassword, resetCode, setErrors, navigate)

    if (!isValid) {
      return false
    }


    const data = {
      email,
      new_password: newPassword,
      reset_code: resetCode
    }

    setLoading(true)

    const response = await AxiosHook(false, API_ENDPOINTS.resetPassword, 'POST', data)

    if (response.status === 200) {
      notify('Password updated successfully', 'success')
      navigate('/login')
      localStorage.removeItem('email')
    } else if (response?.data?.error?.startsWith('Invalid or expired reset code')) {
      notify('Invalid or expired reset code', 'error')
      setErrors(new Map(errors).set('resetCode', 'Invalid or expired reset code'))
    }
    else {
      notify('Something went wrong', 'error')
    }

    setLoading(false)


  }



  return (
    <Container >
      <Paper sx={{ background: '#f9f9f9' }} >
        <form style={{ marginTop: '60px', padding: '10px', borderRadius: '6px' }} >
          <Typography variant='h2' sx={{ textAlign: 'center' }} > Reset Password </Typography>
          <TextField
            fullWidth
            label="New password"
            sx={{ mt: 2, background: 'white' }}
            value={newPassword}
            type={'password'}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              errors.has('newPassword') && errors.delete('newPassword')
              setNewPassword(e.target.value)
            }}
            error={errors.has('newPassword')}
            helperText={errors.get('newPassword')}
          />
          <TextField
            fullWidth
            label="Reset code"
            sx={{ mt: 2, background: 'white' }}
            value={resetCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              errors.has('resetCode') && errors.delete('resetCode')
              setResetCode(e.target.value)
            }}
            error={errors.has('resetCode')}
            helperText={errors.get('resetCode')}
          />
          <Button onClick={handleSubmit} disabled={loading} type={'submit'} fullWidth variant='contained' sx={{ mt: 2, }}  >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
