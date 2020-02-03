<template>
  <v-app>
    <v-app-bar app dark>
      <v-toolbar-title>Jive Call Pop Demo</v-toolbar-title>
      <div v-show="this.$store.state.lines.length > 0">
        <linesDropdown />
      </div>
      <v-spacer></v-spacer>

      <v-btn
        class="green"
        href="https://developer.jive.com/apis/oauth2/v2"
        target="_blank"
        text
      >
        <span class="mr-2">API DOCS</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>

      <v-btn v-show="!isLoggedIn" class="blue" @click="login()">
        <span class="mr-2">Login</span>
        <v-icon>exit_to_app</v-icon>
      </v-btn>

      <v-btn v-show="isLoggedIn" class="blue" @click="logout()">
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <v-content v-show="isSelectedLine">
      <ClickToCall />
    </v-content>
    <v-expansion-panels
      multiple
      accordion
      focusable
      v-show="isLoggedIn && isSelectedLine"
    >
      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium"
          >LINES RESPONSE -
          {{
            `https://api.jive.com/users/v1/users/${principal}/lines`
          }}</v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <br />
          <code class="pa-4">{{ this.$store.state.lines }}</code>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium"
          >SESSION RESPONSE - {{ `https://realtime.jive.com/v2/session` }} -H
          {{ `Authorization: Bearer {ACCESS_TOKEN}` }}</v-expansion-panel-header
        >
        <v-expansion-panel-content
          ><br />
          <code class="pa-4">{{ currentSession }}</code>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="font-weight-medium"
          >SUBSCRIPTION RESPONSE -
          {{ `https://realtime.jive.com/v2/session/${ws}/subscriptions` }} -H
          {{ `Authorization: Bearer {ACCESS_TOKEN}` }}</v-expansion-panel-header
        >
        <v-expansion-panel-content class="font-weight-medium"
          ><br />
          -H 'Content-Type: application/json' <br />
          <code class="pa-4">{{ currentSubBody }}</code> <br />
          <br />
          RESPONSE: <br />
          <code class="pa-4">{{ currentSub }}</code>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-app>
</template>

<script>
import ClickToCall from "./components/ClickToCall";
import LinesDropdown from "./components/LinesDropdown";
export default {
  name: "App",
  components: {
    ClickToCall,
    LinesDropdown
  },
  data() {
    return {
      principal: localStorage.principal,
      ws: localStorage.WS,
      currentSession: [],
      currentSub: [],
      currentSubBody: [],
      urlWithToken: "",
      isLoggedIn: localStorage.token != null,
      isSelectedLine: localStorage.selectedLine != null
    };
  },
  methods: {
    login() {
      window.location.href =
        "https://authentication.logmeininc.com/oauth/authorize?response_type=token&client_id=e7144292-7f91-4e06-89fb-b11b9deff831&redirect_uri=http://localhost:8080&scope=users.v1.lines.read calls.v2.initiate";
    },
    logout() {
      const keysToRemove = [
        "token",
        "principal",
        "lineID",
        "orgID",
        "WS",
        "lines",
        "SUB",
        "currentPBX",
        "selectedLine",
        "currentSession",
        "currentSub",
        "currentSubBody"
      ];
      for (this.key of keysToRemove) {
        localStorage.removeItem(this.key);
      }
      window.location.reload();
    },
    parseToken() {
      var token = "";
      var principal = "";
      var removeMeFromToken = "&token_type";
      var removeMeFromPrincipal = "&loa";
      var replaceMe = "%40";
      var parameter = this.urlWithToken;
      var stringArray = parameter.split("=");

      token = stringArray[1];
      token = token.replace(removeMeFromToken, "");
      principal = stringArray[5];
      principal = principal.replace(removeMeFromPrincipal, "");
      principal = principal.replace(replaceMe, "@");
      localStorage.setItem("token", token);
      localStorage.setItem("principal", principal);
      setTimeout(() => {
        window.location.reload();
      }, 200);
      console.log("URL: ", this.urlWithToken);
    }
  },
  created() {
    if (!localStorage.token) {
      this.urlWithToken = window.location.href;
      this.parseToken();
      this.$router.push({ path: "/" });
    }
    if (localStorage.currentSub) {
      this.currentSession = JSON.parse(localStorage.currentSession);
      this.currentSub = JSON.parse(localStorage.currentSub);
      this.currentSubBody = JSON.parse(localStorage.currentSubBody);
    }
  },
  beforeMount() {
    if (localStorage.token) {
      this.$store.dispatch("GET_LINES");
    }
  }
};
</script>

<style lang="less" scoped>
button {
  margin-left: 15px;
}
</style>
