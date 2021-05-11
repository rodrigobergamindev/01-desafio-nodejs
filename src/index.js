const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(customer => customer.username === username)

  if(!user) {
    return response.status(400).json({error: "User not found"})
}

request.customer = user;

return next()
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;
  const id = uuidv4();

  const UserAlreadyExists = users.some((user) => user.username === username)

  if(UserAlreadyExists) {
    return response.status(400).json({error: "User already exists!"})
  }

  users.push({
    name,
    username,
    id,
    todos: []
  })

  return response.status(201).send("User Created")

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  
    const {user} = request;
    return response.status(201).json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const {title, deadline} = request.body;
  const {user} = request;

  const dateFormat = new Date(deadline + " 00:00")
  
  const todo = {
    title,
    deadline: new Date(dateFormat).toDateString(),
    done: false,
    id: uuidv4(),
    created_at: new Date().toDateString()
  }

  users.todos.push(todo)
  return response.status(201).send()

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { title, deadline } = request.body;
    const { user } = request;

    //Realizar alteração no title e deadline do todo cujo ID está nos parâmetros da rota

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;