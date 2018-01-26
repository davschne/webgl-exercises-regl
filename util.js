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
