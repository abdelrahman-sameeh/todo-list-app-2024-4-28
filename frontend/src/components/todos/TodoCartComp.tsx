import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button } from '@mui/material';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const todoStatus: any = {
  "P": 'Pending',
  "IP": 'In progress',
  'C': 'Completed'
}


export const todoPriority: any = {
  "L": 'Low',
  "M": 'Medium',
  'H': 'High'
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

type TodoCartPropsType = {
  todo: any,
  setTargetTodo: any,
  setCreateUpdateOpenDialog: any
  setMethod: any
  setDeleteOpenDialog: any
}

export function TodoCartComp({ todo, setTargetTodo, setCreateUpdateOpenDialog, setMethod, setDeleteOpenDialog }: TodoCartPropsType) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ width: '100%', mt: 3, paddingX: 1 }} >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
        <CardHeader
          title={todo.title}
        />
        <div>
          <Button onClick={() => {
            setTargetTodo(todo)
            setCreateUpdateOpenDialog(true)
            setMethod('update')
          }} variant='outlined' > Update </Button>
          <Button onClick={() => {
            setTargetTodo(todo)
            setDeleteOpenDialog(true)
          }} variant='outlined' color='error' sx={{ ml: 1 }} > Delete </Button>
        </div>
      </div>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {todoPriority[todo.priority]} | {todoStatus[todo.status]}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Description:</Typography>
          <Typography paragraph>
            {todo?.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
