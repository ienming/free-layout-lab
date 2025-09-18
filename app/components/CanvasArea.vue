<template>
	<div>
		<canvas
			ref="canvas"
			:width="CANVAS_WIDTH"
			:height="CANVAS_HEIGHT"
			class="canvas" />
	</div>
</template>

<script setup>
import { CANVAS_UI } from '~/constants/canvas';

const canvasStore = useCanvasStore();

const canvas = useTemplateRef('canvas');
const [CANVAS_WIDTH, CANVAS_HEIGHT] = [CANVAS_UI.WIDTH, CANVAS_UI.HEIGHT];
let ctx = null;
let offsetX = 0;
let offsetY = 0;
let isElDragging = false;
let isControlHandlerStartDragging = false;
let animationFrameId = null;

// 建立元素
const canvasElements = canvasStore.elements;

watch(canvasElements, () => {
	if (isElDragging) return;
	drawAll();
}, {
	deep: true,
});

function drawAll() {
	ctx.fillStyle = CANVAS_UI.BG_COLOR;
	ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
	canvasElements.forEach(el => el.draw(ctx));
}

function renderLoop() {
	if (!isElDragging) return;
	animationFrameId = requestAnimationFrame(renderLoop);
	drawAll();
}

function onMouseDown(e) {
	const rect = canvas.value.getBoundingClientRect();
	const px = e.clientX - rect.left;
	const py = e.clientY - rect.top;

	// 確認是不是點到 control handler
	canvasStore.selectedEl?.checkControlHandlerHit(px, py);
	if (canvasStore.activeControlHandler) {
		console.log(canvasStore.selectedEl.key, canvasStore.activeControlHandler.name);
		isControlHandlerStartDragging = true;
		return;
	}

	// 確認點到哪一個元素	
	// 取消所有元素的選取狀態
	canvasStore.clearActiveControlHandler();
	canvasStore.clearSelectedEl();

	// 從上到下檢查點擊位置是否在元素內
	for (let i = canvasElements.length - 1; i >= 0; i--) {
		const el = canvasElements[i];
		el.isPointInside(px, py);
		if (el.selected) break;
	}

	if (canvasStore.selectedEl) {
		offsetX = px - canvasStore.selectedEl.x;
		offsetY = py - canvasStore.selectedEl.y;
		isElDragging = true;
	}

	renderLoop();
}

function onMouseMove(e) {
	const rect = canvas.value.getBoundingClientRect();
	const px = e.clientX - rect.left;
	const py = e.clientY - rect.top;

	// control handler 拖曳
	if (isControlHandlerStartDragging) {
		canvasStore.resizeSelectedEl(px, py);
	} else if (isElDragging) {
		canvasStore.selectedEl.x = px - offsetX;
		canvasStore.selectedEl.y = py - offsetY;
	}
}

function onMouseUp() {
	isElDragging = false;
	isControlHandlerStartDragging = false;
	cancelAnimationFrame(animationFrameId);
}

function checkShortcut(e) {
	console.log(e);
	if (e.code === 'Backspace') {
		canvasStore.removeEl();
	} else if (e.code === 'BracketLeft') {
		canvasStore.sendToBack();
	} else if (e.code === 'BracketRight') {
		canvasStore.sendToFront();
	}
}

onMounted(() => {
	ctx = canvas.value.getContext('2d');
	drawAll();

	canvas.value.addEventListener('mousedown', onMouseDown);
	canvas.value.addEventListener('mousemove', onMouseMove);
	canvas.value.addEventListener('mouseup', onMouseUp);
	document.addEventListener('keydown', checkShortcut);
})

onUnmounted(() => {
	canvas.value.removeEventListener('mousedown', onMouseDown);
	canvas.value.removeEventListener('mousemove', onMouseMove);
	canvas.value.removeEventListener('mouseup', onMouseUp);
	document.removeEventListener('keydown', checkShortcut);
})
</script>

<style lang="scss" scoped>
.canvas {
	border-radius: 12px;
	border:1px solid #333;
}
</style>
