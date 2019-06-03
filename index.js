const express = require('express')
const socketIo = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const sequelize = require('./db')
const app = express()
app.use(cors())
app.use(bodyParser.json())

function dispatchMessages () {
  const action = {
    type: 'MESSAGES',
    payload: messages
  }
  io.emit('action', action)
}

app.post('/message', (req, res, next) => {
  Message
    .create(req.body)
    .then(message => messages.push(message.message))
    .then(dispatchMessages)
    .then(message => {
      return res.status(201).send(message)
    })
    .catch(error => {
      console.log(error)
      next(error)
    })  
})

app.get('/message', (req, res, next) => { 
  Message.findAll()
  .then(message => {
    res.send({ message: message })
  })
  .catch(error => next(error))
}) 

function onListen () {
  console.log('Listening on port 4000')
}

const server = app.listen(4000, onListen)
const io = socketIo.listen(server)
const messages = []

io.on(
  'connection',
  client => {
    console.log('client.id test:', client.id)
    dispatchMessages()
    client.on(
      'disconnect',
      () => console.log('disconnect test:', client.id)
    )
  }
)

const Message = sequelize.define(
  'messages', {
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  }
)

const User = sequelize.define(
  'users', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }
)

Message.belongsTo(User)
