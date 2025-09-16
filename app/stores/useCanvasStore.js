import { CONTROLHANDLER_NAMES, EL_MINIMUM_SIZE } from "~/constants/canvas";
import { getAngleFromDegree, getDegreeFromAngle, getLocalCoords } from "~/lib/helper";

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
		setEl2Select(key) {
			const target = this.elements.find(el => el.key === key);
			if (!target) return;

			target.selected = true;
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
		updateElColor(value) {
			if (this.selectedEl) {
				const target = this.elements.find(el => el.key === this.selectedEl.key);
				console.log(value);
				target.color.default = value;
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

				case CONTROLHANDLER_NAMES.ROTATE:
					// 1. 把滑鼠座標轉到元素中心
					// const dx = posX - cx;
					// const dy = posY - cy;

					// // 2. 把旋轉反轉回 local 座標系
					// const localX = dx * Math.cos(-angle) - dy * Math.sin(-angle);
					// const localY = dx * Math.sin(-angle) + dy * Math.cos(-angle);

					// // 3. 計算新的旋轉角度
					// const newAngleRad = Math.atan2(localY, localX);
					// this.selectedEl.rotationDeg = (newAngleRad * 180 / Math.PI + 360) % 360;
					return;
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
			if (!this.selectedEl) return;
			const index = this.elements.findIndex(el => el.key === this.selectedEl.key);
			if (index === -1) return;
			this.elements.splice(index, 1);
		},
		removeAll() {
			if (window.confirm('清空畫布')) {
				this.elements.splice(0, this.elements.length);
			}
		}
	}
});

export default useCanvasStore;