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
      <search-result
        :keyword="r.Key"
        :href="r.Link"
        :title="r.Title"
        :txt="r.Txt"
        :txt1="r.Txt1"
      ></search-result>
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

<script>
import searchResult from "../components/searchResult.vue";
import { defineComponent } from 'vue'


export default defineComponent({
  name: "Search",
  components: {
    searchResult,
  },
  data() {
    return {
      list: [],
      msg: "获取中",
      nextLink: "",
    };
  },
  props: {
    title: String,
    q: String,
    page: Number,
  },
  methods: {
    async getdata() {
      this.i = 0;
      let s = new URLSearchParams();
      s.set("q", this.q);
      s.set("page", this.page);
      const response = await fetch("/search/api/s?" + s.toString());
      const json = await response.json();
      if (json.code != 0) {
        this.msg = json.msg;
        return;
      }
      this.list.push(...json.Data);
      if (json.Data.length >= 20) {
        let s = new URLSearchParams();
        s.set("q", this.q);
        s.set("page", this.page ? Number(this.page) + 1 : 1);
        this.nextLink = "/search/s?" + s.toString();
      } else {
        this.nextLink = "";
      }
      if (this.list.length >= 500) {
        this.list = this.list.slice(100, this.list.length);
      }
    },
    enter(el, done) {
      this.i = this.i + 80;
      el.style["animation-delay"] = `${this.i}ms`;
      done();
    },
    onscroll(e) {
      if (e.length > 0 && e[0].intersectionRatio > 0 && this.nextLink != "") {
        this.$router.push(this.nextLink);
      }
    },
  },
  watch: {
    page() {
      this.getdata();
    },
  },
  mounted() {
    document.title = this.title;
    (async () => {
      await this.getdata();
      this.o = new IntersectionObserver(this.onscroll);
      this.o.observe(this.$refs.bottom);
    })();
  },
  unmounted() {
    this.o.disconnect();
  },
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