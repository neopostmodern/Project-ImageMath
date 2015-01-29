define ['drawing'], (Drawing) ->
  class CanvasDrawing extends Drawing
    RandomInt: (lower, upper) ->
      Math.round(Math.random() * (upper - lower)) + lower

    _createDomElement: (properties) -> # width, height, offsetTop, offsetLeft
      canvas = document.createElement('canvas')

      canvas.width = properties.width
      canvas.height = properties.height

      # todo: @_setAbsolutePositionOnDomElement(canvas) -- cell??

      return canvas


    _drawDomElement: (canvas, cell) ->
      context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle =
        switch @RandomInt(0, 3)
          when 0 then 'green'
          when 1 then 'blue'
          when 2 then 'pink'
          else 'black'

      context.fillRect(
        @RandomInt(0, canvas.width / 2), @RandomInt(0, canvas.height / 2),
        @RandomInt(0, canvas.width / 2), @RandomInt(0, canvas.height / 2)
      )