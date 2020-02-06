<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex mb-5 xs12>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-layout justify-center>
            <v-text-field
              prepend-icon="phone"
              label="Phone Number"
              :rules="phoneNumberRules"
              required
              v-model="dialString"
            ></v-text-field>
            <v-btn
              :disabled="!valid"
              fab
              small
              depressed
              class="blue white--text"
              @click="makeCall()"
            >
              <v-icon>phone</v-icon>
            </v-btn>
          </v-layout>
        </v-form>
        <v-layout>
          <CallPop />
        </v-layout>
        <v-layout>
          <v-flex lg text-left>
            <CRM />
          </v-flex>
        </v-layout>
        <v-layout>
          <div>
            <div class="flex-column mb-5 mr-5" flat tile>
              <v-tooltip right color="#424242">
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mx-2"
                    v-on="on"
                    depressed
                    fab
                    small
                    @click="displayLog = !displayLog"
                    color="blue white--text"
                  >
                    <v-icon class="white--text">{{
                      displayLog ? "mdi-eye-outline" : "mdi-eye-off"
                    }}</v-icon>
                  </v-btn>
                </template>
                <span>{{
                  displayLog ? "Hide WebSocket logs" : "Show WebSocket Logs"
                }}</span>
              </v-tooltip>
            </div>

            <div class="flex-column mb-5 mr-5" flat tile>
              <v-tooltip right color="#424242">
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mx-2"
                    v-on="on"
                    depressed
                    fab
                    small
                    :class="{ green: sessionStatus, orange: !sessionStatus }"
                  >
                    <v-icon class="white--text">{{
                      sessionStatus ? "mdi-check-bold" : "mdi-alert"
                    }}</v-icon>
                  </v-btn>
                </template>
                <span>{{
                  sessionStatus ? "Session Created" : "Session Error"
                }}</span>
              </v-tooltip>
            </div>

            <div class="flex-column mb-5 mr-5" flat tile>
              <v-tooltip right color="#424242">
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mx-2"
                    v-on="on"
                    depressed
                    fab
                    small
                    :class="{ green: wsStatus, orange: !wsStatus }"
                  >
                    <v-icon class="white--text">{{
                      wsStatus ? "mdi-power-plug" : "mdi-power-plug-off"
                    }}</v-icon>
                  </v-btn>
                </template>
                <span>{{
                  wsStatus ? "WebSocket Connected" : "WebSocket Error"
                }}</span>
              </v-tooltip>
            </div>

            <div class="flex-column mb-5 mr-5" flat tile>
              <v-tooltip right color="#424242">
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mx-2"
                    v-on="on"
                    depressed
                    fab
                    small
                    :class="{ green: subStatus, orange: !subStatus }"
                  >
                    <v-icon class="white--text">{{
                      subStatus
                        ? "mdi-transit-connection-variant"
                        : "mdi-electric-switch-closed"
                    }}</v-icon>
                  </v-btn>
                </template>
                <span>{{
                  subStatus ? "Subscribed" : "Subscription Error"
                }}</span>
              </v-tooltip>
            </div>

            <div class="flex-column mb-5 mr-5" flat tile>
              <v-tooltip right color="#424242">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-show="displayLog"
                    :disabled="displayWSlogs.length == 0"
                    class="mx-2"
                    v-on="on"
                    depressed
                    fab
                    small
                    color="red"
                    @click="clearLog()"
                  >
                    <v-icon class="white--text">mdi-trash-can</v-icon>
                  </v-btn>
                </template>
                <span>Clear Logs</span>
              </v-tooltip>
            </div>
          </div>

          <v-spacer></v-spacer>
          <code class="pa-4 text-left ws-text" v-show="displayLog">{{
            displayWSlogs
          }}</code>
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
      wsStatus: false,
      subStatus: false,
      sessionStatus: false,
      displayWSlogs: [],
      displayLog: true,
      valid: true,
      displayNumber: "",
      timeOfCall: "",
      phoneNumberRules: [
        v => !!v || "Phone Number is required",
        v => /^[0-9]*$/.test(v) || "Phone Number must be valid"
      ]
    };
  },
  components: {
    CallPop,
    CRM
  },
  methods: {
    clearLog() {
      this.displayWSlogs = [];
    },
    makeCall() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("GET_CALL");
      }
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
          this.wsStatus = true;
        };
        this.$socketClient.onMessage = msg => {
          console.log(JSON.parse(msg.data));
          this.displayWSlogs.push(JSON.parse(msg.data));
          var msgToJSON = JSON.parse(msg.data);
          switch (msgToJSON.type) {
            case "announce":
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
              break;
          }
        };
        this.$socketClient.onClose = msg => {
          console.log(msg);
          this.wsStatus = false;
          this.displayWSlogs.push(msg.type);
        };
        this.$socketClient.onError = msg => {
          console.log(msg);
          this.wsStatus = false;
          this.displayWSlogs.push(msg.type);
        };
      }
    }, 0);
  },
  mounted() {
    if (localStorage.subStatus) {
      this.subStatus = JSON.parse(localStorage.subStatus);
    }
    if (localStorage.sessionStatus) {
      this.sessionStatus = JSON.parse(localStorage.sessionStatus);
    }
  },
  watch: {
    subStatus(newSubStatus) {
      localStorage.subStatus = newSubStatus;
    },
    sessionStatus(newSessionStatus) {
      localStorage.sessionStatus = newSessionStatus;
    }
  }
};
</script>

<style lang="less" scoped>
.ws-text {
  overflow-y: scroll;
  max-height: 500px;
  width: 100%;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: #f5f5f5;
}
::-webkit-scrollbar-thumb {
  background: #616161;
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:hover {
  background: #616161;
  border-radius: 8px;
}
</style>
