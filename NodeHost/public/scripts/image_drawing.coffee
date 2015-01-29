define ['drawing', 'settings', 'media_provider'], (Drawing, Settings, MediaProvider) ->
  class ImageDrawing extends Drawing
    constructor: (container, options) ->
      if not options.ImageSource?
        throw TypeError "Image source parameter missing"

      @ImageSource = options.ImageSource
#      MediaProvider.LoadImage(
#        @ImageSource,
#        (image) =>
#          @Image = image
#      )

      super(container, options)


#    _createDomElement: (properties) -> # width, height, offsetTop, offsetLeft
#      image = document.createElement('img')
#
#      image.src = @ImageSource
#
#      #      image.style.height = properties.height + "px"
#      #      image.style.width = properties.width + "px"
#      image.style.webkitClipPath = "polygon(" +
#        "#{ properties.offsetLeft }px #{ properties.offsetTop }px, " +
#        "#{ properties.offsetLeft }px #{properties.offsetTop + properties.height}px, " +
#        "#{ properties.offsetLeft + properties.width }px #{properties.offsetTop + properties.height}px, " +
#        "#{ properties.offsetLeft + properties.width }px #{ properties.offsetTop }px)"
#      # image.style.webkitClipPath = "inset(#{ properties.offsetTop }px #{ properties.offsetLeft }px #{properties.offsetTop + properties.height}px #{ properties.offsetLeft + properties.width }px)"
#
#      return image

    _createDomElement: (properties, cell) -> # width, height, offsetTop, offsetLeft
      image = document.createElement('div')

      image.style.backgroundImage = "url(#{ @ImageSource })"

      image.style.backgroundSize = "cover"
      if @Orientation is Drawing.ORIENTATION.HORIZONTAL
        image.style.backgroundPositionY = cell.x * 10 + "%"
      if @Orientation is Drawing.ORIENTATION.VERTICAL
        image.style.backgroundPositionX = cell.y * 10 + "%"

      image.style.height = properties.height + "px"
      image.style.width = properties.width + "px"

      return image

    _drawDomElement: (image, cell) ->
      if cell.active
        image.style.display = 'block'
      else
        image.style.display = 'none'
      return