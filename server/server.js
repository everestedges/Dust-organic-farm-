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
    await query(`
      CREATE TABLE IF NOT EXISTS distributor_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        city_state VARCHAR(255) NOT NULL,
        channel VARCHAR(100) DEFAULT 'Regional Distributor',
        investment_capacity VARCHAR(100) DEFAULT '₹20,000 – ₹50,000',
        message TEXT NULL,
        status VARCHAR(50) DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).catch(() => {});
    await query(`
      CREATE TABLE IF NOT EXISTS upcoming_banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NULL,
        tagline VARCHAR(100) DEFAULT 'COMING SOON',
        launch_date VARCHAR(100) DEFAULT 'Launching Soon',
        image_url TEXT NOT NULL,
        description TEXT NULL,
        cta_text VARCHAR(100) DEFAULT 'Pre-Order Inquiry',
        cta_link VARCHAR(255) DEFAULT '/combos',
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).catch(() => {});

    // Site settings table (for editable ticker bar, store announcements, etc.)
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `).catch(() => {});

    // Customer Reviews & Video Testimonials table
    await query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(100) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        product_slug VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        rating INT DEFAULT 5,
        title VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        media_type VARCHAR(50) DEFAULT 'text',
        video_url TEXT NULL,
        video_poster TEXT NULL,
        video_duration VARCHAR(50) NULL,
        verified_buyer BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT TRUE,
        is_approved BOOLEAN DEFAULT TRUE,
        is_read BOOLEAN DEFAULT FALSE,
        helpful_count INT DEFAULT 0,
        date_str VARCHAR(100) DEFAULT 'Just now',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).catch(() => {});
    await query("ALTER TABLE testimonials ADD COLUMN is_read BOOLEAN DEFAULT FALSE").catch(() => {});

    // Coupons & Promotional Offers table
    await query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        discount_type VARCHAR(20) DEFAULT 'percentage',
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2) DEFAULT 0,
        max_discount_amount DECIMAL(10,2) NULL,
        expiry_date VARCHAR(50) NOT NULL,
        description VARCHAR(255) NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).catch(() => {});

    // Seed default active coupons if empty
    const existingCoupons = await query("SELECT COUNT(*) as count FROM coupons").catch(() => [{ count: 0 }]);
    if (!existingCoupons || existingCoupons[0]?.count === 0) {
      await query(`
        INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, expiry_date, description, is_active)
        VALUES 
          ('PANINDIA15', 'percentage', 15.00, 500.00, '2026-12-31', '15% OFF on orders above ₹500', 1),
          ('WELCOME10', 'percentage', 10.00, 299.00, '2026-12-31', '10% OFF on your first purchase above ₹299', 1),
          ('DUST50', 'fixed', 50.00, 499.00, '2026-12-31', 'Flat ₹50 OFF on orders above ₹499', 1)
      `).catch(() => {});
    }

    // Seed Dragon Berry Blast upcoming banner if table is empty
    const existingUpcoming = await query("SELECT COUNT(*) AS cnt FROM upcoming_banners").catch(() => [{ cnt: 0 }]);
    if (existingUpcoming && existingUpcoming[0] && existingUpcoming[0].cnt === 0) {
      await query(`
        INSERT INTO upcoming_banners (title, subtitle, tagline, launch_date, image_url, description, cta_text, cta_link, display_order, is_active)
        VALUES (
          'Dragon Berry Blast Fruit Drink Powder',
          'Real Fruit Goodness • Instant Refreshment • Energizing & Reviving',
          'COMING SOON',
          'Expected Launch: Q1 2027',
          '/banners/dragon-berry-blast-upcoming.jpg',
          'Pure dried dragon fruit, strawberries & blueberries. Just add water and shake.',
          'Stay Tuned',
          '/contact',
          1,
          1
        )
      `).catch(() => {});
    }

    await query("ALTER TABLE orders MODIFY COLUMN order_status VARCHAR(50) DEFAULT 'Pending'").catch(() => {});
    await query("ALTER TABLE orders MODIFY COLUMN payment_status VARCHAR(50) DEFAULT 'PAID'").catch(() => {});
    await query("ALTER TABLE orders MODIFY COLUMN payment_method VARCHAR(50) DEFAULT 'UPI'").catch(() => {});
    await query("ALTER TABLE orders ADD COLUMN velocity_order_id VARCHAR(100) NULL").catch(() => {});
    await query("ALTER TABLE orders ADD COLUMN velocity_shipment_id VARCHAR(100) NULL").catch(() => {});
    await query("ALTER TABLE orders ADD COLUMN velocity_awb VARCHAR(100) NULL").catch(() => {});
    await query("ALTER TABLE orders ADD COLUMN velocity_label_url TEXT NULL").catch(() => {});
    await query("ALTER TABLE orders ADD COLUMN courier_name VARCHAR(100) NULL").catch(() => {});
    await query("ALTER TABLE orders ADD COLUMN velocity_status VARCHAR(100) NULL").catch(() => {});
    await query("ALTER TABLE products ADD COLUMN data_json LONGTEXT NULL").catch(() => {});
    await query("ALTER TABLE products MODIFY COLUMN category_id INT UNSIGNED NULL").catch(() => {});
    // Purge legacy test duplicate products with numeric slugs (2, 3, 4, 5) and deleted test SKU Hairoil
    await query("DELETE FROM products WHERE slug IN ('2', '3', '4', '5') OR name IN ('DUST Almond Powder (500g)', 'DUST Premium Cashew Powder (500g)', 'DUST Natural Powder Shampoo for Men (100ml)', 'Kacha Aam Instant Powder')").catch(() => {});
    await query("DELETE FROM products WHERE name = 'Hairoil' OR slug = 'hairoil' OR slug LIKE '%1793768267280%'").catch(() => {});

    // Auto-repair any products whose price accidentally became 0
    await query("UPDATE products SET price = 299, compare_price = 350 WHERE price <= 0 AND (slug LIKE '%paan%' OR name LIKE '%Paan%')").catch(() => {});
    await query("UPDATE products SET price = 229, compare_price = 259 WHERE price <= 0 AND (slug LIKE '%ragi%' OR name LIKE '%Ragi%')").catch(() => {});
    await query("UPDATE products SET price = 749, compare_price = 849 WHERE price <= 0 AND (slug LIKE '%almond%' OR name LIKE '%Almond%')").catch(() => {});
    await query("UPDATE products SET price = 649, compare_price = 749 WHERE price <= 0 AND (slug LIKE '%cashew%' OR name LIKE '%Cashew%')").catch(() => {});
    await query("UPDATE products SET price = 246, compare_price = 299 WHERE price <= 0 AND (slug LIKE '%shampoo%' OR name LIKE '%Shampoo%')").catch(() => {});

    // Ensure product name is updated from Banarasi Paan to Paan Digestive Shots in live MySQL database
    await query("UPDATE products SET name = 'Paan Digestive Shots' WHERE name LIKE '%Banarasi Paan%'").catch(() => {});
    await query("UPDATE products SET data_json = REPLACE(data_json, 'Banarasi Paan', 'Paan') WHERE data_json LIKE '%Banarasi Paan%'").catch(() => {});

    // Also repair data_json if it had price: 0
    const zeroJsonRows = await query("SELECT id, slug, name, price, data_json FROM products WHERE data_json LIKE '%\"price\":0%'").catch(() => []);
    if (Array.isArray(zeroJsonRows)) {
      for (const row of zeroJsonRows) {
        try {
          const parsed = JSON.parse(row.data_json);
          const fallbackPrice = row.slug.includes("paan") ? 299 : row.slug.includes("ragi") ? 229 : row.slug.includes("almond") ? 749 : row.slug.includes("cashew") ? 649 : row.slug.includes("shampoo") ? 246 : 299;
          parsed.price = Number(row.price) > 0 ? Number(row.price) : fallbackPrice;
          await query("UPDATE products SET data_json = ? WHERE id = ?", [JSON.stringify(parsed), row.id]);
        } catch(e) {}
      }
    }
    
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
// 3. VELOCITY SHIPPING INTEGRATION & 100% AUTO-SHIP CONFIGURATION
// ---------------------------------------------------------------------
const VELOCITY_CONFIG = {
  baseUrl: process.env.VELOCITY_BASE_URL || "https://shazam.velocity.in",
  token:
    process.env.VELOCITY_TOKEN ||
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaGF6YW0iLCJjbGllbnRfaWQiOiI2NmIxZTk0Ny1lNGYzLTQ3YjUtYTk2YS02MTQ4NDBkZjZlMmMiLCJ0aWVyIjoic2lsdmVyIiwidG9rZW4iOiIzNWE5NmYwMTQ1ZGQ2ZGRkNGJkY2RlZWYwMTIyYTcwODE5NGM5YWZmYjhmZmQ4YzZlY2M5ZmIyNzM4NDU0ODM4IiwiZXhwIjoxODI2MDExMjQwfQ.pLW3Jw23js_xesmru3tIosCVS-bEj2znkUqiZ01MXW0",
  warehouseId: process.env.VELOCITY_WAREHOUSE_ID || "WHHE57",
  pickupLocation: process.env.VELOCITY_PICKUP_LOCATION || "DUST Farm Pune",
  pickupPincode: "412101",
  defaultWeight: 0.5,
  defaultLength: 15,
  defaultBreadth: 10,
  defaultHeight: 5,
};

async function createVelocityShipment(orderData) {
  try {
    const isCOD =
      (orderData.payment_method || orderData.paymentMethod || "").toUpperCase() ===
      "COD";
    const totalAmount = Number(orderData.total_amount || orderData.total || 0);

    const now = new Date();
    const orderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const rawName = (
      orderData.customer_name ||
      orderData.customerName ||
      "Customer"
    ).trim();
    const nameParts = rawName.split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || "";

    const rawItems =
      Array.isArray(orderData.items) && orderData.items.length > 0
        ? orderData.items
        : [
            {
              name: "DUST Organic Food Product",
              quantity: 1,
              price: totalAmount,
            },
          ];

    const orderItems = rawItems.map((item, idx) => ({
      name: String(
        item.name || item.product_name || "DUST Organic Food Product"
      ).slice(0, 100),
      sku: String(item.sku || `DUST-SKU-${idx + 1}`).slice(0, 50),
      units: Number(item.quantity || 1),
      selling_price: Number(item.price || item.unit_price || totalAmount),
      discount: 0,
      tax: 0,
    }));

    // If order total includes shipping / handling fee, include it so items sum matches total
    const itemsTotal = orderItems.reduce(
      (sum, item) =>
        sum + (Number(item.selling_price) || 0) * (Number(item.units) || 1),
      0
    );
    const shippingHandlingDiff = totalAmount - itemsTotal;
    if (shippingHandlingDiff > 0) {
      orderItems.push({
        name: "Shipping & Delivery Charge",
        sku: "DUST-SHIPPING-FEE",
        units: 1,
        selling_price: shippingHandlingDiff,
        discount: 0,
        tax: 0,
      });
    }

    const cleanPincode = String(orderData.pincode || "411045")
      .replace(/\D/g, "")
      .slice(0, 6);
    const cleanPhone = String(
      orderData.customer_phone || orderData.customerPhone || "8600694906"
    )
      .replace(/\D/g, "")
      .slice(-10);

    const payload = {
      order_id: String(orderData.order_reference || orderData.reference),
      order_date: orderDate,
      carrier_id: "",
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: String(
        orderData.shipping_address || orderData.address || "Pune"
      ).slice(0, 200),
      billing_city: String(orderData.city || "Pune"),
      billing_pincode: cleanPincode || "411045",
      billing_state: String(orderData.state || "Maharashtra"),
      billing_country: "India",
      billing_email: String(
        orderData.customer_email ||
          orderData.customerEmail ||
          "order@dustofficial.com"
      ),
      billing_phone: cleanPhone.length === 10 ? cleanPhone : "8600694906",
      shipping_is_billing: true,
      print_label: true,
      order_items: orderItems,
      payment_method: isCOD ? "COD" : "PREPAID",
      sub_total: totalAmount,
      cod_collectible: isCOD ? totalAmount : 0,
      length: Number(orderData.length || VELOCITY_CONFIG.defaultLength),
      breadth: Number(orderData.breadth || VELOCITY_CONFIG.defaultBreadth),
      height: Number(orderData.height || VELOCITY_CONFIG.defaultHeight),
      weight: Number(orderData.weight || VELOCITY_CONFIG.defaultWeight),
      pickup_location: VELOCITY_CONFIG.pickupLocation,
      warehouse_id: VELOCITY_CONFIG.warehouseId,
    };

    console.log(
      `🚀 [Velocity API] Auto-dispatching forward shipment for Order ${payload.order_id}...`
    );

    const response = await fetch(
      `${VELOCITY_CONFIG.baseUrl}/custom/api/v1/forward-order-orchestration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: VELOCITY_CONFIG.token,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json().catch(() => ({}));
    console.log(
      `📦 [Velocity API] Response (${response.status}):`,
      JSON.stringify(data)
    );

    if (
      data &&
      (data.status === 1 || data.status === "SUCCESS") &&
      data.payload
    ) {
      const p = data.payload;
      return {
        success: true,
        awb: p.awb_code || null,
        courierName: p.courier_name || null,
        labelUrl: p.label_url || null,
        velocityOrderId: p.order_id || null,
        shipmentId: p.shipment_id || null,
        message: "Dispatched with Velocity successfully!",
      };
    } else {
      const errMsg =
        data.message ||
        data.error ||
        (data.meta && data.meta.message) ||
        JSON.stringify(data);
      return {
        success: false,
        error: errMsg || "Velocity shipment creation failed",
      };
    }
  } catch (err) {
    console.error("❌ Velocity Dispatch Exception:", err.message);
    return { success: false, error: err.message };
  }
}

