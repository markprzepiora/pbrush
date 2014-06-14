Painter = (canvas) ->
  context = canvas.getContext("2d")

  clear = ->
    context.fillStyle = "rgb(0, 0, 0)"
    context.fillRect(0, 0, canvas.width, canvas.height)

  draw = ([start, end]) ->
    context.beginPath()
    context.lineWidth = 2
    context.strokeStyle = "rgb(255, 255, 255)"
    context.moveTo(start...)
    context.lineTo(end...)
    context.stroke()

  { clear, draw }

MyLines = (canvas) ->
  toCoords   = (e) -> [e.clientX - 7, e.clientY - 52]
  mouseDown  = $(canvas).asEventStream("mousedown").doAction(".preventDefault")
  mouseUp    = $(document).asEventStream("mouseup").doAction(".preventDefault")
  mouseMoves = $(document).asEventStream("mousemove").throttle(8).map(toCoords)

  mouseDown.flatMap ->
    mouseMoves.slidingWindow(2,2).takeUntil(mouseUp)

PaintBrushController = ($container) ->
  canvas      = $container.find('canvas').get(0)
  painter     = Painter(canvas)
  myLines     = MyLines(canvas)
  paintSocket = PaintSocket(myLines)
  remoteLines = paintSocket.remoteLines
  lines       = myLines.merge(remoteLines)

  painter.clear()
  lines.assign(painter.draw)

PaintSocket = (myLines) ->
  fromSocketEventTarget = (socket, event) ->
    Bacon.fromBinder (handler) ->
      socket.on(event, handler)
      -> socket.off(event, handler)

  myFrames     = myLines.bufferWithTime(32)
  socket       = io('/')
  remoteFrames = fromSocketEventTarget(socket, 'buffer-from-server')
  remoteLines  = remoteFrames.flatMap(Bacon.fromArray)

  myFrames.assign(socket, 'emit', 'buffer-from-client')

  { remoteLines }

controller = PaintBrushController($('#canvas-container'))
