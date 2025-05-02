# TaskSync API Documentation

## Authentication

### Login

**POST** `/api/user/login`

**Description:** Authenticate a user and return a JWT.

**Request Body:**

```
{
    "username": "some_username",
    "password": "some_password"
}
```

**Response:**

```
{
    "message": "User logged in successfully",
    "accessToken": "JWT token string",
    "refreshToken": "JWT token string"
}
```

**Error Responses**

status: 400

```
{
    message: "Username and password are required" ,
}
```

status 401:

```
{
    "message": "Invalid username or password"
}
```

status 500:

```
{
   message: "Internal Server error"
}
```

---

### Logout

**POST** `/api/user/logout`

**Description:** Logs out the user by invalidating the access token refresh token.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "refreshToken": "your_refresh_token"
}
```

**Response:**
status 200:

```
{
  message: message: "logged out successfully"
}
```

**Error Responses**

status: 400

```
{
    message: "Refresh token required",
}
```

status 401:

```
{
    message: "Token required",
}
```

status 500:

```
{
  message: "Server error"
}
```

---

### Register

**POST** `/api/user/register`

**Description:** Creates a new user account.

**Request Body:**

```
{
    "username": "some_username",
    "password": "some_password",
    "email": "some-email@example.com",
    "role": "user"
}
```

**Response:**
status 200:

```
{
  message: "User registered successfully"
}
```

**Error Responses**

status 500:

```
{
  message: "Server error"
}
```

---

### Refresh Token

**POST** `/api/user/refresh`

**Description:** Refreshes the JWT access token.

**Request Body:**

```
{
    "refreshToken": "your_refresh_token"
}
```

**Response:**

```
{
    "message": "new access token",
    "accessToken": "new_JWT_token"
}
```

**Error Responses**

status: 400

```
{
    message: "Refresh token required",
}
```

status 401:

```
{
    message: "expired token" ,
    //or message: "invalid token" ,
}
```

---

### Role Management

**PUT** `/api/user/:id/role`

**Description:** Change a user's role. Restricted to admin users only.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "role":"user" // Possible values: "user", "manager", "admin"
}
```

**Responses:**

status: 200

```
{

    "user": {
        "id": "user_id",
        "username": "username",
        "role": "new_role"
        ...
    }
}
```

**Error Responses**

status: 400

```
{
    "error": "Invalid role",
}
```

status 404:

```
{
    "error": "User not found",
}
```

---

## Task Management

### Create Task

**POST** `/api/tasks`

**Description:** Creates a new task.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "title": "New Task",
    "description": "Task details",
    "status": "To-Do",
    "priority": "High",
    "dueDate": "2025-02-05"
}
```

**Responses:**

status: 200

```
{
  "message": "Task created successfully",
  "task": { ... }
}

```

**Error Responses**

status 500:

```
{
    message: "failed to create task",
}
```

---

### Get Tasks

**GET** `/api/tasks?scope=self,team&page=number&status=Low,Medium,High&priority=To-Do,In-Progress,Done&search=some_text`

**Description:** Retrieves a list of tasks with filtering options.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Query Parameters:**

- `scope`: `self` (user's own tasks) or `team` (team tasks-manager role.)
- `page`: Page number
- `status`: `to-do`, `in-progress`, `done`,
- `priority`: `low`, `medium`, `high`,
- `search`: free text to search in title and description of a task

**Response:**

```
{
    "totalTasks": 1,
    "totalPages": 1,
    "currentPage": 1,
    "tasks": [
        {
            "_id": "task_id",
            "title": "Create Report",
            "description": "Compile sales data",
            "status": "In-Progress",
            "priority": "High",
            "dueDate": "2025-02-15"
        }
    ]
}
```

---

### Get Task by ID

**GET** `/api/tasks/{taskId}`

**Description:** Retrieves a task by its ID.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Responses:**

status 200:

```
{
    "task": {....}
}
```

**Error Responses**

status 404:

```
{
   message: "Task not found" ,
}
```

status 500:

```
{
    message: "Failed to fetch task",
}
```

---

### Update Task

**PUT** `/api/tasks/{taskId}`

**Description:** Updates a task by its ID. if user send the request , only the status of the task will be modified. manage and admin have full access to change the details of a task.w

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "title": "New Task",
    "description": "Task details",
    "status": "To-Do",
    "priority": "High",
    "dueDate": "2025-02-05"
    "assignee": "some_user_ID"
}
```

