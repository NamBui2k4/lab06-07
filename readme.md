

# 📁 File Manager Web Application

*A lightweight and containerized file management system built with Express.js, MySQL, Multer, and Docker.*



## 🛠 Technologies Used

### **Backend**

* **Node.js / Express.js**
* **Express-Session**
* **MySQL (MariaDB / MySQL Server)**
* **Multer** – upload handling
* **Archiver** – ZIP export
* **csurf** – CSRF protection
* **connect-flash** – flash messaging

### **Frontend**

* **EJS Template Engine**
* **Bootstrap 4**
* **jQuery AJAX**
* **FontAwesome Icons**

### **DevOps**

* **Docker**
* **Docker Compose**

---

## 📦 Docker Setup

This project includes a ready-to-use Docker Compose file with:

* **Node.js app container**
* **MySQL database container**
* **Auto database initialization**

### 🚀 Start with Docker



App runs at:

```
http://localhost:3000
```

MySQL runs at:

```
localhost:3306
user: root
password: 123456
database: lab_nodejs
```

---

## 🐳 docker-compose.yml (Recommended Setup)

```
services:
  mysql:
    image: mysql:8
    container_name: lab06-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: lab_nodejs
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

```bash
docker compose up -d
```

---

Go mysql:

```
docker exec -it lab06-mysql mysql -u root -p
```

```
password: 123456
```

Create table:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100),
  email VARCHAR(100),
  username VARCHAR(100),
  password VARCHAR(255)
);
```
Create user admin:
```
INSERT INTO users (fullname, email, username, password)
VALUES ('Admin', 'admin@gmail.com', 'admin',
'$2b$10$TBjjBHkrbwGmibqxXUwX.OABLbHAF9THhHjnifhAZtls0/alETJcS ');
```

in which `$2b$10$TBjjBHkrbwGmibqxXUwX.OABLbHAF9THhHjnifhAZtls0/alETJcS` is password hashed by bcript module.

---
## 🏗 Project Structure

```
project/
│
├── Dockerfile
├── docker-compose.yml
├── app.js
├── package.json
│
├── controllers/
│   └── fileController.js
│
├── routes/
│   ├── account.js
│   └── file.js
│
├── uploads/                 # File storage
│
├── database/
│   ├── db.js                # MySQL connection
│   └── init.sql             # (optional) auto-run schema
│
└── views/
    ├── index.ejs
    ├── login.ejs
    ├── register.ejs
    └── error.ejs
```

---


## ⚙️ Installation

```bash
npm install
node app.js
```

---

# 🚀 Features & Demo

### ✔ File & Folder Navigation

* Explore directories with breadcrumb navigation
* Nested folders supported

### ✔ Folder Creation

```
POST /files/new-folder
```

* Instantly create a new folder in the current path

### ✔ Create Text File

```
POST /files/create-text
```

### ✔ Upload File

Supports any file type via Multer.

```
POST /files/upload
```

### ✔ Download File

```
GET /files/download?path=...
```

### ✔ Download Folder as ZIP

```
GET /files/zip?path=...
```

### ✔ Rename File or Folder

```
POST /files/rename
```

### ✔ Delete File or Folder

Recursive folder delete.

```
POST /files/delete
```

### ✔ Authentication

* Session-based login
* Protected routes
* CSRF protection (except upload)

---

## 🔐 Security

* CSRF tokens injected into EJS
* Upload path sanitized (`path.join`, `fs.stat`)
* Session restricted to logged-in users

---

## 🧪 Test Checklist

* Create nested folders
* Upload file into subfolder
* Download file
* Download folder as ZIP
* Rename operations
* Delete operations
* Logout / login

---

## 📜 Demo result

![](public\image.png)

![](public\index.png)

![](public\new-folder.png)

![](public\hello.png)

![](public\register.png)

![](public\register-1.png)