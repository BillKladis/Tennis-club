# 🎾 Tennis Club Web App

A full-stack web application for managing tennis club bookings, tournaments, trainers, and user registration. Built with **Node.js**, **Express**, and **SQLite3** (via `better-sqlite3`), the app supports:

- 🧾 User registration/login (with `argon2` hashing)
- 🗓️ Court and trainer booking
- 📅 Schedule and calendar management
- 👨‍👩‍👧 Forms for self and child registration
- 🔐 Secure session handling
- 🗃️ Persistent storage via SQLite3

---

## 📦 Dependencies

| Package              | Description |
|----------------------|-------------|
| `express`            | Web framework for Node.js |
| `dotenv`             | Loads environment variables from `.env` |
| `express-session`    | Handles user sessions and authentication persistence |
| `argon2`             | Secure password hashing library |
| `better-sqlite3`     | Fast and simple SQLite3 bindings for Node.js |

Install all dependencies with:

```bash
npm install

Run with:

npm run start
or
node app.js