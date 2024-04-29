import { Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { isValidEmail } from '../../utils/validation'
import { AxiosHook } from '../../api/AxiosHook'
import { API_ENDPOINTS } from '../../api/EndPoints'
import { useNavigate } from 'react-router-dom'
import { notify } from '../../components/utils/Notify'


const validation = (name: string, email: string, password: string, passwordConfirm: string, setErrors: any) => {

  const newErrors = new Map()

  if (!name) {
    newErrors.set('name', 'Name is required')
  }
  if (!email) {
    newErrors.set('email', 'Email is required')
  }
  if (email && !isValidEmail(email)) {
    newErrors.set('email', 'Enter a valid email')
  }
  if (!password) {
    newErrors.set('password', 'Password is required')
  }
  if (!passwordConfirm) {
    newErrors.set('passwordConfirm', 'PasswordConfirm is required')
  }
  if (password && passwordConfirm && password != passwordConfirm) {
    newErrors.set('passwordConfirm', 'PasswordConfirm must be equal Password')
  }

  console.log(newErrors);


  if (newErrors.size) {
    setErrors(newErrors)
    return false
  }

  return true

}

export const Register = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('M')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errors, setErrors] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()


  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const isValid = validation(name, email, password, passwordConfirm, setErrors)

    if (!isValid) {
      return false
    }

    const data = {
      name,
      email,
      password,
      gender
    }

    setLoading(true)
      const response = await AxiosHook(null, API_ENDPOINTS.register, 'POST', data)
      if (response.status === 201) {
        navigate('/login')
        notify('Account created successfully', 'success')
      }else if (response?.status==400 && response?.data && response?.data?.email[0]?.startsWith('user with this email already exists.') ){
        notify('This email already used', 'error')
        setErrors((prev)=>(new Map(errors).set('email', 'This email already used')))
      }else{
        notify('Something went wrong', 'error')
      }
    setLoading(false)
  }


  return (
    <Container >
      <Paper sx={{ background: '#f9f9f9' }} >
        <form style={{ marginTop: '60px', padding: '10px', borderRadius: '6px' }} >
          <Typography variant='h2' sx={{ textAlign: 'center' }} > Register </Typography>
          <TextField
            fullWidth
            label="name"
            sx={{ mt: 2, background: 'white' }}
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              errors.has('name') && errors.delete('name')
              setName(e.target.value)
            }}
            error={errors.has('name')}
            helperText={errors.get('name')}
          />
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

          <FormControl fullWidth
            sx={{ mt: 2, background: 'white' }}>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gender}
              label="Age"
              onChange={(e: any) => {
                setGender(e.target.value)
              }}
            >
              <MenuItem value={'M'}>Male</MenuItem>
              <MenuItem value={'F'}>Female</MenuItem>
            </Select>
          </FormControl>

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
          <TextField
            sx={{ mt: 2, background: 'white' }}
            fullWidth
            label="password confirm"
            value={passwordConfirm}
            type={'password'}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              errors.has('passwordConfirm') && errors.delete('passwordConfirm')
              setPasswordConfirm(e.target.value)
            }}
            error={errors.has('passwordConfirm')}
            helperText={errors.get('passwordConfirm')}
          />
          <Button onClick={handleSubmit} disabled={loading} type={'submit'} fullWidth variant='contained' sx={{ mt: 2, }}  >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
