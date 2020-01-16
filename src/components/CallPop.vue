<template>
  <transition name="slide" mode="in-out">
    <div class="call-pop-container" v-show="showCallPopState">
      <v-row>
        <v-col>
          <v-card elevation="8" max-width="344" class="mx-auto">
            <v-list-item three-line>
              <v-list-item-avatar size="60"
                ><v-icon size="80"
                  >mdi-account-circle</v-icon
                ></v-list-item-avatar
              >
              <v-list-item-content>
                <v-list-item-title class="headline"
                  >{{ firstName || "No contact" }} {{ lastName }}
                </v-list-item-title>
                <v-list-item-title
                  class="font-weight-regular text-uppercase"
                  :class="{
                    isRinging: callState === 'Ringing',
                    isConnected: callState === 'Connected',
                    isDisconnected: callState === 'Disconnected'
                  }"
                  >{{ callState || "Error" }} ({{
                    direction ? "Outbound" : "Inbound"
                  }})
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item-title class="display-1 font-weight-light"
              >{{ hours }}:{{ minutes | zeroPad }}:{{
                seconds | zeroPad
              }}</v-list-item-title
            >
            <v-card-text>
              <v-list-item text-left>
                <v-list-item-action>
                  <v-icon color="orange">mdi-calendar</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ timeOfCall || "Date/Time" }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="blue">mdi-phone</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{
                    phoneNumber || "No Phone Number"
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="grey darken-3">business</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{
                    company || "No Company"
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="green">mdi-email</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{
                    email || "No Email"
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="red">mdi-map-marker</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{
                    address || "No Address"
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </transition>
</template>

<script>
export default {
  name: "CallPop",
  data() {
    return {
      animateFrame: 0,
      nowTime: 0,
      diffTime: 0,
      startTime: 0,
      isRunning: false
    };
  },
  methods: {
    setSubtractStartTime(time) {
      time = typeof time !== "undefined" ? time : 0;
      this.startTime = Math.floor(Date.now() - time);
    },
    startTimer() {
      var vm = this;
      vm.setSubtractStartTime(vm.diffTime);

      (function loop() {
        vm.nowTime = Math.floor(Date.now());
        vm.diffTime = vm.nowTime - vm.startTime;
        vm.animateFrame = requestAnimationFrame(loop);
      })();
      vm.isRunning = true;
    },
    stopTimer() {
      this.isRunning = false;
      cancelAnimationFrame(this.animateFrame);
    },
    clearAll() {
      this.startTime = 0;
      this.nowTime = 0;
      this.diffTime = 0;
      this.stopTimer();
      this.animateFrame = 0;
    }
  },
  watch: {
    startWatcher: {
      handler() {
        if (this.$store.state.callState == "Connected") {
          this.startTimer();
        }
      },
      deep: true
    },
    endWatcher: {
      handler() {
        if (this.$store.state.callState == "Disconnected") {
          this.stopTimer();
          setTimeout(() => {
            this.clearAll();
          }, 4000);
        }
      },
      deep: true
    }
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
  bottom: -12px;
  left: 0;
  height: auto;
  position: fixed;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  z-index: 100;
}

.v-card {
  border-radius: 0px 5px 0px 0px !important;
}

.isRinging {
  color: #2196f3 !important;
  // background-color: #2196f3 !important;
}
.isConnected {
  color: #4caf50 !important;
  // background-color: #4caf50 !important;
}
.isDisconnected {
  color: #ff5252 !important;
  // background-color: #ff5252 !important;
}
.isError {
  color: blue !important;
  // background-color: blue !important;
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

.v-list-item__content {
  text-align: left;
}
</style>
