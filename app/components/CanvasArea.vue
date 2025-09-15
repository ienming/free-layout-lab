<template>
	<div>
		<canvas
			ref="canvas"
			width="800"
			height="600"
			style="border:1px solid #ccc;" />
		<ul>
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

function drawAll() {
	ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
	canvasElements.forEach(el => el.draw(ctx));
}

function onMouseDown(e) {
	const rect = canvas.value.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	[...canvasElements].forEach(el => el.checkSelected(x, y));
	canvasStore.selectedElementKey = [...canvasElements].reverse().find(el => el.selected)?.key;
	if (canvasStore.selectedElementKey) {
		offsetX = x - canvasStore.selectedElement.x;
		offsetY = y - canvasStore.selectedElement.y;
		isDragging = true;
	}
}

function onMouseMove(e) {
	if (!isDragging) return;
	
	const rect = canvas.value.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	canvasStore.selectedElement.x = x - offsetX;
	canvasStore.selectedElement.y = y - offsetY;
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
