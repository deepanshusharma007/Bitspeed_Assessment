# Contact Identity Tracking Web Service

## 📌 Problem Statement

In an e-commerce or CRM system, customers often make purchases using different contact details (email, phone number, etc.). The challenge is to identify and link all contacts belonging to the same person to maintain a unified customer profile.

### **Requirements**
1. If a new contact has an email or phone number matching an existing contact, it should be linked.
2. If a contact contains new information (new email or phone number), a secondary contact should be created.
3. The system should always return the **primary contact ID** with all linked emails, phone numbers, and secondary contact IDs.
4. Efficiently handle merging and linking of contacts while avoiding duplication.

---

## ✅ Solution

The **Contact Identity Tracking Web Service** solves this problem by:
- Maintaining a **Contact** table in a MySQL database.
- Identifying primary and secondary contacts dynamically.
- Automatically linking new contacts based on email or phone number.
- Ensuring accurate identity resolution.

---

## 🚀 Hosted Application

- **Backend:** Hosted on [Render](https://render.com)
- **Database:** Hosted on [TiDB Cloud](https://tidbcloud.com)

---

## 🛠 Tech Stack

- **Backend:** Node.js, TypeScript, Express.js
- **Database:** MySQL (TiDB Cloud)
- **Frontend:** HTML, CSS (for testing API via form)

---

## 📖 Installation & Running the Project

Follow these steps to set up and run the project:

### 1️⃣ Clone the Repository
```sh
 git clone https://github.com/deepanshusharma007/Bitspeed_Assessment
 cd backend
```

### 2️⃣ Install Dependencies
```sh
 npm install
```

### 3️⃣ If any error occurs, install dependencies manually (Optional)
```sh
 npm install express mysql2 dotenv typescript ts-node nodemon copyfiles fs-extra cors body-parser
```

### 4️⃣ Run the Project
```sh
 npm start
```

The server will start running on the port defined in your `.env` file.

---

## ⚙️ Environment Variables

You can modify database credentials in the `.env` file:

```env
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=bitespeed
PORT=4000
SERVER_PORT=5000
```

---

## 🎯 API Endpoint

### **Identify Contact**
- **Endpoint (Run Locally and then try to Test) :** `POST /api/identify`
- **Request Body:**
  ```json
  {
    "email": "george@hillvalley.edu",
    "phoneNumber": "919191"
  }
  ```
- **Response:**
  ```json
  {
    "contact": {
      "primaryContactId": 1,
      "emails": ["george@hillvalley.edu"],
      "phoneNumbers": ["919191"],
      "secondaryContactIds": []
    }
  }
  ```

---

## 📸 Output Screenshot

(Insert an image of your API working here, e.g., a successful response from Postman or the UI form.)

---

## 📌 Notes

- If needed, update the database credentials in the `.env` file.
- Ensure your MySQL database is accessible.
- You can use the provided HTML form to test the API without Postman.

---

## 🤝 Contributing

Feel free to open issues or submit pull requests to enhance the project.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).


## OUTPUT

![image](https://github.com/user-attachments/assets/5666a18c-8080-40a0-b4f2-7d474299d5bf)

