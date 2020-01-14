import Vue from "vue";
import VueSimpleWebSocket from "vue-simple-websocket";

export const webSockMixin = {
  methods: {
    getWebsocket() {
      Vue.use(VueSimpleWebSocket, localStorage.WS, {
        reconnectEnabled: true,
        reconnectInterval: 5000
      });
      console.log("Websock created...");
    }
  }
};
