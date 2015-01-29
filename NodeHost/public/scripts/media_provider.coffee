define ->
  class MediaProvider
    constructor: ->
      @Images = {}
    LoadImage: (imagePath, callback) ->
      if @Images[imagePath]?
        callback(@Images[imagePath])

      image = new Image()
      image.src = imagePath

      image.addEventListener 'load', =>
        @Images[imagePath] = image
        callback(image)

  _mediaProvider = null

  GetInstance = ->
    if not _mediaProvider?
      _mediaProvider = new MediaProvider()

    return _mediaProvider


  return GetInstance()