**Responses:**

status 200:

```
{
  "message": "Task updated successfully"
}
```

**Error Responses**

status 400:

```
{
    message: "could not find task",
    //or message: "Cannot mark task as 'Done' while subtasks are incomplete."
    //or message: "Only the 'status' field can be updated, and it must be provided."
}
```

status 404:

```
{
  message: "Task not found"
}
```

status 500:

```
{
    message: "Failed to update task"
}
```

---

### Delete Task

**DELETE** `/api/tasks/{taskId}`

**Description:** Deletes a task by its ID. only admin can delete a task

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Response:**

status: 200:

```
{
{ message: "Task deleted successfully" }
}
```

**Error Responses**

status: 500:

```
{
{ message: "Failed to delete task", error : some_error_message }
}
```

---

### Assign Task

**PUT** `/api/tasks/{taskId}/assign`

**Description:** assign a task by its ID to a user, the userId is in the boy request . only admin can delete a task

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "newUserId": "some_user_id"
}
```

---

### Add Comment to Task

**POST** `/api/tasks/{taskId}/comment`

**Description:** post a comment on a task by its ID.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "content": "some_content_here"
}
```

**Response:**

status: 200:

```
{
  "message": "Comment added successfully"
}
```

**Error Responses**

status: 500:

```
{
{ message: "Failed to delete task", error : some_error_message }
}
```

---

### get Comments of a Task

**GET** `/api/tasks/{taskId}/comment`

**Description:** This endpoint retrieves all comments for a task by its taskId .

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Response:**

status: 200:

```
{
{ message: "Comments found", comments: [{comment1},{comment2},...] }
}
```

**Error Responses**

status: 500:

```
{
    "message": "some_error_message",
}
```

---

## Subtask Management

### Create Subtask

**POST** `/api/tasks/:taskId/subtasks`

**Description:** Creates a new subtask.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "title":"subtask title",
    "status": "subtask-status"
}
```

**Response:**

status: 200:

```
{
"message": "Subtask created",
    "createSubtask": {
        // ...subtask object as returned by taskService.createSubTask
    }
}
```

**Error Responses**

status: 500:

```
{
    "message": "Error creating subtask",
}
```

---

### Update Subtask

**PUT** `/api/tasks/:taskId/subtasks/:subtaskId`

**Description:** update a subtask.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "title":"subtask title",
    "status": "subtask-status"
}
```

**Query Parameters:**

- `title`: string
- `status`:`pending`, `in-progress`, `done`

**Request Body:**

```
{
    "title":"subtask title",
    "status": "subtask-status"
}
```

**Response:**

status: 200:

```
{
    message: "Task updated successfully"
    task: {
        // ...subtask object as returned by taskService.createSubTask
    }
}
```

**Error Responses**

status: 400:

```
{
    "message": "Only the 'status' field can be updated, and it must be provided.",
}
```

status: 404:

```
{
    "message": "Task not found"
}
```

status: 500:

```
{
    "message": "Error creating subtask",
}
```

---

### Comment Subtask

**POST** `/api/tasks/:taskId/subtasks/:subtaskId/comment`

**Description:** Add a comment to a subtask.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
{ "content": "comment text" }
}
```

**Query Parameters:**

- `title`: string
- `status`:`pending`, `in-progress`, `done`

**Response:**

status: 200:

```
{
    message: "Comment added successfully"
}
```

**Error Responses**

status: 500:

```
{
    "message": "Error updating subtask",
}
```

---
