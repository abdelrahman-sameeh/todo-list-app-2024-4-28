import { Select, MenuItem, Dialog, DialogActions, TextField, DialogContent, DialogTitle, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { AxiosHook } from '../../api/AxiosHook';
import { API_ENDPOINTS } from '../../api/EndPoints';
import { notify } from '../utils/Notify';
import { TodoInterface, todoStatusType } from '../../pages/todos/Todos';




type deleteTodoPropsTypes = {
  open: boolean;
  setDeleteOpenDialog: any;
  setTodos: any;
  targetTodo: TodoInterface;
  todos: TodoInterface[]
  setTargetTodo: any
}



export const DeleteTodoDialog = ({ open, setDeleteOpenDialog, setTodos, targetTodo, todos, setTargetTodo }: deleteTodoPropsTypes) => {

  const handleDelete = async () => {
    const response = await AxiosHook(true, API_ENDPOINTS.updateDeleteTodo(targetTodo?.uuid), 'DELETE', {})
    if (response.status == 204) {
      setDeleteOpenDialog(false)
      const updatedTodos = todos.filter(todo => todo.uuid != targetTodo?.uuid)
      setTodos(updatedTodos)
      setTargetTodo({})
      notify('Deleted successfully', 'success')
    } else {
      notify('Something went wrong', 'error')
    }
  }


  return (
    <Dialog open={open} onClose={() => {
      setDeleteOpenDialog(false)
      setTargetTodo({})
    }} >
      <DialogTitle> Delete Todo </DialogTitle>
      <DialogContent>
        <Typography > Are you sure to delete this item! </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => {
          setDeleteOpenDialog(false)
          setTargetTodo({})
        }} > Close </Button>
        <Button color={'error'} onClick={handleDelete} variant={'contained'} > Delete </Button>
      </DialogActions>
    </Dialog>
  )
}