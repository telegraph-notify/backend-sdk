## Telegraph Node.js SDK

```js
import BackendSDK from "./backend-sdk/src/index.ts";
const telegraph = new BackendSDK(secretKey, httpGateway);
```

Enter your `secretKey` and `httpGateway` from the Telegraph CDK deployment.

## Usage

All `telegraph` methods return a Promise that will resolve to the response.

## Send a Notification

```js
telegraph.send({
  user_id,
  channels: {
    in_app?: {
      message
    };
    email?: {
      subject,
      message,
    };
  };
});
```

- `user_id` _(string, required)_: The unique identifier of the user receiving the notification.
- `channels.in_app.message` _(string)_: The in_app message to be sent to the user.
- `channels.email.subject` _(string)_: The email subject to be sent to the user.
- `channels.email.message` _(string)_: The email message to be sent to the user.

**Response:**

- **Success (200 OK)**: Returns a JSON object with the status code and response message.
  - Example:
    ```json
    {
      "status": 200,
      "body": [
        {
          "channel": "in_app",
          "notification_id": "1865d4a8-94cb-4a4b-bfef-35942abadf18"
        },
        {
          "channel": "email",
          "notification_id": "27149fcf-1e8d-47f7-b240-6c7db899f861"
        }
      ]
    }
    ```
- **Error (500 Internal Server Error)**: Returns an error message if the request fails.
  - Example:
    ```json
    {
      "status": 500,
      "body": "Internal Server Error"
    }
    ```

## Add User

```js
telegraph.addUser(id, name, email);
```

- `id` _(string, required)_: The unique identifier of the user.
- `name` _(string, required)_: The full name of the user.
- `email` _(string, required)_: The email address of the user.

**Response:**

- **Success (200 OK)**: Returns a JSON object with the status code and a success message.
  - Example:
    ```json
    {
      "status": 200,
      "body": "User added successfully"
    }
    ```
- **Error (500 Internal Server Error)**: Returns an error message if the request fails.
  - Example:
    ```json
    {
      "status": 500,
      "body": "Internal Server Error"
    }
    ```

## Edit User

```js
telegraph.editUser(id, name, email);
```

- `id` _(string, required)_: The unique identifier of the user.
- `name` _(string, required)_: The updated full name of the user.
- `email` _(string, required)_: The updated email address of the user.

**Response:**

- **Success (200 OK)**: Returns a JSON object with the status code and a success message.
  - Example:
    ```json
    {
      "status": 200,
      "body": "User edited"
    }
    ```
- **Error (500 Internal Server Error)**: Returns an error message if the request fails.
  - Example:
    ```json
    {
      "status": 500,
      "body": "Internal Server Error"
    }
    ```

## Delete User

```js
telegraph.deleteUser(id);
```

- `id` _(string, required)_: The unique identifier of the user to be deleted.

**Response:**

- **Success (200 OK)**: Returns a JSON object with the status code and a success message.
  - Example:
    ```json
    {
      "status": 200,
      "body": "User deleted successfully"
    }
    ```
- **Error (404 Not Found)**: Returns an error message if the user does not exist.
  - Example:
    ```json
    {
      "status": 404,
      "message": "User does not exist"
    }
    ```
- **Error (500 Internal Server Error)**: Returns an error message if the request fails.
  - Example:
    ```json
    {
      "status": 500,
      "message": "Internal Server Error"
    }
    ```

## Get User

```js
telegraph.getUser(id);
```

- `id` _(string, required)_: The unique identifier of the user to retrieve.

**Response:**

- **Success (200 OK)**: Returns a JSON object containing the user's details.
  - Example:
    ```json
    {
      "status": 200,
      "body": {
        "id": "12345",
        "name": "John Doe",
        "email": "john.doe@example.com"
      }
    }
    ```
- **Error (404 Not Found)**: If the user is not found.
  - Example:
    ```json
    {
      "status": 404,
      "message": "User not found"
    }
    ```
- **Error (500 Internal Server Error)**: If there is an error with the request.
  - Example:
    ```json
    {
      "status": 500,
      "body": "Internal Server Error"
    }
    ```

## Get All Users

```js
telegraph.getAllUsers();
```

**Response:**

- **Success (200 OK)**: Returns a JSON object with the status code and response message.
  - Example:
    ```json
    {
      "status": 200,
      "body": [
        {
          "id": "bob",
          "email": "bob@bob.com",
          "name": "bob"
        },
        {
          "id": "alice",
          "email": "alice@alice.com",
          "name": "alice"
        }
      ]
    }
    ```
- **Error (500 Internal Server Error)**: If there is an error with the request.
  - Example:
    ```json
    {
      "status": 500,
      "body": "Internal Server Error"
    }
    ```

## Get Notification Logs

```js
telegraph.getNotificationLogs();
```

**Response:**

- **Success (200 OK)**: Returns an array of notification logs.
  - Example:
    ```json
    [
      {
        "user_id": "bob",
        "created_at": "2024-11-10T03:02:25.494Z",
        "status": "notification request received",
        "notification_id": "d19e2ff9-7dce-48ec-9368-f6344ac0e2d9",
        "log_id": "cc6a2f8c-3885-45d5-9800-a57f74dd9b16",
        "ttl": 1733799745,
        "message": "hi",
        "channel": "in_app"
      }
    ]
    ```
- **Error**: If there is an error with the request.
  - Example:
    ```
    Error fetching notification logs: Error: HTTP error: 404
    ```
