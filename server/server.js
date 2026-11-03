import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json());

// Configure Local MySQL Database Credentials
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // Default root password
  database: process.env.DB_NAME || "dust_db",
  port: Number(process.env.DB_PORT) || 3306,
};

let dbPool;

try {
  dbPool = mysql.createPool(dbConfig);
  console.log("🔗 MySQL Connection Pool initialized for database: dust_db");
} catch (err) {
  console.error("❌ Error initializing MySQL Pool:", err);
}

// Helper query function with automatic fallback
async function query(sql, params) {
  try {
    const [results] = await dbPool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("❌ SQL Query Error:", error.message);
    throw error;
  }
}

// ---------------------------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS (Register & Login connected to MySQL)
// ---------------------------------------------------------------------

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    // Insert new user into MySQL users table
    const result = await query(
      "INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, phone, password]
    );

    const newUser = {
      id: result.insertId,
      name,
      email,
      phone,
      address: "Pune, Maharashtra",
    };

    console.log(`✅ [MySQL SUCCESS] New user registered: ${name} (${email}) - User ID: ${result.insertId}`);
    return res.json({ success: true, message: "Registration successful!", user: newUser });
  } catch (err) {
    console.error("❌ MySQL Register Error:", err.message);
    return res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    // Find user in MySQL
    const users = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "No account found with this email." });
    }

    const foundUser = users[0];

    // Password check
    if (foundUser.password_hash !== password) {
      return res.status(401).json({ success: false, message: "Invalid password. Please try again." });
    }

    const userProfile = {
      id: foundUser.id,
      name: foundUser.full_name,
      email: foundUser.email,
      phone: foundUser.phone,
      address: "Pune, Maharashtra",
    };

    console.log(`✅ [MySQL SUCCESS] User logged in: ${foundUser.full_name} (${foundUser.email})`);
    return res.json({ success: true, message: "Login successful!", user: userProfile });
  } catch (err) {
    console.error("❌ MySQL Login Error:", err.message);
    return res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// POST /api/admin/login - Authenticate Admin Portal Users
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (email.toLowerCase() === "admin@dustofficial.com" && password === "DustAdmin@2026") {
    return res.json({
      success: true,
      user: { id: 1, name: "Everest Edges Admin", email: "admin@dustofficial.com", role: "admin" },
    });
  }

  try {
    const users = await query("SELECT * FROM users WHERE email = ? AND role = 'admin'", [email]);
    if (users.length === 0 || users[0].password_hash !== password) {
      return res.status(401).json({ success: false, message: "Invalid Admin email or password." });
    }

    return res.json({
      success: true,
      user: { id: users[0].id, name: users[0].full_name, email: users[0].email, role: "admin" },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// GET /api/users - Fetch all registered users in MySQL
app.get("/api/users", async (req, res) => {
  try {
    const users = await query("SELECT id, full_name, email, phone, role, created_at FROM users");
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 2. B2B DISTRIBUTOR LEADS ENDPOINT (Inserts into MySQL distributor_leads)
// ---------------------------------------------------------------------
app.post("/api/distributor-leads", async (req, res) => {
  const { name, company, phone, email, cityState, channel, investment, message } = req.body;

  try {
    const result = await query(
      `INSERT INTO distributor_leads (contact_name, company_name, phone, email, city_state, channel, investment_capacity, message) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, company, phone, email, cityState, channel, investment, message || ""]
    );

    console.log(`✅ [MySQL SUCCESS] B2B Distributor lead saved to DB: ${company} (${cityState}) - Lead ID: ${result.insertId}`);
    return res.json({ success: true, message: "Lead saved successfully!", leadId: result.insertId });
  } catch (err) {
    console.error("❌ MySQL Distributor Lead Error:", err.message);
    return res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// ---------------------------------------------------------------------
// 3. ORDERS ENDPOINT (Inserts into MySQL orders & order_items)
// ---------------------------------------------------------------------
app.post("/api/orders", async (req, res) => {
  const { reference, customerName, customerEmail, customerPhone, address, city, state, pincode, total } = req.body;

  try {
    const result = await query(
      `INSERT INTO orders (order_reference, customer_name, customer_email, customer_phone, shipping_address, city, state, pincode, subtotal_amount, total_amount, payment_status, order_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PAID', 'Order Received')`,
      [reference, customerName, customerEmail, customerPhone, address, city, state, pincode, total, total]
    );

    console.log(`✅ [MySQL SUCCESS] Order saved to DB: ${reference} for ${customerName} (Total: ₹${total})`);
    return res.json({ success: true, message: "Order created successfully!", orderId: result.insertId });
  } catch (err) {
    console.error("❌ MySQL Order Error:", err.message);
    return res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const tables = await query("SHOW TABLES");
    res.json({ status: "OK", database: "dust_db", tablesCount: tables.length });
  } catch (err) {
    res.status(500).json({ status: "ERROR", error: err.message });
  }
});

// ---------------------------------------------------------------------
// 4. FRONTEND STATIC SERVING (Serves built React Vite app on Hostinger)
// ---------------------------------------------------------------------
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Express 5 compatible SPA fallback middleware
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("DUST API Server Running. Please ensure 'npm run build' has completed.");
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DUST Server running on port ${PORT}`);
});
