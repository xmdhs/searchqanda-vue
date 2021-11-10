<template>
    <div v-if="nextLink">
        <router-link :to="nextLink">{{ page - 1 + " / " + allpage }}</router-link>
    </div>
    <div v-else>没有了</div>
</template>

<script setup lang="ts">
import { ref,watchEffect } from 'vue'
const props = defineProps({
    page: Number,
    count: Number,
    nextLink: String
})
let allpage = ref(0)

watchEffect(() => {
    allpage.value = Number((props.count / 20).toFixed(0))
})
</script>