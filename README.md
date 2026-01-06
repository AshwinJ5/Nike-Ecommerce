Objective
Build a mini e-commerce application that demonstrates real-world development skills, including:
Server-side rendering (SSR)
Animations using GSAP
Token-based authentication
Clean API integration
Proper state management
Production-ready code quality
This test evaluates UI accuracy, logic handling, performance, and code structure.

Mandatory Tech Stack
Framework: Next.js (App Router preferred)
Styling: Tailwind CSS or CSS Modules
State Management: Context API or Zustand
Animations: GSAP (mandatory)
Authentication: Token-based (JWT)
Rendering:
Navbar → SSR
Product Details → SSR
Footer → SSR
UI Design
Figma Design File:
 https://www.figma.com/design/9kO0TVazA4g5rA1aK9Baru/Skill-Test
Website Prototype:
 https://www.figma.com/proto/9kO0TVazA4g5rA1aK9Baru/Skill-Test
Mobile Responsive Prototype:
https://www.figma.com/proto/9kO0TVazA4g5rA1aK9Baru/Skill-Test?page-id=52%3A505
Base URL:
 https://skilltestnextjs.evidam.zybotechlab.com/


👉 UI must closely match the Figma design (spacing, typography, layout).

Pages & Features
1️⃣ Global Layout
Navbar (SSR Required)
Logo
Login button (if not authenticated)
Profile link (if authenticated)
Must be server-side rendered
Footer (SSR Required)
Static links
Proper alignment
Server-side rendered



2️⃣ Product Card (Core UI Test)
Card Requirements
Follow the uploaded Figma design exactly
Display:
Product image
Product name
Brand logo
Color variants
Buy Now button
GSAP Animation (Mandatory)
On hover:
Product image moves upward
Smooth easing
❌ CSS-only animations not allowed

3️⃣ Authentication Flow
Phone number login with OTP
If user does not exist:
Collect Name
Store JWT token securely
Protect Profile page using token
Logout clears token

4️⃣ Order Success Page
Display:
Order ID
Payment status
Success message

5️⃣ Profile Page
List all orders
Logout functionality

Evaluation Criteria
SSR implementation
GSAP animation quality
Clean component structure
State management usage
Token handling & protected routes
Responsiveness (Desktop + Mobile)
Code readability & scalability
REST API FOR INTEGRATION
All protected APIs require:
Authorization: Bearer <access_token>


1️⃣ Verify User (OTP Based)
Endpoint:
 POST /api/verify/
Request:
{
  "phone_number": "9876543210"
}

Response (Existing User):
{
  "otp": "1234",
  "token": {
    "access": "jwt_access_token_here"
  },
  "user": true
}

Response (New User):
{
  "otp": "5678",
  "user": false
}

📌 Static OTP allowed for testing.

2️⃣  Register
Endpoint:
 POST /api/login-register/
Request:
{
  "name": "Sanjith",
  "phone_number": "9876543210",
  "unique_id": "guest_cart_id_optional"
}

Response:
{
  "token": {
    "access": "jwt_access_token_here"
  },
  "user_id": "ARM0001",
  "name": "Sanjith",
  "phone_number": "9876543210",
  "message": "Login Successful"
}


3️⃣ Purchase Product (Buy Now)
Endpoint:
 POST /api/purchase-product/
Rules:
Send either product_id or variation_product_id


JWT required


Response:
{
  "message": "Order created successfully",
  "order": {
    "id": "ORD202512270001",
    "total_amount": 899,
    "payment_status": "Paid"
  }
}


4️⃣ User Orders List
Endpoint:
 GET /api/user-orders/
Response:
Order history for logged-in user


Supports both product & variation orders

5️⃣ New Products Listing
Endpoint:
 GET /api/new-products/
Latest 8 products


Includes variations (color, size)


Optimized queries required (prefetch_related)


