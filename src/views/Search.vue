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
  <p v-if="nextLink"><router-link :to="nextLink">more</router-link></p>
</template>

<script>
// @ is an alias to /src
import searchResult from "../components/searchResult.vue";

export default {
  name: "Home",
  components: {
    searchResult,
  },
  data() {
    return {
      title: "",
      list: [],
      page: 0,
      q: "",
      msg: "获取中",
      nextLink: "",
      i: 0,
    };
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
      if (this.list.length >= 20) {
        let s = new URLSearchParams();
        s.set("q", this.q);
        s.set("page", this.page ? Number(this.page) + 1 : 1);
        this.nextLink = "/search/s?" + s.toString();
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
    this.title = this.$route.query.q + " - 问答版搜索";
    document.title = this.title;
    this.q = this.$route.query.q;
    this.page = this.$route.query.page || 0;
    this.getdata();
    window.addEventListener("scroll", this.onscroll, true);
  },
  unmounted() {
    window.removeEventListener("scroll", this.onscroll, true);
  },
  beforeRouteUpdate(to, from, next) {
    this.title = this.$route.query.q + " - 问答版搜索";
    this.q = to.query.q;
    this.page = to.query.page || 0;
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