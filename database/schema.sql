-- =====================================================================
-- DUST — Choice of Motherland (Everest Edges Pvt. Ltd.)
-- Production Database Schema for MySQL / Hostinger phpMyAdmin
-- CIN: U10309PN2026PTC258739 | GSTIN: 27AAJCE8999E1ZX
-- Includes: Products, Categories, Variants, Orders, Users, Coupons, 
--           Banners, Reviews, Blogs, Recipes, Contact & B2B Leads.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `dust_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dust_db`;

-- ---------------------------------------------------------------------
-- Table 1: Categories
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 2: Products & Variants
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `sub_heading` VARCHAR(255) NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `compare_price` DECIMAL(10, 2) NULL,
  `weight` VARCHAR(50) NOT NULL,
  `servings` VARCHAR(50) NOT NULL,
  `stock_qty` INT UNSIGNED DEFAULT 100,
  `image_url` VARCHAR(500) NOT NULL,
  `gallery_images` TEXT NULL,
  `description` TEXT NOT NULL,
  `ingredients` TEXT NULL,
  `is_best_seller` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 3: Customers & User Accounts
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin') DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 4: Orders
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_reference` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(20) NOT NULL,
  `subtotal_amount` DECIMAL(10, 2) NOT NULL,
  `tax_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `shipping_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `payment_method` ENUM('UPI', 'CARD', 'COD', 'NETBANKING') DEFAULT 'UPI',
  `payment_status` ENUM('PAID', 'PENDING', 'FAILED', 'REFUNDED') DEFAULT 'PAID',
  `order_status` ENUM('Order Received', 'Payment Verified', 'Packed', 'Handed to Courier', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Order Received',
  `tracking_awb` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 5: Order Items
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 6: Coupons & Discounts
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_type` ENUM('percentage', 'fixed') DEFAULT 'percentage',
  `discount_value` DECIMAL(10, 2) NOT NULL,
  `min_order_amount` DECIMAL(10, 2) DEFAULT 0.00,
  `expiry_date` DATE NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 7: Banners & Offers
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `cta_link` VARCHAR(255) DEFAULT '/shop',
  `cta_text` VARCHAR(100) DEFAULT 'Explore Now',
  `is_active` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 8: Customer Reviews & Ratings
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_name` VARCHAR(255) NOT NULL DEFAULT 'Banarasi Paan Digestive Shots',
  `customer_name` VARCHAR(150) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `rating` INT UNSIGNED DEFAULT 5,
  `comment` TEXT NOT NULL,
  `media_type` ENUM('photo', 'video') DEFAULT 'photo',
  `media_url` VARCHAR(500) NOT NULL,
  `is_approved` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 9: Blogs & Wellness Articles
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `author` VARCHAR(100) DEFAULT 'DUST Wellness Team',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 10: Recipes & Mixology
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `prep_time` VARCHAR(50) DEFAULT '5 seconds',
  `ingredients` TEXT NOT NULL,
  `instructions` TEXT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 11: Distributor & B2B Leads
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `distributor_leads` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `contact_name` VARCHAR(150) NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `city_state` VARCHAR(150) NOT NULL,
  `channel` VARCHAR(100) NOT NULL,
  `investment_capacity` VARCHAR(100) NOT NULL,
  `message` TEXT NULL,
  `status` ENUM('New', 'In Review', 'Contacted', 'Approved', 'Rejected') DEFAULT 'New',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table 12: Contact Form Inquiries
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NULL,
  `inquiry_type` VARCHAR(100) DEFAULT 'General Enquiry',
  `message` TEXT NOT NULL,
  `status` ENUM('New', 'Responded', 'Closed') DEFAULT 'New',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED DATA
-- =====================================================================

INSERT INTO `categories` (`id`, `slug`, `name`, `description`) VALUES
(1, 'pure-fruit-powders', 'Pure Fruit Powders', 'Spray-dried real fruit instant powders with zero synthetic chemicals.'),
(2, 'heritage-wellness', 'Heritage Wellness', 'Post-meal digestive mixes and royal paan shots inspired by Banaras traditions.')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `products` (`id`, `slug`, `name`, `sub_heading`, `category_id`, `price`, `compare_price`, `weight`, `servings`, `stock_qty`, `image_url`, `description`, `ingredients`, `is_best_seller`, `is_featured`) VALUES
(1, 'banarasi-paan-01', 'Banarasi Paan Digestive Shots', 'Royal Betel Leaf & Gulkand After-Meal Digestive', 2, 299.00, 350.00, 'Box of 10 Sachets', 'Makes 20 Shots', 200, '/paan_image_2.jpeg', 'Crafted with authentic Banarasi betel leaf extracts, rose petal gulkand, fennel, and prebiotic inulin fiber for digestive health.', 'Real Betel Leaf Solids, Gulkand, Fennel, Cardamom, Inulin Fiber', 1, 1),
(2, 'kacha-aam-01', 'Kacha Aam Instant Powder', 'Tangy Raw Mango Summer Cooler Mix (Coming Soon)', 1, 199.00, 249.00, '100g', 'Makes 10 Coolers', 150, '/paan_image_1.jpeg', 'Experience authentic Indian summer street flavor made with spray-dried raw mango solids and rock salt.', 'Raw Mango Solids, Rock Salt, Cumin, Mint Extract', 0, 0),
(3, 'pure-almond-powder', 'DUST Almond Powder (500g)', 'Pure Almond Goodness. Everyday Nutrition.', 1, 749.00, 899.00, '500g', 'Multiple Uses', 100, '/almond_powder/Almond Flour Pouch with Natural Accents.png', 'Made from almonds with their natural skin, this finely ground powder offers a convenient way to enjoy the familiar taste and richness of almonds.', '100% Pure Skin-On Almond Powder', 0, 1),
(4, 'premium-cashew-powder', 'DUST Premium Cashew Powder (500g)', 'Pure Cashew Goodness. Everyday Nutrition. Endless Possibilities.', 1, 649.00, 799.00, '500g', 'Multiple Uses', 100, '/cashew_powder/Premium Natural Cashew Powder Pouch.png', 'Bring the rich, creamy taste of cashews into your everyday recipes with DUST Premium Cashew Powder. Made from finely ground premium cashews.', '100% Pure Natural Cashew Nuts', 0, 1)
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`);

INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_order_amount`, `expiry_date`, `is_active`) VALUES
(1, 'DUSTFIRST10', 'percentage', 10.00, 200.00, '2026-12-31', 1),
(2, 'PANINDIA15', 'percentage', 15.00, 500.00, '2026-12-31', 1)
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);