// ---------------------------------------------------------------------
// 4. ORDERS ENDPOINTS (Inserts & Fetches from MySQL orders & order_items)
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
    if (!customerEmail || !customerEmail.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required to complete your purchase.",
      });
    }

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

    console.log(
      `✅ [MySQL SUCCESS] Order saved to DB: ${reference} for ${customerName} (Total: ₹${total})`
    );

    // -----------------------------------------------------------------
    // 100% AUTOMATED AUTO-SHIP: Push order immediately to Velocity API
    // -----------------------------------------------------------------
    let velocityDispatch = null;
    try {
      velocityDispatch = await createVelocityShipment({
        order_reference: reference,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: address,
        city: city || "Pune",
        state: state || "Maharashtra",
        pincode: pincode || "",
        total_amount: total,
        subtotal_amount: subtotal || total,
        payment_method: payment,
        items,
      });

      if (velocityDispatch && velocityDispatch.success) {
        await query(
          `UPDATE orders 
           SET tracking_awb = ?, velocity_awb = ?, courier_name = ?, velocity_label_url = ?, velocity_order_id = ?, velocity_shipment_id = ?, order_status = 'Handed to Courier', velocity_status = 'Dispatched'
           WHERE id = ?`,
          [
            velocityDispatch.awb,
            velocityDispatch.awb,
            velocityDispatch.courierName,
            velocityDispatch.labelUrl,
            velocityDispatch.velocityOrderId,
            velocityDispatch.shipmentId,
            orderId,
          ]
        ).catch(() => {});
        console.log(
          `✅ [Velocity SUCCESS] Auto-dispatched order ${reference} - AWB: ${velocityDispatch.awb} via ${velocityDispatch.courierName}`
        );
      } else {
        const failReason = velocityDispatch?.error || "Dispatch failed";
        await query(
          "UPDATE orders SET velocity_status = ? WHERE id = ?",
          [`Failed: ${failReason}`.slice(0, 100), orderId]
        ).catch(() => {});
        console.warn(
          `⚠️ [Velocity WARNING] Order saved in DB, but auto-ship returned: ${failReason}`
        );
      }
    } catch (velErr) {
      console.warn("⚠️ Velocity auto-dispatch exception:", velErr.message);
    }

    return res.json({
      success: true,
      message: "Order created successfully!",
      orderId,
      velocity: velocityDispatch,
    });
  } catch (err) {
    console.error("❌ MySQL Order Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Database error: " + err.message });
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
             o.velocity_awb, o.velocity_label_url, o.courier_name, o.velocity_status,
             COALESCE(GROUP_CONCAT(CONCAT(oi.quantity, 'x ', oi.product_name) SEPARATOR ', '), '1x DUST Organic Blend') as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
    `;
    const params = [];
    if (email) {
      sql += " WHERE LOWER(TRIM(o.customer_email)) = LOWER(TRIM(?)) ";
      params.push(email);
    }
    sql +=
      " GROUP BY o.id, o.order_reference, o.customer_name, o.customer_email, o.customer_phone, o.shipping_address, o.city, o.state, o.pincode, o.subtotal_amount, o.total_amount, o.payment_method, o.payment_status, o.order_status, o.tracking_awb, o.created_at, o.velocity_awb, o.velocity_label_url, o.courier_name, o.velocity_status ORDER BY o.id DESC ";

    const orders = await query(sql, params);
    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders/:id/ship-velocity - Manually dispatch or re-sync with Velocity
app.post("/api/orders/:id/ship-velocity", async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await query(
      "SELECT * FROM orders WHERE id = ? OR order_reference = ? LIMIT 1",
      [id, id]
    );

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const order = orders[0];
    const items = await query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [order.id]
    );

    const result = await createVelocityShipment({
      order_reference: order.order_reference,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      shipping_address: order.shipping_address,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      total_amount: order.total_amount,
      subtotal_amount: order.subtotal_amount,
      payment_method: order.payment_method,
      items: items.map((i) => ({
        name: i.product_name,
        quantity: i.quantity,
        price: i.unit_price,
      })),
    });

    if (result.success) {
      await query(
        `UPDATE orders 
         SET tracking_awb = ?, velocity_awb = ?, courier_name = ?, velocity_label_url = ?, velocity_order_id = ?, velocity_shipment_id = ?, order_status = 'Handed to Courier', velocity_status = 'Dispatched'
         WHERE id = ?`,
        [
          result.awb,
          result.awb,
          result.courierName,
          result.labelUrl,
          result.velocityOrderId,
          result.shipmentId,
          order.id,
        ]
      );
      return res.json({
        success: true,
        message: "Order dispatched with Velocity successfully!",
        awb: result.awb,
        courier: result.courierName,
        labelUrl: result.labelUrl,
      });
    } else {
      await query("UPDATE orders SET velocity_status = ? WHERE id = ?", [
        `Failed: ${result.error}`.slice(0, 100),
        order.id,
      ]);
      return res.status(400).json({ success: false, message: result.error });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
});

// GET /api/orders/track - Real-time tracking lookup for customers
app.get("/api/orders/track", async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Query parameter q is required" });
  }

  const queryTerm = q.trim();
  try {
    const orders = await query(
      `SELECT o.id, o.order_reference, o.customer_name, o.customer_phone, o.city, o.state, o.pincode,
              o.order_status, o.tracking_awb, o.velocity_awb, o.courier_name, o.velocity_label_url, o.created_at
       FROM orders o
       WHERE o.order_reference = ? 
          OR o.tracking_awb = ? 
          OR o.velocity_awb = ? 
          OR o.customer_phone LIKE ?
       ORDER BY o.id DESC LIMIT 1`,
      [queryTerm, queryTerm, queryTerm, `%${queryTerm.slice(-10)}%`]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No order found matching your search.",
      });
    }

    const order = orders[0];
    const awb = order.velocity_awb || order.tracking_awb;
    return res.json({
      success: true,
      order: {
        reference: order.order_reference,
        status: order.order_status,
        customerName: order.customer_name,
        city: order.city,
        state: order.state,
        awb: awb || null,
        courierName: order.courier_name || "Velocity Express",
        trackingUrl: awb ? `https://shipfastt.in/track/${awb}` : null,
        labelUrl: order.velocity_label_url || null,
        orderDate: order.created_at,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
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
      const fallbackPrice = r.slug.includes("paan")
        ? 299
        : r.slug.includes("ragi")
        ? 229
        : r.slug.includes("almond")
        ? 749
        : r.slug.includes("cashew")
        ? 649
        : r.slug.includes("shampoo")
        ? 246
        : 299;
      const effectivePrice =
        Number(r.price) > 0
          ? Number(r.price)
          : Number(richData.price) > 0
          ? Number(richData.price)
          : fallbackPrice;
      const effectiveComparePrice =
        r.compare_price && Number(r.compare_price) > 0
          ? Number(r.compare_price)
          : richData.originalPrice && Number(richData.originalPrice) > 0
          ? Number(richData.originalPrice)
          : r.slug.includes("paan")
          ? 350
          : undefined;

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
        price: effectivePrice,
        originalPrice: effectiveComparePrice,
        priceDisplay: `₹${effectivePrice}`,
        originalPriceDisplay: effectiveComparePrice ? `₹${effectiveComparePrice}` : undefined,
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
        stock:
          r.stock_qty !== null && r.stock_qty !== undefined
            ? Number(r.stock_qty)
            : richData.stock !== undefined
            ? Number(richData.stock)
            : 100,
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
      rows = await query("SELECT * FROM products WHERE id = ? OR slug = ? LIMIT 1", [Number(id), targetSlug]);
    } else {
      rows = await query(
        "SELECT * FROM products WHERE slug = ? OR slug = ? OR name = ? OR data_json LIKE ? LIMIT 1",
        [id, targetSlug, targetName, `%"id":"${id}"%`]
      );
    }

    if (rows.length === 0 && targetName) {
      rows = await query("SELECT * FROM products WHERE name = ? LIMIT 1", [targetName]);
    }

    if (rows.length === 0) {
      const lower = String(id).toLowerCase();
      if (lower.includes("ragi") || lower.includes("laddoo")) {
        rows = await query("SELECT * FROM products WHERE slug LIKE '%ragi%' OR name LIKE '%Ragi%' LIMIT 1");
      } else if (lower.includes("paan")) {
        rows = await query("SELECT * FROM products WHERE slug LIKE '%paan%' OR name LIKE '%Paan%' LIMIT 1");
      } else if (lower.includes("almond")) {
        rows = await query("SELECT * FROM products WHERE slug LIKE '%almond%' OR name LIKE '%Almond%' LIMIT 1");
      } else if (lower.includes("cashew")) {
        rows = await query("SELECT * FROM products WHERE slug LIKE '%cashew%' OR name LIKE '%Cashew%' LIMIT 1");
      } else if (lower.includes("shampoo")) {
        rows = await query("SELECT * FROM products WHERE slug LIKE '%shampoo%' OR name LIKE '%Shampoo%' LIMIT 1");
      }
    }

    const existingRow = rows.length > 0 ? rows[0] : null;
    const rowId = existingRow ? existingRow.id : (isNumId ? Number(id) : null);

    // 2. CHECK FOR STOCK-ONLY UPDATE:
    if (
      p.isStockOnly ||
      (p.stock !== undefined &&
        p.description === undefined &&
        p.ingredients === undefined &&
        p.subtitle === undefined)
    ) {
      if (rowId) {
        const newStock = Math.max(0, Number(p.stock));
        await query("UPDATE products SET stock_qty = ? WHERE id = ?", [newStock, rowId]);
        if (existingRow && existingRow.data_json) {
          try {
            const parsed = JSON.parse(existingRow.data_json);
            parsed.stock = newStock;
            if (!parsed.price || Number(parsed.price) <= 0) {
              parsed.price = Number(existingRow.price) > 0 ? Number(existingRow.price) : 299;
            }
            await query("UPDATE products SET data_json = ? WHERE id = ?", [JSON.stringify(parsed), rowId]);
          } catch (e) {}
        }
        console.log(`📦 [MySQL] Stock-only update for product id=${rowId} to ${newStock} units`);
      }
      return res.json({ success: true, message: "Product stock updated successfully" });
    }

    // 3. CHECK FOR PRICE-ONLY UPDATE:
    if (
      p.isPriceOnly ||
      (p.price !== undefined &&
        p.stock === undefined &&
        p.description === undefined &&
        p.ingredients === undefined &&
        p.subtitle === undefined)
    ) {
      if (rowId) {
        const newPrice = Math.max(1, Number(p.price));
        await query("UPDATE products SET price = ? WHERE id = ?", [newPrice, rowId]);
        if (existingRow && existingRow.data_json) {
          try {
            const parsed = JSON.parse(existingRow.data_json);
            parsed.price = newPrice;
            await query("UPDATE products SET data_json = ? WHERE id = ?", [JSON.stringify(parsed), rowId]);
          } catch (e) {}
        }
        console.log(`💰 [MySQL] Price-only update for product id=${rowId} to ₹${newPrice}`);
      }
      return res.json({ success: true, message: "Product price updated successfully" });
    }

    // 4. FULL PRODUCT PAYLOAD:
    const fallbackPrice = targetSlug.includes("paan")
      ? 299
      : targetSlug.includes("ragi")
      ? 229
      : targetSlug.includes("almond")
      ? 749
      : targetSlug.includes("cashew")
      ? 649
      : targetSlug.includes("shampoo")
      ? 246
      : 299;
    const name = p.name || (existingRow ? existingRow.name : "Product");
    const price =
      p.price !== undefined && Number(p.price) > 0
        ? Number(p.price)
        : existingRow && Number(existingRow.price) > 0
        ? Number(existingRow.price)
        : fallbackPrice;
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

