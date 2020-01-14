import axios from "axios";

export default axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.token
  },
  linesHeaders: {
    Authorization: "Bearers " + localStorage.token
  },
  subBody: [
    {
      id: localStorage.selectedLine,
      type: "dialog",
      entity: {
        id: localStorage.lineID,
        type: "line",
        account: localStorage.orgID
      }
    }
  ]
});
