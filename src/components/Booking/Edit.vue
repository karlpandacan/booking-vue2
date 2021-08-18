<template>
  <v-dialog v-model="showModal" transition="dialog-top-transition" :width="width">
    <v-card ref="listMessages">
      <v-toolbar color="primary">
        <v-toolbar-title> Book Room </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="showModal = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container>
        <v-alert v-if="alert.show" cols="12" :type="alert.type">
          <span v-html="alert.message"></span>
        </v-alert>
        <form @submit.prevent="submit">
          <v-menu
            v-model="datepicker1"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.date"
                label="Select Date"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                v-bind="attrs"
                v-on="on"
                @change="$v.form.date.$touch()"
                @blur="$v.form.date.$touch()"
                :error-messages="dateErrors"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.date"
              @input="datepicker1 = false"
            ></v-date-picker>
          </v-menu>
          <v-menu
            ref="timepicker"
            v-model="timeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="form.time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.time"
                label="Time"
                prepend-inner-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                @input="$v.form.time.$touch()"
                @blur="$v.form.time.$touch()"
                :error-messages="timeErrors"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="timeMenu"
              v-model="form.time"
              full-width
              min="8:00"
              max="17:00"
              @click:minute="$refs.timepicker.save(form.time)"
            ></v-time-picker>
          </v-menu>
          <v-select
            v-model="form.time_span"
            label="Time Span"
            prepend-inner-icon="mdi-timer-outline"
            :items="intervals"
            outlined
            item-text="name"
            item-value="id"
            @input="$v.form.time_span.$touch()"
            @blur="$v.form.time_span.$touch()"
            :error-messages="timeSpanErrors"
          ></v-select>

          <v-select
            v-model="form.room"
            label="Room"
            prepend-inner-icon="mdi-map-marker"
            :items="rooms"
            item-text="name"
            item-value="id"
            :disabled="enablePickRoom"
            outlined
            @input="$v.form.room.$touch()"
            @blur="$v.form.room.$touch()"
            :error-messages="roomErrors"
          ></v-select>
        </form>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text @click="showModal = false"> Close </v-btn>
        <v-btn color="secondary" text @click="submit"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  name: "booking-add",
  mixins: [validationMixin],
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    booking: {
      type: Object,
      required: true,
      default: function () {
        return {
          id: "",
          date: "",
          room: "",
          time_span: "",
          time: "",
        };
      },
    },
  },
  validations: {
    form: {
      date: { required },
      time_span: { required },
      time: { required },
      room: { required },
    },
  },
  data: () => ({
    isLoading: false,
    showModal: false,
    firstLoad: false,
    intervals: [
      { id: "30minutes", name: "30 Minutes" },
      { id: "1hour", name: "1 Hour" },
    ],
    datepicker1: false,
    timeMenu: false,
    rooms: [],
    alert: {
      show: false,
      type: "success",
      message: "",
    },
    form: {
      date: "",
      time_span: "",
      time: "",
      room: "",
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
        let url = this.$api + "/bookings/" + this.booking.id;
        this.$http
          .put(url, this.form)
          .then((response) => {
            this.alert = {
              show: true,
              type: "success",
              message: response.data.message,
            };
            this.$v.$reset();
            this.$emit("generateTable");
          })
          .catch((error) => {
            let message = "";
            if (error.response !== undefined) {
              message = error.response.data.message;
            } else {
              message = "Something went wrong! Please Contact the administrator";
            }

            this.alert = {
              show: true,
              type: "error",
              message: message,
            };
          });
      }
    },
    async getAvailableRooms() {
      let url =
        this.$api +
        "/rooms?date=" +
        this.form.date +
        "&interval=" +
        this.form.time_span +
        "&time=" +
        this.form.time +
        "&booking=" + this.booking.id;
      this.$http.get(url).then((response) => {
        this.rooms = response.data.response;
        if (this.firstLoad) {
          let availableRooms = response.data.response;
          let index = availableRooms.findIndex((key) => key.name == this.booking.room);
          this.form.room = this.rooms[index].id;
          this.firstLoad = false;
        }
      });
    },
  },
  computed: {
    enablePickRoom() {
      return this.form.date == "" && this.form.time == "" && this.form.time_span == "";
    },
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
    dateErrors() {
      const errors = [];
      if (!this.$v.form.date.$dirty) return errors;
      !this.$v.form.date.required && errors.push("Date is required");
      return errors;
    },
    timeSpanErrors() {
      const errors = [];
      if (!this.$v.form.time_span.$dirty) return errors;
      !this.$v.form.time_span.required && errors.push("Time Span is required");
      return errors;
    },
    timeErrors() {
      const errors = [];
      if (!this.$v.form.time.$dirty) return errors;
      !this.$v.form.time.required && errors.push("Time is required");
      return errors;
    },
    roomErrors() {
      const errors = [];
      if (!this.$v.form.room.$dirty) return errors;
      !this.$v.form.room.required && errors.push("Room is required");
      return errors;
    },
  },
  watch: {
    show() {
      this.showModal = this.show;
      if (this.show) {
        this.$v.$reset();
        this.firstLoad = true;
        let from = this.booking.date + " " + this.booking.time_from;
        let to = this.booking.date + " " + this.booking.time_to;
        this.form.date = this.booking.date;
        this.form.time = this.booking.time_from.slice(0, 5);
        let diff = Math.abs(new Date(from) - new Date(to));
        let minDiff = Math.floor(diff / 1000 / 60);
        if (minDiff == 30) {
          this.form.time_span = "30minutes";
        } else {
          this.form.time_span = "1hour";
        }
        this.getAvailableRooms();
      }
    },
    showModal() {
      if (!this.showModal) {
        this.form = {
          date: "",
          time_span: "",
          time: "",
          room: "",
        };
        this.alert.show = false;
        this.$emit("close");
      }
    },
    "form.date"() {
      if (this.showModal) this.getAvailableRooms();
    },
    "form.time_span"() {
      if (this.showModal) this.getAvailableRooms();
    },
    "form.time"() {
      if (this.showModal) this.getAvailableRooms();
    },
  },
};
</script>
