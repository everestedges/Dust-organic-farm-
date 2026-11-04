import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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

// Auto-migration: ensure orders columns accept standard e-commerce lifecycle statuses and products support full rich CMS data
async function initDatabaseTables() {
  try {
    await query("ALTER TABLE orders MODIFY COLUMN order_status VARCHAR(50) DEFAULT 'Pending'").catch(() => {});
    await query("ALTER TABLE orders MODIFY COLUMN payment_status VARCHAR(50) DEFAULT 'PAID'").catch(() => {});
    await query("ALTER TABLE orders MODIFY COLUMN payment_method VARCHAR(50) DEFAULT 'UPI'").catch(() => {});
    await query("ALTER TABLE products ADD COLUMN data_json LONGTEXT NULL").catch(() => {});
    await query("ALTER TABLE products MODIFY COLUMN category_id INT UNSIGNED NULL").catch(() => {});
    // Purge legacy test duplicate products with numeric slugs (2, 3, 4, 5) and deleted test SKU Hairoil
    await query("DELETE FROM products WHERE slug IN ('2', '3', '4', '5') OR name IN ('DUST Almond Powder (500g)', 'DUST Premium Cashew Powder (500g)', 'DUST Natural Powder Shampoo for Men (100ml)', 'Kacha Aam Instant Powder')").catch(() => {});
    await query("DELETE FROM products WHERE name = 'Hairoil' OR slug = 'hairoil' OR slug LIKE '%1793768267280%'").catch(() => {});
    
    // Seed standard official products into MySQL if they are not already in the table
    const defaultOfficialProducts = [
      {
        slug: "shahi-ragi-dry-fruit-laddoo-mix",
        name: "Shahi Ragi & Dry Fruit Laddoo Mix",
        sub_heading: "Wholesome Laddoo Premix | Premium Nuts | Traditional Taste",
        category_id: 1,
        price: 229.00,
        compare_price: 259.00,
        weight: "250g",
        servings: "₹229 / 250g Pack",
        stock_qty: 50,
        image_url: "/ragi_pouch.png",
        description: "Made with nutritious Ragi and a delicious blend of dry fruits, our Ragi & Dry Fruit Laddoo Mix is a convenient way to prepare tasty, wholesome laddoos at home.",
        ingredients: "Ragi, Date Powder, Almond, Cashew, Pumpkin Seed, Sunflower Seed, Watermelon Seed, Flax Seed, Cardamom.",
        data_json: JSON.stringify({
          id: "ragi-laddoo-01",
          slug: "shahi-ragi-dry-fruit-laddoo-mix",
          name: "Shahi Ragi & Dry Fruit Laddoo Mix",
          shortName: "Ragi Laddoo Mix",
          subtitle: "Wholesome Laddoo Premix | Premium Nuts | Traditional Taste",
          pitch: "Wholesome Laddoo Premix & Premium Nuts — Ready to Shape",
          category: "wholesome-millets",
          categoryLabel: "Wholesome Laddoo Premix",
          price: 229,
          originalPrice: 259,
          priceDisplay: "₹229",
          originalPriceDisplay: "₹259",
          unitDisplay: "₹229 / 250g Pack",
          netWeight: "250g",
          badges: ["Wholesome Laddoo Premix", "Premium Dry Fruits", "No Added Sugar"],
          description: [
            "Made with nutritious Ragi and a delicious blend of dry fruits, our Ragi & Dry Fruit Laddoo Mix is a convenient way to prepare tasty, wholesome laddoos at home.",
            "Perfect for breakfast, snacking, or whenever you crave something naturally delicious.",
            "Rooted in Indian tradition and packed with natural nutrition for a healthier tomorrow."
          ],
          ingredients: "Ragi, Date Powder, Almond, Cashew, Pumpkin Seed, Sunflower Seed, Watermelon Seed, Flax Seed, Cardamom.",
          allergen: "Contains: Ghee, Almonds, Cashews, Pistachios & Other Tree Nuts.",
          storage: "Store in a cool, dry place away from sunlight, heat & moisture. Shelf life: 6 months.",
          nutrition: {
            serving: "Per 100g",
            note: "Pack Net Wt: 250g",
            rows: [
              ["Energy", "423.63 kcal", "21%*"],
              ["Protein", "14.66g", "27%*"],
              ["Fat", "16.75g", "25%*"],
              ["Carbohydrate", "53.56g", "19%*"],
              ["Total Sugar", "40.76g", "—"],
              ["Added Sugar", "0g", "0%*"]
            ]
          },
          claims: [
            "Energy Snack — natural, sustained fuel throughout the day",
            "Supports Bone Health — calcium and mineral rich finger millet (ragi)",
            "Keeps You Fuller For Longer — nutrient-dense seeds and wholesome dry fruits",
            "No Added Sugar — naturally sweetened with pure date powder",
            "100% Wholesome Ingredients & Premium Nuts"
          ],
          ritualLabel: "Preparation Method",
          ritual: [
            { title: "Measure & Add Ghee", detail: "Add ghee as per your requirement of mix into a clean mixing bowl." },
            { title: "Knead Thoroughly", detail: "Mix and knead thoroughly until the warm ghee blends evenly with the roasted ragi and nut mix." },
            { title: "Shape into Laddoos & Enjoy", detail: "Shape the mixture by hand into round, wholesome laddoos. Enjoy fresh, healthy nutrition anytime." }
          ],
          heritageTitle: "Wholesome Laddoo premix Heritage",
          heritageQuote: "Natural nutrition for a healthier tomorrow. Made for those who choose better — crafted with pure finger millet (ragi), crunchy roasted nuts, and pure date powder.",
          images: [{ src: "/ragi_pouch.png", alt: "DUST Shahi Ragi & Dry Fruit Laddoo Mix" }],
          storyImage: "/ragi_pouch.png",
          accent: "amber",
          stock: 50,
          sku: "DUST-RAGI-250",
          fssai: "12545678901024",
          featured: true,
          newArrival: true,
          bestSeller: true
        })
      },
      {
        slug: "pure-almond-powder",
        name: "DUST™ Almond Powder",
        sub_heading: "Pure Almond Goodness. Everyday Nutrition.",
        category_id: 2,
        price: 749.00,
        compare_price: 899.00,
        weight: "500g",
        servings: "₹749 / 500g Pack",
        stock_qty: 60,
        image_url: "/almond_powder_pouch.png",
        description: "Bring the goodness of almonds into your everyday meals with DUST™ Almond Powder. Made from almonds with their natural skin, this finely ground powder offers a convenient way to enjoy the familiar taste and richness of almonds.",
        ingredients: "100% Pure Skin-On Almond Powder (Prunus dulcis).",
        data_json: JSON.stringify({
          id: "almond-powder-01",
          slug: "pure-almond-powder",
          name: "DUST™ Almond Powder",
          shortName: "Almond Powder",
          subtitle: "Pure Almond Goodness. Everyday Nutrition.",
          pitch: "Made from skin-on almonds for versatile everyday kitchen nutrition",
          category: "pure-nut-powders",
          categoryLabel: "Pure Almond Powder",
          price: 749,
          originalPrice: 899,
          priceDisplay: "₹749",
          originalPriceDisplay: "₹899",
          unitDisplay: "₹749 / 500g Pack",
          netWeight: "500g",
          badges: ["100% Pure Almonds", "Skin-On Goodness", "No Added Sugar"],
          description: [
            "Bring the goodness of almonds into your everyday meals with DUST™ Almond Powder. Made from almonds with their natural skin, this finely ground powder offers a convenient way to enjoy the familiar taste and richness of almonds.",
            "A versatile kitchen ingredient, it blends easily into milk, smoothies, breakfast bowls, desserts and homemade recipes."
          ],
          ingredients: "100% Pure Skin-On Almond Powder (Prunus dulcis).",
          allergen: "Contains Tree Nuts (Almonds).",
          storage: "Store in a cool, dry place, away from direct sunlight, heat and moisture.",
          nutrition: {
            serving: "Per 100g",
            note: "Pack Net Wt: 500g",
            rows: [
              ["Energy", "579 kcal", "29%*"],
              ["Protein", "21.15g", "38%*"],
              ["Fat", "49.93g", "74%*"],
              ["Carbohydrate", "21.55g", "7%*"],
              ["Dietary Fibre", "12.50g", "42%*"],
              ["Added Sugar", "0g", "0%*"]
            ]
          },
          claims: [
            "100% Pure Skin-On Almond Powder",
            "Naturally Contains Protein, Fibre & Vitamin E",
            "No Added Sugar & Zero Additives",
            "Ideal for Smoothies, Milk, Baking & Sweets"
          ],
          ritualLabel: "Ways to Use",
          ritual: [
            { title: "Almond Milk", detail: "Mix almond powder into warm milk or a plant-based milk alternative." },
            { title: "Smoothies & Shakes", detail: "Add one or two spoonfuls to banana shakes or breakfast smoothies." },
            { title: "Breakfast Bowls", detail: "Sprinkle over Greek yoghurt, oats or fresh fruit bowls." }
          ],
          heritageTitle: "Pure Almond Goodness — Choice of Motherland",
          heritageQuote: "A simple ingredient. Countless delicious possibilities. Finely ground skin-on almonds for daily family wellness.",
          images: [{ src: "/almond_powder_pouch.png", alt: "DUST Almond Powder" }],
          storyImage: "/almond_powder_pouch.png",
          accent: "amber",
          stock: 60,
          sku: "DUST-ALMOND-500",
          fssai: "In Process",
          featured: true,
          newArrival: true,
          bestSeller: false
        })
      },
      {
        slug: "premium-cashew-powder",
        name: "DUST™ Premium Cashew Powder",
        sub_heading: "Pure Cashew Goodness | Everyday Nutrition | Endless Possibilities",
        category_id: 2,
        price: 649.00,
        compare_price: 799.00,
        weight: "500g",
        servings: "₹649 / 500g Pack",
        stock_qty: 60,
        image_url: "/cashew_powder_pouch.png",
        description: "Bring the rich, creamy taste of cashews into your everyday recipes with DUST™ Premium Cashew Powder.",
        ingredients: "100% Pure Natural Cashew Nuts (Anacardium occidentale).",
        data_json: JSON.stringify({
          id: "cashew-powder-01",
          slug: "premium-cashew-powder",
          name: "DUST™ Premium Cashew Powder",
          shortName: "Cashew Powder",
          subtitle: "Pure Cashew Goodness | Everyday Nutrition | Endless Possibilities",
          pitch: "Pure Cashew Goodness. Everyday Nutrition. Endless Possibilities.",
          category: "pure-nut-powders",
          categoryLabel: "Pure Nut Powders",
          price: 649,
          originalPrice: 799,
          priceDisplay: "₹649",
          originalPriceDisplay: "₹799",
          unitDisplay: "₹649 / 500g Pack",
          netWeight: "500g",
          badges: ["100% Natural", "Premium Quality", "Plant Protein", "Clean Label"],
          description: [
            "Bring the rich, creamy taste of cashews into your everyday recipes with DUST™ Premium Cashew Powder.",
            "Made from finely ground premium cashews, this versatile ingredient adds natural nutty flavour, velvety texture and nutritional goodness."
          ],
          ingredients: "100% Pure Natural Cashew Nuts (Anacardium occidentale).",
          allergen: "Contains Tree Nuts (Cashew Nuts).",
          storage: "Store in a cool, dry place away from direct sunlight, heat and moisture.",
          nutrition: {
            serving: "Per 100g",
            note: "Pack Net Wt: 500g",
            rows: [
              ["Energy", "553 kcal", "28%*"],
              ["Protein", "18.2g", "33%*"],
              ["Total Fat", "43.9g", "65%*"],
              ["Carbohydrate", "30.2g", "10%*"],
              ["Dietary Fibre", "3.3g", "11%*"],
              ["Added Sugar", "0g", "0%*"]
            ]
          },
          claims: [
            "Natural Cashew Goodness & Creamy Texture",
            "Source of Plant Protein & Healthy Fats",
            "Naturally Provides Magnesium, Zinc & Iron",
            "Ideal for Smoothies, Gravies, Baking & Sweets"
          ],
          ritualLabel: "Ways to Use",
          ritual: [
            { title: "Smoothies & Shakes", detail: "Add 1–2 tablespoons to your favourite smoothie or milkshake for rich creaminess." },
            { title: "Curries & Gravies", detail: "Add to vegetable curries, paneer gravies and korma for thickness and richness." },
            { title: "Sweets & Desserts", detail: "Use in kheer, halwa, barfi, and homemade sweets." }
          ],
          heritageTitle: "Pure Cashew Goodness — Choice of Motherland",
          heritageQuote: "A versatile kitchen essential. Enjoy the convenience of finely ground premium cashews without grinding them yourself.",
          images: [{ src: "/cashew_powder_pouch.png", alt: "DUST Premium Cashew Powder" }],
          storyImage: "/cashew_powder_pouch.png",
          accent: "amber",
          stock: 60,
          sku: "DUST-CASHEW-500",
          fssai: "In Process",
          featured: true,
          newArrival: true,
          bestSeller: false
        })
      },
      {
        slug: "natural-powder-shampoo-men",
        name: "DUST™ Natural Powder Shampoo for Men",
        sub_heading: "Designed for Men | 5 Traditional Herbs | No-Foam Herbal Mask",
        category_id: 3,
        price: 246.00,
        compare_price: 299.00,
        weight: "100ml",
        servings: "₹246 / 100ml Bottle",
        stock_qty: 75,
        image_url: "/shampoo_bottle.png",
        description: "Meet a different approach to hair care with DUST™ Natural Powder Shampoo – a traditional herbal powder blend made with Amla, Ritha, Shikakai, Hibiscus and Bhringraj.",
        ingredients: "100% Natural Herbal Powder Blend: Amla Powder, Reetha Powder, Shikakai Powder, Hibiscus Powder, Bhringraj Powder.",
        data_json: JSON.stringify({
          id: "powder-shampoo-01",
          slug: "natural-powder-shampoo-men",
          name: "DUST™ Natural Powder Shampoo for Men",
          shortName: "Natural Powder Shampoo",
          subtitle: "Designed for Men | 5 Traditional Herbs | No-Foam Herbal Mask",
          pitch: "Designed for Men. Inspired by Nature. Powered by 5 Traditional Herbs.",
          category: "herbal-haircare",
          categoryLabel: "Herbal Hair Care",
          price: 246,
          originalPrice: 299,
          priceDisplay: "₹246",
          originalPriceDisplay: "₹299",
          unitDisplay: "₹246 / 100ml Bottle",
          netWeight: "100ml",
          badges: ["Designed for Men", "5 Traditional Herbs", "Zero Foam • Zero Sulfates", "Clean Label"],
          description: [
            "Meet a different approach to hair care with DUST™ Natural Powder Shampoo – a traditional herbal powder blend made with Amla, Ritha, Shikakai, Hibiscus and Bhringraj.",
            "No complicated routines. Just the goodness of traditional herbs in a convenient powder-to-paste hair mask."
          ],
          ingredients: "100% Natural Herbal Powder Blend: Amla Powder, Reetha Powder, Shikakai Powder, Hibiscus Powder, Bhringraj Powder.",
          allergen: "100 plant-based & herbal. Free from Sulfates, Parabens, Silicones & Chemical Preservatives.",
          storage: "Store in a cool, dry place away from direct sunlight. Close cap tightly after every use.",
          nutrition: {
            serving: "Per 100ml",
            note: "100% Herbal Actives",
            rows: [
              ["Amla (Indian Gooseberry)", "Rich in Natural Vitamin C & Antioxidants", "Active Botanical"],
              ["Ritha (Soapnut)", "Natural Saponins for Gentle Cleansing", "Active Botanical"],
              ["Shikakai (Fruit for Hair)", "Low pH Scalp Clarifier & Cleanser", "Active Botanical"],
              ["Hibiscus (Gudhal)", "Conditioning Mucilage & Amino Acids", "Active Botanical"],
              ["Bhringraj (False Daisy)", "Root Strengthener & Scalp Tonic", "Active Botanical"]
            ]
          },
          claims: [
            "5 Traditional Ayurvedic Herbs",
            "Specially Designed for Men's Hair",
            "No-Foam Herbal Hair Mask Experience",
            "Zero Sulfates, Parabens & Artificial Fragrance"
          ],
          ritualLabel: "How to Use — Herbal Hair Mask",
          ritual: [
            { title: "Measure Required Amount", detail: "Take 1–2 tablespoons of powder into a clean bowl." },
            { title: "Mix with Water into Paste", detail: "Add plain or warm water and mix to create a smooth herbal paste." },
            { title: "Apply & Rinse", detail: "Apply on damp hair & scalp, leave for 5–10 minutes, then rinse thoroughly." }
          ],
          heritageTitle: "Herbal Hair Wisdom",
          heritageQuote: "Traditional botanical care formulated specifically for men's everyday scalp health.",
          images: [{ src: "/shampoo_bottle.png", alt: "DUST Natural Powder Shampoo for Men" }],
          storyImage: "/shampoo_bottle.png",
          accent: "amber",
          stock: 75,
          sku: "DUST-SHAMPOO-100",
          fssai: "In Process",
          featured: true,
          newArrival: true,
          bestSeller: false
        })
      }
    ];

    for (const prod of defaultOfficialProducts) {
      const existing = await query("SELECT id FROM products WHERE slug = ? OR name = ?", [prod.slug, prod.name]);
      if (existing.length === 0) {
        await query(
          `INSERT INTO products (slug, name, sub_heading, category_id, price, compare_price, weight, servings, stock_qty, image_url, description, ingredients, is_best_seller, is_featured, data_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)`,
          [
            prod.slug,
            prod.name,
            prod.sub_heading,
            prod.category_id,
            prod.price,
            prod.compare_price,
            prod.weight,
            prod.servings,
            prod.stock_qty,
            prod.image_url,
            prod.description,
            prod.ingredients,
            prod.data_json
          ]
        );
        console.log(`✨ [DB SEED] Inserted official product into MySQL: ${prod.name}`);
      }
    }
    console.log("✅ [DB INIT] database tables, columns and official products verified");
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
      LEFT JOIN orders o ON LOWER(TRIM(o.customer_email)) = LOWER(TRIM(u.email))
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
      sql += " WHERE LOWER(TRIM(o.customer_email)) = LOWER(TRIM(?)) ";
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

// ---------------------------------------------------------------------
// 4. PRODUCTS CMS ENDPOINTS (Create, Read, Update, Delete Products)
// ---------------------------------------------------------------------

// GET /api/products - Fetch all products
app.get("/api/products", async (req, res) => {
  try {
    const rows = await query(
      "SELECT * FROM products WHERE slug NOT IN ('2', '3', '4', '5') AND name NOT IN ('DUST Almond Powder (500g)', 'DUST Premium Cashew Powder (500g)', 'DUST Natural Powder Shampoo for Men (100ml)', 'Kacha Aam Instant Powder') ORDER BY id DESC"
    );
    const products = rows.map((r) => {
      let richData = {};
      if (r.data_json) {
        try {
          richData = JSON.parse(r.data_json);
        } catch (e) {}
      }

      const effectiveSubtitle = r.sub_heading || richData.subtitle || richData.pitch || "";
      // Return clean unified Product object matching frontend interface
      return {
        id: richData.id || String(r.id),
        slug: r.slug,
        name: r.name,
        shortName: richData.shortName || r.name,
        subtitle: effectiveSubtitle,
        pitch: effectiveSubtitle,
        category: richData.category || "heritage-wellness",
        categoryLabel: richData.categoryLabel || "Heritage Wellness",
        price: Number(r.price) || 0,
        originalPrice: r.compare_price ? Number(r.compare_price) : undefined,
        priceDisplay: `₹${Number(r.price) || 0}`,
        originalPriceDisplay: r.compare_price ? `₹${Number(r.compare_price)}` : undefined,
        unitDisplay: richData.unitDisplay || r.servings || "",
        netWeight: r.weight || richData.netWeight || "200g",
        badges: richData.badges || ["100% NATURAL"],
        description: Array.isArray(richData.description)
          ? richData.description
          : [r.description || "Handcrafted pure formulation."],
        caution: richData.caution,
        ingredients: r.ingredients || richData.ingredients || "100% Pure Natural Ingredients",
        allergen: richData.allergen,
        storage: richData.storage || "Store in a cool, dry place away from direct sunlight.",
        disclaimer: richData.disclaimer,
        preparation: richData.preparation,
        nutrition: richData.nutrition || {
          serving: r.weight || "100g",
          note: "100% Natural Formulation",
          rows: [
            ["Energy", "380 kcal", "19%"],
            ["Protein", "12g", "24%"],
            ["Carbohydrates", "68g", "22%"],
            ["Dietary Fiber", "8g", "28%"],
            ["Total Fat", "4g", "6%"],
          ],
        },
        claims: richData.claims || ["100% Pure & Natural", "Zero Synthetic Chemicals", "Heritage Formulation"],
        ritual: richData.ritual || [
          { title: "Measure", detail: "Take 1-2 teaspoons or 1 sachet." },
          { title: "Blend or Mix", detail: "Mix smoothly with water, milk, or recipe." },
          { title: "Experience Wellness", detail: "Consume fresh to enjoy active natural nutrition." },
        ],
        ritualLabel: richData.ritualLabel || "Preparation & Usage Ritual",
        heritageTitle: richData.heritageTitle || "Pure Motherland Heritage",
        heritageQuote: richData.heritageQuote || "Crafted with reverence for authentic Indian ingredients.",
        images: richData.images && richData.images.length > 0
          ? richData.images
          : [{ src: r.image_url || "/logo.png", alt: r.name }],
        storyImage: richData.storyImage || r.image_url || "/logo.png",
        posterImage: richData.posterImage,
        infographicImage: richData.infographicImage,
        accent: richData.accent || "rose",
        stock: Number(r.stock_qty) || 100,
        sku: richData.sku || `SKU-${r.slug}`,
        fssai: richData.fssai || "FSSAI Lic. No. 11522036000722",
        featured: Boolean(r.is_featured),
        newArrival: true,
        bestSeller: Boolean(r.is_best_seller),
      };
    });

    return res.json({ success: true, count: products.length, products });
  } catch (err) {
    console.error("❌ Fetch Products Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products - Create a new product SKU with complete details
app.post("/api/products", async (req, res) => {
  const p = req.body;
  if (!p.name || !p.price) {
    return res.status(400).json({ success: false, message: "Product name and price are required." });
  }

  const slug = (p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) || `prod-${Date.now()}`;
  const subHeading = p.subtitle || p.pitch || "";
  const categoryId = 1; // Default category
  const price = Number(p.price) || 0;
  const comparePrice = p.originalPrice ? Number(p.originalPrice) : null;
  const weight = p.netWeight || "200g";
  const servings = p.unitDisplay || "Multi-serve";
  const stock = Number(p.stock) || 100;
  const imageUrl = p.images && p.images[0] ? p.images[0].src : (p.storyImage || "/logo.png");
  const descriptionText = Array.isArray(p.description) ? p.description.join("\n\n") : (p.description || "");
  const ingredientsText = p.ingredients || "";
  const isBestSeller = p.bestSeller ? 1 : 0;
  const isFeatured = p.featured ? 1 : 1;

  const dataJson = JSON.stringify({
    ...p,
    slug,
    price,
    originalPrice: comparePrice,
    stock,
  });

  try {
    const result = await query(
      `INSERT INTO products (slug, name, sub_heading, category_id, price, compare_price, weight, servings, stock_qty, image_url, description, ingredients, is_best_seller, is_featured, data_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         sub_heading = VALUES(sub_heading),
         price = VALUES(price),
         compare_price = VALUES(compare_price),
         weight = VALUES(weight),
         servings = VALUES(servings),
         stock_qty = VALUES(stock_qty),
         image_url = VALUES(image_url),
         description = VALUES(description),
         ingredients = VALUES(ingredients),
         data_json = VALUES(data_json)`,
      [
        slug,
        p.name,
        subHeading,
        categoryId,
        price,
        comparePrice,
        weight,
        servings,
        stock,
        imageUrl,
        descriptionText,
        ingredientsText,
        isBestSeller,
        isFeatured,
        dataJson,
      ]
    );

    console.log(`✅ [MySQL] Saved Product: ${p.name} (/product/${slug})`);
    return res.json({
      success: true,
      message: "Product created successfully",
      productId: result.insertId,
      slug,
    });
  } catch (err) {
    console.error("❌ Save Product Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id - Update product (price, stock, or full product details)
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const p = req.body;
  try {
    const isNumId = !isNaN(Number(id)) && Number(id) > 0;
    const targetSlug = p.slug || id;
    const targetName = p.name || "";

    // 1. First find which product row exists in MySQL:
    let rows = [];
    if (isNumId) {
      rows = await query("SELECT id FROM products WHERE id = ? OR slug = ? LIMIT 1", [Number(id), targetSlug]);
    } else {
      rows = await query(
        "SELECT id FROM products WHERE slug = ? OR slug = ? OR name = ? OR data_json LIKE ? LIMIT 1",
        [id, targetSlug, targetName, `%"id":"${id}"%`]
      );
    }

    if (rows.length === 0 && targetName) {
      rows = await query("SELECT id FROM products WHERE name = ? LIMIT 1", [targetName]);
    }

    const rowId = rows.length > 0 ? rows[0].id : (isNumId ? Number(id) : null);

    // If full product payload is provided
    if (p.name || p.slug || (p.price !== undefined && p.subtitle !== undefined)) {
      const name = p.name || "Product";
      const price = p.price !== undefined ? Number(p.price) : 0;
      const comparePrice = p.originalPrice ? Number(p.originalPrice) : null;
      const subHeading = p.subtitle || p.pitch || "";
      const weight = p.netWeight || "200g";
      const servings = p.unitDisplay || "";
      const stock = p.stock !== undefined ? Number(p.stock) : 100;
      const imageUrl = p.images && p.images[0] ? p.images[0].src : (p.storyImage || "/logo.png");
      const descriptionText = Array.isArray(p.description) ? p.description.join("\n\n") : (p.description || "");
      const ingredientsText = p.ingredients || "";
      const dataJson = JSON.stringify({
        ...p,
        id: p.id || String(rowId || id),
        slug: targetSlug,
        subtitle: subHeading,
        pitch: subHeading,
        price,
        originalPrice: comparePrice,
        stock,
      });

      if (rowId) {
        await query(
          `UPDATE products 
           SET name = ?,
               slug = ?,
               price = ?,
               compare_price = ?,
               sub_heading = ?,
               weight = ?,
               servings = ?,
               stock_qty = ?,
               image_url = ?,
               description = ?,
               ingredients = ?,
               data_json = ?
           WHERE id = ?`,
          [
            name,
            targetSlug,
            price,
            comparePrice,
            subHeading,
            weight,
            servings,
            stock,
            imageUrl,
            descriptionText,
            ingredientsText,
            dataJson,
            rowId,
          ]
        );
        console.log(`✏️ [MySQL] Updated product id=${rowId} (${name})`);
      } else {
        // Product didn't exist in DB yet, insert it!
        await query(
          `INSERT INTO products (slug, name, sub_heading, category_id, price, compare_price, weight, servings, stock_qty, image_url, description, ingredients, is_best_seller, is_featured, data_json)
           VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)`,
          [
            targetSlug,
            name,
            subHeading,
            price,
            comparePrice,
            weight,
            servings,
            stock,
            imageUrl,
            descriptionText,
            ingredientsText,
            dataJson,
          ]
        );
        console.log(`✨ [MySQL] Inserted edited product: ${name}`);
      }
    } else {
      // Partial updates (price or stock only)
      if (rowId) {
        if (p.price !== undefined) {
          await query("UPDATE products SET price = ? WHERE id = ?", [Number(p.price), rowId]);
        }
        if (p.stock !== undefined) {
          await query("UPDATE products SET stock_qty = ? WHERE id = ?", [Number(p.stock), rowId]);
        }
        if (p.data) {
          await query("UPDATE products SET data_json = ? WHERE id = ?", [JSON.stringify(p.data), rowId]);
        }
      }
    }

    return res.json({ success: true, message: `Product updated successfully` });
  } catch (err) {
    console.error("❌ Product update error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id - Delete product (by ID, slug, name or data_json)
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const slug = req.query.slug || id;
  const name = req.query.name || id;
  try {
    const result = await query(
      `DELETE FROM products 
       WHERE id = ? 
          OR slug = ? 
          OR slug = ? 
          OR name = ? 
          OR data_json LIKE ?`,
      [id, id, slug, name, `%"id":"${id}"%`]
    );
    console.log(`🗑️ [MySQL] Deleted product: id=${id}, slug=${slug}, name=${name} (affectedRows: ${result.affectedRows})`);
    return res.json({ success: true, message: `Product deleted successfully`, affectedRows: result.affectedRows });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload-image - Upload device image (base64) and save to /uploads
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.post("/api/upload-image", async (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: "No image data provided" });
    }

    const matches = image.match(/^data:([A-Za-z0-9\-+\/.]+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let buffer;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(image, "base64");
    }

    let ext = "jpg";
    if (mimeType.includes("png")) ext = "png";
    else if (mimeType.includes("webp")) ext = "webp";
    else if (mimeType.includes("gif")) ext = "gif";
    else if (mimeType.includes("svg")) ext = "svg";

    let safeBase = "product";
    if (filename) {
      safeBase = filename.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    }

    const uniqueName = `${safeBase}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await fs.promises.writeFile(filePath, buffer);
    console.log(`📸 [Upload] Saved device image: /uploads/${uniqueName} (${(buffer.length / 1024).toFixed(1)} KB)`);

    return res.json({
      success: true,
      url: `/uploads/${uniqueName}`,
      filename: uniqueName,
      size: buffer.length,
    });
  } catch (err) {
    console.error("❌ Image upload error:", err);
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
const publicPath = path.join(__dirname, "../public");

app.use("/uploads", express.static(uploadsDir));
app.use(express.static(publicPath));
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
