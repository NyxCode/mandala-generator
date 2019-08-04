import {drawBackground} from './background'

export const CANVAS_SIZE = 1000;
export const FOREGROUND_CANVAS = $('#foreground-canvas');
export const BACKGROUND_CANVAS = $('#background-canvas');
export let controlsState = {symmetries: 6};
export let canvasResolutionSizeRatio = -1;

const OUTPUT = $('#output');

FOREGROUND_CANVAS[0].width = CANVAS_SIZE;
FOREGROUND_CANVAS[0].height = CANVAS_SIZE;
BACKGROUND_CANVAS[0].width = CANVAS_SIZE;
BACKGROUND_CANVAS[0].height = CANVAS_SIZE;

function resizeCanvas() {
    let width = OUTPUT[0].clientWidth;
    let height = OUTPUT[0].clientHeight;

    let canvasSize = (width > height) ? height : width;

    FOREGROUND_CANVAS.css('width', canvasSize);
    FOREGROUND_CANVAS.css('height', canvasSize);
    BACKGROUND_CANVAS.css('width', canvasSize);
    BACKGROUND_CANVAS.css('height', canvasSize);

    let bottom = (height - canvasSize) / 2;
    FOREGROUND_CANVAS.css('bottom', bottom);
    BACKGROUND_CANVAS.css('bottom', bottom);

    canvasResolutionSizeRatio = 1000 / canvasSize;
}

function initializeControls() {
    $('#symmetries-slider')
        .slider({
            min: 1, max: 16, start: controlsState.symmetries, step: 1,
            onMove: (e) => {
                if (controlsState.symmetries !== e) {
                    controlsState.symmetries = e;
                    drawBackground()
                }
            }
        });
}

window.addEventListener('resize', resizeCanvas);

initializeControls();
resizeCanvas();
