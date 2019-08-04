import {controlsState} from './layout.js'

const BACKGROUND_CANVAS = $('#background-canvas');
export const context = BACKGROUND_CANVAS[0].getContext('2d');

export function drawBackground() {
    let symmetries = controlsState.symmetries;
    clearCanvas();
    drawSymmetries(symmetries);
    drawCircle();
}

function clearCanvas() {
    context.clearRect(0, 0, 1000, 1000);
}

function drawCircle() {
    context.beginPath();
    context.strokeStyle = 'rgb(53, 53, 53)';
    context.lineWidth = 7;
    context.arc(500, 500, 450, 0, 2 * Math.PI);
    context.stroke();
}

function drawSymmetries(symmetries) {
    if (symmetries === 1) return;
    let angleSize = 2 * Math.PI / symmetries;
    let currentAngle = (3 / 2 * Math.PI) - (angleSize / 2);
    context.lineWidth = 7;
    context.strokeStyle = 'rgb(232, 232, 232)';
    for (let n = 0; n < symmetries; n++) {
        let toAngle = currentAngle + angleSize;
        context.beginPath();
        context.moveTo(500, 500);
        context.lineTo(
            Math.cos(currentAngle) * 450 + 500,
            Math.sin(currentAngle) * 450 + 500);
        context.moveTo(500, 500);
        context.lineTo(
            Math.cos(toAngle) * 450 + 500,
            Math.sin(toAngle) * 450 + 500);
        context.stroke();
        currentAngle += angleSize;
    }
}