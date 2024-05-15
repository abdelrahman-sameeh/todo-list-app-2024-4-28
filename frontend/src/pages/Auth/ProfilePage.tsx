import { Box, Button, Container, TextField, Typography } from '@mui/material'

import uploadImage from '../../static/image/upload.jpg'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosHook } from '../../api/AxiosHook'
import { API_ENDPOINTS } from '../../api/EndPoints'
import { notify } from '../../components/utils/Notify'

export const ProfilePage = () => {


  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState<any>(uploadImage)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [errors, setErrors] = useState<Map<string, string>>(new Map())

  const { user }: any = useAuth()
  const navigate = useNavigate()


  useEffect(() => {
    if (user?.email) {
      setName(user.name)
      setEmail(user.email)
      setImage(user?.profile_picture)
    }
  }, [user])

  useEffect(() => {
    if (!localStorage?.authTokens) {
      navigate('/login')
    }
  }, [])

  const handleUpdate = async (e: any) => {
    e.preventDefault()

    if (name == user.name && email == user.email && image == user.profile_picture) {
      return false
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('profile_picture', selectedFile == null || selectedFile == 'delete' ? '' : selectedFile)

    const response = await AxiosHook(true, API_ENDPOINTS.getUpdateLoggedUser, 'PUT', formData, 'multipart/form-data')
    
    if(response.status==200){
      notify('Upload successfully', 'success')
    }else{
      notify('Something went wrong', 'error')
    }

  }



  return (
    <Container sx={{ mt: '20px' }} >
      <form onSubmit={handleUpdate} >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <label htmlFor="inputImg">
            <img style={{ height: '200px', objectFit: 'contain', cursor: 'pointer' }} src={image ? image : uploadImage} alt="user image" />
          </label>
          <input onChange={(e: any) => {
            errors.has('image') && errors.delete('image')
            if (e.target.files && e.target.files[0]) {
              if (!e.target.files[0].type.startsWith('image')) {
                setErrors((prev: any) => (new Map().set('image', 'Invalid image')))
                return
              }
              if (+e.target.files[0].size > 5000 * 1000) {
                setErrors((prev: any) => (new Map().set('image', 'Only accept image less than 5MB')))
                return
              }
            }
            if (e.target.files && e.target.files[0]) {
              setSelectedFile(e.target.files[0])
              setImage(URL.createObjectURL(e.target.files[0]))
            }
            e.target.value = null
          }} id={'inputImg'} type="file" hidden />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }} >
            {
              image != null && image != uploadImage &&
              <Button
                onClick={() => {
                  setSelectedFile('delete')
                  setImage(uploadImage)
                }}
                variant='contained' color={'error'} > delete </Button>
            }

          </div>
          <Typography sx={{ fontSize: '16px', color: 'red', my: 1 }} >
            {
              errors?.has('image') && errors.get('image')
            }
          </Typography>
        </Box>

        <TextField
          label={'Name'}
          fullWidth
          sx={{ mt: 2 }}
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label={'Email'}
          fullWidth
          sx={{ mt: 2 }}
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button fullWidth sx={{ mt: 2 }} type={'submit'} variant={'contained'} > Update </Button>
      </form>


    </Container>
  )
}
