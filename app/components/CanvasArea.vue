<template>
	<div>
		<canvas
			ref="canvas"
			width="800"
			height="600"
			style="border:1px solid #ccc;" />
		<ul class="element-list">
			<li
				v-for="el of canvasElements"
				:key="el.key">
				{{ el }}
			</li>
		</ul>
	</div>
</template>

<script setup>
const canvasStore = useCanvasStore();

const canvas = useTemplateRef('canvas');
let isDragging = false;
let ctx = null;

// 建立元素
const canvasElements = canvasStore.elements;

watch(canvasElements, () => {
	drawAll();
}, {
	deep: true,
});

let offsetX = 0;
let offsetY = 0;
let isControlHandlerDragging = false;

function drawAll() {
	ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
	canvasElements.forEach(el => el.draw(ctx));
}

function onMouseDown(e) {
	const rect = canvas.value.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	// TODO: 確認是不是點到 control handler
	const result = canvasStore.selectedEl?.checkControlHandlerHit(x, y)?.name;
		// ? canvas.value.style.cursor = 'nwse-resize'
		// : canvas.value.style.cursor = 'move';
	if (result) {
		console.log(result, canvasStore.selectedEl.key);
		isControlHandlerDragging = true;
		return;
	}

	// 取消所有元素的選取狀態
	for (let i = 0; i < canvasElements.length; i++) {
		const el = canvasElements[i];
		el.selected = false;
		el.controlHandlers.forEach(handler => handler.selected = false);
	}

	// 從上到下檢查點擊位置是否在元素內
	for (let i = canvasElements.length - 1; i >= 0; i--) {
		const el = canvasElements[i];
		el.checkSelected(x, y);
		if (el.selected) break;
	}

	if (canvasStore.selectedEl) {
		offsetX = x - canvasStore.selectedEl.x;
		offsetY = y - canvasStore.selectedEl.y;
		isDragging = true;
	}
}

function onMouseMove(e) {
	const rect = canvas.value.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	if (!isDragging) return;

	canvasStore.selectedEl.x = x - offsetX;
	canvasStore.selectedEl.y = y - offsetY;
}

function onMouseUp() {
	isDragging = false;
}

onMounted(() => {
	ctx = canvas.value.getContext('2d');

	canvas.value.addEventListener('mousedown', onMouseDown);
	canvas.value.addEventListener('mousemove', onMouseMove);
	canvas.value.addEventListener('mouseup', onMouseUp);
})
</script>

<style lang="scss" scoped>
.element-list {
	position: fixed;
	bottom: 8px;
	left: 8px;
	background: rgba(255, 255, 255, 0.8);
	padding: 8px;
	border-radius: 4px;
	max-height: 200px;
	overflow-y: auto;
	list-style: none;
	margin: 0;
	padding: 0;
	font-size: 12px;
}
</style>