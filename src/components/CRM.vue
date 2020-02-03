<template>
  <div>
    <v-layout justify-end>
      <Modal title="Create Contact" buttonTitle="Create Contact" />
    </v-layout>
    <br />
    <v-divider></v-divider>
    <br />
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
            <th class="text-left">Favorite</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td><v-icon @click="handleSelectedUser(user)">phone</v-icon></td>
            <td>{{ user.phoneNumber }}</td>
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.company }}</td>
            <td>{{ user.address }}</td>
            <td>
              <v-icon v-if="!user.isFavorite" color="orange"
                >mdi-star-outline</v-icon
              >
              <v-icon v-if="user.isFavorite" color="orange">mdi-star</v-icon>
            </td>
            <td>
              <v-icon color="red" @click="removeContact(index)"
                >mdi-delete</v-icon
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-divider></v-divider>
  </div>
</template>

<script>
import Modal from "./Modal";
export default {
  data() {
    return {};
  },
  components: {
    Modal
  },
  methods: {
    removeContact(index) {
      var arr = this.$store.state.savedContacts;
      for (var i = 0; i < arr.length; i++) {
        if (index[i] === arr[i].index) {
          arr.splice(index, 1);
          localStorage.setItem("savedContacts", JSON.stringify(arr));
          break;
        }
      }
    },
    makeCall() {
      this.$store.dispatch("GET_CALL");
    },
    getContacts() {
      this.$store.commit("updateUsers", JSON.parse(localStorage.savedContacts));
    },
    handleSelectedUser(user) {
      this.$store.state.dialString = user.phoneNumber;
      this.makeCall();
      this.$store.state.dialString = "";
    }
  },
  computed: {
    users: {
      get() {
        return this.$store.state.savedContacts;
      }
    }
  },
  mounted() {
    if (localStorage.savedContacts) {
      this.getContacts();
    }
  }
};
</script>
