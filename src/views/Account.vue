<template>
  <v-container>
    <v-row>
      <v-col
        offset-sm="2"
        offset-md="3"
        offset-lg="4"
        offset-xl="4"
        xs="12"
        sm="8"
        md="6"
        lg="4"
        xl="4"
        class="mt-10"
      >
        <v-card class="mx-auto" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <form @submit.prevent="submit">
                <v-list-item-title class="headline mb-5">
                  Change Password
                </v-list-item-title>
                <v-alert v-if="alert.show" cols="12" :type="alert.type">
                  <span v-html="alert.message"></span>
                </v-alert>
                <v-text-field
                  label="Current Password"
                  v-model="form.current_password"
                  :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  @click:append="showCurrentPassword = !showCurrentPassword"
                  @input="$v.form.current_password.$touch()"
                  @blur="$v.form.current_password.$touch()"
                  @keyup.enter="submit"
                  :error-messages="currentPasswordErrors"
                  :disabled="isLoading"
                  dense
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  label="New Password"
                  v-model="form.new_password"
                  :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showNewPassword ? 'text' : 'password'"
                  @click:append="showNewPassword = !showNewPassword"
                  @input="$v.form.new_password.$touch()"
                  @blur="$v.form.new_password.$touch()"
                  @keyup.enter="submit"
                  :error-messages="newPasswordErrors"
                  :disabled="isLoading"
                  dense
                  outlined
                  required
                ></v-text-field>
                <v-text-field
                  label="Confirm Password"
                  v-model="form.confirm_password"
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  @click:append="showConfirmPassword = !showConfirmPassword"
                  @input="$v.form.confirm_password.$touch()"
                  @blur="$v.form.confirm_password.$touch()"
                  @keyup.enter="submit"
                  :error-messages="confirmPasswordErrors"
                  :disabled="isLoading"
                  dense
                  outlined
                  required
                ></v-text-field>
                <v-btn
                  class="py-6"
                  color="primary"
                  :loading="isLoading"
                  @click="submit"
                  block
                >
                  Submit
                </v-btn>
              </form>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, sameAs, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  name: "account",
  mixins: [validationMixin],
  validations: {
    form: {
      current_password: { required },
      new_password: {
        required,
        sameAsPassword: sameAs("confirm_password"),
        minLength: minLength(8),
        maxLength: maxLength(60),
      },
      confirm_password: {
        required,
        sameAsPassword: sameAs("new_password"),
      },
    },
  },
  data: () => ({
    isLoading: false,
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    form: {
      current_password: "",
      new_password: "",
      confirm_password: "",
      _method: "PUT",
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
          .post(this.$api + "/change-password", this.form)
          .then((resp) => {
            this.$v.$reset();
            this.alert = {
              show: true,
              type: "success",
              message: resp.data.message,
            };
            (this.form = {
              current_password: "",
              new_password: "",
              confirm_password: "",
              _method: "PUT",
            }),
              (this.isLoading = false);
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
            this.isLoading = false;
          });
      }
    },
  },
  computed: {
    currentPasswordErrors() {
      const errors = [];
      if (!this.$v.form.current_password.$dirty) return errors;
      !this.$v.form.current_password.required && errors.push("Current is required");
      return errors;
    },
    newPasswordErrors() {
      const errors = [];
      if (!this.$v.form.new_password.$dirty) return errors;
      !this.$v.form.new_password.required && errors.push("New Password is required");
      !this.$v.form.new_password.minLength && errors.push("Password minimum length is 8");
      !this.$v.form.new_password.maxLength &&
        errors.push("Password minimum length is 60");
      !this.$v.form.confirm_password.sameAsPassword &&
        errors.push("New Password must same as Confirm Password");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.form.confirm_password.$dirty) return errors;
      !this.$v.form.confirm_password.required &&
        errors.push("Confirm Password is required");
      !this.$v.form.confirm_password.sameAsPassword &&
        errors.push("Confirm Password must same as New Password");
      return errors;
    },
  },
};
</script>
