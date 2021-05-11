const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username)

  if(!user) {
    return response.status(404).json({error: "User not found"})
}

request.user = user;

return next()
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;
  const id = uuidv4();

  const UserAlreadyExists = users.some((user) => user.username === username)

  if(UserAlreadyExists) {
    return response.status(400).json({error: "User already exists!"})
  }

  const user = {
    name,
    username,
    id,
    todos: []
  }

  users.push(user)

  return response.status(201).send(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  
    const {user} = request;
    return response.json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const {title, deadline} = request.body;
  const {user} = request;
  
  
  const todo = {
    title,
    deadline: new Date(deadline),
    done: false,
    id: uuidv4(),
    created_at: new Date()
  }

  user.todos.push(todo)
  return response.status(201).send(todo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { title, deadline } = request.body;
    const { user } = request;
    const { id } = request.params;

    const todoMustBeChanged = user.todos.find(todo => todo.id === id)

    if(!todoMustBeChanged) { 
      return response.status(404).json({error: "Todo Not Found"})
    }

    todoMustBeChanged.title = title;
    todoMustBeChanged.deadline = new Date(deadline);

    return response.json(todoMustBeChanged)


});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
    const { user } = request;
    const { id } = request.params;

    const todoMustBeChanged = user.todos.find(todo => todo.id === id)

    if(!todoMustBeChanged) { 
      return response.status(404).json({error: "Todo Not Found"})
    }

    todoMustBeChanged.done = true;

    return response.status(201).json(todoMustBeChanged)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { user } = request;
    const { id } = request.params;

    const todoMustBeDeleted = user.todos.find(todo => todo.id === id)

    if(!todoMustBeDeleted) { 
      return response.status(404).json({error: "Todo Not Found"})
    }

    user.todos.splice(todoMustBeDeleted, 1)

    return response.status(204).send()
});

module.exports = app;