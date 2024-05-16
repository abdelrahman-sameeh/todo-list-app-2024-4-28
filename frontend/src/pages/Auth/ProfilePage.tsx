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
  const [file, setFile] = useState<any>(null)
  const [errors, setErrors] = useState<Map<string, string>>(new Map())

  const { user, setUser }: any = useAuth()
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

    if (name == user.name && email == user.email && file == null) {
      return false
    }


    const formData = new FormData()

    if (name != user.name) {
      formData.append('name', name)
    }
    if (email != user.email) {
      formData.append('email', email)
    }
    if (image != user.profile_picture) {
      formData.append(
        'profile_picture',
        (file == 'delete' || file == null) && !image.startsWith('blob') ? '' : file
      )
    }

    const response = await AxiosHook(true, API_ENDPOINTS.getUpdateLoggedUser, 'PUT', formData, 'multipart/form-data')

    if (response.status == 200) {
      notify('updated successfully', 'success')
      setUser(response.data)
    } else {
      if (response?.data?.email[0]?.startsWith('user with this email already exists.')) {
        notify('this email already used', 'error')
      }
      else {
        notify('Something went wrong', 'error')
      }
    }

  }

  const handleChangeImage = (e: any) => {
    errors.has('image') && errors.delete('image')
    if (e.target.files && e.target.files[0]) {
      if (!e.target.files[0].type.startsWith('image')) {
        setErrors(new Map(errors).set('image', 'Invalid image'))
        return
      }
      if (e.target.files[0].size > 1000 * 5000) {
        setErrors(new Map(errors).set('image', 'Only accept image size less than 5MB'))
        return
      }
      setImage(URL.createObjectURL(e.target.files[0]))
      setFile(e.target.files[0])
    }
    e.target.value = ''
  }


  return (
    <Container sx={{ mt: '20px' }} >
      <form onSubmit={handleUpdate} >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <label htmlFor="inputImg">
            <img style={{ height: '200px', objectFit: 'contain', cursor: 'pointer' }} src={image ? image : uploadImage} alt="user image" />
          </label>
          <input onChange={handleChangeImage} id={'inputImg'} type="file" hidden />

          {
            image && image != uploadImage ?

              <Button
                onClick={() => {
                  setFile('delete')
                  setImage(uploadImage)
                }}
                variant='contained' color={'error'} >
                delete
              </Button>
              : null
          }
          <Typography sx={{ fontSize: '16px', color: 'red', my: 1 }} >
            {errors.has('image') && errors.get('image')}
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


    </Container >
  )
}
