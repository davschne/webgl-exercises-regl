export async function fetchShaderSource(filename) {
  const response = await fetch(filename);
  return response.text();
}

export function fetchImage(filename) {
  return fetch(filename).then(response => {
    return response.blob();
  }).then(blob => {
    const image = new Image();
    // URL.createObjectURL doesn't accept a Promise, so unfortunately `await` won't work here.
    image.src = URL.createObjectURL(blob);
    // We have to wait for the image to load.
    return new Promise((resolve, reject) => {
      image.addEventListener('load', () => resolve(image));
    });
  });
}

export function createFullScreenCanvas(container = document.body) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    border: 0,
    margin: 0,
    padding: 0,
    top: 0,
    left: 0,
  });
  container.appendChild(canvas)

  if (container === document.body) {
    canvas.style.position = 'absolute'
    Object.assign(container.style, {
      margin: 0,
      padding: 0,
      overflow: 'hidden',
    });
  }

  function resize() {
    let w, h;
    if (container === document.body) {
      [w, h] = [window.innerWidth, window.innerHeight];
    } else {
      const bounds = container.getBoundingClientRect();
      [w, h] = [bounds.right - bounds.left, bounds.bottom - bounds.top];
    }
    canvas.width = w;
    canvas.height = h;
    canvas.style = Object.assign(canvas.style, {
      width: `${w} px`,
      height: `${h} px`,
    });
  }

  resize();
  window.addEventListener('resize', resize);

  return canvas;
}

export function getMouseWebGLCoordinates(mouseEvent, canvas) {
  const {
    clientX,
    clientY,
    target,
  } = mouseEvent;
  const {
    width,
    height,
  } = canvas;

  const {
    left,
    right,
    top,
  } = target.getBoundingClientRect();

  const x = 2 * ((clientX - left) - width * 0.5) / width;
  const y = 2 * (height * 0.5 - (clientY - top)) / height;
  return [x, y];
}
