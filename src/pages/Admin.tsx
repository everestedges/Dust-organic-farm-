import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Ticket,
  Image as ImageIcon,
  BookOpen,
  Utensils,
  Star,
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  LogOut,
  Save,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { products as initialProducts, companyInfo, Product } from "@/lib/data";
import { useAdminAuthStore } from "@/lib/admin-auth-store";

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, adminLogout, adminUser } = useAdminAuthStore();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  // Active Tab State (16 Client Requirements organized in 10 Control Tabs)
  const [activeTab, setActiveTab] = useState<
    | "reports"
    | "products"
    | "categories"
    | "inventory"
    | "orders"
    | "customers"
    | "coupons"
    | "banners"
    | "content"
    | "leads"
  >("reports");

  // State 1: Products & Image Management (Add/Edit/Delete)
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form State
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState<"wholesome-millets" | "heritage-wellness">("wholesome-millets");
  const [newProductPrice, setNewProductPrice] = useState(229);
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState(259);
  const [newProductWeight, setNewProductWeight] = useState("250g");
  const [newProductServings, setNewProductServings] = useState("Makes 10-12 Laddoos");
  const [newProductImageUrl, setNewProductImageUrl] = useState("/ragi_pouch.png");
  const [newProductDescription, setNewProductDescription] = useState("");

  // State 2: Categories
  const [categories, setCategories] = useState([
    { id: 1, name: "Wholesome Laddoo Premix", slug: "wholesome-millets", count: 1, desc: "Traditional millet mixes and dry fruit laddoo premixes with zero added sugar." },
    { id: 2, name: "Heritage Wellness", slug: "heritage-wellness", count: 1, desc: "Post-meal digestive mixes and royal paan shots inspired by Banaras traditions." },
  ]);

  // State 3: Coupons
  const [coupons, setCoupons] = useState([
    { id: 2, code: "PANINDIA15", type: "Percentage", value: "15% OFF", minOrder: "₹500", status: "Inactive", expiry: "31 Dec 2026" },
  ]);

  // State 4: Homepage Banners
  const [banners, setBanners] = useState([
    { id: 1, title: "Royal Paan Digestive Shot", subtitle: "Real Betel Leaf & Gulkand After-Meal Shot", cta: "Shop Digestives", status: "Active" },
    { id: 2, title: "Shahi Ragi & Dry Fruit Laddoo Mix", subtitle: "Wholesome Laddoo Premix & Real Nuts - Zero Added Sugar", cta: "Explore Range", status: "Active" },
  ]);

  // State 5: Customer Reviews Moderation
  const [reviews, setReviews] = useState([
    { id: 1, author: "Ananya Sharma", location: "Pune", rating: 5, comment: "Tastes exactly like royal paan after dinner!", product: "Paan Digestive Shot", status: "Approved" },
    { id: 2, author: "Rajesh Kulkarni", location: "Mumbai", rating: 5, comment: "Authentic betel leaf and gulkand flavor in seconds!", product: "Paan Digestive Shot", status: "Approved" },
  ]);

  // State 6: Blogs & Recipes
  const [blogs, setBlogs] = useState([
    { id: 1, title: "The Science of Betel Leaf Digestion", author: "DUST Research Team", date: "24 Aug 2026", status: "Published" },
    { id: 2, title: "Why Spray-Dried Fruit Powders Retain 98% Nutrition", author: "Dr. V. Joshi", date: "15 Aug 2026", status: "Published" },
  ]);

  const [recipes, setRecipes] = useState([
    { id: 1, title: "5-Second Chilled Paan Digestive", prep: "5 Secs", product: "Paan Digestive Shot Box" },
    { id: 2, title: "Royal Gulkand & Paan Mocktail", prep: "2 Mins", product: "Paan Digestive Shot" },
  ]);

  // State 7: Customers
  const [customers, setCustomers] = useState([
    { id: 1, name: "Rajesh Kumar", email: "rajesh.kumar@example.com", phone: "9876543210", orders: 2, totalSpent: "₹1,045", date: "26 Aug 2026" },
    { id: 2, name: "Vipul Mandal", email: "vipul.m@gmail.com", phone: "1234567890", orders: 1, totalSpent: "₹249", date: "27 Aug 2026" },
  ]);

  // State 8: Customer Orders
  const [orders, setOrders] = useState([
    {
      id: "DST-8600-9482",
      customer: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "9876543210",
      total: 647,
      payment: "PAID (UPI)",
      status: "Handed to Courier",
      awb: "SR-994821",
      date: "26 Aug 2026",
    },
    {
      id: "DST-8600-3810",
      customer: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "9812345678",
      total: 398,
      payment: "PAID (Card)",
      status: "Delivered",
      awb: "DEL-882910",
      date: "24 Aug 2026",
    },
  ]);

  // State 9: Distributor Leads
  const [distributorLeads, setDistributorLeads] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      company: "Om Traders & Agency",
      phone: "9876543210",
      email: "rajesh@omtraders.com",
      location: "Pune, Maharashtra",
      channel: "Regional Distributor",
      investment: "₹2 Lakhs – ₹5 Lakhs",
      status: "New",
      date: "26 Aug 2026",
    },
  ]);

  // Actions
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `dust-prod-${Date.now()}`;
    const newProd: Product = {
      id: newId,
      slug: newProductName.toLowerCase().replace(/\s+/g, "-"),
      name: newProductName,
      shortName: newProductName,
      subtitle: newProductServings,
      pitch: newProductDescription,
      category: newProductCategory,
      categoryLabel: newProductCategory === "wholesome-millets" ? "Wholesome Laddoo Premix" : "Heritage Wellness",
      price: newProductPrice,
      originalPrice: newProductOriginalPrice,
      priceDisplay: `₹${newProductPrice}`,
      originalPriceDisplay: `₹${newProductOriginalPrice}`,
      unitDisplay: newProductServings,
      netWeight: newProductWeight,
      badges: ["NEW LAUNCH"],
      description: [newProductDescription || "Pure spray-dried natural ingredient formulation."],
      ingredients: "Real Betel Leaf Solids, Gulkand, Fennel, Cardamom, Inulin Fiber",
      storage: "Store in a cool dry place away from direct sunlight.",
      nutrition: { serving: newProductWeight, note: "100% Natural", rows: [["Energy", "45 kcal", "2%"]] },
      claims: ["100% Natural", "Zero Preservatives"],
      ritual: [{ title: "Stir & Enjoy", detail: "Mix with 60ml chilled water." }],
      ritualLabel: "Preparation Ritual",
      heritageTitle: "Traditional Wellness",
      heritageQuote: "Inspired by Banaras digestive recipes.",
      images: [{ src: newProductImageUrl, alt: newProductName }],
      storyImage: newProductImageUrl,
      accent: "rose",
      stock: 150,
      sku: newId,
      fssai: "FSSAI Lic. No. 11522036000722",
      featured: true,
      newArrival: true,
      bestSeller: false,
    };

    setProductsList((prev) => [newProd, ...prev]);
    setIsAddModalOpen(false);
    setNewProductName("");
    alert("✅ New product added successfully!");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product SKU?")) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-screen bg-[#F6F5F0] text-[#0E382E]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enterprise Admin Header */}
        <div className="bg-[#0E382E] text-white p-8 sm:p-10 rounded-3xl border border-[#74B487]/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#E67E22] font-extrabold flex items-center gap-2">
              <Building2 className="w-4 h-4" /> CENTRAL ADMIN OPERATIONS SUITE
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              DUST Operations Management
            </h1>
            <p className="text-xs text-[#E8F1E9] mt-1 font-semibold">
              Parented by <strong>{companyInfo.name}</strong> • CIN: {companyInfo.cin}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-[#1F684B] px-4 py-2 rounded-2xl text-right text-xs">
              <span className="text-[#E67E22] font-bold block uppercase">Admin Authenticated</span>
              <span className="text-white font-extrabold">{adminUser?.name || "Master Admin"}</span>
            </div>
            <button
              onClick={() => {
                adminLogout();
                navigate("/admin-login");
              }}
              className="bg-[#E67E22] hover:bg-[#d67018] text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-md"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* 10 Control Tabs Fulfilling All 16 Client Requirements */}
        <div className="flex flex-wrap gap-2.5 border-b border-[#74B487]/30 pb-4">
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "reports"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <TrendingUp className="w-4 h-4 text-[#E67E22]" /> Sales Reports
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "products"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <Package className="w-4 h-4 text-[#E67E22]" /> Products & Images
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "categories"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <Building2 className="w-4 h-4 text-[#E67E22]" /> Categories & Variants
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "inventory"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <DollarSign className="w-4 h-4 text-[#E67E22]" /> Price & Stock Control
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "orders"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#E67E22]" /> Order Fulfillment
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "customers"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <Users className="w-4 h-4 text-[#E67E22]" /> Customer Directory
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "coupons"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <Ticket className="w-4 h-4 text-[#E67E22]" /> Coupons & Offers
          </button>

          <button
            onClick={() => setActiveTab("banners")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "banners"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <ImageIcon className="w-4 h-4 text-[#E67E22]" /> Homepage Banners
          </button>

          <button
            onClick={() => setActiveTab("content")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "content"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <BookOpen className="w-4 h-4 text-[#E67E22]" /> Reviews, Blogs & Recipes
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "leads"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <MessageSquare className="w-4 h-4 text-[#E67E22]" /> Inquiries & B2B Leads
          </button>
        </div>

        {/* Tab 1: Sales Reports & Analytics (#16) */}
        {activeTab === "reports" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs uppercase font-extrabold tracking-wider">Gross Revenue</span>
                  <DollarSign className="w-5 h-5 text-[#E67E22]" />
                </div>
                <div className="text-3xl font-extrabold text-[#0E382E]">₹12,480.00</div>
                <p className="text-[11px] text-[#25D366] font-bold">↑ +24.8% vs last month</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs uppercase font-extrabold tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-5 h-5 text-[#E67E22]" />
                </div>
                <div className="text-3xl font-extrabold text-[#0E382E]">38 Orders</div>
                <p className="text-[11px] text-[#74B487] font-bold">Pan-India Dispatched</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs uppercase font-extrabold tracking-wider">Avg Order Value</span>
                  <TrendingUp className="w-5 h-5 text-[#E67E22]" />
                </div>
                <div className="text-3xl font-extrabold text-[#0E382E]">₹328.42</div>
                <p className="text-[11px] text-[#74B487] font-bold">Average 2.4 SKUs per cart</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs uppercase font-extrabold tracking-wider">Top Selling SKU</span>
                  <Package className="w-5 h-5 text-[#E67E22]" />
                </div>
                <div className="text-xl font-extrabold text-[#0E382E]">Paan Digestive Shot</div>
                <p className="text-[11px] text-[#E67E22] font-bold">78% of Total Sales Revenue</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products & Image Management (#1, #11) */}
        {activeTab === "products" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#0E382E]">Product Catalog & Images</h3>
                <p className="text-xs text-[#1F684B]">Create new products, edit pricing, and update image URLs.</p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-dust-orange px-5 py-2.5 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl inline-flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add New Product SKU
              </button>
            </div>

            <div className="border border-[#74B487]/30 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#E8F1E9] text-[#0E382E] font-extrabold">
                  <tr>
                    <th className="p-4">Image & SKU Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Weight / Servings</th>
                    <th className="p-4">Stock Qty</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74B487]/20 text-[#1F684B]">
                  {productsList.map((product) => (
                    <tr key={product.id} className="hover:bg-[#F6F5F0]">
                      <td className="p-4 font-bold text-[#0E382E] flex items-center gap-3">
                        <img
                          src={product.images[0]?.src || ""}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-[#74B487]/40"
                        />
                        <div>
                          <p className="font-extrabold text-[#0E382E]">{product.name}</p>
                          <span className="text-[10px] text-[#74B487] font-mono">{product.id}</span>
                        </div>
                      </td>
                      <td className="p-4 uppercase font-bold text-[10px] text-[#0E382E]">
                        {product.categoryLabel}
                      </td>
                      <td className="p-4 font-extrabold text-[#0E382E]">
                        ₹{product.price}{" "}
                        <span className="line-through text-stone-400 text-[10px]">₹{product.originalPrice}</span>
                      </td>
                      <td className="p-4 font-medium">
                        {product.netWeight} ({product.unitDisplay})
                      </td>
                      <td className="p-4 font-extrabold text-[#0E382E]">{product.stock} units</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            const newPrice = prompt(`Enter new price for ${product.name}:`, product.price.toString());
                            if (newPrice && !isNaN(Number(newPrice))) {
                              handleUpdatePrice(product.id, Number(newPrice));
                            }
                          }}
                          className="px-3 py-1.5 bg-[#0E382E] text-white rounded-lg text-[10px] font-bold hover:bg-[#E67E22]"
                        >
                          Edit Price
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700"
                        >
                          Delete SKU
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Categories & Variants (#2, #3) */}
        {activeTab === "categories" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#0E382E]">Product Categories & Package Variants</h3>
              <p className="text-xs text-[#1F684B]">Organize product classifications and package variant sizes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-[#74B487]/30 p-6 rounded-2xl bg-[#F6F5F0] space-y-3">
                <h4 className="font-extrabold text-[#0E382E]">Active Categories</h4>
                <ul className="space-y-2 text-xs">
                  {categories.map((cat) => (
                    <li key={cat.id} className="bg-white p-3 rounded-xl border border-[#74B487]/30 flex justify-between items-center">
                      <div>
                        <p className="font-extrabold text-[#0E382E]">{cat.name}</p>
                        <span className="text-[10px] text-[#74B487] font-mono">slug: {cat.slug}</span>
                      </div>
                      <span className="bg-[#0E382E] text-[#E67E22] font-bold px-2.5 py-1 rounded-full text-[10px]">
                        {cat.count} SKUs
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-[#74B487]/30 p-6 rounded-2xl bg-[#F6F5F0] space-y-3">
                <h4 className="font-extrabold text-[#0E382E]">Standard Package Variants</h4>
                <ul className="space-y-2 text-xs">
                  <li className="bg-white p-3 rounded-xl border border-[#74B487]/30 flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-[#0E382E]">20g Digestive Pouch</p>
                      <span className="text-[10px] text-[#74B487]">Makes 4 After-Meal Shots</span>
                    </div>
                    <span className="text-xs font-extrabold text-[#0E382E]">₹249</span>
                  </li>

                  <li className="bg-white p-3 rounded-xl border border-[#74B487]/30 flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-[#0E382E]">100g Cooler Pack</p>
                      <span className="text-[10px] text-[#74B487]">Makes 10 Refreshment Drinks</span>
                    </div>
                    <span className="text-xs font-extrabold text-[#0E382E]">₹199</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Price & Stock Control (#4, #5) */}
        {activeTab === "inventory" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#0E382E]">Price & Inventory Control</h3>
              <p className="text-xs text-[#1F684B]">Monitor stock levels and change unit pricing instantly.</p>
            </div>

            <div className="border border-[#74B487]/30 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#E8F1E9] text-[#0E382E] font-extrabold">
                  <tr>
                    <th className="p-4">SKU Product</th>
                    <th className="p-4">Current Price</th>
                    <th className="p-4">Stock Quantity</th>
                    <th className="p-4">Inventory Status</th>
                    <th className="p-4 text-right">Replenish Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74B487]/20 text-[#1F684B]">
                  {productsList.map((prod) => (
                    <tr key={prod.id}>
                      <td className="p-4 font-extrabold text-[#0E382E]">{prod.name}</td>
                      <td className="p-4 font-bold text-[#0E382E]">₹{prod.price}</td>
                      <td className="p-4 font-bold text-[#0E382E]">{prod.stock} units</td>
                      <td className="p-4">
                        {prod.stock > 50 ? (
                          <span className="bg-[#25D366]/20 text-[#0E382E] px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                            In Stock
                          </span>
                        ) : (
                          <span className="bg-[#E67E22]/20 text-[#E67E22] px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                            Low Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            const addQty = prompt(`Add stock quantity for ${prod.name}:`, "50");
                            if (addQty && !isNaN(Number(addQty))) {
                              setProductsList((prev) =>
                                prev.map((p) => (p.id === prod.id ? { ...p, stock: p.stock + Number(addQty) } : p))
                              );
                            }
                          }}
                          className="px-3 py-1.5 bg-[#0E382E] text-white rounded-lg text-[10px] font-bold hover:bg-[#E67E22]"
                        >
                          + Add Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Order Fulfillment Hub (#6) */}
        {activeTab === "orders" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#0E382E]">Order Fulfillment Hub</h3>
              <p className="text-xs text-[#1F684B]">Track order delivery stages and print tax invoices.</p>
            </div>

            <div className="border border-[#74B487]/30 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#E8F1E9] text-[#0E382E] font-extrabold">
                  <tr>
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Order Stage</th>
                    <th className="p-4">Tracking AWB</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74B487]/20 text-[#1F684B]">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="p-4 font-mono font-bold text-[#0E382E]">{order.id}</td>
                      <td className="p-4">
                        <p className="font-extrabold text-[#0E382E]">{order.customer}</p>
                        <p className="text-[10px] text-[#74B487]">{order.email} • {order.phone}</p>
                      </td>
                      <td className="p-4 font-extrabold text-[#0E382E]">₹{order.total}</td>
                      <td className="p-4 font-bold text-[#25D366]">{order.payment}</td>
                      <td className="p-4 font-extrabold text-[#E67E22]">{order.status}</td>
                      <td className="p-4 font-mono text-[11px] text-[#0E382E]">{order.awb}</td>
                      <td className="p-4 text-right space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-[#F6F5F0] border border-[#74B487]/40 rounded-lg p-1.5 text-[11px] font-extrabold text-[#0E382E]"
                        >
                          <option value="Order Received">Order Received</option>
                          <option value="Packed">Packed</option>
                          <option value="Handed to Courier">Handed to Courier</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>

                        <Link
                          to={`/order-confirmation?id=${order.id}`}
                          className="px-2.5 py-1 bg-[#0E382E] text-white rounded-lg text-[10px] font-bold hover:bg-[#E67E22]"
                        >
                          Invoice
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Customer Directory (#7) */}
        {activeTab === "customers" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#0E382E]">Registered Customer Directory</h3>
              <p className="text-xs text-[#1F684B]">Search customer profiles and view purchase history.</p>
            </div>

            <div className="border border-[#74B487]/30 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#E8F1E9] text-[#0E382E] font-extrabold">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Mobile Number</th>
                    <th className="p-4">Orders Placed</th>
                    <th className="p-4">Total Spent</th>
                    <th className="p-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74B487]/20 text-[#1F684B]">
                  {customers.map((cust) => (
                    <tr key={cust.id}>
                      <td className="p-4 font-extrabold text-[#0E382E]">{cust.name}</td>
                      <td className="p-4">{cust.email}</td>
                      <td className="p-4 font-mono">{cust.phone}</td>
                      <td className="p-4 font-bold text-[#0E382E]">{cust.orders} Orders</td>
                      <td className="p-4 font-extrabold text-[#0E382E]">{cust.totalSpent}</td>
                      <td className="p-4 font-medium text-stone-500">{cust.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Coupons & Offers (#8, #9) */}
        {activeTab === "coupons" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-[#0E382E]">Coupons & Promotional Offers</h3>
                <p className="text-xs text-[#1F684B]">Create discount coupon codes and offer campaigns.</p>
              </div>

              <button
                onClick={() => {
                  const code = prompt("Enter new coupon code (e.g. SUMMER20):");
                  if (code) {
                    setCoupons((prev) => [
                      ...prev,
                      { id: Date.now(), code: code.toUpperCase(), type: "Percentage", value: "20% OFF", minOrder: "₹300", status: "Active", expiry: "31 Dec 2026" },
                    ]);
                  }
                }}
                className="btn-dust-orange px-5 py-2.5 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Coupon Code
              </button>
            </div>

            <div className="border border-[#74B487]/30 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#E8F1E9] text-[#0E382E] font-extrabold">
                  <tr>
                    <th className="p-4">Coupon Code</th>
                    <th className="p-4">Discount Value</th>
                    <th className="p-4">Min Order Amount</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74B487]/20 text-[#1F684B]">
                  {coupons.map((cpn) => (
                    <tr key={cpn.id}>
                      <td className="p-4 font-mono font-extrabold text-[#0E382E]">{cpn.code}</td>
                      <td className="p-4 font-bold text-[#E67E22]">{cpn.value}</td>
                      <td className="p-4 font-medium">{cpn.minOrder}</td>
                      <td className="p-4">{cpn.expiry}</td>
                      <td className="p-4">
                        <span className="bg-[#25D366]/20 text-[#0E382E] px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                          {cpn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 8: Homepage Banner Management (#10) */}
        {activeTab === "banners" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#0E382E]">Homepage Hero Slides & Banner Control</h3>
              <p className="text-xs text-[#1F684B]">Update promotional hero banners and call-to-action buttons.</p>
            </div>

            <div className="space-y-4">
              {banners.map((ban) => (
                <div key={ban.id} className="p-6 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/30 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="bg-[#0E382E] text-[#E67E22] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Hero Slide #{ban.id}
                    </span>
                    <h4 className="text-base font-extrabold text-[#0E382E]">{ban.title}</h4>
                    <p className="text-xs text-[#74B487]">{ban.subtitle}</p>
                  </div>
                  <button className="px-4 py-2 bg-[#0E382E] text-white text-xs font-extrabold rounded-xl hover:bg-[#E67E22]">
                    Edit Banner
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 9: Reviews, Blogs & Recipes (#12, #13, #14) */}
        {activeTab === "content" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-8">
            {/* Section 1: Customer Reviews Moderation */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-[#0E382E]">Customer Reviews Moderation</h3>
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/30 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#0E382E]">{rev.author} ({rev.location})</span>
                        <span className="text-[#E67E22] font-bold">5 ★★★★★</span>
                      </div>
                      <p className="text-[#1F684B] italic my-1">"{rev.comment}"</p>
                      <span className="text-[10px] text-[#74B487] font-bold">Product: {rev.product}</span>
                    </div>
                    <span className="bg-[#25D366]/20 text-[#0E382E] text-[10px] font-extrabold px-3 py-1 rounded-full">
                      {rev.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Blog Articles & Recipes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#74B487]/30">
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#0E382E]">Wellness Blogs</h4>
                {blogs.map((b) => (
                  <div key={b.id} className="p-3.5 bg-[#F6F5F0] rounded-xl border border-[#74B487]/30 text-xs flex justify-between items-center">
                    <p className="font-bold text-[#0E382E]">{b.title}</p>
                    <span className="text-[10px] text-[#74B487]">{b.date}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-[#0E382E]">Product Recipes</h4>
                {recipes.map((r) => (
                  <div key={r.id} className="p-3.5 bg-[#F6F5F0] rounded-xl border border-[#74B487]/30 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#0E382E]">{r.title}</p>
                      <span className="text-[10px] text-[#74B487]">{r.product}</span>
                    </div>
                    <span className="bg-[#E67E22] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{r.prep}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 10: Inquiries & B2B Leads (#15) */}
        {activeTab === "leads" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#0E382E]">B2B Distributor & Contact Inquiries</h3>
              <p className="text-xs text-[#1F684B]">Review regional wholesale applications and support messages.</p>
            </div>

            <div className="border border-[#74B487]/30 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#E8F1E9] text-[#0E382E] font-extrabold">
                  <tr>
                    <th className="p-4">Contact & Company</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Target Location</th>
                    <th className="p-4">Channel</th>
                    <th className="p-4">Investment</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74B487]/20 text-[#1F684B]">
                  {distributorLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="p-4">
                        <p className="font-extrabold text-[#0E382E]">{lead.name}</p>
                        <p className="text-[11px] font-bold text-[#E67E22]">{lead.company}</p>
                      </td>
                      <td className="p-4">
                        <p>{lead.email}</p>
                        <p className="font-bold text-[#0E382E]">{lead.phone}</p>
                      </td>
                      <td className="p-4 font-bold text-[#0E382E]">{lead.location}</td>
                      <td className="p-4 font-semibold">{lead.channel}</td>
                      <td className="p-4 font-extrabold text-[#0E382E]">{lead.investment}</td>
                      <td className="p-4">
                        <span className="bg-[#E67E22] text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 space-y-5 border border-[#74B487]/50 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-extrabold text-[#0E382E]">Add New Product SKU</h3>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Paan Digestive Shot Box"
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">Category *</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                  >
                    <option value="wholesome-millets">Wholesome Laddoo Premix</option>
                    <option value="heritage-wellness">Heritage Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">Weight *</label>
                  <input
                    type="text"
                    required
                    value={newProductWeight}
                    onChange={(e) => setNewProductWeight(e.target.value)}
                    placeholder="e.g. 20g"
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">Servings *</label>
                  <input
                    type="text"
                    required
                    value={newProductServings}
                    onChange={(e) => setNewProductServings(e.target.value)}
                    placeholder="e.g. Makes 4 Shots"
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">Image URL / Asset Path *</label>
                <input
                  type="text"
                  required
                  value={newProductImageUrl}
                  onChange={(e) => setNewProductImageUrl(e.target.value)}
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">Description</label>
                <textarea
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  placeholder="Product wellness pitch..."
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold h-20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 bg-stone-200 text-stone-700 py-3 rounded-xl font-bold uppercase"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 btn-dust-orange text-white py-3 rounded-xl font-bold uppercase shadow-md"
                >
                  Save Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
