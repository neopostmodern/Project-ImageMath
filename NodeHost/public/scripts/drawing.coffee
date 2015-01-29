define ["jquery", "settings", "grid"], ($, Settings, GridProvider) ->
  class Drawing
    constructor: (container, options) ->
      if not options.orientation?
        throw TypeError "Orientation parameter missing"
      if not options.roomNumber?
        throw TypeError "Room number parameter missing"

      @Orientation = options.orientation
      @RoomNumber = options.roomNumber
      @Container = container

      @DomElements = []

      GridProvider(@RoomNumber).onReady (grid) => @_createDomGrid(grid)

    _createDomGrid: (grid) ->
      for row in grid
        for cell in row
          domElement = @_createDomElement(
            width:
                  if @Orientation is Drawing.ORIENTATION.HORIZONTAL
                  then Settings.CANVAS_SIZE[0]
                  else Settings.SQUARE_SIZE[0]
            height:
                  if @Orientation is Drawing.ORIENTATION.VERTICAL
                  then Settings.CANVAS_SIZE[1]
                  else Settings.SQUARE_SIZE[1]
            offsetLeft:
                  if @Orientation is Drawing.ORIENTATION.VERTICAL
                  then cell.x * Settings.SQUARE_SIZE[0]
                  else 0
            offsetTop:
                  if @Orientation is Drawing.ORIENTATION.HORIZONTAL
                  then cell.y * Settings.SQUARE_SIZE[1]
                  else 0
          ,
            cell
          )

          domElement.classList.add('partial-drawing')

          @_setAbsolutePositionOnDomElement(domElement, cell) #todo: really?

          domElement._drawing =
            cellRoom: cell.room
            cellX: cell.x
            cellY: cell.y

          @Container.append(domElement)

          @DomElements.push(domElement)

    _createDomElement: (width, height, offsetTop, offsetLeft) ->
      throw new ReferenceError "Abstract method '_createDomElement' not implemented."

    _setAbsolutePositionOnDomElement: (domElement, cell) ->
      domElement.style.left =
        if @Orientation is Drawing.ORIENTATION.VERTICAL
        then cell.x * Settings.SQUARE_SIZE[0] + 'px'
        else 0
      domElement.style.top =
        if @Orientation is Drawing.ORIENTATION.HORIZONTAL
        then cell.y * Settings.SQUARE_SIZE[1] + 'px'
        else 0

    DrawFrame: ->
      grid = GridProvider(@RoomNumber).Grid
      @DomElements.forEach (domElement) =>
        @_drawDomElement(domElement, grid[domElement._drawing.cellX][domElement._drawing.cellY])


      if (new Date() - timestamp) > 1000 / 30
        console.warn 'slow frame'
      timestamp = new Date()

    _drawDomElement: (domElement, cell) ->
      throw new ReferenceError "Abstract method '_drawDomElement' not implemented."

    StartAutomatedRendering: (fps) ->
      frametime = 1000 / fps
      @_renderingProcessId = window.setInterval(=>
        timestamp = new Date()
        @DrawFrame()
        if (new Date() - timestamp) > frametime
          console.warn "Slow frame: #{ new Date() - timestamp } ms"
      , frametime)

    StopAutomatedRendering: ->
      window.clearInterval(@_renderingProcessId)

  Drawing.ORIENTATION =
    HORIZONTAL: 0
    VERTICAL: 1

  return Drawing