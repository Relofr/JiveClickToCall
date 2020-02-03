<template>
  <div class="text-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          :class="{
            blue: selectedLine,
            red: !selectedLine
          }"
          dark
          v-on="on"
        >
          {{ selectedLine ? "Ext: " + selectedLine : "Select a line" }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in LINES"
          :key="index"
          @click="changeLine(item.id)"
        >
          <v-list-item-title
            >{{ item.number }}: {{ item.name }} on
            {{ item.organization.name }}</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    selectedLine: localStorage.selectedLine
  }),
  computed: {
    ...mapGetters(["LINES"])
  },
  methods: {
    changeLine(selectedLine) {
      var obj = this.$store.state.lines;

      for (var i = 0; i < obj.length; i++) {
        let newSelectedLine = obj[i].number;
        let newId = obj[i].id;
        let newOrgId = obj[i].organization.id;

        if (selectedLine === obj[i].id) {
          localStorage.removeItem("selectedLine");
          localStorage.removeItem("lineID");
          localStorage.removeItem("orgID");
          localStorage.removeItem("WS");
          localStorage.removeItem("SUB");
          localStorage.setItem("selectedLine", newSelectedLine);
          localStorage.setItem("lineID", newId);
          localStorage.setItem("orgID", newOrgId);
          break;
        }
      }
      this.$store.dispatch("GET_SESSION");
      setTimeout(() => {
        this.$store.dispatch("GET_SUBSCRIPTION");
      }, 250);
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
button {
  margin-left: 15px;
}
</style>
