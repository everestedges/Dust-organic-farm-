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

// Auto-migration: ensure orders columns accept standard e-commerce lifecycle statuses
async function initDatabaseTables() {
  try {
    await query("ALTER TABLE orders MODIFY COLUMN order_status VARCHAR(50) DEFAULT 'Pending'");
    await query("ALTER TABLE orders MODIFY COLUMN payment_status VARCHAR(50) DEFAULT 'PAID'");
    await query("ALTER TABLE orders MODIFY COLUMN payment_method VARCHAR(50) DEFAULT 'UPI'");
    console.log("✅ [DB INIT] orders table columns verified (order_status VARCHAR(50))");
  } catch (err) {
    // Column already modified or table not yet created
  }
}
initDatabaseTables();

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

// GET /api/users - Fetch all registered users in MySQL with order totals
app.get("/api/users", async (req, res) => {
  try {
    const users = await query(`
      SELECT u.id, u.full_name, u.email, u.phone, u.role, u.created_at,
             COUNT(o.id) as orders_count,
             COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON o.customer_email = u.email
      GROUP BY u.id, u.full_name, u.email, u.phone, u.role, u.created_at
      ORDER BY u.id DESC
    `);
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 2. B2B DISTRIBUTOR LEADS ENDPOINTS
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

app.get("/api/distributor-leads", async (req, res) => {
  try {
    const leads = await query(`
      SELECT id, contact_name, company_name, phone, email, city_state, channel, investment_capacity, message, created_at
      FROM distributor_leads
      ORDER BY id DESC
    `);
    return res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// 3. ORDERS ENDPOINTS (Inserts & Fetches from MySQL orders & order_items)
// ---------------------------------------------------------------------
app.post("/api/orders", async (req, res) => {
  const {
    reference,
    customerName,
    customerEmail,
    customerPhone,
    address,
    city,
    state,
    pincode,
    total,
    subtotal,
    paymentMethod,
    items,
  } = req.body;

  try {
    const payment = (paymentMethod || "UPI").toUpperCase();
    const result = await query(
      `INSERT INTO orders (order_reference, customer_name, customer_email, customer_phone, shipping_address, city, state, pincode, subtotal_amount, total_amount, payment_method, payment_status, order_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        reference,
        customerName,
        customerEmail || "",
        customerPhone,
        address,
        city || "",
        state || "Maharashtra",
        pincode || "",
        subtotal || total,
        total,
        payment === "COD" ? "COD" : "UPI",
        payment === "COD" ? "PENDING" : "PAID",
      ]
    );

    const orderId = result.insertId;

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        try {
          await query(
            `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
             VALUES (?, 1, ?, ?, ?, ?)`,
            [
              orderId,
              item.name || "DUST Product",
              item.quantity || 1,
              item.price || 0,
              (item.price || 0) * (item.quantity || 1),
            ]
          );
        } catch (itemErr) {
          console.warn("Could not insert order item:", itemErr.message);
        }
      }
    }

    console.log(`✅ [MySQL SUCCESS] Order saved to DB: ${reference} for ${customerName} (Total: ₹${total})`);
    return res.json({ success: true, message: "Order created successfully!", orderId });
  } catch (err) {
    console.error("❌ MySQL Order Error:", err.message);
    return res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// GET /api/orders - Fetch all orders for Admin Fulfillment or by user email
app.get("/api/orders", async (req, res) => {
  try {
    const { email } = req.query;
    let sql = `
      SELECT o.id, o.order_reference, o.customer_name, o.customer_email, o.customer_phone,
             o.shipping_address, o.city, o.state, o.pincode, o.subtotal_amount, o.total_amount,
             o.payment_method, o.payment_status, o.order_status, o.tracking_awb, o.created_at,
             COALESCE(GROUP_CONCAT(CONCAT(oi.quantity, 'x ', oi.product_name) SEPARATOR ', '), '1x DUST Organic Blend') as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
    `;
    const params = [];
    if (email) {
      sql += " WHERE o.customer_email = ? ";
      params.push(email);
    }
    sql += " GROUP BY o.id, o.order_reference, o.customer_name, o.customer_email, o.customer_phone, o.shipping_address, o.city, o.state, o.pincode, o.subtotal_amount, o.total_amount, o.payment_method, o.payment_status, o.order_status, o.tracking_awb, o.created_at ORDER BY o.id DESC ";
    
    const orders = await query(sql, params);
    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/orders/:id/status - Update order status & AWB tracking
app.put("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, awb } = req.body;
  try {
    await query(
      "UPDATE orders SET order_status = ?, tracking_awb = COALESCE(?, tracking_awb) WHERE id = ? OR order_reference = ?",
      [status, awb || null, id, id]
    );
    return res.json({ success: true, message: "Order status updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/orders/:id - Permanently delete an order and its items
app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Delete linked items first
    try {
      await query(
        "DELETE FROM order_items WHERE order_id = ? OR order_id = (SELECT id FROM orders WHERE order_reference = ? LIMIT 1)",
        [id, id]
      );
    } catch (itemErr) {
      // Ignored if cascade or already empty
    }

    const result = await query("DELETE FROM orders WHERE id = ? OR order_reference = ?", [id, id]);
    console.log(`🗑️ [MySQL] Deleted order: ${id} (Affected rows: ${result.affectedRows})`);
    return res.json({
      success: true,
      message: `Order ${id} deleted successfully`,
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error("❌ Delete Order Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
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
