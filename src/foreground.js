import {canvasResolutionSizeRatio, controlsState, FOREGROUND_CANVAS} from './layout'
import controlButtons from './buttons'
import {context as backgroundCanvas, drawBackground} from './background';

export let canvas = FOREGROUND_CANVAS[0];
export let context = FOREGROUND_CANVAS[0].getContext("2d");

let drawing = false;
let lastDrawingLocation = null;
let lineStart = null;

// completely reset the foreground
export function reset() {
    context.clearRect(0, 0, 1000, 1000);
    resetState();
}

export function resetState() {
    drawing = false;
    lastDrawingLocation = null;
    lineStart = null;
    drawBackground();
}

function rotateCoordinates(x, y, angle) {
    if (angle === 0) { return {x, y} }
    let translatedX = (x - 500),
        translatedY = (y - 500);
    let distanceToCenter = Math.sqrt(translatedX ** 2 + translatedY ** 2);
    let phi = 2 * Math.atan(translatedY / (translatedX + distanceToCenter));
    return {
        x: 500 + Math.cos(phi + angle) * distanceToCenter,
        y: 500 + Math.sin(phi + angle) * distanceToCenter
    }
}

function isInside(x, y) {
    // (x-m)^2 + (y-m)^2 = r^2
    return (x - 500) ** 2 + (y - 500) ** 2 < 450 ** 2
}

function setStrokeProperties(mode) {
    context.lineCap = 'round';
    if (mode === 'pen') {
        context.globalCompositeOperation = "source-over";

        context.lineWidth = 10;
        context.strokeStyle = 'rgb(53, 53, 53)';
    } else if (mode === 'eraser') {
        context.globalCompositeOperation = "destination-out";

        context.lineWidth = 40;
        context.strokeStyle = 'rgb(255, 255, 255)'
    }
}


function handleMouseUp(x, y) {
    if (drawing) {
        context.stroke();
        drawing = false;
    }
    if (lineStart !== null && isInside(x, y)) {
        setStrokeProperties('pen');

        for (let i = 0; i < controlsState.symmetries; i++) {
            let angle = (2 * Math.PI / controlsState.symmetries) * i;
            let rotatedLast = rotateCoordinates(lineStart.x, lineStart.y, angle);
            let rotatedNext = rotateCoordinates(x, y, angle);
            context.beginPath();
            context.moveTo(rotatedLast.x, rotatedLast.y);
            context.lineTo(rotatedNext.x, rotatedNext.y);
            context.stroke();
        }

        lineStart = null;
        drawBackground();
    }
}

function handleMouseDown(x, y) {
    if (!isInside(x, y) || drawing || lineStart !== null) return;

    let mode = controlButtons.getCurrentMode();

    if (mode === 'pen' || mode === 'eraser') {
        setStrokeProperties(mode);
        drawing = true;

        context.beginPath();
        context.moveTo(x, y);
        lastDrawingLocation = {x, y};
    } else if (mode === 'line') {
        lineStart = {x, y};
        drawTemporaryLine(null);
    }
}

function handleMouseMove(x, y) {
    let mode = controlButtons.getCurrentMode();
    if (mode === 'pen' || mode === 'eraser') {
        if (!drawing) return;

        if (!isInside(x, y)) {
            context.stroke();
            lastDrawingLocation = null;
            return;
        }

        if (lastDrawingLocation == null) {
            lastDrawingLocation = {x, y};
            context.beginPath();
        }

        // prevent the foreground of small line segments (we dont use sqrt for performance reasons)
        if ((lastDrawingLocation.x - x) ** 2 + (lastDrawingLocation.y - y) ** 2 > 5 ** 2) {
            context.lineTo(x, y);
            context.stroke();

            for (let i = 1; i < controlsState.symmetries; i++) {
                let angle = (2 * Math.PI / controlsState.symmetries) * i;
                let rotatedLast = rotateCoordinates(lastDrawingLocation.x, lastDrawingLocation.y, angle);
                let rotatedNext = rotateCoordinates(x, y, angle);
                context.beginPath();
                context.moveTo(rotatedLast.x, rotatedLast.y);
                context.lineTo(rotatedNext.x, rotatedNext.y);
                context.stroke();
            }

            context.beginPath();
            context.moveTo(x, y);

            lastDrawingLocation = {x, y};
        }
    } else if (mode === 'line' && isInside(x, y)) {
        drawTemporaryLine({x, y});
    }

}

function drawTemporaryLine(currentPos) {
    if (lineStart === null) return;

    function drawGreenDot(x, y) {
        backgroundCanvas.beginPath();
        backgroundCanvas.arc(x, y, 10, 0, 2 * Math.PI);
        backgroundCanvas.fillStyle = '#B5CC25';
        backgroundCanvas.stroke();
        backgroundCanvas.fill();
    }

    drawBackground();
    if (currentPos !== null) {
        backgroundCanvas.beginPath();
        backgroundCanvas.moveTo(lineStart.x, lineStart.y);
        backgroundCanvas.lineTo(currentPos.x, currentPos.y);
        backgroundCanvas.stroke();
        drawGreenDot(currentPos.x, currentPos.y)
    }
    drawGreenDot(lineStart.x, lineStart.y);
}

const mouseEventGetX = event => event.offsetX * canvasResolutionSizeRatio;
const mouseEventGetY = event => event.offsetY * canvasResolutionSizeRatio;
const touchEventGetX = touch => (touch.pageX - touch.target.offsetLeft) * canvasResolutionSizeRatio;
const touchEventGetY = touch => (touch.pageY - touch.target.offsetTop) * canvasResolutionSizeRatio;

FOREGROUND_CANVAS[0].addEventListener('mousedown',
    event => handleMouseDown(mouseEventGetX(event), mouseEventGetY(event)));

FOREGROUND_CANVAS[0].addEventListener('mouseup',
    event => handleMouseUp(mouseEventGetX(event), mouseEventGetY(event)));

FOREGROUND_CANVAS[0].addEventListener('mousemove',
    event => handleMouseMove(mouseEventGetX(event), mouseEventGetY(event)));

FOREGROUND_CANVAS[0].addEventListener('touchstart', event => {
    event.preventDefault();
    let touch = event.touches[0];
    handleMouseDown(touchEventGetX(touch), touchEventGetY(touch));
});

FOREGROUND_CANVAS[0].addEventListener('touchend', () => {
    let touch = event.changedTouches[0];
    handleMouseUp(touchEventGetX(touch), touchEventGetY(touch));
});

FOREGROUND_CANVAS[0].addEventListener('touchmove', event => {
    let touch = event.touches[0];
    handleMouseMove(touchEventGetX(touch), touchEventGetY(touch));
});