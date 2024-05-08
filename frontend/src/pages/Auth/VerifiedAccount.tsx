import { Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import { AxiosHook } from '../../api/AxiosHook'
import { API_ENDPOINTS } from '../../api/EndPoints'
import { useNavigate } from 'react-router-dom'
import { notify } from '../../components/utils/Notify'
import { useAuth } from '../../context/AuthContext'

export const VerifiedAccount = () => {
  const [verifiedCode, setVerifiedCode] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const data = {
      verified_code: verifiedCode
    }
    setLoading(true)
    const response = await AxiosHook(true, API_ENDPOINTS.verifiedAccount, 'POST', data)

    if (response.status === 200) {
      navigate('/todos')
      notify('Your Account Verified Successfully', 'success')
    } else if (response?.data?.error?.startsWith('wrong code')) {
      notify('Wrong code', 'error')
    } else if (response?.data?.error?.startsWith('this is not new account')) {
      notify('This is verified account', 'error')
      navigate('/')
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
            fullWidth
            label="Verification code"
            sx={{ mt: 2, background: 'white' }}
            value={verifiedCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setVerifiedCode(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading} type={'submit'} fullWidth variant='contained' sx={{ mt: 2, }}  >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
