const images = [
    "apple.png", "basketball.png", "bike.png", "CoatHanger.png", "cup.png",
    "glass.png", "Helicopters.png", "light.png", "pizza.png", "snag1.png"
];

const leftSide = document.getElementById("left-side");
const rightSide = document.getElementById("right-side");

function preloadImage(src, callback) {
    const img = new Image();
    img.src = "images/" + src;
    img.onload = () => callback(img);
}

images.forEach((imgSrc, index) => {
    preloadImage(imgSrc, (loadedImg) => {
        loadedImg.style.visibility = "visible";
        if (index % 2 === 0) {
            leftSide.appendChild(loadedImg);
        } else {
            rightSide.appendChild(loadedImg);
        }
    });
});

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});
