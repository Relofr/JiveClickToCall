<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th>Call</th>
          <th class="text-left">Phone Number</th>
          <th class="text-left">Name</th>
          <th class="text-left">Email</th>
          <th class="text-left">Company</th>
          <th class="text-left">Address</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, i) in users" :key="i">
          <td><v-icon @click="handleSelectedUser(user)">phone</v-icon></td>
          <td>{{ user.phoneNumber }}</td>
          <td>{{ user.firstName }} {{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.company }}</td>
          <td>{{ user.address }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    makeCall() {
      this.$store.dispatch("GET_CALL");
    },
    getContacts() {
      fetch("users.json")
        .then(response => response.json())
        .then(data => this.$store.commit("updateUsers", data));
    },
    handleSelectedUser(user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.phoneNumber = user.phoneNumber;
      this.email = user.email;
      this.company = user.company;
      this.address = user.address;
      this.dialString = user.phoneNumber;
      this.makeCall();
    }
  },
  computed: {
    users: {
      get() {
        return this.$store.state.users;
      }
    }
  },
  mounted() {
    this.getContacts();
  }
};
</script>
