# TaskSync

TaskSync is a feature-rich task management system that provides authentication, authorization, real-time notifications, task dependencies, and audit logs. It ensures secure task collaboration with granular role-based access control and a robust database architecture.

## Features Implemented

- User authentication (JWT)

  - Secure user authentication with JWT-based authentication.
  - Role-based access control (RBAC) for users, managers, and admins.
  - Session management with Redis for JWT blacklist on logout.

- Task Management

  - Create, read, update, and delete (CRUD) operations for tasks.
  - Assign tasks to specific users.
  - Set priorities, due dates, and categories.
  - Subtasks for breaking down larger tasks.
  - Restriction on marking a task "Done" if any subtask is incomplete.

- Real-time Features

  - Socket.io integration for live notifications.
  - Online status tracking through WebSockets.
  - Real-time task updates and notifications.
  - Event-based alerts for task assignments and updates.

- Search & Filtering

  - Full-text search on task titles and descriptions.
  - Filter tasks by status, priority, category, and assignee.
  - Pagination for efficient data retrieval.

- Activity Logs & Versioning

  - Activity logging to track user actions on tasks.
  - Automatic logging for task updates.
  - Audit logs to maintain a history of changes.
  - Task Versioning: Every update to a task creates a new version, preserving the previous versions and allowing users to view the history, restore previous versions, and track changes for accountability.

- Task Deadline Monitoring

  - Cron jobs to check for upcoming task deadlines.

## Installation

- Clone the repository:

  - Run following commands to clone and install dependencies:

  ```sh
  git clone https://github.com/wailaa/tasksync.git
  cd tasksync
  npm install
  ```

- Set up Redis with Docker:

  - Make sure you have [Docker](https://www.docker.com/get-started/) installed on your system.
  - Pull and run a Redis container:

  ```sh
  docker run --name tasksync-redis -p 6379:6379 -d redis
  ```

  - Verify Redis is running:

  ```sh
  docker ps
  ```

- Create a .env file in the project root with the following environment variables:
  ```sh
  PORT=8080
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  JWT_ACCESS_EXPIRES=1h
  JWT_REFRESH_EXPIRES=7d
  URI_ORIGIN1=http://localhost:8080
  URI_ORIGIN2=http://127.0.0.1:5500
  ```
- Run application :

  ```sh
  npm run dev
  ```

- Visit http://localhost:8080 to access the website
