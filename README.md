# EduTrack - School CRM System

A comprehensive web-based school management application built with modern web technologies. This system enables efficient management of classes, teachers, and students while providing detailed analytics.

## Tech Stack

### Frontend
- **React** (v18) with Vite for fast development and optimal builds
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built accessible components
- **Zod** for form validation and type safety
- **React Router Dom** for routing
- **React Query** for server state management
- **Axios** for API requests

### Backend
- **Node.js** & **Express.js** for server-side logic
- **MongoDB** with Mongoose ODM for database
- **JWT** for authentication
- **Zod** for API request validation
- **Cors** for cross-origin resource sharing
- **Bcrypt** for password hashing

## Screenshots

### Authentication Pages
## Signup Page: 
![Auth Pages](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483649/signup_rsmx53.png)
## Login Page: 
![Auth Pages](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483649/login_hvgirs.png)
- Login page with role selection
- Sign up page with form validation
- Protected route handling

### Dashboard
<!-- ![Dashboard](/screenshots/dashboard.png) -->
- Role-based dashboard views
- Quick access to key features
- Analytics overview

### Class Management
![Class Management](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483993/class_management_wcdckp.png)
- Class listing with pagination
- Create/Edit class forms (Admin only)
- Class analytics and student distribution

### Teacher Management
![Teacher Management](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483650/teacher_management_l9l5jg.png)
- Teacher profiles and listings
- Assignment management
- Salary and schedule tracking

### Student Management
![Student Management](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483650/student_management_ervzr9.png)
- Student profiles and listings
- Class enrollment status
- Fee payment tracking

### Analytics Dashboard
![Analytics](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483650/analytics_echfz8.png)
- Financial reports
- Gender distribution charts
- Monthly/Yearly comparisons

## Features

### Authentication & Authorization
- Role-based access control (Admin, Teacher, Student)
- Secure signup and login system
- Protected routes based on user roles
- JWT-based authentication

### User Management


#### Teacher
![Teacher](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483650/add_new_teacher_d02lqv.png)
- View assigned classes and students
- Create new teacher profiles
- View analytics for assigned classes
- Cannot modify or delete existing teacher profiles

#### Student
![Student](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483649/add_new_student_arkgx7.png)
- View personal profile and assigned classes
- Create new student profiles
- View assigned teachers
- Cannot modify or delete existing student profiles

### Classes
![Classes](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483650/create_class_pgo6ir.png)
- Create new classes (Admin only)
- Set student capacity limits
- View class details and analytics
- Track student enrollment and teacher assignments

#### Admin
![Admin](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483649/edit_and_delete_teacher_ed6nfv.png)
![Admin](https://res.cloudinary.com/dvyf3uzxp/image/upload/v1736483649/edit_and_delete_student_tggppo.png)
- Full access to all features
- Can create, edit, and delete classes
- Can manage teacher and student profiles
- Access to complete analytics dashboard

### Profile Management
#### Teacher Profiles
- Personal Information
  - Name
  - Gender
  - Date of Birth
  - Contact Details
- Professional Information
  - Salary
  - Assigned Classes
  - Teaching Schedule

#### Student Profiles
- Personal Information
  - Name
  - Gender
  - Date of Birth
  - Contact Details
- Academic Information
  - Enrolled Classes
  - Fees Status
  - Academic Progress

### Analytics Dashboard
- Class Analytics
  - Student gender distribution graphs
  - Class capacity utilization
  - Performance metrics
- Financial Analytics
  - Monthly/Yearly toggle views
  - Teacher salary expenditure
  - Student fees income
  - Custom date range selection


## Form Validation with Zod

```typescript
// Example Zod schema for class creation
const classSchema = z.object({
  name: z.string().min(2).max(50),
  year: z.number().min(2024).max(2030),
  capacity: z.number().min(1).max(50),
  teacherId: z.string().uuid(),
  studentFees: z.number().min(0),
});

// Example Zod schema for teacher creation
const teacherSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.date(),
  contact: z.object({
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
    address: z.string().min(5),
  }),
  salary: z.number().min(0),
});
```

## API Implementation

```typescript
// Example API endpoint with Zod validation
app.post('/api/classes', authenticateAdmin, async (req, res) => {
  try {
    const validatedData = classSchema.parse(req.body);
    const newClass = await Class.create(validatedData);
    res.status(201).json(newClass);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
```

## Environment Setup

```bash
# .env.example
VITE_API_URL=http://localhost:5000/api
VITE_JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/hsayvaidya23/EduTrack.git
cd EduTrack
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up shadcn/ui components
```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add card
```

4. Start development servers
```bash
# Backend
npm run dev

# Frontend
npm run dev

## API Endpoints

### Authentication
- POST /api/auth/signup
- POST /api/auth/login

### Classes
- GET /api/classes
- POST /api/classes (Admin only)
- PUT /api/classes/:id (Admin only)
- DELETE /api/classes/:id (Admin only)

### Teachers
- GET /api/teachers
- POST /api/teachers (Admin/Teacher)
- PUT /api/teachers/:id (Admin only)
- DELETE /api/teachers/:id (Admin only)

### Students
- GET /api/students
- POST /api/students (Admin/Student)
- PUT /api/students/:id (Admin only)
- DELETE /api/students/:id (Admin only)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
```

## Development Workflow

1. **Component Development**
   - Use shadcn/ui components as base
   - Extend with Tailwind CSS for custom styling
   - Implement Zod validation schemas

2. **API Integration**
   - Create API endpoints with Express
   - Add Zod validation middleware
   - Implement error handling

3. **Testing**
   - Unit tests with Vitest
   - API tests with Supertest
   - End-to-end tests with Cypress

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

