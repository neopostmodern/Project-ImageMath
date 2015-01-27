CANVAS_SIZE = [800, 800]
GRID_SIZE = [10, 10]
SQUARE_SIZE = [CANVAS_SIZE[0] / GRID_SIZE[0], CANVAS_SIZE[1] / GRID_SIZE[1]]

$().ready ->
  $.get "/room/0", (data) ->
    grid = JSON.parse(data)
    drawing = $('#drawing')
    for row in grid
      for cell in row
        canvas = document.createElement('canvas')
        canvas.width = SQUARE_SIZE[0]
        canvas.height = CANVAS_SIZE[1]
        canvas.id = "canvas_#{ cell.x }_#{ cell.y }"
        canvas.style.left = cell.x * SQUARE_SIZE[0] + 'px'
        canvas.style.top = 0
        drawing.append(canvas)

    randomInt = (lower, upper) ->
      Math.round(Math.random() * (upper - lower)) + lower

    timestamp = new Date()

    window.setInterval(->
      $('canvas').each (index, element) ->
        context = element.getContext('2d')
        context.clearRect(0, 0, SQUARE_SIZE[0], CANVAS_SIZE[1])
        context.fillStyle =
          switch randomInt(0, 3)
            when 0 then 'green'
            when 1 then 'blue'
            when 2 then 'pink'
            else 'black'

        context.fillRect(
          randomInt(0, SQUARE_SIZE[0] / 2), randomInt(0,  CANVAS_SIZE[1] / 2),
          randomInt(0, SQUARE_SIZE[0] / 2), randomInt(0,  CANVAS_SIZE[1] / 2)
          # randomInt(SQUARE_SIZE[0] / 2,  SQUARE_SIZE[0]), randomInt(SQUARE_SIZE[1] / 2,  SQUARE_SIZE[1])
        )

        console.log new Date() - timestamp
        timestamp = new Date()

    , 1000 / 30)

    socket = io()
    messages = "updates from server<br/><br/>"
    Messaging = (message) ->
      messages += message + "<br/>"
      document.getElementById("messages").innerHTML = messages

    socket.on "activate", (cell) ->
      Messaging "<b>Activation</b> " + JSON.stringify(cell)
      grid[cell.room][cell.x][cell.y] = cell

    socket.on "deactivate", (cell) ->
      Messaging "<b>Deactivation</b> " + JSON.stringify(cell)
      grid[cell.room][cell.x][cell.y] = cell