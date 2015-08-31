CANVAS_SIZE = 400

class ImageShifter
  constructor: (resolution, gridSize, defaultTargetCanvas, operator) ->
    @Resolution = resolution
    @GridSize = gridSize
    @DefaultTargetCanvas = defaultTargetCanvas
    @Operator = operator ? "multiplication"
    
    @Matrix = []
    
    for xPosition in [0 ... gridSize]
      @Matrix.push []
      for yPosition in [0 ... gridSize]
        @Matrix[xPosition].push active: if xPosition == yPosition then true else false # inititalize as identity matrix

  SetImage: (image) ->
    @Image = image
    @DrawShift()
          
  CreateInputGrid: (gridElement) ->      
    for row, xPosition in @Matrix
      for element, yPosition in row
        # console.log "Add cell #{ xPosition } / #{ yPosition } with " + element

        gridSquare = document.createElement 'div'
        gridSquare.setAttribute 'class', "grid-square"
        gridSquare.setAttribute 'id', xPosition * @GridSize + yPosition
        gridSquare.setAttribute 'data-x-position', xPosition
        gridSquare.setAttribute 'data-y-position', yPosition
        
        if element.active 
          gridSquare.classList.add('active')

        gridSquare.onclick = ((imageShifter) -> 
          ->
            x = @getAttribute('data-x-position')
            y = @getAttribute('data-y-position')
            # console.log "Clicked cell #{ x } / #{ y }"
            imageShifter.Matrix[x][y].active = not imageShifter.Matrix[x][y].active
            this.classList.toggle('active')
            
            imageShifter.DrawShift()
        )(this)

        gridElement.appendChild gridSquare

    return
    
  DrawShift: (targetCanvas) ->
    canvas = targetCanvas ? @DefaultTargetCanvas
    context = canvas.getContext "2d"
    context.globalCompositeOperation = 'lighter'

    context.clearRect 0, 0, @Resolution, @Resolution

    sourceSquareSize = @Image.naturalHeight / @GridSize
    targetSquareSize = @Resolution / @GridSize
    
    for x in [0 ... @GridSize]
      for y in [0 ... @GridSize]
        if @Operator is "multiplication"
          for index in [0 ... @GridSize]
            if @Matrix[x][index].active
              context.drawImage(
                @Image,
                index * sourceSquareSize, y * sourceSquareSize,
                sourceSquareSize, sourceSquareSize,
                x * targetSquareSize, y * targetSquareSize,
                targetSquareSize, targetSquareSize
              )
        else if @Operator is "left-multiplication"
          for index in [0 ... @GridSize]
            if @Matrix[index][y].active
              context.drawImage(
                @Image,
                x * sourceSquareSize, index * sourceSquareSize,
                sourceSquareSize, sourceSquareSize,
                x * targetSquareSize, y * targetSquareSize,
                targetSquareSize, targetSquareSize
              )
        else
          throw "Undefined operator"

    return

ExtractUrlParameter = (parameterName) ->
  parameterName = parameterName.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]")
  regExString = "[\\?&]" + parameterName + "=([^&#]*)"
  regEx = new RegExp regExString
  results = regEx.exec window.location.href
  return results?[1]

window.onload = ->
  LoadImage = (source, sourceSelector, shifter) ->
    imagePath = "Images/#{ sourceSelector.value }.JPG"

    image = new Image()
    image.src = imagePath

    source.setAttribute 'src', imagePath

    image.addEventListener 'load', ->
      shifter.SetImage image

  gridSize = ExtractUrlParameter('grid') ? 10
  css = document.createElement 'style'
  css.type = 'text/css'
  css.innerHTML = ".grid-square { width: #{ 400 / gridSize }; height: #{ 400 / gridSize }; }"
  document.body.appendChild(css)

  # first

  source1 = document.getElementById 'source-1'
  source1Selector = document.getElementById 'source-1-selector'
  grid1 = document.getElementById 'grid-1'
  canvas1 = document.getElementById 'canvas-1'
  canvas1ColorSelector = document.getElementById 'canvas-1-color-selector'


  shifter1 = new ImageShifter(400, gridSize, canvas1)
  shifter1.CreateInputGrid(grid1)

  LoadImage(source1, source1Selector, shifter1)
  source1Selector.onchange = ->
    LoadImage(source1, source1Selector, shifter1)

  canvas1ColorSelector.onchange = ->
    canvas1.style.backgroundColor = canvas1ColorSelector.value

  # second

  source2 = document.getElementById 'source-2'
  source2Selector = document.getElementById 'source-2-selector'
  grid2 = document.getElementById 'grid-2'
  canvas2 = document.getElementById 'canvas-2'
  canvas2ColorSelector = document.getElementById 'canvas-2-color-selector'


  shifter2 = new ImageShifter(CANVAS_SIZE, gridSize, canvas2, 'left-multiplication')
  shifter2.CreateInputGrid(grid2)

  LoadImage(source2, source2Selector, shifter2)
  source2Selector.onchange = ->
    LoadImage(source2, source2Selector, shifter2)

  canvas2ColorSelector.onchange = ->
    canvas2.style.backgroundColor = canvas2ColorSelector.value

  # addition

  additionCanvas = document.getElementById 'canvas-addition'
  additionCanvasColorSelector = document.getElementById 'canvas-addition-color-selector'

  DrawAddition = ->
    context = additionCanvas.getContext '2d'
    context.globalCompositeOperation = 'lighter'
    context.clearRect 0, 0, CANVAS_SIZE, CANVAS_SIZE
    context.drawImage canvas1, 0, 0, CANVAS_SIZE, CANVAS_SIZE
    context.drawImage canvas2, 0, 0, CANVAS_SIZE, CANVAS_SIZE

  document.getElementsByTagName('body')[0].onclick = ->
    window.setTimeout DrawAddition, 100

  window.setTimeout DrawAddition, 100
  window.setTimeout DrawAddition, 1000
  window.setTimeout DrawAddition, 5000

  additionCanvasColorSelector.onchange = ->
    additionCanvas.style.backgroundColor = additionCanvasColorSelector.value
