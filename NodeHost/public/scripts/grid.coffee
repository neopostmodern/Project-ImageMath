define ["jquery", "socket_io"], ($, io) ->
  messages = "updates from server<br/><br/>"
  Messaging = (message) ->
    messages += message + "<br/>"
    # document.getElementById("messages").innerHTML = messages



  class GridProvider
    constructor: (roomNumber) ->
      @Grid = null
      @RoomNumber = roomNumber

      @_ready = false
      @_readyFunctions = []

      @Socket = io()

      $.get "/room/#{ @RoomNumber }", (data) =>
        @Grid = JSON.parse(data)

        @_markReady()

        @Socket.on "activate", (cell) =>
          if cell.room is @RoomNumber
            Messaging "<b>Activation</b> " + JSON.stringify(cell)
            @Grid[cell.x][cell.y].active = true #todo: which properties?

        @Socket.on "deactivate", (cell) =>
          if cell.room is @RoomNumber
            Messaging "<b>Deactivation</b> " + JSON.stringify(cell)
            @Grid[cell.x][cell.y].active = false

    _markReady: ->
      @_ready = true
      for fx in @_readyFunctions
        fx(@Grid)
      return

    onReady: (fx) ->
      if @_ready
        fx()
      else
        @_readyFunctions.push(fx)

  _gridProvider = {}

  GetInstance = (roomNumber) ->
    if not _gridProvider[roomNumber]?
      _gridProvider[roomNumber] = new GridProvider(roomNumber)

    return _gridProvider[roomNumber]


  return GetInstance