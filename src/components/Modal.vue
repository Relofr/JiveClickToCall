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
        <v-card-title class="headline orange white--text" primary-title>
          {{ title }}
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="firstName"
                  :rules="[v => !!v || 'First name is required']"
                  label="First Name"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="lastName"
                  :rules="[v => !!v || 'Last name is required']"
                  label="Last Name"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              v-model="phoneNumber"
              :rules="phoneNumberRules"
              label="Phone Number"
              required
            ></v-text-field>
            <v-text-field v-model="email" label="Email"></v-text-field>
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
            <br />
            <v-layout class="justify-space-between">
              <v-btn color="error" class="mr-4" @click="dialog = false">
                cancel
              </v-btn>
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                create
              </v-btn>
            </v-layout>
          </v-form>
        </v-card-text>
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
      valid: true,
      phoneNumberRules: [
        v => !!v || "Phone Number is required",
        v => /^[0-9]*$/.test(v) || "Phone Number must be valid"
      ],
      phoneNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      address: ""
    };
  },

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$store.state.savedContacts.push({
          phoneNumber: this.phoneNumber,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email || "No Email",
          company: this.company || "No Company",
          address: this.address || "No Address"
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
