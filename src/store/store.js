import Vue from "vue";
import Vuex from "vuex";
import Axios from "../services/axios.js";

Vue.use(Vuex, Axios);

const store = new Vuex.Store({
  state: {
    lines: [],
    session: [],
    subscription: [],
    dialString: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    address: "",
    direction: "",
    callState: "",
    timeOfCall: "",
    showCallPopState: false,
    savedContacts: []
  },
  getters: {
    LINES: state => {
      return state.lines;
    }
  },
  mutations: {
    updateLines: (state, payload) => {
      state.lines = payload;
    },
    updateSession: (state, payload) => {
      state.session = payload;
    },
    updateSubscription: (state, payload) => {
      state.subscription = payload;
    },
    updateDialString: (state, payload) => {
      state.dialString = payload;
    },
    updateFirstName: (state, payload) => {
      state.firstName = payload;
    },
    updateLastName: (state, payload) => {
      state.lastName = payload;
    },
    updatePhoneNumber: (state, payload) => {
      state.phoneNumber = payload;
    },
    updateEmail: (state, payload) => {
      state.email = payload;
    },
    updateCompany: (state, payload) => {
      state.company = payload;
    },
    updateAddress: (state, payload) => {
      state.address = payload;
    },
    updateCallPopState: (state, payload) => {
      state.showCallPopState = payload;
    },
    updateDirection: (state, payload) => {
      state.direction = payload;
    },
    updateCallState: (state, payload) => {
      state.callState = payload;
    },
    updateTimeOfCall: (state, payload) => {
      state.timeOfCall = payload;
    },
    updateUsers: (state, payload) => {
      state.users = payload;
    },
    updateSavedContacts: (state, payload) => {
      state.savedContacts = payload;
    }
  },
  actions: {
    GET_LINES({ commit }) {
      Axios.get("https://api.jive.com/users/v1/lines", this.lineHeaders)
        .then(response => {
          let lines = response.data.items;
          localStorage.setItem(
            "currentPBX",
            response.data.items[0].organization.name
          );
          commit("updateLines", lines);
          console.log("Fetched lines...", response.data);
        })
        .catch(error => {
          console.log("Lines error: ", error);
        });
    },
    GET_CALL() {
      const callBody = {
        dialString: store.state.dialString,
        from: {
          lineId: localStorage.lineID
        }
      };
      Axios.post(`https://api.jive.com/calls/v2/calls`, callBody, this.headers)
        .then(response => {
          console.log("Initiating Call...", response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    GET_SESSION({ commit }) {
      Axios.post(`https://realtime.jive.com/v2/session`, this.headers)
        .then(response => {
          let session = response.data;
          localStorage.setItem("currentSession", JSON.stringify(response.data));
          localStorage.setItem("WS", response.data.ws);
          localStorage.setItem("SUB", response.data.subscriptions);
          localStorage.setItem("sessionStatus", true);
          commit("updateSession", session);
          console.log("Session created...", response);
        })
        .catch(error => {
          localStorage.setItem("sessionStatus", false);
          console.log(error);
        });
    },
    GET_SUBSCRIPTION({ commit }) {
      const subBody = JSON.stringify([
        {
          id: localStorage.selectedLine,
          type: "dialog",
          entity: {
            id: localStorage.lineID,
            type: localStorage.lineType,
            account: localStorage.orgID
          }
        }
      ]);
      Axios.post(localStorage.SUB, subBody, this.headers)
        .then(response => {
          let sub = response.data;
          localStorage.setItem("currentSub", JSON.stringify(response.data));
          localStorage.setItem("currentSubBody", subBody);
          localStorage.setItem("subStatus", true);
          commit("updateSubscription", sub);
          console.log("Subscription created...", response.data);
        })
        .catch(error => {
          localStorage.setItem("subStatus", false);
          console.log(error);
        });
    }
  }
});
export default store;
