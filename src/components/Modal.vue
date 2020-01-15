<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="orange" dark v-on="on">
          {{ buttonTitle }}
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ title }}
        </v-card-title>

        <v-card-text>
          <form>
            <v-text-field
              v-model="phoneNumber"
              label="Phone Number"
              required
            ></v-text-field>
            <v-text-field
              v-model="firstName"
              label="First Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="lastName"
              label="Last Name"
              required
            ></v-text-field>
            <v-text-field
              :rules="emailRules"
              v-model="email"
              label="Email"
              required
            ></v-text-field>
            <v-text-field
              v-model="company"
              label="Company"
              required
            ></v-text-field>
            <v-text-field
              v-model="address"
              label="Address"
              required
            ></v-text-field>
          </form>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn color="error" @click="dialog = false">
            cancel
          </v-btn>
          <v-btn color="primary" @click="createContact">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["title", "buttonTitle"],
  data() {
    return {
      dialog: false,
      //   contacts: [],
      phoneNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      address: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },

  methods: {
    createContact() {
      this.$store.state.savedContacts.push({
        phoneNumber: this.phoneNumber,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        company: this.company,
        address: this.address
      });

      localStorage.setItem(
        "savedContacts",
        JSON.stringify(this.$store.state.savedContacts)
      );
      setTimeout(() => {
        this.dialog = false;
        location.reload();
      }, 100);
    }
  },
  computed: {
    savedContacts: {
      get() {
        return this.$store.state.savedContacts;
      },
      set(value) {
        this.$store.commit("updateSavedContacts", value);
      }
    }
  },
  mounted() {
    if (localStorage.savedContacts != null) {
      this.$store.state.savedContacts = JSON.parse(localStorage.savedContacts);
    }
  }
};
</script>
