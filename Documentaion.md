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
- `status`: `Low`, `Medium`, `High`
- `priority`: `To-Do`, `In-Progress`, `Done`
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

---

### Delete Task

**DELETE** `/api/tasks/{taskId}`

**Description:** Deletes a task by its ID. only admin can delete a task

**Headers:**

```
Authorization: Bearer <your_access_token>
```

---

### Assign Task

**PUT** `/api/tasks/{taskId}`

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
    "assignedTo":"some_user_id",
    "status": "subtask-status"
}
```

---

### Assign Subtask

**PUT** `/api/tasks/subtasks/:subtaskId/assign`

**Description:** assign a subtask to a user.only by admin or manager.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "userId":"some_user_id",
}
```

---

### Update Subtask

**PUT** `/api/tasks/subtasks/:subtaskId`

**Description:** update a subtask.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "title":"subtask title",
    "assignedTo":"some_user_id",
    "status": "subtask-status"
}
```

---

## Category

### Create Category

**POST** `/api/category`

**Description:** Creates a new task category .

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "category":"category_name"
}
```

---

### Get Category

**GET** `/api/category`

**Description:** get all categories.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Response:**

```

    {
        "category": "the new created category"
    }


```

---

## Comments

### Create Comment

**POST** `/api/comment:taskId`

**Description:** Creates a comment on a task.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Request Body:**

```
{
    "content": "some content here."
}
```

---

### Get Comments

**GET** `/api/comment/{taskId}/comments`

**Description:** Retrieves all comments for a task.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Response:**

```
[
    {
        "_id": "67aa899f9421267465083d4s",
        "taskId": "some_task_id",
        "userId": {
            "_id": "67a8b410775a8a64d529cff0",
            "username": "some_user_name"
        },
        "content": "this is a comment",
        "createdAt": "2025-02-10T23:19:59.323Z",
        "updatedAt": "2025-02-10T23:19:59.323Z",
        "__v": 0
    },
    {
        "_id": "67aa899f9421267465083d4d",
        "taskId": "some_task_id",
        "userId": {
            "_id":"some_user_id",
            "username": "some_user_name"
        },
        "content": "this is a comment",
        "createdAt": "2025-02-10T23:19:59.323Z",
        "updatedAt": "2025-02-10T23:19:59.323Z",
        "__v": 0
    }
]
```

---

## Activity

### Get ActivityLogs

**GET** `/api/activity/:taskId`

**Description:** Retrieves ActivityLogs for a task.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Response:**

```
[
    {
        "_id": "activitylogId",
        "taskId": ""task"",
        "userId": {
            "_id": "67a91377c17ef3217b54c0b2",
            "username": "some_user_id"
        },
        "action": "New user Assigned: "some_user_id"",
        "createdAt": "2025-02-14T11:47:55.312Z",
        "updatedAt": "2025-02-14T11:47:55.312Z",
        "__v": 0
    },
]
```

---

## Notifications

### Get Notifications

**GET** `/api/notifications`

**Description:** Retrieves notifications for the logged-in user.

**Headers:**

```
Authorization: Bearer <your_access_token>
```

**Response:**

```
{
    "message": "new notifications ",
    "notifications": [
        {
            "_id": "notificationId",
            "userId": "some_user_id",
            "message": "notification message",
            "type": "notification_type",
            "isRead": false,
            "createdAt": "2025-02-12T21:41:54.106Z",
            "updatedAt": "2025-02-12T21:41:54.106Z",
            "__v": 0
        },

    ]
}
```

---
