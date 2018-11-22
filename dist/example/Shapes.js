"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Shape = /** @class */ (function () {
    function Shape() {
    }
    Shape.prototype.draw = function () { };
    Shape.prototype.resize = function () { };
    Shape.prototype.rotate = function () { };
    return Shape;
}());
exports.Shape = Shape;
var Triangle = /** @class */ (function (_super) {
    __extends(Triangle, _super);
    function Triangle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Triangle.prototype.draw = function () { };
    return Triangle;
}(Shape));
exports.Triangle = Triangle;
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rectangle.prototype.draw = function () { };
    Object.defineProperty(Rectangle.prototype, "width", {
        get: function () { return 0; },
        set: function (w) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        get: function () { return 0; },
        set: function (h) { },
        enumerable: true,
        configurable: true
    });
    return Rectangle;
}(Shape));
exports.Rectangle = Rectangle;
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Circle.prototype, "radius", {
        get: function () { return 0; },
        set: function (r) { },
        enumerable: true,
        configurable: true
    });
    Circle.prototype.draw = function () { };
    return Circle;
}(Shape));
exports.Circle = Circle;
