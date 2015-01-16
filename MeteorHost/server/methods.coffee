Meteor.methods(
  'activate-position': (x, y, room) ->
    console.log "activate position @#{ x }/#{ y }"

    Positions.update(
      x: x
      y: y
      room: room
    ,
      $set: active: true
    )

  'deactivate-position': (x, y, room) ->
    console.log "deactivate position @#{ x }/#{ y }"
    Positions.update(
      x: x
      y: y
      room: room
    ,
      $set: active: false
    )

    return 'success'
)