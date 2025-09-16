import ControlHandler from './controlHandler.js';
import { CANVAS_UI, CONTROLHANDER_UI, CONTROLHANDLER_NAMES, CONTROLHANDLER_TYPES, ROTATE_CONTROLHANDLER_OFFSET } from '../constants/canvas.js';
import { getAngleFromDegree, getLocalCoords } from './helper.js';
export default class Element {
	constructor({ key, type, x, y, color }) {
		this.key = key || crypto.randomUUID();
		this.type = type;		// 'text' | 'rect' | 'circle'
		this.cx = x || CANVAS_UI.WIDTH / 2;
		this.cy = y || CANVAS_UI.HEIGHT / 2;
		this.color = color || {
			default: '#' + Math.floor(Math.random()*16777215).toString(16),
		};
		this.rotationDeg = 0; //degree
		this.selected = false;

		this.controlHandlers = Object.values(CONTROLHANDLER_NAMES).map(name => {
			return new ControlHandler({
				x: 0,
				y: 0,
				type: name === CONTROLHANDLER_NAMES.ROTATE ? CONTROLHANDLER_TYPES.ROTATE : CONTROLHANDLER_TYPES.RESIZE,
				name,
			});
		});
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.cx, this.cy);
		ctx.rotate(getAngleFromDegree(this.rotationDeg));

		this.drawElement(ctx);
		if (this.selected) {
			this.drawOutline(ctx);
			this.drawControlHandlers(ctx);
		}

		ctx.restore();
	}

	drawElement(ctx) {
		throw new Error("drawElement() must be implemented in subclass");
	}

	drawOutline(ctx) {
		ctx.lineWidth = CONTROLHANDER_UI.LINE_WIDTH;
		ctx.strokeStyle = CONTROLHANDER_UI.COLOR;
		ctx.beginPath();
		ctx.moveTo(-this.width / 2, -this.height / 2);
		ctx.lineTo(this.width / 2, -this.height / 2);
		ctx.lineTo(this.width / 2, this.height / 2);
		ctx.lineTo(-this.width / 2, this.height / 2);
		ctx.closePath();
		ctx.stroke();
	}

	drawControlHandlers(ctx) {
		throw new Error("drawControlHandlers() must be implemented in subclass");
	}

	isPointInside(px, py) {
		throw new Error("isPointInside() must be implemented in subclass");
	}

	checkControlHandlerHit(px, py) {
		// 轉換成 element 中心點為原點的座標系
		// 才能計算 control handler 正確位置
		const angle = getAngleFromDegree(this.rotationDeg);
		const {localX, localY} = getLocalCoords(px, py, this.cx, this.cy, angle);

		this.controlHandlers.forEach(handler => handler.isPointInside(localX, localY));
	}
}