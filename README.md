# E-Learning Platform

An E-Learning site for students to browse, purchase, and learn various courses. This platform provides an interactive environment for students to seek assistance from teachers, ask questions, and review their purchased courses.

## Overview

The E-Learning platform allows students to explore a variety of courses, buy them, and access a full library of video lectures for learning. Students can also interact with instructors by asking questions on specific videos, leave course reviews, and access their purchased courses at any time. The platform offers secure payment options, authentication via Google, GitHub, or email, and includes an admin dashboard for course and user management.

[Deployed Link](https://e-learning-lms-ten.vercel.app/) <!-- Add your deployed link here -->

## Features

- **Course Display & Purchase**: Browse all available courses and purchase securely using card payments through Stripe.
- **Video Course Access**: Access purchased courses and watch video lectures at any time.
- **Q&A System**: Ask questions on specific course videos and receive replies from the admin.
- **Course Reviews**: Leave reviews for courses to share feedback with other students.
- **Authentication**: Login and signup via Google, GitHub, or email/password.
- **Admin Dashboard**:
  - Monitor users and courses
  - Create and edit courses
  - Respond to student questions
  - Display charts and graphs for users, courses, etc.
  - Receive notifications for key platform activities

## Admin Login Credentials

To access the admin dashboard and explore its features, use the following credentials:

- **Email**: `admin@gmail.com`
- **Password**: `123456`

#### Navigation

1. Log in using the credentials above.
2. Click on the **Profile** menu in the navigation bar.
3. Select **Admin Dashboard** from the dropdown.

Feel free to log in and test the admin functionalities, including managing courses, users, and responding to student queries.

## Screenshots

Include screenshots for the following:
- **Home Page**
  ![Screenshot 2024-11-13 165135](https://github.com/user-attachments/assets/4492337b-5f00-4721-a802-d929c01ac433)
- **Course Page**
  ![Screenshot 2024-11-13 165203](https://github.com/user-attachments/assets/7c3ff1fe-903b-412b-9459-8684c8efefdc)
- **Purchased Course Page**
  ![Screenshot 2024-11-13 165458](https://github.com/user-attachments/assets/e73f95d1-8ad4-4401-afdc-6e86048c27c9)
- **Admin Dashboard**
  ![Screenshot 2024-11-13 165348](https://github.com/user-attachments/assets/7aad4ebe-beaa-42f1-bb6c-bd19fce682cc)
  
## Tech Stack

- **Frontend**: Next.js, Redux Toolkit, NextAuth for authentication
- **Backend**: Express.js, Node.js, MongoDB
- **Payments**: Stripe integration for card payments

## Installation

To set up this project locally:

### Prerequisites
Ensure you have **Node.js** and **npm** installed on your system.

### Clone the repository
```bash
git clone https://github.com/jeevan-2005/E-Learning.git
cd E-Learning
```

Frontend Setup:

1. **Navigate to the frontend folder:**:
    ```sh
   cd lms_frontend
    ```
2. **Install dependencies:**:
    ```sh
    npm install
    ```
3. **Set up environment variables in a .env.local file.**
4. **Run the frontend:**:
    ```sh
    npm run dev
    ```
5. **Build for Production: To create a production build of the frontend:**
   ```sh
   npm run build
   ```

Backend Setup:

1. **Navigate to the frontend folder:**:
    ```sh
   cd lms_backend
    ```
2. **Install dependencies:**:
    ```sh
    npm install
    ```
3. **Set up environment variables in a .env.local file.**
4. **Run the frontend:**:
    ```sh
    npm run dev
    ```  

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
