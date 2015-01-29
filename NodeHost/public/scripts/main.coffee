require.config(
  # baseUrl: 'scripts'
  wrap: false
  paths:
    socket_io: '/socket.io/socket.io'
    jquery: 'libraries/jquery-2.1.3'
)

require ["jquery", "image_drawing", "media_provider"], ($, Drawing, MediaProvider) ->
  $().ready ->
    drawingHorizontal = new Drawing($('#drawing'), roomNumber: 0, orientation: Drawing.ORIENTATION.HORIZONTAL, ImageSource: 'images/knicklichter.JPG')
    drawingVertical = new Drawing($('#drawing'), roomNumber: 0, orientation: Drawing.ORIENTATION.VERTICAL, ImageSource: 'images/kran.JPG')

    drawingHorizontal.StartAutomatedRendering(25)
    drawingVertical.StartAutomatedRendering(25)

#    MediaProvider.LoadImage('images/knicklichter.JPG', (img) -> console.dir img)
#    MediaProvider.LoadImage('knicklichter.JPG', -> alert(2))