<template>
  <transition name="slide" mode="in-out">
    <div class="call-pop-container" v-show="showCallPopState">
      <v-row>
        <v-col>
          <v-card>
            <v-card-title class="blue darken-1">
              <span class="subtitle-1 white--text"
                ><v-chip class="ma-2" color="white" text-color="black">
                  <v-avatar left>
                    <v-icon>mdi-account-circle</v-icon>
                  </v-avatar>
                  {{ firstName || "No contact" }} {{ lastName }}
                </v-chip></span
              >

              <v-spacer></v-spacer>
              <v-chip
                v-show="this.callState === 'Connected'"
                color="blue darken-1 white--text"
              >
                <v-avatar left>
                  <v-icon>timer</v-icon>
                </v-avatar>
                <span class="title"
                  >{{ hours }}:{{ minutes | zeroPad }}:{{
                    seconds | zeroPad
                  }}</span
                >
              </v-chip>

              <v-chip
                v-show="this.callState != 'Connected'"
                color="blue darken-1 white--text"
              >
                <v-avatar left>
                  <v-icon>timer</v-icon>
                </v-avatar>
                <span class="title"
                  >{{ callState || "Error" }} ({{
                    direction ? "Outbound" : "Inbound"
                  }})</span
                >
              </v-chip>
              <!-- <v-btn dark icon>
                <v-icon>mdi-close</v-icon>
              </v-btn> -->
            </v-card-title>

            <v-list>
              <v-list-item text-left>
                <v-list-item-action>
                  <v-icon>mdi-calendar</v-icon>
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
                  <v-icon>mdi-phone</v-icon>
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
                  <v-icon>business</v-icon>
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
                  <v-icon>mdi-email</v-icon>
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
                  <v-icon>mdi-map-marker</v-icon>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>{{
                    address || "No Address"
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
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
    overlay: {
      handler() {
        if (this.callState != "Connected") {
          this.overlay = true;
        }
      }
    },
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
  // min-width: 260px;
  bottom: -12px;
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

.v-list-item__content {
  text-align: left;
}

// .v-overlay__scrim {
//   background-color: white !important;
// }
</style>
