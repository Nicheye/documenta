"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRenderer = exports.GIFRenderer = exports.CSVRenderer = exports.TXTRenderer = exports.TIFFRenderer = exports.PNGRenderer = exports.PDFRenderer = exports.MSDocRenderer = exports.JPGRenderer = exports.HTMLRenderer = exports.BMPRenderer = exports.DocViewerRenderers = void 0;
var bmp_1 = __importDefault(require("./bmp"));
exports.BMPRenderer = bmp_1.default;
var html_1 = __importDefault(require("./html"));
exports.HTMLRenderer = html_1.default;
var jpg_1 = __importDefault(require("./jpg"));
exports.JPGRenderer = jpg_1.default;
var msdoc_1 = __importDefault(require("./msdoc"));
exports.MSDocRenderer = msdoc_1.default;
var pdf_1 = __importDefault(require("./pdf"));
exports.PDFRenderer = pdf_1.default;
var png_1 = __importDefault(require("./png"));
exports.PNGRenderer = png_1.default;
var tiff_1 = __importDefault(require("./tiff"));
exports.TIFFRenderer = tiff_1.default;
var txt_1 = __importDefault(require("./txt"));
exports.TXTRenderer = txt_1.default;
var csv_1 = __importDefault(require("./csv"));
exports.CSVRenderer = csv_1.default;
var gif_1 = __importDefault(require("./gif"));
exports.GIFRenderer = gif_1.default;
var video_1 = __importDefault(require("./video"));
exports.VideoRenderer = video_1.default;
exports.DocViewerRenderers = [
    bmp_1.default,
    html_1.default,
    jpg_1.default,
    msdoc_1.default,
    pdf_1.default,
    png_1.default,
    tiff_1.default,
    txt_1.default,
    csv_1.default,
    gif_1.default,
    video_1.default,
];
