import { ExportTypes } from "./constants";

class FileSaver {
    static saveCanvasAs(canvas: HTMLCanvasElement, name: string, type: ExportTypes = ExportTypes.Png) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL(`image/${type}`);
        link.download = `${name}.${type}`;
        link.click();
    }
}

export { FileSaver };