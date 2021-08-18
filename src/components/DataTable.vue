<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="isLoading"
      loading-text="Loading... Please wait."
      class="elevation-1"
      hide-default-footer
      disable-pagination
      :singleExpand="false"
      :options.sync="options"
    >
      <template v-if="hasEdit || hasDelete || hasView" v-slot:[`item.actions`]="{ item }">
        <div>
          <v-icon> </v-icon>
          <!-- hasView -->
          <v-icon
            color="secondary"
            v-if="hasView"
            medium
            class="mr-2 float-center"
            @click="$emit('view', item)"
          >
            mdi-file-eye
          </v-icon>
          <!-- hasEdit -->
          <v-icon
            color="secondary"
            v-if="hasEdit"
            medium
            class="mr-2"
            @click="$emit('edit', item)"
          >
            mdi-pencil
          </v-icon>
          <!-- hasDelete -->
          <v-icon color="error" v-if="hasDelete" medium @click="$emit('delete', item)">
            mdi-delete
          </v-icon>
        </div>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">{{ item.remarks }}</td>
      </template>
    </v-data-table>
    <v-row class="justify-center align-center">
      <v-col>
        <v-pagination
          v-model="pagination.current_page"
          :length="pagination.last_page"
          @input="onPageChange"
        ></v-pagination>
      </v-col>
      <v-col sm="2"> </v-col>
      <v-spacer></v-spacer>
      <v-col sm="3" class="text-right float-center">
        {{ pagination.first_item }}
        to {{ pagination.last_item }} of
        {{ pagination.total }}
      </v-col>
    </v-row>

    <alert-box
      :show="alert.show"
      :title="alert.title"
      :message="alert.message"
      @close="alert.show = false"
    />
  </div>
</template>

<script>
import downloadexcel from "vue-json-excel";
import AlertBox from "./AlertBox.vue";
export default {
  name: "data-table",
  components: { downloadexcel, AlertBox },
  props: {
    path: {
      type: String,
      required: true,
      default: "",
    },
    hasEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasView: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
    options: {},
    pagination: {
      current_page: 1,
      total: 0,
    },
    headers: [],
    rows: [],
    parameters: [],
    isLoading: false,
    alert: {
      show: false,
      title: "Notification",
      message: "Error Loading Data",
    },
  }),
  methods: {
    async fetchExcelData() {
      var requestUrl = "";
      if (this.path.includes("?")) {
        requestUrl = this.path + "&isexcel=1" + this.parameters;
      } else {
        requestUrl = this.path + "?isexcel=1" + this.parameters;
      }
      const response = await this.$axios.get(requestUrl);
      return response.data.response.data;
    },
    /** For General Use. */
    setParameters(param) {
      this.pagination.current_page = 1;
      this.parameters = "";
      if (Object.keys(param).length === 0) {
        this.parameters = "";
      } else {
        for (const key of Object.keys(param)) {
          this.parameters += "&" + key + "=" + param[key];
        }
      }
    },
    /** Generate Table Data Functions */
    generate() {
      this.isLoading = true;
      this.rows = [];
      var requestUrl = this.$api;
      if (this.path.includes("?")) {
        requestUrl +=
          this.path + "&page=" + this.pagination.current_page + this.parameters;
      } else {
        requestUrl +=
          this.path + "?page=" + this.pagination.current_page + this.parameters;
      }
      if (this.options.sortBy.length > 0) {
        requestUrl += "&sort=" + this.options.sortBy[0];
        requestUrl += "&sord=" + (this.options.sortDesc[0] ? 'desc' : 'asc')
      }
      this.$http
        .get(requestUrl)
        .then((response) => {
          this.headers = response.data.response.headers;
          this.rows = response.data.response.data;
          this.pagination = response.data.response.pagination;
          this.isLoading = false;
        })
        .catch(() => {
          this.alert.show = true;
          this.isLoading = false;
        });
    },
    onPageChange() {
      this.generate();
    },
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
  },
  watch: {
    options: {
      handler() {
        this.generate();
      },
    },
  },
};
</script>
<style lang="scss">
.theme--light.v-pagination .v-pagination__item--active {
  color: #00b4ee;
}
.v-pagination {
  justify-content: left !important;
  .v-pagination__item--active {
    color: #00b4ee;
  }
}
</style>
