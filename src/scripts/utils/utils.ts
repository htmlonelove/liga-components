let context: CanvasRenderingContext2D

function getContext(): CanvasRenderingContext2D {
  if (context) {
    return context
  }

  const fragment = document.createDocumentFragment()
  const canvas = document.createElement('canvas')
  fragment.appendChild(canvas)
  context = canvas.getContext('2d')
  return context
}

export { getContext }
