import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import vuetify from "./plugins/vuetify";

import VueSimpleWebSocket from "vue-simple-websocket";

if (localStorage.SUB) {
  Vue.use(VueSimpleWebSocket, localStorage.WS, {
    reconnectEnabled: true,
    reconnectInterval: 5000
  });
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,

  render: function(h) {
    return h(App);
  }
}).$mount("#app");
