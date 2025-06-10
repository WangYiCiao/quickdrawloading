// script.js

// —— 圖片預載 ——
const images = [
    "apple.png", "basketball.png", "bike.png", "CoatHanger.png", "cup.png",
    "glass.png", "Helicopters.png", "light.png", "pizza.png", "snag1.png"
];
const leftSide  = document.getElementById("left-side");
const rightSide = document.getElementById("right-side");
function preloadImage(src, callback) {
    const img = new Image();
    img.src = "images/" + src;
    img.onload = () => callback(img);
}
images.forEach((imgSrc, i) => {
    preloadImage(imgSrc, img => {
        img.style.visibility = "visible";
        if (i % 2 === 0) leftSide.appendChild(img);
        else            rightSide.appendChild(img);
    });
});

// —— 取得畫布 & 工具欄元素 ——
const canvas      = document.getElementById('myCanvas');
const ctx         = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const brushSize   = document.getElementById('brush-size');
const eraserBtn   = document.getElementById('eraser-btn');
const undoBtn     = document.getElementById('undo-btn');
const redoBtn     = document.getElementById('redo-btn');

// —— 畫筆狀態 & 歷史記錄 ——
let isDrawing    = false;
let lastX        = 0;
let lastY        = 0;
let currentColor = colorPicker.value;
let currentSize  = parseInt(brushSize.value, 10);
let isEraser     = false;

const undoStack = [];
const redoStack = [];

// 存狀態到堆疊
function saveState(stack, keepRedo = false) {
    if (!keepRedo) redoStack.length = 0;
    stack.push(canvas.toDataURL());
    updateButtons();
}

// 從堆疊復原
function restoreState(fromStack, toStack) {
    if (fromStack.length) {
        toStack.push(canvas.toDataURL());
        const img = new Image();
        img.src = fromStack.pop();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
    updateButtons();
}

// 更新按鈕可用狀態
function updateButtons() {
    undoBtn.disabled = undoStack.length === 0;
    redoBtn.disabled = redoStack.length === 0;
}

// 初始存一個「空白畫布」狀態
saveState(undoStack, true);

// —— 畫布滑鼠事件 ——
canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    saveState(undoStack);
});

canvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);

    ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
    ctx.lineWidth   = currentSize;
    ctx.lineCap     = 'round';
    ctx.stroke();

    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// —— 工具欄事件 ——
// 選顏色時自動切回「畫筆」
colorPicker.addEventListener('change', e => {
    currentColor = e.target.value;
    isEraser = false;
});

// 調整筆刷粗細
brushSize.addEventListener('input', e => {
    currentSize = parseInt(e.target.value, 10);
});

// 切換橡皮擦（背景色為白）
eraserBtn.addEventListener('click', () => {
    isEraser = true;
});

// 上一步 / 下一步
undoBtn.addEventListener('click', () => restoreState(undoStack, redoStack));
redoBtn.addEventListener('click', () => restoreState(redoStack, undoStack));
