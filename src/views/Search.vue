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
  <p v-if="nextLink">
    <router-link :to="nextLink">more</router-link>
  </p>
  <p v-else>没有了</p>
</template>

<script>
// @ is an alias to /src
import searchResult from "../components/searchResult.vue";

export default {
  name: "Search",
  components: {
    searchResult,
  },
  data() {
    return {
      list: [],
      msg: "获取中",
      nextLink: "",
      i: 0,
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
        window.removeEventListener("scroll", this.onscroll, true);
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
    onscroll() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;

      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      if (scrollTop + windowHeight >= scrollHeight) {
        this.$router.push(this.nextLink);
      }
    },
  },
  mounted() {
    this.getdata();
    document.title = this.title;
    window.addEventListener("scroll", this.onscroll, true);
  },
  unmounted() {
    window.removeEventListener("scroll", this.onscroll, true);
  },
  beforeRouteUpdate(to,from,next) {
    this.getdata();
    next();
  },
};
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