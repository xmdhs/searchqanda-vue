<template>
  <h1>{{ title }}</h1>
  <div v-if="list.length > 0">
    <search-result
      v-for="r in list"
      :key="r.Link"
      :keyword="r.Key"
      :href="r.Link"
      :title="r.Title"
      :txt="r.Txt"
      :txt1="r.Txt1"
    ></search-result>
  </div>
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
    };
  },
  methods: {
    async getdata() {
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
    },
  },
  mounted() {
    this.title = this.$route.query.q + " - 问答版搜索";
    document.title = this.title;
    this.q = this.$route.query.q;
    this.page = this.$route.query.page || 0;
    this.getdata();
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
