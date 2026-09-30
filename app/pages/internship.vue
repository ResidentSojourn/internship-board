<script setup lang="ts">
const counter = useState('counter', () => Math.round(Math.random() * 1000))
</script>

<template>
	<div>
		<h2>
			Intership Number {{ counter }}
		</h2>
		<button @click="counter++"> MORE </button>
		<button @click="counter--"> LESS </button>
	</div>
</template>
