<template>
  <h1>{{ title }}</h1>
  <transition-group
    v-if="list.length > 0"
    name="result-list"
    tag="div"
    class="result-list"
    :css="false"
    @enter="enter"
  >
    <div v-for="r in list" :key="r" class="result">
      <search-result :keyword="r.Key" :href="r.Link" :title="r.Title" :txt="r.Txt" :txt1="r.Txt1"></search-result>
    </div>
  </transition-group>
  <div v-else>
    <p>{{ msg }}</p>
  </div>
  <hr />
  <div ref="bottom">
    <p v-if="nextLink">
      <router-link :to="nextLink">more</router-link>
    </p>
    <p v-else>没有了</p>
  </div>
</template>

<script setup lang="ts">
import searchResult from "../components/searchResult.vue";
import { ref, watch, toRefs, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'


let list = ref([])
let nextLink = ref("")
let msg = ref("获取中")

const props = defineProps({
  title: String,
  q: String,
  page: Number,
})

let p = toRefs(props)

let i = 0

function enter(el: any, done: () => void) {
  i = i + 80;
  el.style["animation-delay"] = `${i}ms`;
  done();
}

async function getdata() {
  i = 0;
  let s = new URLSearchParams();
  s.set("q", props.q);
  s.set("page", String(props.page));
  const response = await fetch("/search/api/s?" + s.toString());
  const json = await response.json();
  if (json.code != 0) {
    msg.value = json.msg;
    return;
  }
  list.value.push(...json.Data);
  if (json.Data.length >= 20) {
    let s = new URLSearchParams();
    s.set("q", props.q);
    s.set("page", props.page ? String(Number(props.page + 1)) : "1");
    nextLink.value = "/search/s?" + s.toString();
  } else {
    nextLink.value = "";
  }
  if (list.value.length >= 500) {
    list.value = list.value.slice(100, list.value.length);
  }
}

watch(p.page, () => {
  getdata();
});

let o: IntersectionObserver;
const router = useRouter()

function onscroll(e: IntersectionObserverEntry[]) {
  if (e.length > 0 && e[0].intersectionRatio > 0 && nextLink.value != "") {
    router.push(nextLink.value);
  }
}

const bottom = ref(null)


onMounted(() => {
  document.title = props.title;
  getdata();
  nextTick(() => {
    o = new IntersectionObserver(onscroll);
    o.observe(bottom.value);
  })
});

onUnmounted(() => {
  o.disconnect();
});

</script>

<style scoped>
.result {
  animation-name: fadeIn;
  animation-duration: 1s;
  opacity: 0;
  animation-fill-mode: forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>