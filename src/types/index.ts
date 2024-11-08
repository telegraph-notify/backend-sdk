export interface UserRequestBody {
  id: string;
  name: string;
  email: string;
  userHash?: string;
}

export interface DeleteUserRequestBody {
  id: string;
}

export interface SendRequestBody {
  user_id: string;
  message: string;
}

export interface ApiResponse<T> {
  status: number;
  message: T;
}

// below interfaces need to be defined
interface SendNotificationResponse {}

interface GetUserResponse {}

interface GetAllUsersResponse {}
