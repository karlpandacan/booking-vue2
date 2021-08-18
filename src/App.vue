<template>
  <v-app>
    <v-app-bar class="flex-grow-0" color="primary" dense dark>
      <!-- <v-app-bar-nav-icon v-if="isLoggedIn"></v-app-bar-nav-icon> -->

      <v-toolbar-title>FileInvite Exam</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu left bottom>
        <!-- <router-link to="/register"> -->
        Register
        <!-- </router-link> -->
      </v-menu>
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>
      <v-btn v-if="isLoggedIn" @click="logout" text>
        Logout<v-icon>mdi-logout</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab v-if="!isLoggedIn" :to="{ name: 'home' }" link exact>Login</v-tab>
          <v-tab v-if="!isLoggedIn" :to="{ name: 'register' }" link exact>Register</v-tab>
          <v-tab :to="{ name: 'bookings' }" link exact>Bookings</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    appName: process.env.VUE_APP_TITLE,
    drawer: true,
  }),
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      if (this.$vuetify.theme.dark) {
        this.$store.dispatch("setToDarkTheme");
      } else {
        this.$store.dispatch("setToLightTheme");
      }
    },
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
    displayname: function () {
      return this.$store.getters.displayname;
    },
    isDarkTheme: function () {
      return this.$store.getters.isDarkTheme;
    },
    currentRouteName: function () {
      return this.$route.name;
    },
  },
  mounted() {
    const theme = this.$store.getters.isDarkTheme;
    if (theme) {
      this.$vuetify.theme.dark = true;
    } else {
      this.$vuetify.theme.dark = false;
    }
  },
};
</script>
