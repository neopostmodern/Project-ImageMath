express = require('express')
app = express()
socketIO = require('socket.io')
# router = express.Router()
http = require('http').Server(app)


SIZE = [10, 10]

rooms = {}

rooms[0] = (({ active: false, x: x, y: y, room: 0 } for y in [0 ... SIZE[0]]) for x in [0 ... SIZE[1]])

Broadcast = (->
  socket = null

  SendMessage = (title, data) ->
    console.log "Emmiting '#{title}' with " + JSON.stringify(data)
    io.emit title, data

  SendCellMessage = (status, room, x, y) ->
    SendMessage status,
      room: room
      x: x
      y: y


  class SocketBroadcastService
    constructor: ->
      io.on 'connection', (socket_io) =>
        socket = socket_io

    Activate: (room, x, y) -> SendCellMessage('activate', room, x, y)
    Deactivate: (room, x, y) -> SendCellMessage('deactivate', room, x, y)

  broadcast = null

  return ->
    if not broadcast?
      broadcast = new SocketBroadcastService()

    return broadcast
)()

app.get '/room/:roomNumber', (request, result) ->
  if not request.params?
    return result.status(400).send("No parameters passed")

  roomNumber = parseInt(request.params.roomNumber)

  if isNaN(roomNumber)
    return result.status(400).send("Invalid room number")

  if not rooms[roomNumber]?
    return result.status(400).send("Room not available")

  return result.status(200).send(JSON.stringify(rooms[roomNumber]))


Actions =
  activate:
    transformation: (cell) ->
      cell.active = true
      return cell
    broadcast: (cell) ->
      Broadcast().Activate(cell.room, cell.x, cell.y)
  deactivate:
    transformation: (cell) ->
      cell.active = false
      return cell
    broadcast: (cell) ->
      Broadcast().Deactivate(cell.room, cell.x, cell.y)

app.post '/:action/:room/:x/:y', (request, result) ->
  if not request.params?
    return result.send(400, "No parameters passed")

  if not Actions[request.params.action]?
    return result.send(404, "Action not available")

  action = Actions[request.params.action]

  roomNumber = parseInt(request.params.room)

  if isNaN(roomNumber)
    return result.send(400, "Invalid room number")

  if not rooms[roomNumber]?
    return result.send(404, "Room not available")

  x = parseInt(request.params.x)
  y = parseInt(request.params.y)

  if isNaN(x) or isNaN(y)
    return result.send(400, "Invalid coordinates")

  if x < 0 or x >= SIZE[0]
    return result.send(400, "Invalid coordinate: X out of bound")
  if y < 0 or y >= SIZE[1]
    return result.send(400, "Invalid coordinate: Y out of bound")

  oldStatus = rooms[roomNumber][x][y].active

  rooms[roomNumber][x][y] = action.transformation(rooms[roomNumber][x][y])

  if oldStatus != rooms[roomNumber][x][y].active
    action.broadcast rooms[roomNumber][x][y]

  return result.sendStatus(200)

app.use(express.static('public', extensions: ['.js', '.css', '.map']))

io = socketIO(http)

http.listen 4000, ->
  console.log('listening on *:4000')
