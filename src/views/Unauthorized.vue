<template>
  <v-container class="mt-8">
    <v-row>
      <v-col cols="10" offset="1" align="center" justify="center">
        <v-card class="px-12 py-12">
          <v-row class="mt-8">
            <v-col cols="12">
              <v-icon color="secondary" :size="iconSize"> mdi-lock-outline </v-icon>
            </v-col>
          </v-row>
          <v-row class="mt-8">
            <v-col cols="8" offset="2">
              <p class="text-h5 text--secondary">You Are Accessing Beyond Your Limit</p>
              <p class="text-h5 text--secondary">Unauthorized (401)</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "unauthorized",
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
