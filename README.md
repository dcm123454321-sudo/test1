# USTH Twitter Starter

A basic Twitter-like Android application developed in **Java and XML**, connected to a **Node.js/Express REST API** and a **MySQL database**.

This project is being developed incrementally as a group project for the Mobile Application Development course at USTH.

## 1. Project Overview

The project consists of two main components:

- **Android Client:** Displays tweets retrieved from the backend and allows users to publish new tweets.
- **Backend Server:** An Express REST API responsible for storing and retrieving tweets through MySQL.

Unlike the initial version, which used hardcoded sample tweets, the updated Android application now communicates directly with the backend using **Volley**.

**Current status:** Backend endpoints have been tested successfully. Android API integration has been implemented and is awaiting final testing on the emulator.

## 2. Technologies Used

| Component | Technology |
|---|---|
| Android | Java, Android SDK |
| User interface | XML layouts |
| Timeline | RecyclerView |
| Networking | Volley |
| Backend | Node.js, Express |
| Database | MySQL 8.0 |
| Data exchange | HTTP, JSON |
| Build systems | Gradle, npm |
| Development tools | Android Studio, VS Code |
| Version control | Git, GitHub |

## 3. Implemented Features

### 3.1 Android Client

**Timeline**

- Retrieves tweets from the Express backend through `GET /api/posts`.
- Displays tweets using RecyclerView.
- Shows each tweet's author username and text.
- Displays posts in newest-first order, as returned by the backend.
- Requests tweets when the timeline screen is opened.

**Compose Tweet**

- Users can tap **Write a Tweet** to open a text input dialog.
- Supports messages up to 280 characters.
- Rejects empty messages.
- Sends a `POST /api/posts` request to publish the tweet.
- Reloads the timeline after a successful response.
- Displays a message when posting succeeds or fails.

**Networking**

- Uses Volley for asynchronous HTTP requests.
- Connects to the Windows-hosted backend using `10.0.2.2:3000` from the Android emulator.
- Converts JSON responses into Java `Tweet` objects.
- Displays basic error messages when the server is unreachable or returns an error.

### 3.2 Backend Server

**REST API**

- Built with Node.js and Express.
- Runs on port `3000` by default.
- Accepts JSON request bodies.
- Returns JSON responses.
- Provides basic validation and error handling.

**MySQL integration**

- Uses the `mysql2` package to connect to MySQL.
- Stores posts in the `usth_twitter` database.
- Uses parameterized SQL queries when inserting posts.
- Retrieves stored tweets in newest-first order.
- Preserves tweet data after application and server restarts.

### 3.3 Implemented API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check server and database availability |
| GET | `/api/posts` | Retrieve stored tweets |
| POST | `/api/posts` | Create and save a new tweet |

Example GET response:

```json
{
  "posts": [
    {
      "id": 1,
      "username": "student",
      "content": "Hello from our first Twitter backend!",
      "created_at": "2026-10-21T16:42:09.000Z"
    }
  ]
}
```

Example POST request:

```json
{
  "username": "student",
  "content": "Hello from Android!"
}
```

A successful POST returns HTTP status `201` and the newly created post.

## 4. Project Architecture

```text
Android Application
        |
        v
TimelineFragment
        |
        v
TweetRepository
        |
        v
ApiService (Volley)
        |
        | HTTP / JSON
        v
Express REST API
        |
        v
MySQL Database
```

**Component responsibilities**

- `MainActivity`: Hosts the Android timeline screen.
- `TimelineFragment`: Manages the timeline and compose dialog.
- `TweetAdapter`: Connects tweet data to RecyclerView.
- `TweetViewHolder`: Displays individual tweet items.
- `Tweet`: Represents tweet data inside the Android client.
- `TweetRepository`: Converts backend JSON responses into Tweet objects.
- `ApiService`: Performs asynchronous GET and POST requests using Volley.
- `server.js`: Handles API requests and database operations.

This separation allows UI and backend components to be developed independently.

## 5. Project Structure

```text
USTH-Twitter-Starter/
│
├── app/
│   └── src/main/
│       ├── java/com/example/twitterclient/
│       │   ├── MainActivity.java
│       │   │
│       │   ├── model/
│       │   │   └── Tweet.java
│       │   │
│       │   ├── ui/timeline/
│       │   │   ├── TimelineFragment.java
│       │   │   ├── TweetAdapter.java
│       │   │   └── TweetViewHolder.java
│       │   │
│       │   ├── network/
│       │   │   └── ApiService.java
│       │   │
│       │   └── repository/
│       │       └── TweetRepository.java
│       │
│       ├── res/layout/
│       │   ├── activity_main.xml
│       │   ├── fragment_timeline.xml
│       │   └── item_tweet.xml
│       │
│       └── AndroidManifest.xml
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── build.gradle
├── settings.gradle
└── README.md
```

