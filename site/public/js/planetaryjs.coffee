projection = d3.geo.orthographic()
  .scale(175)
  .translate([175, 175])
  .clipAngle(90)
  .precision(0)

zoom = d3.behavior.zoom()
  .scale(projection.scale())
  .scaleExtent([50, 500])
  .on 'zoom', ->
    projection.scale(d3.event.scale)

canvas = d3.select('.homepage-globe-canvas').selectAll('canvas')
  .data(d3.range(1))
  .enter().append('canvas')
  .attr('width', 350)
  .attr('height', 350)
  .call (canvas) ->
    if window.devicePixelRatio == 2
      canvas[0][0].width = 700
      canvas[0][0].height = 700
      context = canvas[0][0].getContext('2d')
      context.scale(2, 2)

path = d3.geo.path()
  .projection(projection)

pings = []
addPing = (pos) ->
  pings.push { pos: pos, time: Date.now() }

setInterval (->
  lat = Math.random() * 180 - 90
  lng = Math.random() * 360 - 180

  addPing([lat, lng])
), 300

d3.json "world-110m.json", (error, world) ->
  land = topojson.feature(world, world.objects.land)
  borders = topojson.mesh world, world.objects.countries, (a, b) ->
    a.id != b.id
  globe = type: "Sphere"

  lastRotation = Date.now()
  rotate = [0, -5, 0]

  velocity = -0.50
  d3.timer ->
    canvas.each (i) ->
      now = Date.now()
      difference = now - lastRotation
      lastRotation = now
      rotate[i] -= velocity * difference / 100
      context = @getContext('2d')
      projection.rotate(rotate)

      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      context.beginPath()
      path(globe)
      context.fillStyle = '#000080'
      context.fill()

      context.beginPath()
      context.fillStyle = '#339966'
      path.context(context)(land)
      context.fill()

      context.strokeStyle = '#008000'
      context.beginPath()
      path.context(context)(borders)
      context.stroke()

      context.strokeStyle = '#fff'
      context.lineWidth = 2
      currentTime = Date.now()
      for ping in pings
        difference = (currentTime - ping.time) # milliseconds
        alpha = 1 - (difference / 2000)
        context.strokeStyle = "rgba(255,255,255,#{alpha})"
        circle = d3.geo.circle().origin(ping.pos).angle(difference / 500)()
        context.beginPath()
        path.context(context)(circle)
        context.stroke()
      pings = (ping for ping in pings when currentTime - ping.time <= 2000)
    null
