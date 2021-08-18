<template>
  <div class="autocomplete">
    <input
      type="text"
      @input="onChange"
      v-model="search"
      :disabled="disablestate"
      :class="classname"
      :name="inputname"
      :id="inputid"
      :placeholder="placeholder"
      @keyup.down="onArrowDown"
      @keyup.up="onArrowUp"
      @keyup.enter="onEnter"
      autocomplete="off"
    />
    <ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
      <li class="loading" v-if="isLoading">Loading results...</li>
      <li
        v-else
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result.id, result.value)"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
      >{{ result.value }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "Autocomplete",
  template: "#autocomplete",
  props: {
    path: {
      type: String,
      required: true,
      default: ""
    },
    classname: {
      type: String,
      required: false,
      default: "form-control"
    },
    inputname: {
      type: String,
      required: false,
      default: "autocomplete"
    },
    inputid: {
      type: String,
      required: false,
      default: "autocomplete"
    },
    placeholder: {
      type: String,
      required: false,
      default: ""
    },
    disablestate: {
      type: Boolean,
      required: false,
      default: true
    },
    isAsync: {
      type: Boolean,
      required: false,
      default: false
    },
    searchVal: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      isOpen: false,
      results: [],
      search: "",
      isLoading: false,
      arrowCounter: 0,
      items: []
    };
  },

  methods: {
    onChange() {
      // Let's warn the parent that a change was made
      this.$emit("input", this.search);

      // Is the data given by an outside ajax request?
      if (this.isAsync) {
        this.isLoading = true;
      }
      this.isOpen = true;
      this.filterResults();
    },

    filterResults() {
      // first uncapitalize all the things
      this.$http
        .get(
          process.env.VUE_APP_API_BASE_URL +
            this.path +
            "?search=" +
            this.search
        )
        .then(response => {
          this.results = response.data.response.data;
          this.isLoading = false;
        })
        .catch(() => {});
    },
    setResult(id, value) {
      this.search = value;
      this.isOpen = false;
      this.$emit("setValue", { id, value });
    },
    onArrowDown(evt) {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      let id = this.results[this.arrowCounter].id;
      let value = this.results[this.arrowCounter].value;
      this.search = this.results[this.arrowCounter].value;
      this.setResult(id, value);
      this.isOpen = false;
      this.arrowCounter = -1;
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
    searchValue: function(val) {
      this.search = val;
    }
  },
  watch: {
    items: function(val, oldValue) {
      // actually compare them
      if (val.length !== oldValue.length) {
        this.results = val;
        this.isLoading = false;
      }
    },
    serach: function(val) {}
  },
  mounted() {
    this.searchValue();
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script>