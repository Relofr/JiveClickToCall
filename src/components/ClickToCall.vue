<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-5 xs12>
        <v-layout justify-center>
          <v-text-field
            prepend-icon="phone"
            label="Phone Number"
            :rules="phoneNumberRegex"
            v-model="dialString"
          ></v-text-field>
          <v-btn color="primary" @click="makeCall()"
            >Call
            <v-icon>phone</v-icon>
          </v-btn>
        </v-layout>
        <v-layout>
          <CallPop />
        </v-layout>
        <v-layout>
          <v-flex lg text-left>
            <CRM />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "../store/store";
import { webSockMixin } from "../websocket";
import CallPop from "./CallPop";
import CRM from "./CRM";
export default {
  name: "ClickToCall",
  mixins: [webSockMixin],
  data() {
    return {
      displayNumber: "",
      timeOfCall: "",
      phoneNumberRegex: [
        v => !!v || "Phone number is required",
        v =>
          /([0-9\s-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(
            v
          ) || "Phone number must be valid"
      ]
    };
  },
  components: {
    CallPop,
    CRM
  },
  methods: {
    makeCall() {
      this.$store.dispatch("GET_CALL");
    },
    getTimeStamp() {
      var t = new Date();
      var newTime = t.toLocaleTimeString().replace(/:\d+ /, " ");

      var d = new Date();
      var newDate = d.toLocaleDateString();

      var z = new Date();
      var newTimezone = z
        .toLocaleTimeString("en-us", { timeZoneName: "short" })
        .split(" ")[2];

      var endResult = newDate + " - " + newTime + " - " + newTimezone;
      this.timeOfCall = endResult;
    },
    searchContacts() {
      var arr = this.$store.state.users;
      var mapData = arr.map(item => ({
        firstName: item.firstName,
        lastName: item.lastName,
        phoneNumber: item.phoneNumber,
        email: item.email,
        company: item.company,
        address: item.address
      }));

      for (var i = 0; i < mapData.length; i++) {
        if (mapData[i].phoneNumber == this.displayNumber) {
          this.firstName = mapData[i].firstName;
          this.lastName = mapData[i].lastName;
          this.email = mapData[i].email;
          this.company = mapData[i].company;
          this.address = mapData[i].address;
        }
      }
    }
  },
  computed: {
    dialString: {
      get() {
        return this.$store.state.dialString;
      },
      set(value) {
        this.$store.commit("updateDialString", value);
      }
    },
    firstName: {
      get() {
        return this.$store.state.firstName;
      },
      set(value) {
        this.$store.commit("updateFirstName", value);
      }
    },
    lastName: {
      get() {
        return this.$store.state.lastName;
      },
      set(value) {
        this.$store.commit("updateLastName", value);
      }
    },
    phoneNumber: {
      get() {
        return this.$store.state.phoneNumber;
      },
      set(value) {
        this.$store.commit("updatePhoneNumber", value);
      }
    },
    email: {
      get() {
        return this.$store.state.email;
      },
      set(value) {
        this.$store.commit("updateEmail", value);
      }
    },
    company: {
      get() {
        return this.$store.state.company;
      },
      set(value) {
        this.$store.commit("updateCompany", value);
      }
    },
    address: {
      get() {
        return this.$store.state.address;
      },
      set(value) {
        this.$store.commit("updateAddress", value);
      }
    }
  },
  created() {
    setTimeout(() => {
      if (localStorage.WS) {
        this.$socketClient.onOpen = () => {
          console.log("Websocket connected...");
        };
        this.$socketClient.onMessage = msg => {
          console.log(JSON.parse(msg.data));
          var msgToJSON = JSON.parse(msg.data);
          switch (msgToJSON.type) {
            case "announce":
              console.log("Display: ", msgToJSON.data.display);
              var getPhoneNumber = msgToJSON.data.display;

              var test = msgToJSON.data.display;
              this.displayNumber = test;

              var x = getPhoneNumber;
              var y = this.dialString;
              y = y
                .replace(/\D/g, "")
                .replace(/^(1|)?(\d{3})(\d{3})(\d{4})$/, "+$1 ($2) $3-$4");
              x = x
                .replace(/\D/g, "")
                .replace(/^(1|)?(\d{3})(\d{3})(\d{4})$/, "+$1 ($2) $3-$4");
              store.commit("updatePhoneNumber", (this.phoneNumber = x || y));
              this.searchContacts();
              break;

            case "replace":
              var callState = msgToJSON.data.state;
              var callDirection = msgToJSON.data.direction;
              switch (callDirection) {
                case "initiator":
                  store.commit("updateDirection", true);
                  break;
                case "recipient":
                  store.commit("updateDirection", false);
                  break;
              }
              switch (callState) {
                case "early":
                  store.commit("updateCallState", "Ringing");
                  store.commit("updateCallPopState", true);
                  this.getTimeStamp();
                  store.commit("updateTimeOfCall", this.timeOfCall);
                  break;

                case "confirmed":
                  store.commit("updateCallState", "Connected");
                  break;

                default:
                  console.log("Error");
                  break;
              }
              break;

            case "withdraw":
              store.commit("updateCallState", "Disconnected");
              setTimeout(() => {
                store.commit("updateCallPopState", false);
              }, 3500);
              setTimeout(() => {
                store.commit("updatePhoneNumber", "");
                store.commit("updateFirstName", "");
                store.commit("updateLastName", "");
                store.commit("updateEmail", "");
                store.commit("updateCompany", "");
                store.commit("updateAddress", "");
              }, 3600);
              break;

            case "keepalive":
              break;

            default:
              console.log("Error");
              break;
          }
        };
        this.$socketClient.onClose = msg => {
          this.$store.commit("updateConnectionStatus", false);
          console.log(msg);
        };
        this.$socketClient.onError = msg => {
          this.$store.commit("updateConnectionStatus", false);
          console.log(msg);
        };
      }
    }, 1000);
    // this.getContacts();
  }
};
</script>

<style lang="stylus" scoped></style>