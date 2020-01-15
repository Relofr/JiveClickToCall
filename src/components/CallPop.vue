<template>
  <transition name="slide" mode="in-out">
    <div class="call-pop-container" v-show="showCallPopState">
      <v-layout text-left>
        <v-card max-width="344" dark>
          <v-card-text class="white--text">
            <div
              :class="{
                isRinging: callState === 'Ringing',
                isConnected: callState === 'Connected',
                isDisconnected: callState === 'Disconnected'
              }"
              class="text-center title font-regular"
            >
              {{ callState || "Error" }} ({{
                direction ? "Outbound" : "Inbound"
              }})
            </div>
            <div class="headline">
              <div class="d-flex justify-md-space-around" outlined tile>
                <div><v-icon large color="blue">phone</v-icon></div>
                <div class="display-1">
                  {{ hours }}:{{ minutes | zeroPad }}:{{ seconds | zeroPad }}
                </div>
              </div>
            </div>
            Date/Time: {{ timeOfCall || "Date/Time" }} <br />
            Name: {{ firstName || "No Contact" }} {{ lastName }}
            <br />
            Phone Number:
            {{ phoneNumber || "No Data" }} <br />
            Company: {{ company || "No Data" }} <br />
            Email: {{ email || "No Data" }} <br />
            Address: {{ address || "No Data" }}
          </v-card-text>
        </v-card>
      </v-layout>
    </div>
  </transition>
</template>

<script>
export default {
  name: "CallPop",
  data() {
    return {};
  },
  computed: {
    startWatcher: {
      get() {
        return this.$store.state.callState;
      }
    },
    endWatcher: {
      get() {
        return this.$store.state.callState;
      }
    },
    firstName: {
      get() {
        return this.$store.state.firstName;
      }
    },
    lastName: {
      get() {
        return this.$store.state.lastName;
      }
    },
    phoneNumber: {
      get() {
        return this.$store.state.phoneNumber;
      }
    },
    email: {
      get() {
        return this.$store.state.email;
      }
    },
    company: {
      get() {
        return this.$store.state.company;
      }
    },
    address: {
      get() {
        return this.$store.state.address;
      }
    },
    direction: {
      get() {
        return this.$store.state.direction;
      }
    },
    callState: {
      get() {
        return this.$store.state.callState;
      }
    },
    showCallPopState: {
      get() {
        return this.$store.state.showCallPopState;
      }
    },
    timeOfCall: {
      get() {
        return this.$store.state.timeOfCall;
      }
    },
    hours: function() {
      return Math.floor(this.diffTime / 1000 / 60 / 60);
    },
    minutes: function() {
      return Math.floor(this.diffTime / 1000 / 60) % 60;
    },
    seconds: function() {
      return Math.floor(this.diffTime / 1000) % 60;
    },
    milliSeconds: function() {
      return Math.floor(this.diffTime % 1000);
    }
  },
  filters: {
    zeroPad: function(value, num) {
      num = typeof num !== "undefined" ? num : 2;
      return value.toString().padStart(num, "0");
    }
  }
};
</script>

<style scoped lang="less">
.call-pop-container {
  width: auto;
  // min-width: 260px;
  bottom: 0;
  left: 0;
  height: auto;
  position: fixed;
  // font-weight: 500;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  z-index: 100;
}

.v-card {
  border-radius: 0px 5px 0px 0px !important;
}

.isRinging {
  color: #2196f3;
}
.isConnected {
  color: #4caf50;
}
.isDisconnected {
  color: #ff5252;
}

.slide-leave-active,
.slide-enter-active {
  transition: 0.6s;
}
.slide-enter {
  transform: translate(0, 376px);
}
.slide-leave-active {
  transform: translate(0, 376px);
}
</style>
