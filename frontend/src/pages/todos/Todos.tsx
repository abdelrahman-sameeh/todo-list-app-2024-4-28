import { Pagination, Box, Button, Container, Grid, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useEffect, useState } from 'react';
import { TodoCartComp } from '../../components/todos/TodoCartComp';
import { AxiosHook } from '../../api/AxiosHook';
import { API_ENDPOINTS } from '../../api/EndPoints';
import { useDebounce } from '../../utils/debounce';
import { useNavigate } from 'react-router-dom';
import { CreateUpdateTodoDialog } from '../../components/todos/CreateUpdateTodoDialog';
import { DeleteTodoDialog } from '../../components/todos/DeleteTodoDialog';

const PAGE_COUNT = 10

export interface TodoInterface {
  description?: string;
  priority?: string;
  status?: string;
  title?: string;
  user?: any;
  uuid?: any;
}

export type todoStatusType = 'P' | 'IP' | 'C'



const getQueryString = (status: todoStatusType, page: number, search: string) => {
  let qs = '?'
  if (status) {
    qs += `status=${status}&`
  }
  if (page) {
    qs += `page=${page}&`
  }
  if (search) {
    qs += `search=${search}`
  }
  return qs
}

export const Todos = () => {
  const [status, setStatus] = useState<todoStatusType>('P');
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagesCount, setPagesCount] = useState<any>(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search);

  const [method, setMethod] = useState<"create" | 'update'>('create')
  const [targetTodo, setTargetTodo] = useState<TodoInterface>({})

  const [createUpdateOpenDialog, setCreateUpdateOpenDialog] = useState<boolean>(false)
  const [deleteOpenDialog, setDeleteOpenDialog] = useState<boolean>(false)


  const getTodos = async () => {
    setLoading(true)
    const response = await AxiosHook(true, API_ENDPOINTS.getTodos(getQueryString(status, page, debouncedSearch)), 'GET', {})
    if (response.status === 200) {
      setTodos(response?.data?.results)
      if (response?.data?.count) {
        setPagesCount(Math.ceil(+response?.data?.count / PAGE_COUNT));
      } else {
        setPagesCount(1);
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    getTodos()
  }, [status, page, debouncedSearch])


  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: todoStatusType,
  ) => {
    setPage(1)
    if (newValue) {
      setStatus(newValue);
    } else {
      setStatus(status)
    }
  };

  console.log(todos);
  


  return (
    <Container sx={{ mt: 2 }} >
      <Grid container >
        <Grid sx={{ mt: 2 }} item xs={12} md={6} >
          <ToggleButtonGroup
            color="primary"
            value={status}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="P">Pending</ToggleButton>
            <ToggleButton value="IP">In progress</ToggleButton>
            <ToggleButton value="C">Completed</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid sx={{ mt: 2 }} item xs={12} md={6} >
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            fullWidth
            label={'Search by todos title or description'}
            type={'search'}
          />
        </Grid>
      </Grid>


      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }} >
        <Typography variant='h5'  > Todos </Typography>
        <Button onClick={() => {
          setCreateUpdateOpenDialog(true)
          setMethod('create')
          setTargetTodo({})
        }} variant='contained' > Create New Todo </Button>
      </div>


      <Paper sx={{ paddingX: '15px', paddingTop: '10px', paddingBottom: '30px', mt: 2 }} >

        {
          loading
            ? <div style={{ display: 'flex', justifyContent: 'center' }} >
              <CircularProgress />
            </div>
            :
            todos?.map((todo: TodoInterface) =>
              <TodoCartComp
                setMethod={setMethod}
                setTargetTodo={setTargetTodo}
                setCreateUpdateOpenDialog={setCreateUpdateOpenDialog}
                key={todo?.uuid}
                todo={todo}
                setDeleteOpenDialog={setDeleteOpenDialog}
              />
            )
        }

      </Paper>

      {
        pagesCount > 1 &&
        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 3 }} >
          <Pagination onChange={(e: any, pageNumber: any) => {
            setPage(pageNumber)
          }} page={page} siblingCount={1} variant={'outlined'} count={pagesCount} shape="rounded" />
        </Box>
      }

      <CreateUpdateTodoDialog
        open={createUpdateOpenDialog}
        setCreateUpdateOpenDialog={setCreateUpdateOpenDialog}
        setTodos={setTodos}
        status={status}
        method={method}
        targetTodo={targetTodo}
        todos={todos}
        setTargetTodo={setTargetTodo}
        setMethod={setMethod}
      />

      <DeleteTodoDialog
        open={deleteOpenDialog}
        setDeleteOpenDialog={setDeleteOpenDialog}
        setTodos={setTodos}
        targetTodo={targetTodo}
        todos={todos}
        setTargetTodo={setTargetTodo}
      />

    </Container>
  )
}
