import {reset as resetForeground} from './foreground'
import buttons from './buttons'
import {drawBackground} from './background'
import {download} from './download'

buttons.onDelete = () => {
    resetForeground();
    drawBackground();
};

buttons.onDownload = download;

drawBackground();