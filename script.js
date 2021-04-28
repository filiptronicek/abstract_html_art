const canvas = document.querySelector("#drawingBoard");

canvas.height = document.body.scrollHeight;
canvas.width = document.body.scrollWidth;

const width = canvas.width; // 500
const height = canvas.height; // 300

function download(url,name){
// make the link. set the href and download. emulate dom click
  const link = document.querySelector('a');
  link.setAttribute("href", url);
  link.setAttribute("download", name)
  link.click();
}

const getNextPosition = (width, height) => {
  const randomX = Math.floor(Math.random() * width);
  const randomY = Math.floor(Math.random() * height);
  return [randomX, randomY];
};

const getNextSize = () => {
  return Math.floor(Math.random() * 50);
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

window.filled = 0;

const drawLoop = setInterval(() => {
  if (!canvas.getContext) {
    return;
  }

  // get the context
  const ctx = canvas.getContext("2d");

  const nextPos = getNextPosition(width, height);
  const rect = canvas.getBoundingClientRect();
  const size = getNextSize();
  
  ctx.fillStyle = getRandomColor();
  ctx.beginPath();
  ctx.arc(nextPos[0], nextPos[1], size, 0, 2 * Math.PI);
  ctx.fill();
  
  window.filled += size * size;
  
  const filledPercent = window.filled/(width * height);
  console.log(`${Math.round(100*filledPercent)}% filled`);
  if (filledPercent > 1.5) {
    clearInterval(drawLoop);
  }
}, 75);

const bgLoop = setInterval(() => {
  canvas.style.background = getRandomColor();
}, 3000);

document.getElementById("downloadBtn").onclick = () => {
    download(canvas.toDataURL(),`abstract_${Date.now()}.png`);
}