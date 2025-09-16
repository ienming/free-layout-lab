import ControlHandler from './controlHandler.js';
import { CONTROLHANDLER_NAMES, CONTROLHANDLER_TYPES } from '../constants/canvas.js';
export default class Element {
	constructor({ key, type, x, y, width, height, color, content = '' }) {
		this.key = key;
		this.type = type;		// 'text' | 'rect' | 'circle'
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.content = content;
		this.rotation = 0;
		this.selected = false;
		this.controlHandlers = Object.values(CONTROLHANDLER_NAMES).map(name => {
			return new ControlHandler({
				x: 0,
				y: 0,
				type: CONTROLHANDLER_TYPES.RESIZE,
				name,
			});
		});
	}

	draw(ctx) {
		this.drawElement(ctx);
		if (this.selected) {
			this.drawControlOutline(ctx);
		}
	}

	drawElement(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate((this.rotation * Math.PI) / 180);

		if (this.type === 'rect') {
			ctx.fillStyle = this.color;
			ctx.fillRect(0, 0, this.width, this.height);
		} else if (this.type === 'text') {
			ctx.fillStyle = this.color;
			ctx.font = `${this.height}px sans-serif`;
			ctx.fillText(this.content, 0, 0);
		}

		ctx.restore();
	}

	drawControlOutline(ctx) {
		const { x, y, width, height } = this;
		this.controlHandlers.forEach(handler => {
			switch (handler.name) {
				case CONTROLHANDLER_NAMES.TOP_LEFT:
					handler.x = x;
					handler.y = y;
					break;
				case CONTROLHANDLER_NAMES.TOP_CENTER:
					handler.x = x + width / 2;
					handler.y = y;
					break;
				case CONTROLHANDLER_NAMES.TOP_RIGHT:
					handler.x = x + width;
					handler.y = y;
					break;
				case CONTROLHANDLER_NAMES.MIDDLE_LEFT:
					handler.x = x;
					handler.y = y + height / 2;
					break;
				case CONTROLHANDLER_NAMES.MIDDLE_RIGHT:
					handler.x = x + width;
					handler.y = y + height / 2;
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_LEFT:
					handler.x = x;
					handler.y = y + height;
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_CENTER:
					handler.x = x + width / 2;
					handler.y = y + height;
					break;
				case CONTROLHANDLER_NAMES.BOTTOM_RIGHT:
					handler.x = x + width;
					handler.y = y + height;
					break;
			}
			handler.draw(ctx);
		});
	}

	checkControlHandlerHit(px, py) {
		// return this.controlHandlers.find(handler => handler.isPointInside(px, py));
		this.controlHandlers.forEach(handler => handler.isPointInside(px, py));
	}

	isPointInside(px, py) {
		this.selected =
			px >= this.x && px <= this.x + this.width &&
			py >= this.y && py <= this.y + this.height;
		return this.selected;
	}

	applyColor(newColor) {
		this.color = newColor;
	}
}