<template>
  <v-dialog v-model="showModal" transition="dialog-top-transition" :width="width">
    <template>
      <v-card>
        <v-toolbar color="primary"><b><span v-html="title"> </span></b></v-toolbar>
        <v-container class="text-center">
          <p class="my-6 mx-4" v-html="message"></p>
        </v-container>
        <v-card-actions class="justify-end">
          <v-btn color="error" @click="showModal = false"> Close </v-btn>
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
    title: {
      type: String,
      required: false,
      default: "Notification",
    },
    message: {
      type: String,
      required: false,
      default: "",
    },
  },
  data: () => ({
    showModal: false,
  }),
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "95%";
        case "sm":
          return "85%";
        default:
          return "450";
      }
    },
  },
  watch: {
    show: function () {
      this.showModal = this.show;
    },
    showModal: function () {
      if (!this.showModal) {
        this.$emit("close");
      }
    },
  },
};
</script>
