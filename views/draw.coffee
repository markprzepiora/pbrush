canvas = document.getElementById("canvas")
g      = canvas.getContext("2d")

g.fillStyle = "rgb(0, 0, 0)"
g.fillRect(0, 0, canvas.width, canvas.height)

toCoords = (e) -> [e.clientX - 7, e.clientY - 52]

add = (a,b) -> a+b

draw = ([start, end]) ->
  g.beginPath()
  g.lineWidth = 2
  g.strokeStyle = "rgb(255, 255, 255)"
  g.moveTo(start...)
  g.lineTo(end...)
  g.stroke()

mouseDown  = $(canvas).asEventStream("mousedown").doAction(".preventDefault")
mouseUp    = $(document).asEventStream("mouseup").doAction(".preventDefault")
mouseMoves = $(document).asEventStream("mousemove").throttle(16).map(toCoords)

myLines = mouseDown.flatMap ->
  mouseMoves.slidingWindow(2,2).takeUntil(mouseUp)

myLines.map(1).scan(0, add).throttle(32)
  .assign($('.js-lines-count'), 'text')

# Creates buffers of lines... these are for example something we can
# give an ID and send across the wire.
myFrames = myLines.bufferWithTime(100)

myFrames.map(1).scan(0, add).throttle(32)
  .assign($('.js-buffers-count'), 'text')

myFramesJSON = myFrames.map(JSON.stringify)

myFramesJSON.assign($('.js-buffer'), 'text')
myFramesJSON.map('.length').scan(0, add).assign($('.js-bytes'), 'text')

# The resulting lines stream.
lines = myFrames.flatMap(Bacon.fromArray)

myLines.assign(draw)
