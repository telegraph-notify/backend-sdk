/*
The purpose of the backend sdk is to provide an interface for users of the NaaS
to easily interact with the server for common tasks such as: 
  - dispatching events to be sent to users
  - adding users
  - modifying user preferences/attributes
  -etc.

*/
import axios from "axios";

class BackendSDK {
  // constructor(credentials , url) {
  //   this.credentials = credentials;
  //   this.url = url
  // }

  baseUrl: string;

  constructor() {
    this.baseUrl = "http://localhost:3000";
  }

  async send(id: number, message: string) {
    let response = await axios.post(this.baseUrl + "/notifications", {
      id,
      message,
    });
    return response;
  }
}

export default BackendSDK;
