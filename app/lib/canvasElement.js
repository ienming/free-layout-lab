import ControlHandler from './controlHandler.js';
import { CONTROLHANDLER_NAMES, CONTROLHANDLER_TYPES, ROTATE_CONTROLHANDLER_OFFSET } from '../constants/canvas.js';
import { getAngleFromDegree, getLocalCoords } from './helper.js';
export default class Element {
	constructor({ key, type, x, y, color }) {
		this.key = key;
		this.type = type;		// 'text' | 'rect' | 'circle'
		this.cx = x;
		this.cy = y;
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
			this.drawControlOutline(ctx);
		}

		ctx.restore();
	}

	drawElement(ctx) {
		throw new Error("drawElement() must be implemented in subclass");
	}

	isPointInside(px, py) {
		throw new Error("isPointInside() must be implemented in subclass");
	}

	drawControlOutline(ctx) {
		// 在 local 座標中畫控制軸
		// 所以相對於整個元素的中心點 (0,0)
		const { width, height } = this;
		this.controlHandlers.forEach(handler => {
			switch (handler.name) {
				case CONTROLHANDLER_NAMES.TOP_LEFT:
					handler.cx = -width / 2;
					handler.cy = -height / 2;
					break;
				case CONTROLHANDLER_NAMES.TOP_CENTER:
					handler.cx = 0;
					handler.cy = -height / 2;
					break;
				case CONTROLHANDLER_NAMES.TOP_RIGHT:
					handler.cx = width / 2;
					handler.cy = -height / 2;
					break;
				case CONTROLHANDLER_NAMES.MIDDLE_LEFT:
					handler.cx = -width / 2;
					handler.cy = 0;
					break;
				case CONTROLHANDLER_NAMES.MIDDLE_RIGHT:
					handler.cx = width / 2;
					handler.cy = 0;
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_LEFT:
					handler.cx = -width / 2;
					handler.cy = height / 2;
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_CENTER:
					handler.cx = 0;
					handler.cy = height / 2;
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_RIGHT:
					handler.cx = width / 2;
					handler.cy = height / 2;
					break;
				case CONTROLHANDLER_NAMES.ROTATE:
					handler.cx = 0;
					handler.cy = -height / 2 - ROTATE_CONTROLHANDLER_OFFSET;
					break;
			}
			handler.draw(ctx);
		});
	}

	checkControlHandlerHit(px, py) {
		// 轉換成 element 中心點為原點的座標系
		// 才能計算 control handler 正確位置
		const angle = getAngleFromDegree(this.rotationDeg);
		const {localX, localY} = getLocalCoords(px, py, this.cx, this.cy, angle);

		this.controlHandlers.forEach(handler => handler.isPointInside(localX, localY));
	}
}