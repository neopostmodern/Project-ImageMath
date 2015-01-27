Meteor.startup ->
  Positions.remove({})

  if Positions.find().count() is 0
    for i in [0 ... 10]
      for j in [0 ... 10]
        Positions.insert(
          _id: "1:#{ i }/#{ j }"
          x: i
          y: j
          room: 1
          active: false
        )