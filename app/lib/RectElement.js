import Element from "./canvasElement";

export default class RectElement extends Element {
	constructor(props) {
		super({ ...props, type: 'rect' });

		this.width = props.width;
		this.height = props.height;
	}

	drawElement(ctx) {
		ctx.fillStyle = this.color.default;
		ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
	}

	isPointInside(px, py) {
		this.selected =
			px >= this.cx - this.width / 2 && px <=	this.cx + this.width / 2 &&
			py >= this.cy - this.height / 2 && py <= this.cy + this.height / 2;
		return this.selected;
	}
}