<template>
  <v-dialog v-model="showModal" transition="dialog-top-transition" :width="width">
    <template>
      <v-card>
        <v-toolbar color="primary"><span v-html="title"> </span></v-toolbar>
        <v-container>
          <p v-html="message"></p>
        </v-container>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="answeredYes"> {{ buttonYes }} </v-btn>
          <v-btn color="error" @click="showModal = false"> {{ buttonNo }} </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>
export default {
  name: "confirm-box",
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    buttonYes: {
      type: String,
      required: false,
      default: "Yes",
    },
    buttonNo: {
      type: String,
      required: false,
      default: "No",
    },
    title: {
      type: String,
      required: false,
      default: "Please Confirm",
    },
    message: {
      type: String,
      required: false,
      default: "Are you sure you want to continue?",
    },
  },
  data: () => ({
    showModal: false,
  }),
  methods: {
    answeredYes() {
      this.$emit("yes");
      this.showModal = false;
    },
  },
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "95%";
        case "sm":
          return "85%";
        default:
          return "500";
      }
    },
  },
  watch: {
    show: function () {
      this.showModal = this.show;
    },
    showModal: function () {
      if (!this.showModal) {
        this.$emit("no");
      }
    },
  },
};
</script>