// POST /api/upload-video - Upload customer review video file and save to /uploads
app.post("/api/upload-video", async (req, res) => {
  try {
    const { video, filename } = req.body;
    if (!video) {
      return res.status(400).json({ success: false, error: "No video data provided" });
    }

    const matches = video.match(/^data:([A-Za-z0-9\-+\/.]+);base64,(.+)$/);
    let mimeType = "video/mp4";
    let buffer;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(video, "base64");
    }

    let ext = "mp4";
    if (mimeType.includes("webm")) ext = "webm";
    else if (mimeType.includes("quicktime") || mimeType.includes("mov")) ext = "mov";
    else if (mimeType.includes("ogg")) ext = "ogg";

    let safeBase = "customer_review_video";
    if (filename) {
      safeBase = filename.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    }

    const uniqueName = `${safeBase}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await fs.promises.writeFile(filePath, buffer);
    console.log(`🎥 [Upload] Saved review video: /uploads/${uniqueName} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);

    return res.json({
      success: true,
      url: `/uploads/${uniqueName}`,
      filename: uniqueName,
      size: buffer.length,
    });
  } catch (err) {
    console.error("❌ Video upload error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// UPCOMING PRODUCT BANNERS ENDPOINTS
// ---------------------------------------------------------------------
app.get("/api/upcoming-banners", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const sql = showAll
      ? "SELECT * FROM upcoming_banners ORDER BY display_order ASC, id DESC"
      : "SELECT * FROM upcoming_banners WHERE is_active = 1 OR is_active IS NULL ORDER BY display_order ASC, id DESC";
    const banners = await query(sql);
    return res.json({ success: true, count: banners.length, banners });
  } catch (err) {
    console.error("❌ Fetch upcoming banners error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/upcoming-banners", async (req, res) => {
  const {
    title,
    subtitle,
    tagline,
    launch_date,
    image_url,
    description,
    cta_text,
    cta_link,
    display_order,
    is_active,
  } = req.body;

  if (!title || !image_url) {
    return res.status(400).json({ success: false, message: "Title and Image URL are required" });
  }

  try {
    const result = await query(
      `INSERT INTO upcoming_banners (title, subtitle, tagline, launch_date, image_url, description, cta_text, cta_link, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        subtitle || "",
        tagline || "COMING SOON",
        launch_date || "Launching Soon",
        image_url,
        description || "",
        cta_text || "Pre-Order Inquiry",
        cta_link || "/combos",
        Number(display_order) || 0,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
      ]
    );

    console.log(`✨ [MySQL] Created upcoming banner id=${result.insertId} (${title})`);
    return res.json({
      success: true,
      message: "Upcoming banner created successfully",
      bannerId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Create upcoming banner error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/upcoming-banners/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    subtitle,
    tagline,
    launch_date,
    image_url,
    description,
    cta_text,
    cta_link,
    display_order,
    is_active,
  } = req.body;

  try {
    await query(
      `UPDATE upcoming_banners 
       SET title = ?,
           subtitle = ?,
           tagline = ?,
           launch_date = ?,
           image_url = ?,
           description = ?,
           cta_text = ?,
           cta_link = ?,
           display_order = ?,
           is_active = ?
       WHERE id = ?`,
      [
        title,
        subtitle || "",
        tagline || "COMING SOON",
        launch_date || "Launching Soon",
        image_url,
        description || "",
        cta_text || "Pre-Order Inquiry",
        cta_link || "/combos",
        Number(display_order) || 0,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        Number(id),
      ]
    );

    console.log(`✏️ [MySQL] Updated upcoming banner id=${id} (${title})`);
    return res.json({ success: true, message: "Upcoming banner updated successfully" });
  } catch (err) {
    console.error("❌ Update upcoming banner error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/upcoming-banners/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM upcoming_banners WHERE id = ?", [Number(id)]);
    console.log(`🗑️ [MySQL] Deleted upcoming banner id=${id}`);
    return res.json({ success: true, message: "Upcoming banner deleted successfully" });
  } catch (err) {
    console.error("❌ Delete upcoming banner error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ticker - Get marquee ticker content
app.get("/api/ticker", async (req, res) => {
  try {
    const rows = await query("SELECT setting_value FROM site_settings WHERE setting_key = 'marquee_ticker' LIMIT 1").catch(() => []);
    if (Array.isArray(rows) && rows.length > 0 && rows[0].setting_value) {
      try {
        const parsed = JSON.parse(rows[0].setting_value);
        return res.json({ success: true, items: parsed });
      } catch (e) {
        return res.json({ success: true, items: [rows[0].setting_value] });
      }
    }
    // Default fallback items
    return res.json({
      success: true,
      items: [
        "DUST — CHOICE OF MOTHERLAND",
        "NOT MADE FOR EVERYONE • MADE FOR THOSE WHO CHOOSE BETTER",
        "WHOLESOME LADDOO PREMIX & DRY FRUITS",
        "PAAN DIGESTIVE SHOTS",
        "ZERO ADDED SUGAR",
        "100% NATURAL NUTRITION"
      ]
    });
  } catch (err) {
    console.error("❌ Get ticker error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ticker - Update marquee ticker content from admin panel
app.post("/api/ticker", async (req, res) => {
  try {
    const { items } = req.body;
    if (!items) {
      return res.status(400).json({ success: false, error: "Items are required" });
    }
    const valueToStore = typeof items === "string" ? items : JSON.stringify(items);
    await query(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES ('marquee_ticker', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [valueToStore]
    );
    console.log("📢 [MySQL] Updated marquee ticker content");
    return res.json({ success: true, message: "Ticker content updated successfully" });
  } catch (err) {
    console.error("❌ Update ticker error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// TESTIMONIALS / CUSTOMER REVIEWS ENDPOINTS
// ---------------------------------------------------------------------
app.get("/api/testimonials", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM testimonials ORDER BY created_at DESC");
    const testimonials = rows.map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      location: r.location,
      productSlug: r.product_slug,
      productName: r.product_name,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      mediaType: r.media_type || "text",
      videoUrl: r.video_url || undefined,
      videoPoster: r.video_poster || undefined,
      videoDuration: r.video_duration || undefined,
      verifiedBuyer: Boolean(r.verified_buyer),
      isFeatured: Boolean(r.is_featured),
      isApproved: Boolean(r.is_approved),
      isRead: Boolean(r.is_read),
      date: r.date_str || "Recently",
      helpfulCount: r.helpful_count || 0,
    }));
    return res.json({ success: true, count: testimonials.length, testimonials });
  } catch (err) {
    console.error("❌ Fetch testimonials error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/testimonials", async (req, res) => {
  const {
    id,
    customerName,
    location,
    productSlug,
    productName,
    rating,
    title,
    comment,
    mediaType,
    videoUrl,
    videoPoster,
    videoDuration,
    verifiedBuyer,
    isFeatured,
    isApproved,
    isRead,
  } = req.body;

  const reviewId = id || `test-${Date.now()}`;

  try {
    await query(
      `INSERT INTO testimonials (
        id, customer_name, location, product_slug, product_name, rating,
        title, comment, media_type, video_url, video_poster, video_duration,
        verified_buyer, is_featured, is_approved, is_read, helpful_count, date_str
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        customer_name = VALUES(customer_name),
        location = VALUES(location),
        rating = VALUES(rating),
        title = VALUES(title),
        comment = VALUES(comment),
        media_type = VALUES(media_type),
        video_url = VALUES(video_url),
        video_poster = VALUES(video_poster),
        is_approved = VALUES(is_approved),
        is_featured = VALUES(is_featured),
        is_read = VALUES(is_read)`,
      [
        reviewId,
        customerName || "Customer",
        location || "India",
        productSlug || "general",
        productName || "DUST Product",
        rating || 5,
        title || "Customer Review",
        comment || "",
        mediaType || "text",
        videoUrl || null,
        videoPoster || null,
        videoDuration || null,
        verifiedBuyer !== false,
        isFeatured !== false,
        isApproved !== false,
        isRead === true,
        0,
        "Just now",
      ]
    );

    console.log(`⭐ [MySQL] Customer review synced (ID: ${reviewId}, isRead: ${Boolean(isRead)})`);
    return res.json({ success: true, id: reviewId, message: "Review saved successfully" });
  } catch (err) {
    console.error("❌ Save testimonial error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/testimonials/mark-all-read", async (req, res) => {
  try {
    await query("UPDATE testimonials SET is_read = 1 WHERE is_read = 0");
    return res.json({ success: true, message: "All reviews marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/testimonials/:id", async (req, res) => {
  const { id } = req.params;
  const { isApproved, isFeatured, isRead } = req.body;
  try {
    const updates = [];
    const params = [];
    if (typeof isApproved === "boolean") {
      updates.push("is_approved = ?");
      params.push(isApproved ? 1 : 0);
    }
    if (typeof isFeatured === "boolean") {
      updates.push("is_featured = ?");
      params.push(isFeatured ? 1 : 0);
    }
    if (typeof isRead === "boolean") {
      updates.push("is_read = ?");
      params.push(isRead ? 1 : 0);
    }
    if (updates.length > 0) {
      params.push(id);
      await query(`UPDATE testimonials SET ${updates.join(", ")} WHERE id = ?`, params);
    }
    return res.json({ success: true, message: "Review updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/testimonials/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM testimonials WHERE id = ?", [id]);
    return res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------------------------------------------------------------
// COUPONS & OFFERS ENDPOINTS
// ---------------------------------------------------------------------
app.get("/api/coupons", async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const sql = showAll
      ? "SELECT * FROM coupons ORDER BY id DESC"
      : "SELECT * FROM coupons WHERE is_active = 1 AND (expiry_date >= CURDATE() OR expiry_date = '' OR expiry_date IS NULL) ORDER BY id DESC";
    const rows = await query(sql);
    const coupons = rows.map((r) => ({
      id: r.id,
      code: r.code,
      discountType: r.discount_type || "percentage",
      discountValue: Number(r.discount_value),
      minOrderAmount: Number(r.min_order_amount || 0),
      maxDiscountAmount: r.max_discount_amount ? Number(r.max_discount_amount) : null,
      expiryDate: r.expiry_date,
      description: r.description || "",
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
    }));
    return res.json({ success: true, count: coupons.length, coupons });
  } catch (err) {
    console.error("❌ Fetch coupons error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/coupons", async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    expiryDate,
    description,
    isActive,
  } = req.body;

  if (!code || !discountValue) {
    return res.status(400).json({ success: false, message: "Coupon code and discount value are required" });
  }

  const cleanCode = String(code).trim().toUpperCase();

  try {
    const result = await query(
      `INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount_amount, expiry_date, description, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         discount_type = VALUES(discount_type),
         discount_value = VALUES(discount_value),
         min_order_amount = VALUES(min_order_amount),
         max_discount_amount = VALUES(max_discount_amount),
         expiry_date = VALUES(expiry_date),
         description = VALUES(description),
         is_active = VALUES(is_active)`,
      [
        cleanCode,
        discountType || "percentage",
        Number(discountValue),
        Number(minOrderAmount || 0),
        maxDiscountAmount ? Number(maxDiscountAmount) : null,
        expiryDate || "2026-12-31",
        description || "",
        isActive !== false ? 1 : 0,
      ]
    );

    console.log(`🎟️ [MySQL] Coupon saved: ${cleanCode}`);
    return res.json({ success: true, id: result.insertId, message: "Coupon saved successfully" });
  } catch (err) {
    console.error("❌ Save coupon error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/coupons/:id", async (req, res) => {
  const { id } = req.params;
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    expiryDate,
    description,
    isActive,
  } = req.body;

  try {
    const updates = [];
    const params = [];

    if (code !== undefined) {
      updates.push("code = ?");
      params.push(String(code).trim().toUpperCase());
    }
    if (discountType !== undefined) {
      updates.push("discount_type = ?");
      params.push(discountType);
    }
    if (discountValue !== undefined) {
      updates.push("discount_value = ?");
      params.push(Number(discountValue));
    }
    if (minOrderAmount !== undefined) {
      updates.push("min_order_amount = ?");
      params.push(Number(minOrderAmount));
    }
    if (maxDiscountAmount !== undefined) {
      updates.push("max_discount_amount = ?");
      params.push(maxDiscountAmount ? Number(maxDiscountAmount) : null);
    }
    if (expiryDate !== undefined) {
      updates.push("expiry_date = ?");
      params.push(expiryDate);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }
    if (isActive !== undefined) {
      updates.push("is_active = ?");
      params.push(isActive ? 1 : 0);
    }

    if (updates.length > 0) {
      params.push(id);
      await query(`UPDATE coupons SET ${updates.join(", ")} WHERE id = ?`, params);
    }

    return res.json({ success: true, message: "Coupon updated successfully" });
  } catch (err) {
    console.error("❌ Update coupon error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/coupons/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await query("DELETE FROM coupons WHERE id = ?", [id]);
    console.log(`🗑️ [MySQL] Deleted coupon id=${id}`);
    return res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (err) {
    console.error("❌ Delete coupon error:", err);
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

// GET /sitemap.xml - Dynamic SEO Sitemap including all live products
app.get("/sitemap.xml", async (req, res) => {
  try {
    let dbProducts = [];
    try {
      dbProducts = await query("SELECT slug, name, image_url, updated_at FROM products WHERE is_active = 1 OR is_active IS NULL");
    } catch (e) {
      dbProducts = await query("SELECT slug, name, image_url FROM products").catch(() => []);
    }

    const today = new Date().toISOString().split("T")[0];
    const baseUrl = "https://dustofficial.com";

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    const staticRoutes = [
      { path: "", changefreq: "daily", priority: "1.0" },
      { path: "shop", changefreq: "daily", priority: "0.9" },
      { path: "combos", changefreq: "weekly", priority: "0.8" },
      { path: "about", changefreq: "monthly", priority: "0.8" },
      { path: "contact", changefreq: "monthly", priority: "0.7" },
      { path: "faq", changefreq: "monthly", priority: "0.6" },
      { path: "order-tracking", changefreq: "monthly", priority: "0.5" },
      { path: "collections/wholesome-millets", changefreq: "weekly", priority: "0.8" },
      { path: "collections/heritage-wellness", changefreq: "weekly", priority: "0.8" },
      { path: "collections/pure-nut-powders", changefreq: "weekly", priority: "0.8" },
      { path: "collections/herbal-haircare", changefreq: "weekly", priority: "0.8" },
      { path: "shipping-policy", changefreq: "yearly", priority: "0.4" },
      { path: "return-refund-policy", changefreq: "yearly", priority: "0.4" },
      { path: "cancellation-policy", changefreq: "yearly", priority: "0.4" },
      { path: "privacy-policy", changefreq: "yearly", priority: "0.4" },
      { path: "terms-conditions", changefreq: "yearly", priority: "0.4" },
    ];

    for (const r of staticRoutes) {
      const fullUrl = r.path ? `${baseUrl}/${r.path}` : baseUrl;
      xml += `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>\n`;
    }

    const seenSlugs = new Set();
    for (const p of dbProducts) {
      if (p.slug && !seenSlugs.has(p.slug)) {
        seenSlugs.add(p.slug);
        const lastMod = p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : today;
        const imgTag = p.image_url ? `\n    <image:image>\n      <image:loc>${p.image_url.startsWith("http") ? p.image_url : baseUrl + p.image_url}</image:loc>\n      <image:title>${(p.name || "").replace(/&/g, "&amp;")}</image:title>\n    </image:image>` : "";
        xml += `  <url>\n    <loc>${baseUrl}/product/${p.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>${imgTag}\n  </url>\n`;
      }
    }

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml; charset=utf-8");
    return res.send(xml);
  } catch (err) {
    console.error("Error generating dynamic sitemap:", err);
    res.sendFile(path.join(publicPath, "sitemap.xml"));
  }
});

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
