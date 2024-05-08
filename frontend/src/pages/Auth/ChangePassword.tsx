import { Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import { AxiosHook } from '../../api/AxiosHook'
import { useAuth } from '../../context/AuthContext'
import { API_ENDPOINTS } from '../../api/EndPoints'
import { notify } from '../../components/utils/Notify'
import { useNavigate } from 'react-router-dom'


const validation = (oldPassword: string, newPassword: string, confirmNewPassword: string, setErrors: any) => {
  const newErrors = new Map()
  if (!oldPassword) {
    newErrors.set('oldPassword', 'Old password is required')
  }
  if (!newPassword) {
    newErrors.set('newPassword', 'New password is required')
  }
  if (!confirmNewPassword) {
    newErrors.set('confirmNewPassword', 'Confirm new password is required')
  }
  if (newPassword && confirmNewPassword && newPassword != confirmNewPassword) {
    newErrors.set('confirmNewPassword', 'Confirm new password must be equal new password')
  }
  if (oldPassword && newPassword && oldPassword == newPassword) {
    newErrors.set('newPassword', 'Ensure the new password is not the same as the old password.')
  }

  if (newErrors.size) {
    setErrors(newErrors)
    return false
  }
  return true
}

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Map<string, string>>(new Map())

  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const isValid = validation(oldPassword, newPassword, confirmNewPassword, setErrors)
    if (!isValid) {
      return false
    }

    const data = {
      old_password: oldPassword,
      new_password: newPassword
    }
    setLoading(true)
    const response = await AxiosHook(true, API_ENDPOINTS.changePassword, 'POST', data)
    if (response.status == 200) {
      notify('Password updated successfully', 'success')
      navigate('/')
    } else if (response?.data?.error?.startsWith('Old password is incorrect')) {
      notify('Old password is incorrect', 'error')
      setErrors((prev) => new Map(prev).set('oldPassword', 'Old password is incorrect'))
    } else {
      notify('Something went wrong', 'error')
    }
    setLoading(false)
  }


  return (
    <Container >
      <Paper sx={{ background: '#f9f9f9' }} >
        <form style={{ marginTop: '60px', padding: '10px', borderRadius: '6px' }} >
          <Typography variant='h2' sx={{ textAlign: 'center' }} > Verified Account </Typography>
          <TextField
            error={errors.has('oldPassword')}
            helperText={errors.get('oldPassword')}
            fullWidth
            label="Old password"
            sx={{ mt: 2, background: 'white' }}
            type={'password'}
            value={oldPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              errors.has('oldPassword') && errors.delete('oldPassword')
              setOldPassword(e.target.value)
            }}
          />
          <TextField
            error={errors.has('newPassword')}
            helperText={errors.get('newPassword')}
            fullWidth
            label="New password"
            sx={{ mt: 2, background: 'white' }}
            type={'password'}
            value={newPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              errors.has('newPassword') && errors.delete('newPassword')
              setNewPassword(e.target.value)
            }}
          />
          <TextField
            error={errors.has('confirmNewPassword')}
            helperText={errors.get('confirmNewPassword')}
            fullWidth
            label="Confirm new password"
            sx={{ mt: 2, background: 'white' }}
            type={'password'}
            value={confirmNewPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              errors.has('confirmNewPassword') && errors.delete('confirmNewPassword')
              setConfirmNewPassword(e.target.value)
            }}
          />
          <Button onClick={handleSubmit} disabled={loading} type={'submit'} fullWidth variant='contained' sx={{ mt: 2, }}  >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
