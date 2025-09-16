<template>
	<div class="control-panel">
		Now selected: {{ canvasStore.selectedEl?.key || 'None' }}
		<label>
			Width:{{ width }}
			<input
				v-model.number="width"
				type="range"
				min="10"
				max="200"
				class="input"
				:disabled="!canvasStore.selectedEl" />
		</label>
		<label>
			Height: {{ height }}
			<input
				v-model.number="height"
				type="range"
				min="10"
				max="200"
				class="input"
				:disabled="!canvasStore.selectedEl" />
		</label>
		<button
			class="btn-primary"
			@click="canvasStore.sendToFront">
			Send to front
		</button>
		<button
			class="btn-primary"
			@click="canvasStore.sendToBack">
			Send to back
		</button>
		<button
			class="btn-primary"
			@click="addRect">
			Add rectangle
		</button>
	</div>
</template>

<script setup>
import Element from '@/lib/canvasElement.js';

const canvasStore = useCanvasStore();

const width = computed({
	get: () => canvasStore.selectedEl?.width || 0,
	set: val => canvasStore.updateElWidth(val),
});

const height = computed({
	get: () => canvasStore.selectedEl?.height || 0,
	set: val => canvasStore.updateElHeight(val),
});

function addRect() {
	const newEl = new Element({
		key: crypto.randomUUID(),
		type: 'rect',
		x: 50,
		y: 50,
		width: 100,
		height: 100,
		color: '#' + Math.floor(Math.random()*16777215).toString(16),
	});
	canvasStore.addElement(newEl);
}
</script>

<style lang="scss" scoped>
.control-panel {
	position: fixed;
	right: 8px;
	top: 8px;
	width: 300px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 12px;
	border-radius: 8px;
	border: 1px solid #ccc;
	background-color: #fff;

	.input	{
		width: 100%;
	}
}
</style>
