import {canvas as foregroundCanvas} from "./foreground";

let renderCanvasElement = document.createElement("canvas");
renderCanvasElement.width = 1000;
renderCanvasElement.height = 1000;
let renderCanvas = renderCanvasElement.getContext('2d');

export function download() {
    renderCanvas.fillStyle = 'white';
    renderCanvas.fillRect(0, 0, 1000, 1000);
    renderCanvas.beginPath();
    renderCanvas.strokeStyle = 'rgb(53, 53, 53)';
    renderCanvas.lineWidth = 7;
    renderCanvas.arc(500, 500, 450, 0, 2 * Math.PI);
    renderCanvas.stroke();
    renderCanvas.drawImage(foregroundCanvas, 0, 0);

    let image = renderCanvasElement.toDataURL("image/png");

    let downloadLink = document.createElement("a");
    downloadLink.href = image;
    downloadLink.download = "mandala.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}