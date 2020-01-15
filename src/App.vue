<template>
  <v-app>
    <v-app-bar app dark>
      <v-toolbar-title>Jive Call Pop Demo</v-toolbar-title>
      <linesDropdown />
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

    <v-content>
      <ClickToCall />
    </v-content>
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
      urlWithToken: "",
      isLoggedIn: localStorage.token != null
    };
  },
  methods: {
    login() {
      window.location.href =
        "https://auth.jive.com/oauth2/v2/grant?response_type=token&client_id=0238a181-ae13-4065-b74d-f37bb825e8ec&redirect_uri=http://localhost:8080&scope=users.v1.lines.read calls.v2.initiate cr.v1.read recording.v1.read";
    },
    logout() {
      const keysToRemove = [
        "token",
        "username",
        "lineID",
        "orgID",
        "WS",
        "lines",
        "SUB",
        "currentPBX",
        "selectedLine"
      ];
      for (this.key of keysToRemove) {
        localStorage.removeItem(this.key);
      }
      window.location.reload();
    },
    parseToken() {
      var token = "";
      var username = "";
      var removeMe = "&type";
      var parameter = this.urlWithToken;
      var stringArray = parameter.split("=");

      token = stringArray[1];
      token = token.replace(removeMe, "");
      username = stringArray[4];
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
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
  },
  beforeMount() {
    if (localStorage.token) {
      this.$store.dispatch("GET_LINES");
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
button {
  margin-left: 15px;
}
</style>
