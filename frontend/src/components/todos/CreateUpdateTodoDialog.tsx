import { Select, MenuItem, Dialog, DialogActions, TextField, DialogContent, DialogTitle, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { AxiosHook } from '../../api/AxiosHook';
import { API_ENDPOINTS } from '../../api/EndPoints';
import { notify } from '../utils/Notify';
import { TodoInterface, todoStatusType } from '../../pages/todos/Todos';


type createUpdateTodoPropsTypes = {
  open: boolean;
  setCreateUpdateOpenDialog: any;
  setTodos: any;
  status: todoStatusType;
  method: "create" | 'update';
  targetTodo: TodoInterface;
  todos: TodoInterface[]
  setTargetTodo: any
  setMethod: any
}


const validation = (title: string, description: string, setErrors: any) => {

  const newErrors = new Map()

  if (!title) {
    newErrors.set('title', 'Title is required')
  }

  if (!description) {
    newErrors.set('description', 'Description is required')
  }

  if (description && description.length < 3) {
    newErrors.set('description', 'Too short description')
  }

  if (newErrors.size) {
    setErrors(newErrors)
    return false
  }

  return true
}



export const CreateUpdateTodoDialog = ({ open, setCreateUpdateOpenDialog, status, setTodos, method, targetTodo, todos, setTargetTodo, setMethod }: createUpdateTodoPropsTypes) => {

  const [title, setTitle] = useState<any>('')
  const [description, setDescription] = useState<any>('')
  const [priority, setPriority] = useState<any>('H')
  const [todoStatus, setTodoStatus] = useState<any>('P')
  const [errors, setErrors] = useState<Map<string, string>>(new Map())


  useEffect(() => {
    if (targetTodo && targetTodo?.uuid) {
      setTitle(targetTodo?.title)
      setDescription(targetTodo?.description)
      setPriority(targetTodo.priority)
      setTodoStatus(targetTodo?.status)
    } else {
      setTitle('')
      setDescription('')
      setPriority('H')
    }

  }, [targetTodo])


  const handleCreate = async () => {
    if (validation(title, description, setErrors) == false) {
      return false
    }

    const data = {
      title,
      description,
      priority
    }

    const response = await AxiosHook(true, API_ENDPOINTS.createTodo, 'POST', data)
    if (response.status == 201) {
      notify('Todo created successfully', 'success')
      setTitle('')
      setDescription('')
      setPriority('H')
      setCreateUpdateOpenDialog(false)
      if (status == 'P') {
        setTodos((prev: any) => ([response.data, ...prev]))
      }
    } else {
      notify('Something went wrong', 'error')
    }


  }


  const handleUpdate = async () => {
    if (validation(title, description, setErrors) == false) {
      return false
    }

    const data = {
      title,
      description,
      priority,
      status: todoStatus,
    }

    const response = await AxiosHook(true, API_ENDPOINTS.updateDeleteTodo(targetTodo?.uuid), 'PUT', data)
    const updatedTodos = todos.map(todo => {
      if (todo.uuid === targetTodo?.uuid && status === data.status) {
        return { ...data, uuid: targetTodo.uuid };
      }
      return todo;
    });


    setTodos(updatedTodos)
    notify('Updated successfully', 'success')

    if (response.status == 200) {
      setTargetTodo({})
      setMethod('create')
      setCreateUpdateOpenDialog(false)
    } else {
      notify('Something went wrong', 'error')
    }

  }

  return (
    <Dialog open={open} onClose={() => {
      setCreateUpdateOpenDialog(false)
      setTargetTodo({})
    }} >
      <DialogTitle> {method == 'create' ? 'Create New' : 'Update'} Todo </DialogTitle>
      <DialogContent>
        <TextField
          error={errors.has('title')}
          helperText={errors.get('title')}
          fullWidth
          sx={{ mb: 1 }}
          label={'Title'}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          error={errors.has('description')}
          helperText={errors.get('description')}
          fullWidth
          sx={{ mb: 1 }}
          label={'Description'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />

        <Select fullWidth value={priority} onChange={(e) => setPriority(e.target.value)} >
          <MenuItem value={'H'}> High </MenuItem>
          <MenuItem value={'M'}> Medium </MenuItem>
          <MenuItem value={'L'}> Low </MenuItem>
        </Select>

        {
          method == 'update' &&
          <Select sx={{ mt: 1 }} fullWidth value={todoStatus} onChange={(e) => setTodoStatus(e.target.value)} >
            <MenuItem value={'P'}> Pending </MenuItem>
            <MenuItem value={'IP'}> In progress </MenuItem>
            <MenuItem value={'C'}> Completed </MenuItem>
          </Select>
        }

      </DialogContent>


      <DialogActions>
        <Button onClick={() => {
          setCreateUpdateOpenDialog(false)
          setTargetTodo({})
        }} > Close </Button>
        <Button onClick={method == 'create' ? handleCreate : handleUpdate} variant={'contained'} > {method == 'create' ? 'Create' : 'Update'}  </Button>
      </DialogActions>
    </Dialog>
  )
}