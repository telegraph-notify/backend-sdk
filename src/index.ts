import crypto from "node:crypto";
import {
  UserRequestBody,
  SendRequestBody,
  ApiResponse,
  DeleteUserRequestBody,
} from "./types/index";

class BackendSDK {
  baseUrl: string;
  secretKey: string;

  constructor(secretKey: string, baseUrl: string) {
    this.baseUrl = baseUrl;
    this.secretKey = secretKey;
  }

  // creates sha256 HMAC from the api secret key and username
  generateUserHash(username: string): string {
    return crypto
      .createHmac("sha256", this.secretKey)
      .update(username)
      .digest("base64");
  }

  // check the return value & add to apiresponse generic type
  async send(user_id: string, message: string): Promise<ApiResponse> {
    try {
      const url = this.baseUrl + "/notification";
      const payload: SendRequestBody = {
        user_id,
        message,
      };

      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.secretKey,
        },
        body: JSON.stringify(payload),
      });

      const responseMessage = await response.json();
      return { status: response.status, responseMessage };
    } catch (error) {
      return { status: 400, message: "error" };
    }
  }

  async addUser(
    id: string,
    name: string,
    email: string
  ): Promise<ApiResponse<string>> {
    try {
      const url = this.baseUrl + "/user";
      const payload: UserRequestBody = {
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

  async editUser(
    id: string,
    name: string,
    email: string
  ): Promise<ApiResponse<string>> {
    try {
      const url = this.baseUrl + "/user";
      const payload: UserRequestBody = {
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

  async deleteUser(id: string): Promise<ApiResponse<string>> {
    try {
      const url = this.baseUrl + "/user";
      const payload: DeleteUserRequestBody = {
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
  // check the return value & add to apiresponse generic type
  async getUser(id: string): Promise<ApiResponse> {
    try {
      const url = this.baseUrl + `/user/${id}`;

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
  // check the return value & add to apiresponse generic type
  async getAllUsers(): Promise<ApiResponse> {
    try {
      const url = this.baseUrl + `/users`;

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
