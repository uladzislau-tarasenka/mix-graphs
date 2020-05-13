import { ExportTypes } from "./constants";
declare class FileSaver {
    static saveCanvasAs(canvas: HTMLCanvasElement, name: string, type?: ExportTypes): void;
}
export { FileSaver };
