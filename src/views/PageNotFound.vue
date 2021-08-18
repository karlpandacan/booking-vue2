<template>
  <v-container class="mt-8">
    <v-row>
      <v-col cols="10" offset="1" align="center" justify="center">
        <v-card class="px-12 py-12">
          <v-row class="mt-8">
            <v-col cols="12">
              <v-icon color="secondary" :size="iconSize"> mdi-file-remove </v-icon>
            </v-col>
          </v-row>
          <v-row class="mt-8">
            <v-col cols="12" >
              <p class="text-h5 text--secondary">Error Four Oh Four!</p>
              <p class="text-h5 text--secondary">
                You're in a location where you are not supposed to be.
              </p>
              <p class="text-h5 text--secondary">Page Not Found</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- mdiBookOffOutline  -->
</template>
<script>
export default {
  name: "pagenotfound",
  computed: {
    iconSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "12em";
        case "sm":
          return "20em";
        default:
          return "23em";
      }
    },
  },
};
</script>
