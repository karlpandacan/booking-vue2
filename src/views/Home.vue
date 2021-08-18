<template>
  <v-container>
    <v-row class="mt-10" align="center" justify="center">
      <v-col v-if="!showTopBanner" xs="12" sm="8" md="6" lg="5" xl="3">
        <v-img src="/images/logo.jpg"></v-img>
      </v-col>
      <v-col offset-lg="1" xs="12" sm="8" md="6" lg="5" xl="3">
        <v-card class="mx-auto" outlined>
          <v-img v-if="showTopBanner" src="/images/logo.jpg"></v-img>
          <v-card-title> {{ appName }} Login </v-card-title>
          <v-list-item three-line>
            <v-list-item-content>
              <form>
                <!-- <v-list-item-title class="headline mb-3"></v-list-item-title> -->
                <v-alert v-if="alert.show" cols="12" :type="alert.type">
                  <span v-html="alert.message"></span>
                </v-alert>
                <v-text-field
                  cols="12"
                  v-model="form.username"
                  prepend-inner-icon="mdi-account"
                  label="Username"
                  @input="$v.form.username.$touch()"
                  @blur="$v.form.username.$touch()"
                  @keyup.enter="submit"
                  :error-messages="usernameErrors"
                  :disabled="isLoading"
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  cols="12"
                  v-model="form.password"
                  prepend-inner-icon="mdi-key"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  label="Password"
                  @input="$v.form.password.$touch()"
                  @blur="$v.form.password.$touch()"
                  @keyup.enter="submit"
                  :error-messages="passwordErrors"
                  :disabled="isLoading"
                  outlined
                  required
                ></v-text-field>
              </form>
              <v-btn
                class="py-6"
                color="primary"
                :loading="isLoading"
                @click="submit"
                block
              >
                Submit
              </v-btn>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <loading :is-loading="isLoading" />
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Loading from "../components/Loading";
export default {
  name: "home",
  mixins: [validationMixin],
  components: { Loading },
  validations: {
    form: {
      password: { required },
      username: { required },
    },
  },
  data: () => ({
    appName: process.env.VUE_APP_TITLE || "",
    isLoading: false,
    showPassword: false,
    form: {
      username: "",
      password: "",
    },
    alert: {
      show: false,
      message: "",
      type: "error",
    },
  }),
  methods: {
    submit() {
      this.isLoading = true;
      this.alert.show = false;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
        this.alert = {
          show: true,
          type: "error",
          message: "Please Check Errors Below",
        };
      } else {
        this.$store
          .dispatch("login", this.form)
          .then((response) => {
            setTimeout(() => {
              this.$router.push({
                name: "bookings",
              });
              this.isLoading = false;
            }, 1000);
          })
          .catch((err) => {
            setTimeout(() => {
              let msg = "";
              if (err.response != undefined) {
                msg = err.response.data.message;
              } else {
                msg = "Something went wrong. Please contact the administrator";
              }
              this.alert = {
                show: true,
                type: "error",
                message: msg,
              };
              this.isLoading = false;
            }, 1000);
          });
      }
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.form.username.$dirty) return errors;
      !this.$v.form.username.required && errors.push("Username is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.form.password.$dirty) return errors;
      !this.$v.form.password.required && errors.push("Password is required");
      return errors;
    },
    showTopBanner() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 220;
        case "sm":
          return 400;
        case "md":
          return false;
        case "lg":
          return false;
        case "xl":
          return false;
        default:
          return false;
      }
    },
  },
};
</script>
