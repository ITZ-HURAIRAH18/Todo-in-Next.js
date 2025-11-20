"# 📋 Todo App in Next.js

A modern, feature-rich Todo application built with Next.js 16, TypeScript, Prisma, and PostgreSQL. Features include user authentication, role-based access control, todo sharing, and a beautiful dark/light mode interface.

🚀 **Live Demo:** [https://taskify18.vercel.app](https://taskify18.vercel.app)

> **Note:** This project was created as a learning experience to explore Next.js and its ecosystem, including authentication, database integration, and modern UI patterns.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with NextAuth.js
- JWT-based session management
- Role-based access control (USER/ADMIN)
- Secure password hashing with bcryptjs

### 📝 Todo Management
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Add descriptions and categories
- Soft delete functionality
- Filter and sort todos

### 🤝 Todo Sharing
- Share todos with other users
- Set view-only or edit permissions
- View shared todos separately
- Real-time permission checking

### 👨‍💼 Admin Dashboard
- User management (view and delete users)
- Todo overview and management
- Statistics and analytics
- Role-based filtering

### 🎨 User Interface
- Beautiful animated borders with gradient effects
- Dark/light mode support with theme toggle
- Responsive design for all screen sizes
- Shadcn UI components with Tailwind CSS v4
- Smooth transitions and animations

### 📊 Dashboard Features
- Todo statistics (total, completed, pending)
- Progress visualization with animated bars
- Recent todos overview
- Category distribution
- Completion rate tracking

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js v4
- **Styling:** Tailwind CSS v4, Shadcn UI
- **UI Components:** Custom components with semantic colors
- **State Management:** React Server Components

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ITZ-HURAIRAH18/Todo-in-Next.js.git
cd "Todo in Next.js/app"
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the `app` directory with the following:

```env
DATABASE_URL="your_postgresql_connection_string"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Set up the database:**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── app/
│   ├── (admin)/          # Admin routes
│   │   ├── layout.tsx    # Admin layout with auth check
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── users/
│   │       └── todos/
│   ├── (auth)/           # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (user)/           # User routes
│   │   ├── layout.tsx
│   │   └── user/
│   │       ├── dashboard/
│   │       └── todos/
│   └── api/              # API routes
│       ├── auth/
│       ├── todo/
│       ├── users/
│       └── admin/
├── components/           # Reusable components
│   ├── Navbar.tsx
│   ├── TodoForm.tsx
│   ├── TodoDisplay.tsx
│   ├── SharedTodoDisplay.tsx
│   ├── ShareTodoModal.tsx
│   ├── DeleteUserButton.tsx
│   └── DeleteTodoButton.tsx
├── lib/
│   └── prisma.ts        # Prisma client
└── prisma/
    ├── schema.prisma    # Database schema
    └── migrations/      # Database migrations
```

## 🗄️ Database Schema

### User Model
- `id` - Unique identifier
- `name` - User's name (optional)
- `email` - User's email (unique)
- `password` - Hashed password
- `role` - USER or ADMIN
- `todos` - User's todos
- `sharedTodos` - Todos shared with user

### Todo Model
- `id` - Unique identifier
- `title` - Todo title
- `description` - Todo description (optional)
- `completed` - Completion status
- `category` - Todo category (optional)
- `deleted` - Soft delete flag
- `userId` - Owner's ID
- `sharedWith` - Users with access

### SharedTodo Model
- `id` - Unique identifier
- `todoId` - Todo reference
- `userId` - User reference
- `canEdit` - Edit permission flag
- `sharedAt` - Share timestamp

## 🚀 Deployment

### Vercel Deployment

1. **Configure Root Directory:**
   - Set Root Directory to `app` in Vercel project settings

2. **Add Environment Variables:**
   - Add your `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`

3. **Deploy:**
   - Push to GitHub and Vercel will auto-deploy

## 🎯 Usage

### For Regular Users:
1. Register a new account
2. Create todos with titles, descriptions, and categories
3. Mark todos as complete/incomplete
4. Share todos with other users
5. View and manage shared todos
6. Toggle between dark/light mode

### For Admins:
1. Access admin dashboard at `/admin/dashboard`
2. View all users and their statistics
3. Manage and delete user accounts
4. View and manage all todos
5. Monitor system-wide statistics

## 🔑 Key Features Explained

### Theme System
- Automatic dark/light mode detection
- Manual theme toggle in navbar
- Persistent theme preference in localStorage
- Semantic color system with CSS custom properties

### Animated Borders
- Gradient animated borders on cards
- Pulse animations with custom durations
- Color-coded by status (completed/pending)
- Smooth transitions

### Todo Sharing
- Share with specific users
- Set view-only or edit permissions
- Shared todos displayed separately
- Permission checks on all operations

### Role-Based Access
- Middleware protection for admin routes
- API-level permission checks
- Separate admin and user interfaces
- Secure session management

## 📝 API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login

### Todos
- `GET /api/todo` - Get user's todos
- `POST /api/todo` - Create new todo
- `PATCH /api/todo/[id]` - Update todo
- `DELETE /api/todo/[id]` - Delete todo
- `POST /api/todo/[id]/share` - Share todo

### Admin
- `GET /api/users` - Get all users
- `DELETE /api/admin/users/[id]` - Delete user

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**ITZ-HURAIRAH18**
- GitHub: [@ITZ-HURAIRAH18](https://github.com/ITZ-HURAIRAH18)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Prisma team for the excellent ORM
- Vercel for hosting solutions
" 
