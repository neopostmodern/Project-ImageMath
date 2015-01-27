UI.registerHelper 'positions', -> Positions.find()

GenerateEmptyGrid = (size) -> ({ cells: (active: false for y in [0 ... size]) } for x in [0 ... size])

Grids = new ReactiveDict()

ApplyPositionToGrid = (position) ->
  log = Session.get "log"
  message = "Setting [#{ position.room }] #{ position.x }/#{ position.y} to #{ if position.active then 'ACTIVE' else 'deactivated' }."
  log = "<small>#{ new Date().getHours() }:#{ new Date().getMinutes() }:#{ new Date().getSeconds() }</small> " + message + "<br/>" + log
  console.log message
  Session.set "log", log

  grid = Grids.get(position.room) ? GenerateEmptyGrid(10)

  grid[position.x].cells[position.y].active = position.active

  Grids.set position.room, grid

Positions.find().observe(
  added: ApplyPositionToGrid
  changed: ApplyPositionToGrid
)

UI.registerHelper 'grid', (room) ->
  return Grids.get room

Meteor.startup ->
  Session.set ""

UI.registerHelper 'log', -> Session.get "log"
