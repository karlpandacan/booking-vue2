<template>
  <v-container>
    <v-row class="my-1">
      <v-col class="text-left" xs="6" sm="6" md="2" lg="2" xl="2">
        <v-menu
          v-model="datepickerFrom"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="params.date_from"
              label="Date From"
              prepend-inner-icon="mdi-calendar"
              readonly
              outlined
              dense
              v-bind="attrs"
              v-on="on"
              hide-details
              @change="generateTable"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="params.date_from"
            @input="datepickerFrom = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="text-left" xs="6" sm="6" md="2" lg="2" xl="2">
        <v-menu
          v-model="datepickerTo"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="params.date_to"
              label="Date To"
              prepend-inner-icon="mdi-calendar"
              readonly
              outlined
              dense
              v-bind="attrs"
              v-on="on"
              hide-details
              @change="generateTable"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="params.date_to"
            @input="datepickerTo = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col xs="6" sm="6" md="3" lg="3" xl="3">
        <v-text-field
          v-model="params.search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
          hide-details
          @change="generateTable"
        ></v-text-field>
      </v-col>

      <v-switch
        v-if="isLoggedIn"
        v-model="params.mybooking"
        @change="generateTable"
        color="primary"
        label="My Bookings"
      ></v-switch>
      <v-col v-if="isLoggedIn" class="text-right" xs="4" sm="4" md="3" lg="3" xl="3">
        <v-btn depressed color="primary" @click="showBook = true"> Book Room </v-btn>
      </v-col>
    </v-row>
    <data-table
      ref="bookings"
      :hasEdit="true"
      @edit="editItem"
      :hasDelete="true"
      @delete="deleteItem"
      :path="isLoggedIn ? '/bookings' : '/guest/bookings'"
    />
    <loading :is-loading="isLoading" />
    <booking-add
      :show="showBook"
      @close="showBook = false"
      @generate-table="generateTable"
    />
    <booking-edit
      :show="showEditBook"
      :booking="activeBooking"
      @close="showEditBook = false"
      @generate-table="generateTable"
    />
    <confirm-box
      :show="showDelete"
      :message="deleteMessage"
      @yes="submit"
      @no="showDelete = false"
    />
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Loading from "@/components/Loading";
import DataTable from "@/components/DataTable";
import BookingAdd from "@/components/Booking/Add";
import BookingEdit from "@/components/Booking/Edit";
import ConfirmBox from "@/components/ConfirmBox";
export default {
  name: "bookings",
  mixins: [validationMixin],
  components: { Loading, DataTable, BookingAdd, BookingEdit, ConfirmBox },
  validations: {
    form: {
      fullname: { required },
      email: { required },
      password: { required },
    },
  },
  data: () => ({
    showBook: false,
    showDelete: false,
    deleteMessage: "",
    showEditBook: false,
    isLoading: false,
    datepickerFrom: false,
    datepickerTo: false,
    listUrl: "",
    params: {
      date_from: new Date().toJSON().slice(0, 10).replace(/-/g, "-"),
      date_to: new Date().toJSON().slice(0, 10).replace(/-/g, "-"),
      search: "",
      mybooking: false,
    },
    alert: {
      show: true,
      message: "",
      title: "Message",
    },
    activeBooking: {},
  }),
  methods: {
    submit() {
      let url = "";
      if (this.isLoggedIn) {
        url = this.$api + "/bookings/" + this.activeBooking.id;
      } else {
        url = this.$api + "/guest/bookings";
      }
      this.$http
        .delete(url)
        .then((response) => {
          this.generateTable();
          this.isLoading = false;
          this.alert.show = true;
          this.alert.message = response.data.message;
        })
        .catch((error) => {
          let msg = "";
          if (error.response !== undefined) {
            msg = error.response.data.message;
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
    },
    generateTable() {
      let params = this.params;
      params.mybooking = params.mybooking ? 1 : 0;
      this.$refs.bookings.setParameters(params);
      this.$refs.bookings.generate();
    },
    editItem(item) {
      this.activeBooking = item;
      this.showEditBook = true;
    },
    deleteItem(item) {
      this.activeBooking = item;
      this.deleteMessage = "Are you sure you want to delete booking ";
      this.deleteMessage += item.room + " on " + item.date;
      this.deleteMessage += "?";
      this.showDelete = true;
    },
  },
  mounted() {
    this.generateTable();
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
  },
  watch: {
    "params.date_from"(newValue, oldValue) {
      if (newValue != oldValue) this.generateTable();
    },
    "params.date_to"(newValue, oldValue) {
      if (newValue != oldValue) this.generateTable();
    },
    "params.search"(newValue, oldValue) {
      if (newValue != oldValue) this.generateTable();
    },
  },
};
</script>
