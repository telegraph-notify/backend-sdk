import crypto from "node:crypto";

interface NotificationPayload {
  user_id: string;
  channels: {
    in_app?: {
      message: string;
    };
    email?: {
      subject: string;
      message: string;
    };
  };
}

// input validation
function isValid(...args: string[]) {
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] !== "string" || !args[i]) {
      return false;
    }
  }

  return true;
}

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

  async send(payload: NotificationPayload) {
    if (!isValid(payload.user_id)) {
      return { status: 400, body: "Error: user_id is required" };
    }

    try {
      const url = this.baseUrl + "/notification";

      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.secretKey,
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json();
      return { status: response.status, body };
    } catch (error) {
      return { status: 500, body: "Internal Server Error" };
    }
  }

  async addUser(id: string, name: string, email: string) {
    if (!isValid(id, name, email)) {
      return { status: 400, body: "Error: id, name and email are required" };
    }

    try {
      const url = this.baseUrl + "/user";
      const payload = {
        id,
        name,
        email,
      };

      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.secretKey,
        },
        body: JSON.stringify(payload),
      });

      const body = await response.text();
      return { status: response.status, body };
    } catch (error) {
      return { status: 500, body: "Internal Server Error" };
    }
  }

  async editUser(id: string, name: string, email: string) {
    if (!isValid(id, name, email)) {
      return { status: 400, body: "Error: id, name and email are required" };
    }

    try {
      const url = this.baseUrl + "/user";
      const payload = {
        id,
        name,
        email,
      };

      let response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.secretKey,
        },
        body: JSON.stringify(payload),
      });

      const body = await response.text();
      return { status: response.status, body };
    } catch (error) {
      return { status: 500, body: "Internal Server Error" };
    }
  }

  async deleteUser(id: string) {
    if (!isValid(id)) {
      return { status: 400, body: "Error: id is required" };
    }

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

      const body = await response.text();
      return { status: response.status, body };
    } catch (error) {
      return { status: 500, body: "Internal Server Error" };
    }
  }

  async getUser(id: string) {
    if (!isValid(id)) {
      return { status: 400, body: "Error: id is required" };
    }

    try {
      const url = this.baseUrl + `/user/${id}`;

      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: this.secretKey,
        },
      });

      let body;

      if (response.status === 200) {
        body = await response.json();
      } else {
        body = await response.text();
      }

      return { status: response.status, body };
    } catch (error) {
      return { status: 500, body: "Internal Server Error" };
    }
  }

  async getAllUsers() {
    try {
      const url = this.baseUrl + `/users`;

      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: this.secretKey,
        },
      });

      let body;

      if (response.status === 200) {
        body = await response.json();
      } else {
        body = await response.text();
      }

      return { status: response.status, body };
    } catch (error) {
      return { status: 500, body: "Internal Server Error" };
    }
  }

  async getNotificationLogs() {
    try {
      const url = this.baseUrl + `/notification-logs`;

      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: this.secretKey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return { status: 500, body: "Internal Server Error" };
    }
  }
}

export default BackendSDK;
