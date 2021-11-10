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
    <div v-for="r in list" :key="r.link" class="result">
      <search-result :keyword="r.key" :href="r.link" :title="r.title" :txt="r.txt" :txt1="r.txt1"></search-result>
    </div>
  </transition-group>
  <div v-else>
    <p>{{ msg }}</p>
  </div>
  <hr />
  <div ref="bottom">
    <next-link :page="page" :count="count" :nextLink="link"></next-link>
  </div>
</template>

<script setup lang="ts">
import searchResult from "../components/searchResult.vue";
import { ref, watch, toRefs, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import nextLink from "../components/nextLink.vue"

let count = ref(0)
let link = ref("")
let list = ref([] as SearchResultList[])
let msg = ref("获取中")

const props = defineProps({
  title: String,
  q: String,
  page: Number,
})

let p = toRefs(props)

let i = 0

function enter(el: Element, done: () => void) {
  if (el instanceof HTMLElement) {
    i = i + 80;
    el.style["animation-delay"] = `${i}ms`;
    done();
  }
}

interface SearchResult {
  code: number,
  msg: string,
  data: SearchResultData,
}

interface SearchResultData {
  list: SearchResultList[],
  count: number,
}

interface SearchResultList {
  link: string,
  title: string,
  txt: string,
  txt1: string,
  key: string,
}

async function getdata() {
  i = 0;
  let s = new URLSearchParams();
  s.set("q", props.q);
  s.set("page", String(props.page));
  const response = await fetch("/search/api/s?" + s.toString());
  const json: SearchResult = await response.json();
  if (json.code != 0) {
    msg.value = json.msg;
    return;
  }
  count.value = json.data.count;
  list.value.push(...json.data.list);
  if (json.data.list.length >= 20 && json.data.count > props.page * 20) {
    let s = new URLSearchParams();
    s.set("q", props.q);
    s.set("page", props.page ? String(Number(props.page + 1)) : "1");
    link.value = "/search/s?" + s.toString();
  } else {
    link.value = "";
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
  if (e.length > 0 && e[0].intersectionRatio > 0 && link.value != "") {
    router.push(link.value);
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