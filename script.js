const canvas = document.querySelector("#drawingBoard");

canvas.height = document.body.scrollHeight;
canvas.width = document.body.scrollWidth;

const width = canvas.width; // 500
const height = canvas.height; // 300

const etaSpan = document.getElementById("eta");
const percentSpan = document.getElementById("perc");
const placedSpan = document.getElementById("placed");

function download(url, name) { // make the link. set the href and download. emulate dom click
    const link = document.getElementById('downloadLink');
    link.setAttribute("href", url);
    link.setAttribute("download", name);
    link.click();
}

const getNextPosition = (width, height) => {
    const randomX = Math.floor(Math.random() * width);
    const randomY = Math.floor(Math.random() * height);
    return [randomX, randomY];
};

const getNextSize = () => {
    return Math.floor(Math.random() * 15);
};

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const hms = (seconds) => {
  return [3600, 60]
    .reduceRight(
      (p, b) => r => [Math.floor(r / b)].concat(p(r % b)),
      r => [r]
    )(seconds)
    .map(a => a.toString().padStart(2, '0'))
    .join(':');
};

window.filled = 0;
window.placed = 0;

const start = Date.now();

const drawLoop = setInterval(() => {
    if (! canvas.getContext) {
        return;
    }

    // get the context
    const ctx = canvas.getContext("2d");

    const nextPos = getNextPosition(width, height);
    const size = getNextSize();
    const generator = Math.random();

    ctx.fillStyle = getRandomColor();
    if (generator > 0.5) {
        ctx.beginPath();
        ctx.arc(nextPos[0], nextPos[1], size, 0, 2 * Math.PI);
    } else {
        ctx.fillRect(nextPos[0], nextPos[1], size, size);
    } ctx.fill();

    const filledPercent = window.filled/(width * height);
    window.filledPercent = filledPercent;

    const filledThreshold = 1.5;

    const timeSpent = (Date.now() - start) / 1000;
    const secondsRemaining = ((timeSpent / (filledPercent * 100)) * (filledThreshold * 100)) - timeSpent;

    /* Output */

    etaSpan.innerText = `ETA: ${hms(Math.floor(secondsRemaining))}`;
    percentSpan.innerText = `Progress: ${Math.floor((filledPercent * 100) / 1.5)}%`;
    placedSpan.innerText = `${window.placed.toLocaleString()} (expected: ${Math.floor((window.placed / (filledPercent * 100)) * 100).toLocaleString()})`;

    window.placed += 1;
    window.filled += size * size;

    if (filledPercent > filledThreshold) {
        clearInterval(drawLoop);
    }
}, 10);

document.getElementById("downloadBtn").onclick = () => {
    download(canvas.toDataURL(), `abstract_${
        Date.now()
    }.png`);
};
