"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var VideoRenderer = function (_a) {
    var currentDocument = _a.mainState.currentDocument;
    if (!currentDocument)
        return null;
    return (react_1.default.createElement(Container, { id: "video-renderer" },
        react_1.default.createElement(Video, { controls: true, src: currentDocument.uri })));
};
exports.default = VideoRenderer;
VideoRenderer.fileTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
VideoRenderer.weight = 0;
var Container = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n"], ["\n  width: 100%;\n"])));
var Video = styled_components_1.default.video(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n  border: 0;\n"], ["\n  width: 100%;\n  height: 100%;\n  border: 0;\n"])));
var templateObject_1, templateObject_2;
