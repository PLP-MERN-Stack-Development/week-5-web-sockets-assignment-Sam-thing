import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();

// ✅ Validate required env vars
const requiredEnvVars = ['ANTHROPIC_API_KEY', 'MONGODB_URI', 'PORT'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// ✅ Initialize Express
const app = express();
const __dirname = path.resolve(); 

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
  // ✅ Your actual deployment URLs
  'https://week-5-web-sockets-assignment-sam-thing-2.onrender.com',
  'https://week-5-web-sockets-assignment-sam-thing-qk6dbd2gv.vercel.app',
  'https://week-5-web-sockets-assignment-sam-t.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 CORS Request from origin:', origin);
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check exact matches first
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Exact match found for origin:', origin);
      return callback(null, true);
    }
    
    // ✅ Regex patterns for your week-5-web-sockets project
    const vercelWeekAssignmentRegex = /^https:\/\/week-5-web-sockets-assignment-sam-[\w-]*\.vercel\.app$/;
    
    if (vercelWeekAssignmentRegex.test(origin)) {
      console.log('✅ Vercel week assignment deployment matched:', origin);
      return callback(null, true);
    }

    // ✅ General fallback pattern for any week-5-web-sockets deployment
    const vercelWeekGeneralRegex = /^https:\/\/week-5-web-sockets-assignment.*\.vercel\.app$/;
    
    if (vercelWeekGeneralRegex.test(origin)) {
      console.log('✅ General Vercel week assignment deployment matched:', origin);
      return callback(null, true);
    }

    console.log('❌ Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },  
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// ✅ Add favicon route to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).send(); // No content
});

// ✅ Static file serving (for uploaded audio)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/feedback", feedbackRoutes);

// ✅ Health Check Routes
app.get("/health", (req, res) => res.send("Server alive ⚡"));
app.get("/api/test", (req, res) => res.json({ message: "Week 5 Web Sockets API is working" }));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ Mongo Error:", err));

// ✅ Debug Anthropic Key
console.log('ANTHROPIC_API_KEY loaded:', process.env.ANTHROPIC_API_KEY ? 'YES' : 'NO');
console.log('API key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 10));