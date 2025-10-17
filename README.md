

# 📚 Smart Classroom & AI Timetable Scheduler

A **MERN-based Smart Classroom Management System** that helps manage **faculties, rooms, and courses**, while automatically generating an **AI-powered timetable** that assigns the **right faculty to the right course**. It also includes a **chatbot** for students and faculty to query the timetable in real time.

<img width="1878" height="922" alt="image" src="https://github.com/user-attachments/assets/6e84e2ac-f10f-4896-a203-c8b110168886" />

<img width="1888" height="902" alt="image" src="https://github.com/user-attachments/assets/564d1596-83ea-49f7-ac3a-ccbe5bb9c3be" />

<img width="1897" height="910" alt="image" src="https://github.com/user-attachments/assets/afe3955a-f8c3-4843-bcb4-d7c34f7a4165" />

<img width="1918" height="908" alt="image" src="https://github.com/user-attachments/assets/1e5d818d-4bcf-44af-b254-ca0fd8330e75" />

<img width="1907" height="916" alt="image" src="https://github.com/user-attachments/assets/be5e4200-8d7f-4d45-96b2-a14073f32989" />

<img width="1917" height="906" alt="image" src="https://github.com/user-attachments/assets/2baee206-6a8f-4a5c-8051-0eba748eb138" />

<img width="1905" height="897" alt="image" src="https://github.com/user-attachments/assets/2f71c22a-ff22-474b-a858-22c57de01878" />


---

## 🚀 Features

* 👨‍🏫 **Faculty Management**

  * Add, update, and manage faculty members with their expertise.

* 🏫 **Room Management**

  * Add classrooms with seating capacity and availability.

* 📘 **Course Management**

  * Create and assign courses with prerequisites and credit details.

* 📅 **AI Timetable Generator**

  * Automatically generates an optimized timetable.
  * Ensures no clashes between rooms, faculty, and courses.
  * Maps correct faculty to correct courses based on expertise.

* 🤖 **AI Chatbot**

  * Students and faculty can ask about class schedules.
  * Provides quick answers like *"When is my next class?"* or *"Which room is CS101?"*.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **AI**: Timetable generation algorithm (genetic algorithm/constraint satisfaction)
* **Chatbot**: AI-powered assistant 

---

## 📂 Project Structure

```
smart-classroom/
├── backend/           # Node.js + Express APIs
│   ├── models/        # Faculty, Room, Course schemas
│   ├── routes/        # API routes
│   └── controllers/   # Logic for handling requests
├── frontend/          # React.js client
│   ├── components/    # Reusable UI components
│   ├── pages/         # Pages (Dashboard, Timetable, Chatbot)
│   └── utils/         # Helper functions
├── ai/                # Timetable generation + chatbot logic
└── README.md          # Project documentation
```

---

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/smart-classroom.git
   cd smart-classroom
   ```

2. **Backend setup**

   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**

   * Create a `.env` file in `backend/` with:

     ```
     MONGO_URI=your_mongodb_connection
     PORT=5000
     AI_API_KEY=your_ai_key_if_any
     ```

---

## 🎯 Future Enhancements

* 📊 Dashboard with analytics for faculty workload and room usage.
* 🔔 Notification system for class changes/cancellations.
* 🧑‍🎓 Student portal with personalized schedules.
* 🌐 Multi-language support for chatbot.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 💡 Acknowledgements

* MERN Stack community
* GeminiAI / Dialogflow for chatbot inspiration
* Constraint Satisfaction Problem (CSP) & Genetic Algorithms for timetable generation

---

👉 Would you like me to also **add some sample screenshots / usage GIF placeholders** in the README so it looks more professional on GitHub?
