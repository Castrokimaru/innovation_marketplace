// Mock database data aligned with ERD

export const mockUsers = [
  {
    id: 1,
    first_name: "Jane",
    last_name: "Doe",
    email: "jane@moringa.com",
    password_hash: "hashed_password_1",
    role_id: 1,
    created_at: new Date("2024-01-15"),
    status: "active",
  },
  {
    id: 2,
    first_name: "John",
    last_name: "Smith",
    email: "john@moringa.com",
    password_hash: "hashed_password_2",
    role_id: 2,
    created_at: new Date("2024-02-20"),
    status: "active",
  },
];

export const mockUserRoles = [
  {
    id: 1,
    name: "admin",
    description: "Administrator with full access",
  },
  {
    id: 2,
    name: "user",
    description: "Regular user",
  },
  {
    id: 3,
    name: "reviewer",
    description: "Project reviewer",
  },
];

export const mockCategories = [
  {
    id: 1,
    name: "AI & Machine Learning",
    description: "Projects focused on artificial intelligence and machine learning",
  },
  {
    id: 2,
    name: "Web Development",
    description: "Web applications and frontend projects",
  },
  {
    id: 3,
    name: "Mobile Development",
    description: "Mobile app projects for iOS and Android",
  },
  {
    id: 4,
    name: "Data Science",
    description: "Data analysis and visualization projects",
  },
  {
    id: 5,
    name: "Cloud & DevOps",
    description: "Cloud infrastructure and DevOps solutions",
  },
];

export const mockProjects = [
  {
    id: 1,
    title: "Smart Farm Monitoring System",
    description: "IoT-based system for real-time farm monitoring and crop prediction using machine learning",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    technologies: "Python, TensorFlow, IoT, REST API",
    submitted_name: "Jane Doe",
    status: "approved",
    created_at: new Date("2024-01-20"),
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "Full-stack web application with real-time inventory management and payment integration",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    technologies: "React, Node.js, PostgreSQL, Stripe",
    submitted_name: "John Smith",
    status: "pending",
    created_at: new Date("2024-02-10"),
  },
  {
    id: 3,
    title: "Health Tracking Mobile App",
    description: "Cross-platform mobile application for tracking fitness activities and health metrics",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    technologies: "Flutter, Firebase, Dart",
    submitted_name: "Sarah Johnson",
    status: "approved",
    created_at: new Date("2024-01-05"),
  },
  {
    id: 4,
    title: "Data Analytics Dashboard",
    description: "Interactive dashboard for visualizing business metrics and real-time data insights",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    technologies: "Vue.js, D3.js, Python, PostgreSQL",
    submitted_name: "Michael Brown",
    status: "pending",
    created_at: new Date("2024-02-25"),
  },
  {
    id: 5,
    title: "Cloud Infrastructure Automation",
    description: "Terraform and Kubernetes setup for automated cloud deployment and scaling",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    technologies: "Terraform, Kubernetes, AWS, Docker",
    submitted_name: "Emily Davis",
    status: "approved",
    created_at: new Date("2024-01-30"),
  },
  {
    id: 6,
    title: "NLP Sentiment Analysis Tool",
    description: "Machine learning tool for analyzing sentiment in social media posts and customer reviews",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    technologies: "Python, NLP, scikit-learn, Flask",
    submitted_name: "Alex Wilson",
    status: "pending",
    created_at: new Date("2024-03-01"),
  },
];

export const mockProjectCategories = [
  { project_id: 1, category_id: 1 },
  { project_id: 1, category_id: 5 },
  { project_id: 2, category_id: 2 },
  { project_id: 3, category_id: 3 },
  { project_id: 4, category_id: 4 },
  { project_id: 5, category_id: 5 },
  { project_id: 6, category_id: 1 },
];

export const mockUserProjects = [
  { id: 1, project_id: 1, user_id: 1, action: "submitted" },
  { id: 2, project_id: 2, user_id: 2, action: "submitted" },
  { id: 3, project_id: 3, user_id: 1, action: "reviewed" },
];

export const mockMerchandise = [
  {
    id: 1,
    name: "Moringa School T-Shirt",
    description: "Premium cotton t-shirt with Moringa logo",
    price: 25.99,
    stock: 150,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
  },
  {
    id: 2,
    name: "Moringa Water Bottle",
    description: "Stainless steel water bottle, 750ml capacity",
    price: 19.99,
    stock: 200,
    image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e9?w=500&h=500&fit=crop",
  },
  {
    id: 3,
    name: "Innovation Badge Set",
    description: "Set of 5 enamel pins celebrating innovation",
    price: 12.99,
    stock: 300,
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
  },
  {
    id: 4,
    name: "Moringa Hoodie",
    description: "Comfortable hoodie for any season",
    price: 45.99,
    stock: 100,
    image_url: "https://images.unsplash.com/photo-1556821552-5c1e1e5d2d4e?w=500&h=500&fit=crop",
  },
  {
    id: 5,
    name: "Developer's Notebook",
    description: "Hardcover notebook for coding notes",
    price: 14.99,
    stock: 250,
    image_url: "https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=500&h=500&fit=crop",
  },
  {
    id: 6,
    name: "Sticker Pack",
    description: "Collection of 20 tech-themed stickers",
    price: 9.99,
    stock: 400,
    image_url: "https://images.unsplash.com/photo-1599810694352-c11cc3cfbe46?w=500&h=500&fit=crop",
  },
];

export const mockOrders = [
  {
    id: 1,
    user_id: 1,
    total_amount: 85.97,
    status: "completed",
    created_at: new Date("2024-02-15"),
  },
  {
    id: 2,
    user_id: 2,
    total_amount: 45.98,
    status: "pending",
    created_at: new Date("2024-03-01"),
  },
];

export const mockOrdersMerchandise = [
  {
    id: 1,
    order_id: 1,
    merchandise_id: 1,
    quantity: 2,
    price_at_purchase: 25.99,
  },
  {
    id: 2,
    order_id: 1,
    merchandise_id: 2,
    quantity: 1,
    price_at_purchase: 19.99,
  },
  {
    id: 3,
    order_id: 2,
    merchandise_id: 4,
    quantity: 1,
    price_at_purchase: 45.99,
  },
];
