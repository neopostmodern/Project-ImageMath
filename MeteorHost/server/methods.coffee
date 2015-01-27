Meteor.methods(
  'activate-position': (room, x, y) ->
    console.log "activate position [#{ room }] @#{ x }/#{ y }"


    Positions.update(
      "#{ room }:#{ x }/#{ y }"
    ,
      $set: active: true
    )

    return 'OK'

#    Positions.update(
#      x: x
#      y: y
#      room: room
#    ,
#      $set: active: true
#    )

  'deactivate-position': (room, x, y) ->
    console.log "deactivate position [#{ room }] @#{ x }/#{ y }"
    Positions.update(
      x: x
      y: y
      room: room
    ,
      $set: active: false
    )

    return 'OK'
)