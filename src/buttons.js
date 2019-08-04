import myself from './buttons';

let pen = $('#pen-button');
let line = $('#line-button');
let eraser = $('#eraser-button');
let undo = $('#undo-button');
let redo = $('#redo-button');
let download = $('#download-button');
let trash = $('#delete-button');

let statefulButtons = [pen, line, eraser];
let currentMode = null;

export default {
    getCurrentMode: () => { return currentMode },
    onUndo: () => { },
    onRedo: () => { },
    onDelete: () => { },
    onDownload: () => { }
};

const toggleMode = (button, mode) => () => {
    if (currentMode === mode) {
        currentMode = null;
        statefulButtons.forEach(b => b.removeClass('primary'))
    } else {
        currentMode = mode;
        statefulButtons.forEach(b => b.removeClass('primary'));
        button.addClass('primary')
    }
};


pen.on('click', toggleMode(pen, 'pen'));
line.on('click', toggleMode(line, 'line'));
eraser.on('click', toggleMode(eraser, 'eraser'));
undo.on('click', () => myself.onUndo());
redo.on('click', () => myself.onRedo());
download.on('click', () => myself.onDownload());
trash.on('click', () => myself.onDelete());

requestAnimationFrame(toggleMode(pen, 'pen'));

