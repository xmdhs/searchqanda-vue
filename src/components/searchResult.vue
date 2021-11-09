<template>
  <h3>
    <a :href="href" target="_blank">{{ title }}</a>
  </h3>
  <blockquote>
    <p>
      {{ txt }}<span class="red">{{ keyword }}</span
      >{{ txt1 }}
    </p>
  </blockquote>
</template>

<script setup lang="ts">
const props = defineProps({
    href: String,
    title: String,
    txt: String,
    keyword: String,
    txt1: String,
})
</script>

<style scoped>
.red {
  color: red;
}
</style>