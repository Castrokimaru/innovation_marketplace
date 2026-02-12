 Innovation Marketplace

A full-stack web platform that connects student innovators with recruiters by showcasing reviewed and approved tech projects in a professional marketplace environment.

 Overview

Innovation Marketplace is a role-based project marketplace where:

 Students submit and manage their projects

 Admins review and approve submissions

 Recruiters browse approved projects and evaluate talent

Users can purchase merchandise

Payments are integrated via M-Pesa (Safaricom Sandbox)

The platform focuses on structured review, role-based access control, and a clean professional UI.

 Tech Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

ShadCN UI

NextAuth.js (Authentication)

Lucide Icons

Backend

Flask

SQLAlchemy

PostgreSQL / SQLite

Flask-Migrate

JWT Authentication

M-Pesa Daraja API (Sandbox)

User Roles
1️ Student

Submit projects

Upload thumbnails

Add technologies & categories

Edit their own submissions

2️⃣ Admin

Review submitted projects

Approve or reject projects

Manage users and merchandise

3️⃣ Recruiter

Access recruiter dashboard

View approved projects only

Filter by technology

Search by student/team

Evaluate project stack

 Core Features
 Authentication

Role-based access control

Secure login via NextAuth

Protected recruiter dashboard

Session-based user state

 Project Management

Create, edit, delete projects

Upload thumbnail images

Category and technology tagging

Admin approval workflow

Public page displays approved projects only

 Advanced Filtering & Sorting

Search by:

Title

Description

Author

Filter by category

Sort by:

Newest

Most viewed

Highest rated

 Recruiter Dashboard

Displays approved submissions only

Shows statistics:

Total approved projects

Unique students

Technologies count

Live filtering and refresh functionality

 Merchandise Shop

Browse items

Add to cart

Checkout flow

Order tracking

 M-Pesa Integration

STK Push (Sandbox)

Secure credential handling via .env

Token generation & payment request handling

Order creation after successful payment

 Project Structure
innovation_marketplace/
│
├── frontend/            # Next.js app
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
│
├── server/              # Flask backend
│   ├── models.py
│   ├── resources/
│   ├── migrations/
│   └── ...
│
└── README.md

 Installation & Setup
1️ Clone the Repository
git clone https://github.com/your-repo/innovation_marketplace.git
cd innovation_marketplace

2️⃣ Backend Setup
cd server
pipenv install
pipenv shell
flask db upgrade
flask run


Create a .env file:

MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🔄 Approval Workflow

Student submits project

Admin reviews project

Admin approves project

Project becomes visible on:

Public /projects page

Recruiter Dashboard

Unapproved projects are not publicly accessible.

 Security Considerations

Role-based route protection

Server-side session validation

Hidden GitHub links (to prevent code scraping)

Environment variables for sensitive credentials

Protected admin endpoints

 Future Improvements

Pagination for large datasets

Email notifications on approval

Recruiter contact modal with copy-all emails

Analytics dashboard

Production M-Pesa integration

Project bookmarking system

 Learning Outcomes

This project demonstrates:

Full-stack architecture

RESTful API design

Authentication & authorization

Payment gateway integration

State management in React

Git branching & PR workflow

UI/UX refinement

Secure environment handling

 Contributors

Joshua (Frontend & Integration)
Grace Odongo 
Team Members (Backend, Admin workflows, Review system)

 License

This project was developed for academic purposes.
