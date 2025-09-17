<template>
	<div class="control-panel">
		Now selected: {{ canvasStore.selectedEl?.key || 'None' }}
		<input
			v-model="canvasStore.isDebugging"
			type="checkbox" />
		<div v-if="canvasStore.selectedEl">
			<div v-if="canvasStore.selectedEl.type === 'rect'">
				<label>
					Width:{{ width }}
					<input
						v-model.number="width"
						type="range"
						min="10"
						max="200"
						class="input"/>
				</label>
				<label>
					Height: {{ height }}
					<input
						v-model.number="height"
						type="range"
						min="10"
						max="200"
						class="input"/>
				</label>
			</div>
			<div v-if="canvasStore.selectedEl.type === 'text'">
				font-size, font-family...
				<label for="content">
					Content
					<input
						v-model="content"
						type="text"
						class="input" />
				</label>
				<label>
					Width:{{ width }}
					<input
						v-model.number="width"
						type="range"
						min="10"
						max="200"
						class="input"/>
				</label>
				<label for="fontSize">
					FontSize
					<input
						v-model="fontSize"
						type="number"
						class="input" />
				</label>
			</div>
			<label for="rotate">
				Rotation: {{ canvasStore.selectedEl?.rotationDeg || 0 }}°
				<input
					v-model.number="rotation"
					type="range"
					min="0"
					max="360"
					class="input">
			</label>
			<label for="color">
				Color: {{ canvasStore.selectedEl?.color.default || 'undefined' }}
				<ClientOnly>
					<ChromePicker v-model="color" />
				</ClientOnly>
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
				@click="canvasStore.removeEl">
				Remove
			</button>
		</div>
		<button
			class="btn-primary"
			@click="addGeometry('rect')">
			Add rectangle
		</button>
		<button
			class="btn-primary"
			@click="addGeometry('circle')">
			Add circle
		</button>
		<button
			class="btn-primary"
			@click="addText">
			Add text
		</button>
		<button
			class="btn-primary"
			@click="canvasStore.removeAll">
			Clear
		</button>
	</div>
</template>

<script setup>
import { ChromePicker } from 'vue-color';
import GeometryElement from '~/lib/GeometryElement';
import TextElement from '~/lib/TextElement';

const canvasStore = useCanvasStore();

const width = computed({
	get: () => canvasStore.selectedEl?.width || 0,
	set: val => canvasStore.updateElWidth(val),
});

const height = computed({
	get: () => canvasStore.selectedEl?.height || 0,
	set: val => canvasStore.updateElHeight(val),
});

const content = computed({
	get: () => canvasStore.selectedEl?.content || '',
	set: val => canvasStore.updateTextContent(val),
});

const fontSize = computed({
	get: () => canvasStore.selectedEl?.fontSize || '',
	set: val => canvasStore.updateFontSize(val),
});

const rotation = computed({
	get: () => canvasStore.selectedEl?.rotationDeg || 0,
	set: val => canvasStore.updateElRotation(val),
});

const color = computed({
	get: () => canvasStore.selectedEl?.color.default || '#000000',
	set: val => canvasStore.updateElColor(val),
});

function addGeometry(type) {
	const newEl = new GeometryElement({
		type,
	});
	canvasStore.addEl(newEl);
}

function addText() {
	const newEl = new TextElement({});
	canvasStore.addEl(newEl);
}
</script>

<style lang="scss" scoped>
.control-panel {
	position: fixed;
	right: 8px;
	top: 8px;
	width: 200px;
	height: calc(100vh - 16px);
	overflow-y: scroll;
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
