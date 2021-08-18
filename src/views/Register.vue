<template>
  <v-container>
    <v-row class="mt-10" align="center" justify="center">
      <v-col v-if="!showTopBanner" xs="12" sm="8" md="6" lg="5" xl="3">
        <v-img src="/images/logo.jpg"></v-img>
      </v-col>
      <v-col offset-lg="1" xs="12" sm="8" md="6" lg="5" xl="3">
        <v-card class="mx-auto" outlined>
          <v-img v-if="showTopBanner" src="/images/logo.jpg"></v-img>
          <v-card-title> {{ appName }} Register </v-card-title>
          <v-list-item three-line>
            <v-list-item-content>
              <form>
                <!-- <v-list-item-title class="headline mb-3"></v-list-item-title> -->
                <v-alert v-if="alert.show" cols="12" :type="alert.type">
                  <span v-html="alert.message"></span>
                </v-alert>
                <v-text-field
                  cols="12"
                  v-model="form.fullname"
                  label="Full Name"
                  @input="$v.form.fullname.$touch()"
                  @blur="$v.form.fullname.$touch()"
                  @keyup.enter="submit"
                  :error-messages="fullnameErrors"
                  :disabled="isLoading"
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  cols="12"
                  v-model="form.username"
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
  name: "register",
  mixins: [validationMixin],
  components: { Loading },
  validations: {
    form: {
      fullname: { required },
      username: { required },
      password: { required },
    },
  },
  data: () => ({
    appName: process.env.VUE_APP_TITLE || "",
    isLoading: false,
    showPassword: false,
    form: {
      fullname: "",
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
      this.alert.show = false;
      this.isLoading = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
      } else {
        this.$http
          .post(this.$api + "/register", this.form)
          .then((resp) => {
            this.$v.$reset();
            this.alert = {
              show: true,
              type: "success",
              message: resp.data.message,
            };
            this.form = {
              username: "",
              password: "",
              fullname: "",
            }
          })
          .catch((err) => {
            let msg = "";
            if (err.response.data.message) {
              msg = err.response.data.message;
            } else {
              msg = "Something went wrong. Please contact the administrator";
            }
            this.alert = {
              show: true,
              type: "error",
              message: msg,
            };
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
  },
  computed: {
    fullnameErrors() {
      const errors = [];
      if (!this.$v.form.fullname.$dirty) return errors;
      !this.$v.form.fullname.required && errors.push("Full Name is required");
      return errors;
    },
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
