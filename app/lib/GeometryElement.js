import Element from "./canvasElement";
import { CONTROLHANDLER_NAMES, ROTATE_CONTROLHANDLER_OFFSET, DEBUGGER_UI } from "~/constants/canvas";
import { getAngleFromDegree, getLocalCoords } from "./helper";
import { useCanvasStore } from "#imports";

export default class GeometryElement extends Element {
	constructor(props) {
		super({ ...props });

		this.type = props.type || 'circle';
		this.width = props.width || 100;
		this.height = props.height || 100;
	}

	drawElement(ctx) {
		ctx.fillStyle = this.color.default;

		if (this.type === 'rect') {
			ctx.fillRect(
				-this.width / 2,
				-this.height / 2,
				this.width,
				this.height,
			);
		} else if (this.type === 'circle') {
			ctx.beginPath();
			ctx.ellipse(
				0,
				0,
				this.width / 2,
				this.height / 2,
				0, //這邊是 global 坐標系的旋轉，因為外層已經轉過，所以不用再轉
				0,
				2 * Math.PI
			);
			ctx.fill();
		}

		if (useCanvasStore().isDebugging) {
			this.drawGuideLines(ctx);
		}
	}

	drawControlHandlers(ctx) {
		// 在 local 座標中畫控制軸
		// 所以相對於整個元素的中心點 (0,0)
		const { width, height } = this;
		this.controlHandlers.forEach(handler => {
			switch (handler.name) {
				case CONTROLHANDLER_NAMES.TOP_LEFT:
					handler.x = -width / 2;
					handler.y = -height / 2;
					break;
				case CONTROLHANDLER_NAMES.TOP_CENTER:
					handler.x = 0;
					handler.y = -height / 2;
					break;
				case CONTROLHANDLER_NAMES.TOP_RIGHT:
					handler.x = width / 2;
					handler.y = -height / 2;
					break;
				case CONTROLHANDLER_NAMES.MIDDLE_LEFT:
					handler.x = -width / 2;
					handler.y = 0;
					break;
				case CONTROLHANDLER_NAMES.MIDDLE_RIGHT:
					handler.x = width / 2;
					handler.y = 0;
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_LEFT:
					handler.x = -width / 2;
					handler.y = height / 2;
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_CENTER:
					handler.x = 0;
					handler.y = height / 2;
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_RIGHT:
					handler.x = width / 2;
					handler.y = height / 2;
					break;
				case CONTROLHANDLER_NAMES.ROTATE:
					handler.x = 0;
					handler.y = -height / 2 - ROTATE_CONTROLHANDLER_OFFSET;
					break;
			}
			handler.draw(ctx);
		});

		// Line to rotation handler
		ctx.beginPath();
		ctx.moveTo(0, -height / 2);
		ctx.lineTo(0, -height / 2 - ROTATE_CONTROLHANDLER_OFFSET);
		ctx.stroke();
	}

	isPointInside(px, py) {
		const angle = getAngleFromDegree(this.rotationDeg);
		const {localX, localY} = getLocalCoords(px, py, this.x, this.y, angle);
		this.selected =
			localX >= -this.width / 2 && localX <=	this.width / 2 &&
			localY >= -this.height / 2 && localY <= this.height / 2;
		return this.selected;
	}

	drawGuideLines(ctx) {
		ctx.lineWidth = DEBUGGER_UI.LINE_WIDTH;
		ctx.strokeStyle = DEBUGGER_UI.COLOR;
		// Bounding
		ctx.beginPath();
		ctx.moveTo(-this.width / 2, -this.height / 2);
		ctx.lineTo(this.width / 2, -this.height / 2);
		ctx.lineTo(this.width / 2, this.height / 2);
		ctx.lineTo(-this.width / 2, this.height / 2);
		ctx.closePath();
		ctx.stroke();
		// Horizontal
		ctx.beginPath();
		ctx.moveTo(-this.width / 2, 0);
		ctx.lineTo(this.width / 2, 0);
		ctx.stroke();
		// Vertical
		ctx.beginPath();
		ctx.moveTo(0, -this.height / 2);
		ctx.lineTo(0, this.height / 2);
		ctx.stroke();
	}
}