The backend folder is maintained separately from the Android Gradle module. Some generated and configuration files are omitted from the diagram.

## 6. Setup Instructions

### 6.1 Requirements

- Android Studio
- Android SDK and Android emulator
- Java JDK compatible with the Gradle configuration
- Node.js and npm
- MySQL Server 8.0

### 6.2 Database Setup

Connect to MySQL and create the project database:

```sql
CREATE DATABASE IF NOT EXISTS usth_twitter;

USE usth_twitter;

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6.3 Backend Setup

Open a terminal inside the `backend` folder.

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=usth_twitter
PORT=3000
```

Replace the placeholder password with your own local MySQL password.

Start the backend:

```bash
node server.js
```

Test the endpoints in a browser:

```text
http://localhost:3000/api/health
http://localhost:3000/api/posts
```

The health endpoint should report that the database is connected.

### 6.4 Android Setup

1. Open the Android project root in Android Studio.
2. Wait for Gradle Sync to finish.
3. Make sure the Express server and MySQL are running.
4. Start an Android emulator.
5. Select the `app` run configuration.
6. Run the application.

The Android emulator connects to the local backend using:

```text
http://10.0.2.2:3000
```

This address is defined in `ApiService.java`.

**Important:** `10.0.2.2` is specific to the standard Android emulator. Running the application on a physical phone requires a different, reachable backend address.

## 7. Current Limitations

### Android Client

- Uses a fixed demo username: `student`.
- No user registration or login.
- No profile pages or user search.
- No following or follower functionality.
- No likes, replies, retweets, or direct messages.
- No image or video attachments.
- No notifications.
- No pull-to-refresh functionality.
- No offline caching.
- Tweets require a running backend to load.
- Tweet IDs and timestamps are stored by the backend but are not yet represented in the Android `Tweet` model.
- Full Android-to-backend behavior still needs emulator verification.

### Backend

- Only basic post creation and retrieval are supported.
- No authentication or authorization.
- No users table or user relationships.
- The username is supplied directly by the client.
- No post editing or deletion.
- No pagination.
- No media storage.
- No production deployment.

### Security

The project currently uses unencrypted HTTP for local development.

The Android manifest permits cleartext HTTP traffic so the emulator can reach the development server.

The backend uses local MySQL credentials stored in `.env`.

**This version is intended for development and testing only.** Authentication, restricted database credentials, HTTPS and appropriate access controls are required before public deployment.

Do not commit `.env` or real database credentials to GitHub.

## 8. Development Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | Basic Android timeline | Completed |
| 2 | Local tweet composition | Completed |
| 3 | Express server | Completed |
| 4 | MySQL database integration | Completed |
| 5 | GET/POST posts API | Completed |
| 6 | Android networking with Volley | Implemented |
| 7 | Android-to-backend end-to-end testing | Next |
| 8 | User registration and login | Planned |
| 9 | User profiles and search | Planned |
| 10 | Likes, replies and retweets | Planned |
| 11 | Followers and following | Planned |
| 12 | Direct messages and media | Planned |
| 13 | Deployment and additional testing | Planned |

## 9. Next Development Milestone

The immediate next milestone is to verify the updated Android application against the running backend.

Testing goals:

- Confirm that tweets stored in MySQL appear in the Android timeline.
- Publish a tweet from the Android application.
- Confirm that the new tweet appears in `GET /api/posts`.
- Restart the Android application and verify that the tweet remains visible.
- Test the behavior when the backend is unavailable.

Once these tests pass, the next major development stage will be user management and authentication.

## 10. Reference Material

The application was designed with reference to the Twitter-Android-Client and Twitter-Server projects.

Relevant USTH Android Development coursework includes:

- Android Activities and Fragments
- XML layouts and UI resources
- RecyclerView and adapter patterns
- Background tasks and asynchronous operations
- HTTP networking with Volley
- JSON data representation
- Touch and user interaction

The application is a separate implementation rather than a direct copy of the reference repositories.

## 11. Project Status

**Early development — Android and backend integrated at source-code level**

The Android interface, Express backend and MySQL database are implemented. Database persistence and backend POST requests have been tested successfully.

The updated Android networking layer has been added, but complete end-to-end verification on the emulator remains the next task.

The project is intended to serve as a maintainable foundation for further development and group collaboration.