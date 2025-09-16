import { CONTROLHANDLER_NAMES, EL_MINIMUM_SIZE } from "~/constants/canvas";
import { getAngleFromDegree, getLocalCoords } from "~/lib/helper";

const useCanvasStore = defineStore('canvas', {
	state: () => ({
		elements: [],
	}),
	getters: {
		selectedEl(state) {
			return state.elements.find(el => el.selected) || null;
		},
		activeControlHandler(state) {
			return state.selectedEl?.controlHandlers.find(handler => handler.active) || null;
		},
	},
	actions: {
		addEl(element) {
			this.elements.push(element);
		},
		clearSelectedEl() {
			this.elements.forEach(el => el.selected = false);
		},
		clearActiveControlHandler() {
			this.selectedEl?.controlHandlers.forEach(handler => handler.active = false);
		},
		updateElWidth(value) {
			if (this.selectedEl) {
				const target = this.elements.find(el => el.key === this.selectedEl.key);
				target.width = value;
			}
		},
		updateElHeight(value) {
			if (this.selectedEl) {
				const target = this.elements.find(el => el.key === this.selectedEl.key);
				target.height = value;
			}
		},
		updateElRotation(value) {
			if (this.selectedEl) {
				const target = this.elements.find(el => el.key === this.selectedEl.key);
				target.rotationDeg = value;
			}
		},
		resizeSelectedEl(posX, posY) {
			if (!this.selectedEl) return;

			const cx = this.selectedEl.cx;
			const cy = this.selectedEl.cy;
			const angle = getAngleFromDegree(this.selectedEl.rotationDeg);
			const { localX, localY } = getLocalCoords(posX, posY, cx, cy, angle);

			let halfW = this.selectedEl.width / 2;
			let halfH = this.selectedEl.height / 2;

			switch (this.activeControlHandler.name) {
				case CONTROLHANDLER_NAMES.TOP_LEFT:
				case CONTROLHANDLER_NAMES.TOP_RIGHT:
				case CONTROLHANDLER_NAMES.BOTTOM_LEFT:
				case CONTROLHANDLER_NAMES.BOTTOM_RIGHT:
					halfW = Math.max(EL_MINIMUM_SIZE / 2, Math.abs(localX));
					halfH = Math.max(EL_MINIMUM_SIZE / 2, Math.abs(localY));
					break;

				case CONTROLHANDLER_NAMES.TOP_CENTER:
				case CONTROLHANDLER_NAMES.BOTTOM_CENTER:
					halfH = Math.max(EL_MINIMUM_SIZE / 2, Math.abs(localY));
					break;

				case CONTROLHANDLER_NAMES.MIDDLE_LEFT:
				case CONTROLHANDLER_NAMES.MIDDLE_RIGHT:
					halfW = Math.max(EL_MINIMUM_SIZE / 2, Math.abs(localX));
					break;

				// case CONTROLHANDLER_NAMES.ROTATE:
				// 	const angleRad = Math.atan2(posY - cy, posX - cx);
				// 	this.selectedEl.rotationDeg = angleRad * (180 / Math.PI);
				// 	return;
			}

			// 更新 width / height，中心點不動
			this.selectedEl.width = halfW * 2;
			this.selectedEl.height = halfH * 2;
		},
		sendToFront() {
			if (!this.selectedEl) return;
			const index = this.elements.findIndex(el => el.key === this.selectedEl.key);
			if (index === -1) return;
			if (index === this.elements.length - 1) return; // Already at front

			const [element] = this.elements.splice(index, 1);
			this.elements.push(element);
		},
		sendToBack() {
			if (!this.selectedEl) return;
			const index = this.elements.findIndex(el => el.key === this.selectedEl.key);
			if (index === -1) return;
			if (index === 0) return; // Already at back

			const [element] = this.elements.splice(index, 1);
			this.elements.unshift(element);
		},
		removeEl() {
			const index = this.elements.findIndex(el => el.key === this.selectedEl.key);
			this.elements.splice(index, 1);
		},
		removeAll() {
			this.elements.splice(0, this.elements.length);
		}
	}
});

export default useCanvasStore;