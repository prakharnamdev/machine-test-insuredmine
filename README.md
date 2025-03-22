# machine-test-insuredmine
Node.js + MongoDB Project

This project is built using Node.js, Express, and MongoDB. It provides functionalities for uploading and processing CSV/XLSX data, searching policies, tracking real-time CPU usage, and scheduling messages.

Features-

1.Upload and store CSV/XLSX data in MongoDB using worker threads

2.Search API to find policy info by username

3.Aggregate policy data per user

4.Real-time CPU monitoring and auto-restart on 70% usage

5.Schedule messages for a specific date and time

Installation & Setup-

1️⃣ Clone the Repository

$ git clone https://github.com/prakharnamdev/machine-test-insuredmine.git
$ cd your-repo

2️⃣ Create a .env File

Add the following environment variables:

MONGO_URI=your_mongodb_connection_string
PORT=5000

3️⃣ Install Dependencies

$ npm install

4️⃣ Start the Server

For normal mode:

$ npm start

For development mode with auto-restart:

$ npm run dev

API Endpoints

🔹 Upload CSV/XLSX File

POST /api/upload

Request Body:

{
  "file": upload csv file
}

Uploads and stores file data into MongoDB.

🔹 Search Policy by Username

GET /api/policies/search?username=JohnDoe

Finds policy information by user email or first name.

🔹 Get Aggregated Policies

GET /api/policies/aggregate

Provides policy data grouped by each user.

🔹 Schedule a Message

POST /api/schedule

Request Body:

{
  "message": "Hello!",
  "day": "2025-03-22",
  "time": "14:00"
}

Stores a scheduled message to be processed later.

Real-time CPU Monitoring

Automatically restarts the server if CPU usage exceeds 70%.


Contact

For queries or support, email prakharnamdev00@gmail.com.