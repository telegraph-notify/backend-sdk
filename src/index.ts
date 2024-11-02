/*
The purpose of the backend sdk is to provide an interface for users of the NaaS
to easily interact with the server for common tasks such as: 
  - dispatching events to be sent to users
  - adding users
  - modifying user preferences/attributes
  -etc.

*/
import axios from "axios";
import crypto from "node:crypto";

class BackendSDK {
  baseUrl: string;
  secretKey: string;

  constructor(secretKey: string, baseUrl: string) {
    this.baseUrl = baseUrl;
    this.secretKey = secretKey;
  }

  // creates sha256 naasId from the api secret key and username
  generateUserHash(username: string): string {
    return crypto
      .createHmac("sha256", this.secretKey)
      .update(username)
      .digest("base64");
  }

  async send(id: string, message: string) {
    try {
      const url = this.baseUrl + "/notifications";
      const payload = {
        id,
        message,
      };

      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseMessage = await response.text();
      return { status: response.status, responseMessage };
    } catch (error) {
      return { status: 400, message: "error" };
    }
  }

  async addUser(id: string, name: string, email: string) {
    try {
      const url = this.baseUrl + "/user";
      const payload = {
        id,
        name,
        email,
        userHash: this.generateUserHash(id),
      };

      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.secretKey,
        },
        body: JSON.stringify(payload),
      });

      const message = await response.text();
      return { status: response.status, message };
    } catch (error) {
      return { status: 400, message: "error" };
    }
  }

  async editUser(id: string, name: string, email: string) {
    try {
      const url = this.baseUrl + "/user";
      const payload = {
        id,
        name,
        email,
        userHash: this.generateUserHash(id),
      };

      let response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.secretKey,
        },
        body: JSON.stringify(payload),
      });

      const message = await response.text();
      return { status: response.status, message };
    } catch (error) {
      return { status: 400, message: "error" };
    }
  }

  async deleteUser(id: string) {
    try {
      const url = this.baseUrl + "/user";
      const payload = {
        id,
      };

      let response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.secretKey,
        },
        body: JSON.stringify(payload),
      });

      const message = await response.text();
      return { status: response.status, message };
    } catch (error) {
      // return actual message
      return { status: 400, message: "error" };
    }
  }

  async getUser(id: string) {
    try {
      const queryString = `?user_id=${encodeURIComponent(id)}`;
      const url = this.baseUrl + `/user${queryString}`;

      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: this.secretKey,
        },
      });

      let message;

      if (response.status === 200) {
        message = await response.json();
      } else {
        message = await response.text();
      }

      return { status: response.status, message };
    } catch (error) {
      return { status: 400, message: "error" };
    }
  }
}

export default BackendSDK;
