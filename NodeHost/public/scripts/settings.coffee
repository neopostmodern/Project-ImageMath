define ->
  settings = {
    CANVAS_SIZE: [800, 800]
    GRID_SIZE: [10, 10]
  }

  settings.SQUARE_SIZE = [
    settings.CANVAS_SIZE[0] / settings.GRID_SIZE[0],
    settings.CANVAS_SIZE[1] / settings.GRID_SIZE[1]
  ]

  return settings