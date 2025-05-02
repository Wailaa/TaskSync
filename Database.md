Collecting workspace information

# TaskSync — Database Architecture

## Overview of Database Design

A comprehensive explanation of database schemas, design decisions, and architecture for the TaskSync application.

## Relational vs NoSQL Database

I chose MongoDB, a NoSQL document database, for TaskSync due to its flexibility with document structures and natural fit with JavaScript-based backend systems. This choice allowed me to implement nested document structures for tasks and subtasks, which would be more complex to model in a traditional relational database.

The document-based structure of MongoDB aligns well with the hierarchical nature of task management system, where tasks contain subtasks and comments. Additionally, MongoDB's schema flexibility supports the evolving nature of task management features, where task attributes might change over time.

The JSON-like document structure also integrates seamlessly with our Express.js backend, allowing for efficient data transmission between server and client without transformation overhead.

## Database Model

The database architecture centers around a user-centric model where tasks belong to users. Rather than creating separate collections for tasks, I embedded tasks directly in user documents, optimizing for the most common access pattern: users accessing their own tasks.

### Collections

**User Collection**: The primary collection that stores all user information, tasks, and subtasks.

### Document Schemas

#### User Schema

- `_id` (Mongoose ObjectId) — Unique and indexed.
- `username` (String) — Unique, indexed, and required.
- `email` (String) — Unique and required for authentication.
- `password` (String) — Hashed password stored using bcrypt.
- `role` (String) — User access level: 'admin', 'manager', or 'user'.
- `manager` (ObjectId) — Reference to a user's manager.
- `tasks` (Array) — Collection of task subdocuments.
- `activityLogs` (Array) — History of user actions:
  - `action` (String) — Description of the activity.
  - `taskId` (ObjectId) — Reference to the related task.
  - `subTaskId` (ObjectId) — Optional reference to subtask.
  - `createdAt` (Date) — When the activity occurred.
- `notifications` (Array) — User notifications:
  - `type` (String) — Category of notification ('taskCreated', 'taskUpdated', etc.).
  - `message` (String) — Notification content.
  - `task` (ObjectId) — Related task reference.
  - `isRead` (Boolean) — Tracking if notification has been viewed.
  - `createdAt` (Date) — When the notification was created.

#### Task Schema (Embedded in User)

- `_id` (Mongoose ObjectId) — Unique and indexed.
- `title` (String) — Required task name.
- `description` (String) — Detailed task information.
- `status` (String) — Current state: 'to-do', 'in-progress', or 'done'.
- `priority` (String) — Importance level: 'low', 'medium', or 'high'.
- `assignee` (ObjectId) — Reference to user assigned to the task.
- `dueDate` (Date) — Task deadline.
- `createdBy` (ObjectId) — Reference to user who created the task.
- `labels` (Array of Strings) — Categories or tags for the task.
- `subtasks` (Array) — Collection of subtask subdocuments.
- `comments` (Array) — Discussion threads related to the task.

#### Subtask Schema (Embedded in Task)

- `_id` (Mongoose ObjectId) — Unique and indexed.
- `title` (String) — Required subtask name.
- `parentTask` (ObjectId) — Reference to the parent task.
- `status` (String) — Current state: 'pending', 'in-progress', or 'done'.
- `createdBy` (ObjectId) — Reference to user who created the subtask.
- `comments` (Array) — Discussion threads related to the subtask.

## Database Implementation Details

### Indexing Strategy

- Text indexes on task title and description for efficient full-text search
- Default MongoDB `_id` indexes

- Unique indexes on `username`and `email` in the User collection

### Data Access Patterns

The architecture optimizes for:

1. Users accessing their own tasks (most common operation)
2. Managers viewing tasks of team members
3. Full-text search on task content
4. Filtering tasks by various attributes like status and priority

### Embedded vs Referenced Documents

I made deliberate choices about when to use embedding vs referencing:

- **Tasks are embedded in User documents** - This optimizes access patterns where users primarily retrieve their own tasks or tasks assigned to them
- **User references** - I use ObjectId references for task assignees, creators, and manager relationships
- **Comments are embedded** - Comments on tasks/subtasks are embedded for performance, as they are always retrieved along with their parent document

This structure allows for efficient querying while minimizing the need for multiple database lookups (joins), which can be costly in NoSQL databases.

## Persistence Technologies

### Mongoose as ODM

I use Mongoose as Object Document Mapper for MongoDB, which provides:

- Schema definition and enforcement
- Validation for data integrity
- Clean API for querying MongoDB
- Middleware operations (pre/post hooks)
- Type conversion and casting

### Redis for Complementary Storage

While MongoDB serves as our primary database, I employ Redis for:

- Managing JWT token blacklists to support secure logout functionality
- Tracking online users in real-time
- Mapping between socket connections and user IDs
- Supporting real-time features that require low-latency responses

## Scalability Considerations

The database design supports horizontal scalability:

- Document-based architecture allows for sharding by user ID
- Embedding frequently accessed related data reduces join operations
- Use of Redis for real-time features offloads MongoDB for high-throughput operations

The nested document structure might face limitations with very large task lists per user, but this can be mitigated by implementing pagination strategies and potentially refactoring to a referenced model if necessary.

## Database Queries and Operations

The application uses aggregation pipelines extensively to:

- Filter tasks based on multiple criteria
- Implement full-text search across task titles and descriptions
- Apply pagination for efficient data retrieval
- Project only necessary fields to minimize data transfer

These optimizations ensure good performance even as the data volume grows.

## Database Hosting

I use MongoDB Atlas for database hosting rather than managing database infrastructure manually. MongoDB Atlas provides:

- Free tier hosting for a single MongoDB cluster
- Automated backups and point-in-time recovery
- Advanced security features including IP allowlisting and VPC peering
- Database monitoring and performance optimization tools
- Seamless scaling options as application demands increase
- Geographic distribution capabilities for improved global access
  This cloud-based approach eliminates the operational overhead of database administration while maintaining professional-grade reliability, security, and performance characteristics.
