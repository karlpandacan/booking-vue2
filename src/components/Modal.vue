<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent :max-width="maxWidth">
      <v-card>
        <v-card-title>
          <slot name="header"></slot>
        </v-card-title>
        <v-card-text>
          <slot name="body"></slot>
        </v-card-text>
        <v-card-actions>
          <slot name="footer"></slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  name: "modal",
  props: {
    maxWith: {
      type: String,
      required: false,
      default: "500px",
    },
  },
};
</script>