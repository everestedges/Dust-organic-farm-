import React, { useState, useEffect } from "react";
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
  Video,
  Film,
  Play,
  X,
  ThumbsUp,
  RefreshCw,
  Upload,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { products as initialProducts, companyInfo, Product } from "@/lib/data";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import { useTestimonialsStore, Testimonial } from "@/lib/testimonials-store";
import { useProductsStore } from "@/lib/products-store";
import { useUpcomingBannersStore, UpcomingBanner } from "@/lib/upcoming-banners-store";
import { useTickerStore, DEFAULT_TICKER_ITEMS } from "@/lib/ticker-store";

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, adminLogout, adminUser } = useAdminAuthStore();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  // Active Tab State (16 Client Requirements organized in 12 Control Tabs)
  const [activeTab, setActiveTab] = useState<
    | "reports"
    | "products"
    | "categories"
    | "inventory"
    | "orders"
    | "customers"
    | "coupons"
    | "banners"
    | "upcoming-banners"
    | "reviews"
    | "content"
    | "leads"
  >("reports");

  // State: Upcoming Product Banners Store
  const {
    banners: upcomingBanners,
    fetchBanners: fetchUpcomingBanners,
    createBanner: createUpcomingBanner,
    updateBanner: updateUpcomingBanner,
    deleteBanner: deleteUpcomingBanner,
    isLoading: isLoadingUpcomingBanners,
  } = useUpcomingBannersStore();

  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [editingUpcomingBanner, setEditingUpcomingBanner] = useState<UpcomingBanner | null>(null);
  const [upcomingForm, setUpcomingForm] = useState({
    title: "",
    subtitle: "",
    tagline: "COMING SOON",
    launch_date: "Expected Launch: Q1 2027",
    image_url: "",
    description: "",
    cta_text: "Pre-Order Inquiry",
    cta_link: "/combos",
    display_order: 0,
  });
  const [isUploadingUpcomingImg, setIsUploadingUpcomingImg] = useState(false);
  const [isSavingUpcomingBanner, setIsSavingUpcomingBanner] = useState(false);

  // State: Multicolor Marquee Ticker Bar Store
  const {
    items: tickerItems,
    fetchTicker,
    updateTicker,
    isLoading: isTickerLoading,
  } = useTickerStore();
  const [tickerInput, setTickerInput] = useState("");
  const [isSavingTicker, setIsSavingTicker] = useState(false);
  const [tickerSaveSuccess, setTickerSaveSuccess] = useState(false);

  useEffect(() => {
    fetchTicker();
  }, [fetchTicker]);

  useEffect(() => {
    if (tickerItems && tickerItems.length > 0) {
      setTickerInput(tickerItems.join("\n"));
    }
  }, [tickerItems]);

  const handleSaveTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTicker(true);
    setTickerSaveSuccess(false);
    const cleaned = tickerInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const ok = await updateTicker(cleaned.length > 0 ? cleaned : DEFAULT_TICKER_ITEMS);
    setIsSavingTicker(false);
    if (ok) {
      setTickerSaveSuccess(true);
      setTimeout(() => setTickerSaveSuccess(false), 3000);
    } else {
      alert("Failed to save ticker content to server.");
    }
  };

  // State: Testimonials & Video Stories Store
  const {
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleApproval,
    toggleFeatured,
    resetToDefaults,
  } = useTestimonialsStore();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewTypeFilter, setReviewTypeFilter] = useState<"all" | "video" | "text">("all");
  const [reviewProductFilter, setReviewProductFilter] = useState("all");

  // Form Fields for Testimonial Add/Edit
  const [tName, setTName] = useState("");
  const [tLocation, setTLocation] = useState("");
  const [tProductSlug, setTProductSlug] = useState(
    initialProducts[0]?.slug ?? "shahi-ragi-dry-fruit-laddoo-mix"
  );
  const [tRating, setTRating] = useState(5);
  const [tTitle, setTTitle] = useState("");
  const [tComment, setTComment] = useState("");
  const [tMediaType, setTMediaType] = useState<"video" | "text">("video");
  const [tVideoUrl, setTVideoUrl] = useState("");
  const [tVideoPoster, setTVideoPoster] = useState("");
  const [tVideoDuration, setTVideoDuration] = useState("0:45");
  const [tVerified, setTVerified] = useState(true);
  const [tFeatured, setTFeatured] = useState(true);
  const [tApproved, setTApproved] = useState(true);

  const openNewReviewModal = () => {
    setEditingTestimonial(null);
    setTName("");
    setTLocation("");
    setTProductSlug(initialProducts[0]?.slug ?? "shahi-ragi-dry-fruit-laddoo-mix");
    setTRating(5);
    setTTitle("");
    setTComment("");
    setTMediaType("video");
    setTVideoUrl("");
    setTVideoPoster("");
    setTVideoDuration("0:45");
    setTVerified(true);
    setTFeatured(true);
    setTApproved(true);
    setIsReviewModalOpen(true);
  };

  const openEditReviewModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTName(t.customerName);
    setTLocation(t.location);
    setTProductSlug(t.productSlug);
    setTRating(t.rating);
    setTTitle(t.title);
    setTComment(t.comment);
    setTMediaType(t.mediaType === "video" ? "video" : "text");
    setTVideoUrl(t.videoUrl || "");
    setTVideoPoster(t.videoPoster || "");
    setTVideoDuration(t.videoDuration || "0:45");
    setTVerified(t.verifiedBuyer);
    setTFeatured(t.isFeatured);
    setTApproved(t.isApproved);
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tComment.trim()) return;

    const matchedProd = initialProducts.find((p) => p.slug === tProductSlug);
    const prodName = matchedProd ? matchedProd.name : "DUST Superfoods";
    const defaultPoster = matchedProd?.storyImage ?? "";

    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, {
        customerName: tName.trim(),
        location: tLocation.trim(),
        productSlug: tProductSlug,
        productName: prodName,
        rating: tRating,
        title: tTitle.trim(),
        comment: tComment.trim(),
        mediaType: tMediaType,
        videoUrl: tMediaType === "video" ? tVideoUrl.trim() : undefined,
        videoPoster: tMediaType === "video" ? (tVideoPoster.trim() || defaultPoster) : undefined,
        videoDuration: tMediaType === "video" ? tVideoDuration.trim() : undefined,
        verifiedBuyer: tVerified,
        isFeatured: tFeatured,
        isApproved: tApproved,
      });
    } else {
      addTestimonial({
        customerName: tName.trim(),
        location: tLocation.trim(),
        productSlug: tProductSlug,
        productName: prodName,
        rating: tRating,
        title: tTitle.trim(),
        comment: tComment.trim(),
        mediaType: tMediaType,
        videoUrl: tMediaType === "video" ? tVideoUrl.trim() : undefined,
        videoPoster: tMediaType === "video" ? (tVideoPoster.trim() || defaultPoster) : undefined,
        videoDuration: tMediaType === "video" ? tVideoDuration.trim() : undefined,
        verifiedBuyer: tVerified,
        isFeatured: tFeatured,
        isApproved: tApproved,
      });
    }
    setIsReviewModalOpen(false);
  };

  // State 1: Products & Image Management via Live Database Store
  const {
    products: productsList,
    addProduct,
    updateProduct,
    updateProductPrice,
    updateProductStock,
    deleteProduct,
    fetchProducts: fetchStoreProducts,
  } = useProductsStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productModalTab, setProductModalTab] = useState<"basic" | "media" | "nutrition" | "ritual">("basic");

  // Inline Stock Management States
  const [stockInputs, setStockInputs] = useState<{ [id: string]: number }>({});
  const [savingStockId, setSavingStockId] = useState<string | null>(null);
  const [savedStockId, setSavedStockId] = useState<string | null>(null);

  const handleStockUpdate = async (productId: string, newStock: number) => {
    setSavingStockId(productId);
    const sanitized = Math.max(0, Number(newStock) || 0);
    const success = await updateProductStock(productId, sanitized);
    setSavingStockId(null);
    if (success) {
      setSavedStockId(productId);
      setTimeout(() => setSavedStockId(null), 2000);
    }
  };

  // Tab 1: Basic & Pricing
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState<"wholesome-millets" | "heritage-wellness" | "pure-fruit-powders" | "pure-nut-powders" | "herbal-haircare">("heritage-wellness");
  const [newProductPrice, setNewProductPrice] = useState(299);
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState(349);
  const [newProductWeight, setNewProductWeight] = useState("200g");
  const [newProductServings, setNewProductServings] = useState("Makes 20 Servings");
  const [newProductStock, setNewProductStock] = useState(150);
  const [newProductSubtitle, setNewProductSubtitle] = useState("");
  const [newProductPitch, setNewProductPitch] = useState("");

  // Tab 2: Visuals & Badges
  const [newProductImageUrl, setNewProductImageUrl] = useState("");
  const [newProductGalleryUrls, setNewProductGalleryUrls] = useState("");
  const [newProductBadges, setNewProductBadges] = useState("100% NATURAL, SPRAY-DRIED, ZERO CHEMICALS");
  const [newProductAccent, setNewProductAccent] = useState<"rose" | "emerald" | "amber">("rose");
  const [isUploadingMainImg, setIsUploadingMainImg] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Tab 3: Description, Ingredients & Safety
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductClaims, setNewProductClaims] = useState("100% Pure & Natural, Zero Added Sugar, Fast Absorption");
  const [newProductIngredients, setNewProductIngredients] = useState("");
  const [newProductAllergen, setNewProductAllergen] = useState("Contains no common allergens. 100% vegetarian.");
  const [newProductStorage, setNewProductStorage] = useState("Store in a cool dry place away from direct sunlight.");

  // Tab 4: Nutritional Facts
  const [newProductNutritionServing, setNewProductNutritionServing] = useState("Serving Size: 1 Sachet (5g)");
  const [newProductNutritionNote, setNewProductNutritionNote] = useState("Approximate values based on 2000 kcal diet");
  const [newProductEnergy, setNewProductEnergy] = useState("45 kcal");
  const [newProductProtein, setNewProductProtein] = useState("1.2g");
  const [newProductCarbs, setNewProductCarbs] = useState("9.4g");
  const [newProductFiber, setNewProductFiber] = useState("1.8g");
  const [newProductFat, setNewProductFat] = useState("0.2g");

  // Tab 5: Preparation Ritual & Heritage Story
  const [newProductRitualLabel, setNewProductRitualLabel] = useState("Preparation Ritual");
  const [newProductStep1Title, setNewProductStep1Title] = useState("Pour & Measure");
  const [newProductStep1Detail, setNewProductStep1Detail] = useState("Empty 1 sachet or 1 teaspoon into a glass or bowl.");
  const [newProductStep2Title, setNewProductStep2Title] = useState("Blend Smoothly");
  const [newProductStep2Detail, setNewProductStep2Detail] = useState("Add 60–100ml chilled water or milk and stir for 5 seconds.");
  const [newProductStep3Title, setNewProductStep3Title] = useState("Savor Natural Nutrition");
  const [newProductStep3Detail, setNewProductStep3Detail] = useState("Enjoy immediate digestive refreshment and natural energy.");
  const [newProductHeritageTitle, setNewProductHeritageTitle] = useState("Indian Heritage Wisdom");
  const [newProductHeritageQuote, setNewProductHeritageQuote] = useState("Inspired by time-tested Indian wellness traditions.");

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
  const [customers, setCustomers] = useState<any[]>([]);

  // State 8: Customer Orders
  const [orders, setOrders] = useState<any[]>([]);

  // State 9: Distributor Leads
  const [distributorLeads, setDistributorLeads] = useState<any[]>([]);

  const [isLoadingLive, setIsLoadingLive] = useState(false);

  const API_BASE =
    typeof window !== "undefined" && window.location.hostname !== "localhost"
      ? "/api"
      : "http://localhost:5000/api";

  const fetchLiveDatabaseData = async () => {
    setIsLoadingLive(true);
    try {
      // 1. Fetch live orders
      const ordersRes = await fetch(`${API_BASE}/orders`, { cache: "no-store" });
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(
            data.orders.map((o: any) => ({
              id: o.order_reference || `DST-${o.id}`,
              customer: o.customer_name || "Valued Customer",
              email: o.customer_email || "N/A",
              phone: o.customer_phone || "N/A",
              total: Number(o.total_amount) || 0,
              payment: `${o.payment_status || "PAID"} (${o.payment_method || "UPI"})`,
              status: o.order_status || "Pending",
              items: o.items_summary || "1x DUST Blend",
              awb: o.tracking_awb || "Pending Dispatch",
              date: o.created_at
                ? new Date(o.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Today",
            }))
          );
        }
      }

      // 2. Fetch live registered customers
      const usersRes = await fetch(`${API_BASE}/users`, { cache: "no-store" });
      if (usersRes.ok) {
        const data = await usersRes.json();
        if (data.success && Array.isArray(data.users)) {
          setCustomers(
            data.users.map((u: any) => ({
              id: u.id,
              name: u.full_name || "Registered User",
              email: u.email,
              phone: u.phone || "N/A",
              orders: u.orders_count || 0,
              totalSpent: `₹${Number(u.total_spent || 0).toLocaleString("en-IN")}`,
              date: u.created_at
                ? new Date(u.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent",
            }))
          );
        }
      }

      // 3. Fetch distributor leads
      const leadsRes = await fetch(`${API_BASE}/distributor-leads`, { cache: "no-store" });
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        if (data.success && Array.isArray(data.leads)) {
          setDistributorLeads(
            data.leads.map((l: any) => ({
              id: l.id,
              name: l.contact_name,
              company: l.company_name,
              phone: l.phone,
              email: l.email,
              location: l.city_state,
              channel: l.channel,
              investment: l.investment_capacity,
              message: l.message || "",
              status: "New",
              date: l.created_at
                ? new Date(l.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent",
            }))
          );
        }
      }

      // 4. Fetch live products from MySQL
      fetchStoreProducts();

      // 5. Fetch upcoming banners from MySQL
      fetchUpcomingBanners(true);
    } catch (err) {
      console.warn("Could not load live database records:", err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveDatabaseData();
  }, []);

  // Image Upload Helpers (Upload directly from laptop / mobile device)
  const uploadImageFile = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch(`${API_BASE}/upload-image`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Data, filename: file.name }),
          });
          const data = await res.json();
          if (data.success && data.url) {
            resolve(data.url);
          } else {
            alert(`Upload failed: ${data.error || "Unknown server error"}`);
            resolve(null);
          }
        } catch (err: any) {
          alert(`Image upload error: ${err.message}`);
          resolve(null);
        }
      };
      reader.onerror = () => {
        alert("Failed to read image from device.");
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMainImg(true);
    const uploadedUrl = await uploadImageFile(file);
    setIsUploadingMainImg(false);
    if (uploadedUrl) {
      setNewProductImageUrl(uploadedUrl);
    }
    e.target.value = "";
  };

  // Upcoming Product Banners Modal & CRUD handlers
  const openNewUpcomingBannerModal = () => {
    setEditingUpcomingBanner(null);
    setUpcomingForm({
      title: "",
      subtitle: "",
      tagline: "COMING SOON • IN THE PIPELINE",
      launch_date: "Expected Launch: Q1 2027",
      image_url: "",
      description: "",
      cta_text: "Pre-Order Inquiry",
      cta_link: "/combos",
      display_order: upcomingBanners.length + 1,
    });
    setIsUpcomingModalOpen(true);
  };

  const openEditUpcomingBannerModal = (banner: UpcomingBanner) => {
    setEditingUpcomingBanner(banner);
    setUpcomingForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      tagline: banner.tagline || "COMING SOON • IN THE PIPELINE",
      launch_date: banner.launch_date || "",
      image_url: banner.image_url || "",
      description: banner.description || "",
      cta_text: banner.cta_text || "Pre-Order Inquiry",
      cta_link: banner.cta_link || "/combos",
      display_order: banner.display_order ?? 0,
    });
    setIsUpcomingModalOpen(true);
  };

  const handleSaveUpcomingBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upcomingForm.title.trim()) {
      alert("Please enter a title for the upcoming product banner.");
      return;
    }
    if (!upcomingForm.image_url.trim()) {
      alert("Please upload or provide an image for the banner.");
      return;
    }
    setIsSavingUpcomingBanner(true);
    try {
      if (editingUpcomingBanner) {
        const ok = await updateUpcomingBanner(editingUpcomingBanner.id, upcomingForm);
        if (ok) {
          setIsUpcomingModalOpen(false);
        } else {
          alert("Failed to update banner. Please check the server connection.");
        }
      } else {
        const ok = await createUpcomingBanner({
          ...upcomingForm,
          is_active: 1,
        });
        if (ok) {
          setIsUpcomingModalOpen(false);
        } else {
          alert("Failed to create banner. Please check the server connection.");
        }
      }
    } finally {
      setIsSavingUpcomingBanner(false);
    }
  };

  const handleDeleteUpcomingBanner = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this upcoming product banner?")) {
      await deleteUpcomingBanner(id);
    }
  };

  const handleUpcomingImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingUpcomingImg(true);
    const uploadedUrl = await uploadImageFile(file);
    setIsUploadingUpcomingImg(false);
    if (uploadedUrl) {
      setUpcomingForm((prev) => ({ ...prev, image_url: uploadedUrl }));
    }
    e.target.value = "";
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const url = await uploadImageFile(file);
        if (url) uploadedUrls.push(url);
      }
    }
    setIsUploadingGallery(false);
    if (uploadedUrls.length > 0) {
      setNewProductGalleryUrls((prev) => {
        const existing = prev.trim();
        return existing ? `${existing}\n${uploadedUrls.join("\n")}` : uploadedUrls.join("\n");
      });
    }
    e.target.value = "";
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductModalTab("basic");
    setNewProductName("");
    setNewProductCategory("heritage-wellness");
    setNewProductPrice(299);
    setNewProductOriginalPrice(349);
    setNewProductWeight("200g");
    setNewProductServings("Makes 20 Servings");
    setNewProductStock(150);
    setNewProductSubtitle("");
    setNewProductPitch("");
    setNewProductImageUrl("");
    setNewProductGalleryUrls("");
    setNewProductBadges("100% NATURAL, SPRAY-DRIED, ZERO CHEMICALS");
    setNewProductAccent("rose");
    setNewProductDescription("");
    setNewProductClaims("100% Pure & Natural, Zero Added Sugar, Fast Absorption");
    setNewProductIngredients("");
    setNewProductAllergen("Contains no common allergens. 100% vegetarian.");
    setNewProductStorage("Store in a cool dry place away from direct sunlight.");
    setNewProductNutritionServing("Serving Size: 1 Sachet (5g)");
    setNewProductNutritionNote("Approximate values based on 2000 kcal diet");
    setNewProductEnergy("45 kcal");
    setNewProductProtein("1.2g");
    setNewProductCarbs("9.4g");
    setNewProductFiber("1.8g");
    setNewProductFat("0.2g");
    setNewProductRitualLabel("Preparation Ritual");
    setNewProductStep1Title("Pour & Measure");
    setNewProductStep1Detail("Empty 1 sachet or 1 teaspoon into a glass or bowl.");
    setNewProductStep2Title("Blend Smoothly");
    setNewProductStep2Detail("Add 60–100ml chilled water or milk and stir for 5 seconds.");
    setNewProductStep3Title("Savor Natural Nutrition");
    setNewProductStep3Detail("Enjoy immediate digestive refreshment and natural energy.");
    setNewProductHeritageTitle("Indian Heritage Wisdom");
    setNewProductHeritageQuote("Inspired by time-tested Indian wellness traditions.");
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setProductModalTab("basic");
    setNewProductName(prod.name || "");
    setNewProductCategory(prod.category || "heritage-wellness");
    setNewProductPrice(prod.price || 0);
    setNewProductOriginalPrice(prod.originalPrice || 0);
    setNewProductWeight(prod.netWeight || "200g");
    setNewProductServings(prod.unitDisplay || "");
    setNewProductStock(prod.stock || 100);
    const initialSubtitle = prod.subtitle || prod.pitch || "";
    setNewProductSubtitle(initialSubtitle);
    setNewProductPitch(initialSubtitle);
    setNewProductImageUrl(prod.images?.[0]?.src || prod.storyImage || "");
    setNewProductGalleryUrls(
      prod.images && prod.images.length > 1
        ? prod.images.slice(1).map((i) => i.src).join("\n")
        : ""
    );
    setNewProductBadges(Array.isArray(prod.badges) ? prod.badges.join(", ") : "");
    setNewProductAccent(prod.accent || "rose");
    setNewProductDescription(
      Array.isArray(prod.description) ? prod.description.join("\n\n") : (prod.description || "")
    );
    setNewProductClaims(Array.isArray(prod.claims) ? prod.claims.join(", ") : "");
    setNewProductIngredients(prod.ingredients || "");
    setNewProductAllergen(prod.allergen || "");
    setNewProductStorage(prod.storage || "");
    setNewProductNutritionServing(prod.nutrition?.serving || "");
    setNewProductNutritionNote(prod.nutrition?.note || "");

    const rows = prod.nutrition?.rows || [];
    const energyRow = rows.find((r) => r[0]?.toLowerCase().includes("energy"));
    const proteinRow = rows.find((r) => r[0]?.toLowerCase().includes("protein"));
    const carbsRow = rows.find((r) => r[0]?.toLowerCase().includes("carb"));
    const fiberRow = rows.find((r) => r[0]?.toLowerCase().includes("fiber") || r[0]?.toLowerCase().includes("fibre"));
    const fatRow = rows.find((r) => r[0]?.toLowerCase().includes("fat"));

    setNewProductEnergy(energyRow ? energyRow[1] : "45 kcal");
    setNewProductProtein(proteinRow ? proteinRow[1] : "1.2g");
    setNewProductCarbs(carbsRow ? carbsRow[1] : "9.4g");
    setNewProductFiber(fiberRow ? fiberRow[1] : "1.8g");
    setNewProductFat(fatRow ? fatRow[1] : "0.2g");

    setNewProductRitualLabel(prod.ritualLabel || "Preparation Ritual");
    setNewProductStep1Title(prod.ritual?.[0]?.title || "Pour & Measure");
    setNewProductStep1Detail(prod.ritual?.[0]?.detail || "");
    setNewProductStep2Title(prod.ritual?.[1]?.title || "Blend Smoothly");
    setNewProductStep2Detail(prod.ritual?.[1]?.detail || "");
    setNewProductStep3Title(prod.ritual?.[2]?.title || "Savor Natural Nutrition");
    setNewProductStep3Detail(prod.ritual?.[2]?.detail || "");
    setNewProductHeritageTitle(prod.heritageTitle || "Indian Heritage Wisdom");
    setNewProductHeritageQuote(prod.heritageQuote || "");
    setIsAddModalOpen(true);
  };

  // Actions
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      alert("Please enter a product title.");
      return;
    }

    const slug = newProductName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const categoryLabels: Record<string, string> = {
      "wholesome-millets": "Wholesome Laddoo Premix",
      "heritage-wellness": "Heritage Wellness",
      "pure-fruit-powders": "Pure Fruit Powders",
      "pure-nut-powders": "Pure Nut Powders",
      "herbal-haircare": "Herbal Haircare",
    };

    // Parse gallery URLs
    const galleryList = newProductGalleryUrls
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0)
      .map((u) => ({ src: u, alt: newProductName }));

    const mainImg = newProductImageUrl.trim() || "/logo.png";
    const allImages = [{ src: mainImg, alt: newProductName }, ...galleryList];

    // Parse Badges
    const badgesArray = newProductBadges
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    // Parse Claims
    const claimsArray = newProductClaims
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    // Parse Description paragraphs
    const descriptionParagraphs = newProductDescription
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const cleanSubtitle = newProductSubtitle.trim() || newProductPitch.trim() || newProductServings;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug,
      name: newProductName.trim(),
      shortName: newProductName.trim(),
      subtitle: cleanSubtitle,
      pitch: cleanSubtitle || "100% Pure Natural Indian Formulation.",
      category: newProductCategory,
      categoryLabel: categoryLabels[newProductCategory] || "Heritage Wellness",
      price: Number(newProductPrice),
      priceDisplay: `₹${newProductPrice}`,
      unitDisplay: newProductServings,
      netWeight: newProductWeight,
      badges: badgesArray.length > 0 ? badgesArray : ["100% NATURAL"],
      description:
        descriptionParagraphs.length > 0
          ? descriptionParagraphs
          : [newProductDescription.trim() || "Handcrafted pure natural wellness formulation."],
      ingredients: newProductIngredients.trim() || "100% Pure Natural Ingredients",
      storage: newProductStorage.trim() || "Store in a cool dry place away from direct sunlight.",
      nutrition: {
        serving: newProductNutritionServing.trim(),
        note: newProductNutritionNote.trim(),
        rows: [
          ["Energy", newProductEnergy, "19%"],
          ["Protein", newProductProtein, "24%"],
          ["Carbohydrates", newProductCarbs, "22%"],
          ["Dietary Fiber", newProductFiber, "28%"],
          ["Total Fat", newProductFat, "6%"],
        ],
      },
      claims: claimsArray.length > 0 ? claimsArray : ["100% Natural", "Zero Preservatives", "Pure Heritage"],
      ritual: [
        { title: newProductStep1Title, detail: newProductStep1Detail },
        { title: newProductStep2Title, detail: newProductStep2Detail },
        { title: newProductStep3Title, detail: newProductStep3Detail },
      ],
      ritualLabel: newProductRitualLabel || "Preparation & Usage Ritual",
      heritageTitle: newProductHeritageTitle || "Traditional Indian Wellness",
      heritageQuote: newProductHeritageQuote || "Inspired by time-tested Indian wellness recipes.",
      images: allImages,
      storyImage: mainImg,
      accent: newProductAccent,
      stock: Number(newProductStock) || 100,
      sku: `DUST-${slug.toUpperCase()}`,
      fssai: "FSSAI Lic. No. 11522036000722",
      featured: true,
      newArrival: true,
      bestSeller: false,
      ...(newProductOriginalPrice
        ? {
            originalPrice: Number(newProductOriginalPrice),
            originalPriceDisplay: `₹${newProductOriginalPrice}`,
          }
        : {}),
      ...(newProductAllergen.trim()
        ? { allergen: newProductAllergen.trim() }
        : {}),
    };

    if (editingProduct) {
      const updatedProd: Product = {
        ...editingProduct,
        ...newProd,
        id: editingProduct.id,
        slug: editingProduct.slug,
      };
      const ok = await updateProduct(updatedProd);
      if (ok) {
        setIsAddModalOpen(false);
        setEditingProduct(null);
        alert(`✅ Product "${newProductName}" updated successfully!\n\nAll changes are now live across the storefront and database.`);
      } else {
        alert(`❌ Failed to update product in database. Please try again.`);
      }
      return;
    }

    await addProduct(newProd);
    setIsAddModalOpen(false);
    setNewProductName("");
    setNewProductImageUrl("");
    setNewProductDescription("");
    alert(`✅ Product "${newProductName}" created successfully!\n\nLive Details Page is now available at /product/${slug}`);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"? This will permanently remove it from the store and database.`)) {
      await deleteProduct(product.id, product.slug, product.name);
    }
  };

  const handleUpdatePrice = async (id: string, newPrice: number) => {
    await updateProductPrice(id, newPrice);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn("Could not sync order status with backend DB:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete order ${orderId}? This cannot be undone.`)) {
      return;
    }
    // Optimistic removal from UI
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Failed to delete order: " + (data.error || "Unknown error"));
        fetchLiveDatabaseData();
      }
    } catch (err: any) {
      alert("Error deleting order: " + err.message);
      fetchLiveDatabaseData();
    }
  };

  // Dynamic metrics computed from live database orders
  const grossRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? grossRevenue / totalOrdersCount : 0;

  // Compute Top Selling SKU dynamically from live order items
  const skuCounts: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.items) {
      const parts = String(o.items).split(",");
      parts.forEach((p) => {
        const trimmed = p.trim();
        const match = trimmed.match(/^(\d+)x\s*(.*)$/);
        if (match && match[1] && match[2]) {
          const qty = parseInt(match[1], 10) || 1;
          const skuName = match[2].trim();
          skuCounts[skuName] = (skuCounts[skuName] || 0) + qty;
        } else if (trimmed) {
          skuCounts[trimmed] = (skuCounts[trimmed] || 0) + 1;
        }
      });
    }
  });

  let topSellingSku = "No orders yet";
  let topSellingSubtext = "Awaiting customer orders";
  const sortedSkus = Object.entries(skuCounts).sort((a, b) => b[1] - a[1]);
  const topSkuItem = sortedSkus[0];
  if (topSkuItem) {
    topSellingSku = topSkuItem[0];
    const totalUnits = Object.values(skuCounts).reduce((a, b) => a + b, 0);
    const pct = totalUnits > 0 ? Math.round((topSkuItem[1] / totalUnits) * 100) : 100;
    topSellingSubtext = `${topSkuItem[1]} unit${topSkuItem[1] === 1 ? "" : "s"} sold (${pct}% of volume)`;
  }

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
            <button
              onClick={fetchLiveDatabaseData}
              disabled={isLoadingLive}
              className="bg-[#1F684B] hover:bg-[#165039] text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#E67E22] ${isLoadingLive ? "animate-spin" : ""}`} />
              {isLoadingLive ? "Refreshing..." : "Refresh Live Data"}
            </button>
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
            onClick={() => setActiveTab("upcoming-banners")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "upcoming-banners"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <Sparkles className="w-4 h-4 text-[#E67E22]" /> Upcoming Banners
            {upcomingBanners.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-[#E67E22] text-white">
                {upcomingBanners.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all ${activeTab === "reviews"
              ? "bg-[#0E382E] text-white shadow-md"
              : "bg-white text-[#0E382E] hover:bg-[#E8F1E9]"
              }`}
          >
            <Video className="w-4 h-4 text-[#E67E22]" /> Customer Videos & Reviews
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
            {distributorLeads.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-[#E67E22] text-white">
                {distributorLeads.length}
              </span>
            )}
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
                <div className="text-3xl font-extrabold text-[#0E382E]">
                  ₹{grossRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className={`text-[11px] font-bold ${totalOrdersCount > 0 ? "text-[#25D366]" : "text-stone-400"}`}>
                  {totalOrdersCount > 0 ? "↑ Live synced from orders" : "Real-time from live checkout"}
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs uppercase font-extrabold tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-5 h-5 text-[#E67E22]" />
                </div>
                <div className="text-3xl font-extrabold text-[#0E382E]">
                  {totalOrdersCount} {totalOrdersCount === 1 ? "Order" : "Orders"}
                </div>
                <p className="text-[11px] text-[#74B487] font-bold">
                  {totalOrdersCount > 0 ? "Pan-India Dispatched / Active" : "No orders placed yet"}
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs uppercase font-extrabold tracking-wider">Avg Order Value</span>
                  <TrendingUp className="w-5 h-5 text-[#E67E22]" />
                </div>
                <div className="text-3xl font-extrabold text-[#0E382E]">
                  ₹{avgOrderValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-[#74B487] font-bold">
                  {totalOrdersCount > 0 ? `Based on ${totalOrdersCount} live order${totalOrdersCount === 1 ? "" : "s"}` : "Calculated per placed order"}
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs uppercase font-extrabold tracking-wider">Top Selling SKU</span>
                  <Package className="w-5 h-5 text-[#E67E22]" />
                </div>
                <div className="text-xl font-extrabold text-[#0E382E] truncate">
                  {topSellingSku}
                </div>
                <p className="text-[11px] text-[#E67E22] font-bold">
                  {topSellingSubtext}
                </p>
              </div>
            </div>

            {totalOrdersCount === 0 && (
              <div className="bg-white p-8 rounded-3xl border border-[#74B487]/30 text-center space-y-3">
                <div className="w-12 h-12 bg-[#E8F1E9] text-[#0E382E] rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                  🛒
                </div>
                <h4 className="text-base font-extrabold text-[#0E382E]">Awaiting Your First Order</h4>
                <p className="text-xs text-[#1F684B] max-w-md mx-auto">
                  All dummy revenue and fake order metrics have been removed. As soon as a customer places an order on your store, real-time revenue, order totals, and top-selling SKUs will automatically update here from your live MySQL database.
                </p>
              </div>
            )}
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
                onClick={handleOpenAddModal}
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
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          to={`/product/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-[#E8F1E9] text-[#0E382E] border border-[#74B487]/50 rounded-lg text-[10px] font-bold hover:bg-[#74B487]/30 inline-flex items-center gap-1 transition-colors"
                        >
                          View Live <ArrowUpRight className="w-3 h-3 text-[#E67E22]" />
                        </Link>

                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="px-3 py-1.5 bg-[#0E382E] text-white rounded-lg text-[10px] font-bold hover:bg-[#E67E22] inline-flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Product
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product)}
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#0E382E]">Price & Inventory Control</h3>
                <p className="text-xs text-[#1F684B]">
                  Directly adjust stock counts and reflect real-time availability on the website instantly.
                </p>
              </div>
              <button
                onClick={() => fetchStoreProducts()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#74B487]/40 text-xs font-bold text-[#0E382E] hover:bg-[#E8F1E9] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Inventory
              </button>
            </div>

            <div className="border border-[#74B487]/30 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#E8F1E9] text-[#0E382E] font-extrabold">
                  <tr>
                    <th className="p-4">SKU Product</th>
                    <th className="p-4">Current Price</th>
                    <th className="p-4">Stock Quantity</th>
                    <th className="p-4">Inventory Status</th>
                    <th className="p-4 text-right">Stock Controls & Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74B487]/20 text-[#1F684B]">
                  {productsList.map((prod) => {
                    const currentInput: number =
                      typeof stockInputs[prod.id] === "number"
                        ? (stockInputs[prod.id] as number)
                        : Number(prod.stock ?? 100);
                    const isSaving = savingStockId === prod.id;
                    const isSaved = savedStockId === prod.id;
                    const isOutOfStock = (prod.stock ?? 0) <= 0;
                    const isLowStock = (prod.stock ?? 0) > 0 && (prod.stock ?? 0) <= 15;

                    return (
                      <tr
                        key={prod.id}
                        className="hover:bg-[#F6F5F0]/60 transition-colors"
                      >
                        <td className="p-4 font-extrabold text-[#0E382E]">
                          <p className="text-sm font-black">{prod.name}</p>
                          <span className="text-[10px] font-bold text-stone-500 uppercase">
                            {prod.categoryLabel || prod.category} • {prod.sku || `SKU-${prod.slug}`}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[#0E382E]">
                          <span className="text-sm font-extrabold">
                            ₹{prod.price}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-[11px] text-stone-400 line-through ml-1.5 font-medium">
                              ₹{prod.originalPrice}
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-[#0E382E]">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={currentInput}
                              onChange={(e) => {
                                const val = Math.max(
                                  0,
                                  parseInt(e.target.value) || 0
                                );
                                setStockInputs((prev) => ({
                                  ...prev,
                                  [prod.id]: val,
                                }));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleStockUpdate(prod.id, currentInput);
                                }
                              }}
                              className="w-20 px-3 py-1.5 bg-[#F6F5F0] border border-[#74B487]/50 rounded-xl text-center font-black text-sm text-[#0E382E] outline-none focus:border-[#E67E22] focus:ring-1 focus:ring-[#E67E22]"
                            />
                            <span className="text-[11px] font-bold text-stone-500">
                              units
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {isOutOfStock ? (
                            <span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1.5 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />{" "}
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="bg-[#E67E22]/15 text-[#E67E22] border border-[#E67E22]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1.5 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />{" "}
                              Low Stock ({prod.stock})
                            </span>
                          ) : (
                            <span className="bg-[#25D366]/20 text-[#0E382E] border border-[#25D366]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1.5 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />{" "}
                              In Stock ({prod.stock})
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            <button
                              onClick={() =>
                                handleStockUpdate(prod.id, currentInput)
                              }
                              disabled={isSaving}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                                isSaved
                                  ? "bg-[#25D366] text-white"
                                  : "bg-[#0E382E] text-white hover:bg-[#1F684B]"
                              }`}
                            >
                              {isSaving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : isSaved ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                                </>
                              ) : (
                                <>
                                  <Save className="w-3.5 h-3.5" /> Update
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                setStockInputs((prev) => ({
                                  ...prev,
                                  [prod.id]: 0,
                                }));
                                handleStockUpdate(prod.id, 0);
                              }}
                              className="px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-[10px] font-extrabold uppercase transition-colors cursor-pointer"
                              title="Set Stock to 0 (Mark Out of Stock)"
                            >
                              Set 0 (Out)
                            </button>

                            <button
                              onClick={() => {
                                const nextVal = (prod.stock || 0) + 25;
                                setStockInputs((prev) => ({
                                  ...prev,
                                  [prod.id]: nextVal,
                                }));
                                handleStockUpdate(prod.id, nextVal);
                              }}
                              className="px-2.5 py-1.5 bg-[#E8F1E9] text-[#0E382E] hover:bg-[#74B487]/30 border border-[#74B487]/40 rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer"
                            >
                              +25
                            </button>

                            <button
                              onClick={() => {
                                const nextVal = (prod.stock || 0) + 50;
                                setStockInputs((prev) => ({
                                  ...prev,
                                  [prod.id]: nextVal,
                                }));
                                handleStockUpdate(prod.id, nextVal);
                              }}
                              className="px-2.5 py-1.5 bg-[#E8F1E9] text-[#0E382E] hover:bg-[#74B487]/30 border border-[#74B487]/40 rounded-xl text-[10px] font-extrabold transition-colors cursor-pointer"
                            >
                              +50
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-500 font-medium italic">
                        No orders in the database yet. When customers complete checkout, their orders will appear here automatically.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="p-4 font-mono font-bold text-[#0E382E] whitespace-nowrap">
                          {order.id}
                          <span className="block text-[10px] text-stone-500 font-sans font-normal">{order.date}</span>
                        </td>
                        <td className="p-4">
                          <p className="font-extrabold text-[#0E382E]">{order.customer}</p>
                          <p className="text-[11px] text-[#1F684B] font-mono">{order.phone}</p>
                          <p className="text-[10px] text-[#74B487]">{order.email}</p>
                          {order.items && (
                            <p className="text-[10px] text-[#E67E22] font-semibold mt-1">🛒 {order.items}</p>
                          )}
                        </td>
                        <td className="p-4 font-extrabold text-[#0E382E] whitespace-nowrap">₹{order.total}</td>
                        <td className="p-4 font-bold text-[#25D366] whitespace-nowrap">{order.payment}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : order.status === "Shipped" || order.status === "Handed to Courier" || order.status === "Out for Delivery"
                              ? "bg-purple-100 text-purple-800 border border-purple-300"
                              : order.status === "Processing" || order.status === "Packed"
                              ? "bg-blue-100 text-blue-800 border border-blue-300"
                              : order.status === "Cancelled"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-[#0E382E]">{order.awb}</td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-[#F6F5F0] border border-[#74B487]/40 rounded-lg p-1.5 text-[11px] font-extrabold text-[#0E382E] shadow-2xs"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <Link
                            to={`/order-confirmation?id=${order.id}`}
                            className="px-2.5 py-1.5 bg-[#0E382E] text-white rounded-lg text-[10px] font-bold hover:bg-[#E67E22] transition-colors"
                          >
                            Invoice
                          </Link>

                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Delete Order"
                            className="px-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
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
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500 font-medium italic">
                        No registered customers found in the database. When new users register, they will appear here automatically.
                      </td>
                    </tr>
                  ) : (
                    customers.map((cust) => (
                      <tr key={cust.id}>
                        <td className="p-4 font-extrabold text-[#0E382E]">{cust.name}</td>
                        <td className="p-4">{cust.email}</td>
                        <td className="p-4 font-mono">{cust.phone}</td>
                        <td className="p-4 font-bold text-[#0E382E]">{cust.orders} Orders</td>
                        <td className="p-4 font-extrabold text-[#0E382E]">{cust.totalSpent}</td>
                        <td className="p-4 font-medium text-stone-500">{cust.date}</td>
                      </tr>
                    ))
                  )}
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
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-8">
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

            {/* Multicolor Marquee Ticker Bar Section */}
            <div className="pt-8 border-t border-[#74B487]/30 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E67E22]/15 text-[#E67E22] text-[11px] font-black uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Multicolor Scrolling Strip
                  </span>
                  <h4 className="text-lg font-black text-[#0E382E]">
                    Homepage Multicolor Announcement Ticker
                  </h4>
                  <p className="text-xs text-[#1F684B]">
                    Controls the scrolling banner with your 5 custom gradient colors (#cee4b7, #f1d990, #fab683, #bc6660, #bee9c8) directly below the Hero section.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setTickerInput(DEFAULT_TICKER_ITEMS.join("\n"))}
                  className="px-3 py-1.5 border border-[#74B487]/40 text-[#0E382E] hover:bg-[#E8F1E9] text-xs font-bold rounded-xl transition-colors"
                >
                  Load Default Phrases
                </button>
              </div>

              {/* Live Preview Box */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Live Banner Gradient Preview:
                </span>
                <div
                  style={{
                    background:
                      "linear-gradient(90deg, #cee4b7 0%, #f1d990 25%, #fab683 50%, #bc6660 75%, #bee9c8 100%)",
                  }}
                  className="p-3.5 rounded-xl border border-[#bc6660]/40 overflow-hidden shadow-xs"
                >
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-wider text-[#0E382E] whitespace-nowrap overflow-x-auto py-0.5">
                    {(tickerInput ? tickerInput.split("\n").filter(Boolean) : DEFAULT_TICKER_ITEMS).map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 shrink-0">
                        <span>{item}</span>
                        <span className="text-[#0E382E]/40">•</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveTicker} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E382E] uppercase mb-1.5">
                    Announcement Phrases (Enter 1 phrase per line):
                  </label>
                  <textarea
                    rows={6}
                    value={tickerInput}
                    onChange={(e) => setTickerInput(e.target.value)}
                    placeholder="DUST — CHOICE OF MOTHERLAND&#10;NOT MADE FOR EVERYONE • MADE FOR THOSE WHO CHOOSE BETTER&#10;WHOLESOME LADDOO PREMIX & DRY FRUITS&#10;PAAN DIGESTIVE SHOTS&#10;ZERO ADDED SUGAR&#10;100% NATURAL NUTRITION"
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-2xl p-4 text-[#0E382E] font-semibold text-xs leading-relaxed focus:outline-none focus:border-[#0E382E]"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Tip: Separate each phrase with a new line. You can include promotional offers, seasonal discounts (e.g. Diwali Sale / Free Shipping), or product benefits.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSavingTicker}
                    className="px-6 py-3 bg-[#0E382E] hover:bg-[#E67E22] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingTicker ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Ticker Bar Changes
                      </>
                    )}
                  </button>

                  {tickerSaveSuccess && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saved successfully to website!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 8.1: Upcoming Product Launches & Banners Management */}
        {activeTab === "upcoming-banners" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#74B487]/20 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E67E22]/15 text-[#E67E22] text-[11px] font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Homepage Pipeline Showcase
                </span>
                <h3 className="text-xl font-extrabold text-[#0E382E]">
                  Upcoming Product Launches & Banners
                </h3>
                <p className="text-xs text-[#1F684B] mt-0.5">
                  These banners are displayed in a rich wide banner carousel on the Home page, directly above the "Featured Product Stories" section.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchUpcomingBanners(true)}
                  className="px-3.5 py-2.5 border border-[#74B487]/40 text-[#0E382E] hover:bg-[#E8F1E9] text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                  title="Reload banners from database"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#1F684B]" /> Refresh
                </button>
                <button
                  type="button"
                  onClick={openNewUpcomingBannerModal}
                  className="px-5 py-2.5 bg-[#0E382E] hover:bg-[#E67E22] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Upcoming Banner
                </button>
              </div>
            </div>

            {isLoadingUpcomingBanners ? (
              <div className="py-16 text-center text-[#1F684B] flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#E67E22]" />
                <span className="text-xs font-semibold">Loading upcoming banners from server...</span>
              </div>
            ) : upcomingBanners.length === 0 ? (
              <div className="p-12 text-center bg-[#F6F5F0] rounded-2xl border-2 border-dashed border-[#74B487]/40 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#E8F1E9] flex items-center justify-center mx-auto text-[#0E382E]">
                  <Sparkles className="w-7 h-7 text-[#E67E22]" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#0E382E]">No Upcoming Product Banners</h4>
                  <p className="text-xs text-[#1F684B] max-w-md mx-auto mt-1">
                    Add upcoming banners with teasers, photos, and launch dates to create hype for products currently in your pipeline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewUpcomingBannerModal}
                  className="px-5 py-2.5 bg-[#0E382E] hover:bg-[#E67E22] text-white text-xs font-extrabold rounded-xl transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create First Banner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {upcomingBanners.map((banner, idx) => (
                  <div
                    key={banner.id}
                    className="p-5 sm:p-6 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/30 hover:border-[#74B487] transition-all flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between shadow-xs"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-full lg:w-56 h-36 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-[#74B487]/30 shadow-xs">
                      {banner.image_url ? (
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/dust-wellness-combo-advertisement.webp";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-stone-400 font-bold">
                          No Image
                        </div>
                      )}
                      <span className="absolute top-2 left-2 bg-[#0E382E]/90 text-[#F6F5F0] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                        Slide #{idx + 1}
                      </span>
                    </div>

                    {/* Banner Content Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#E67E22] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {banner.tagline || "COMING SOON"}
                        </span>
                        {banner.launch_date && (
                          <span className="bg-[#0E382E] text-[#74B487] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {banner.launch_date}
                          </span>
                        )}
                        <span className="text-[11px] text-stone-500 font-medium">
                          Order: {banner.display_order ?? idx + 1}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-black text-[#0E382E] leading-snug">
                        {banner.title}
                      </h4>

                      {banner.subtitle && (
                        <p className="text-xs font-semibold text-[#1F684B] leading-relaxed">
                          {banner.subtitle}
                        </p>
                      )}

                      {banner.description && (
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {banner.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                        <span className="font-bold text-[#0E382E]">
                          CTA: <span className="text-[#E67E22] underline">{banner.cta_text || "Pre-Order Inquiry"}</span>
                        </span>
                        <span className="text-stone-400">•</span>
                        <span className="text-stone-500 font-medium">
                          Link: <code className="bg-white px-1.5 py-0.5 rounded text-[10px]">{banner.cta_link || "/combos"}</code>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#74B487]/20">
                      <button
                        type="button"
                        onClick={() => openEditUpcomingBannerModal(banner)}
                        className="px-4 py-2 bg-[#0E382E] hover:bg-[#1F684B] text-white text-xs font-extrabold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUpcomingBanner(banner.id)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold rounded-xl transition-colors inline-flex items-center gap-1.5 border border-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 8.5: Video Testimonials & Customer Reviews Management */}
        {activeTab === "reviews" && (
          <div className="bg-white p-8 rounded-3xl border border-[#74B487]/40 shadow-sm space-y-8">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#0E382E] flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#E67E22]" /> Customer Reviews & Video Stories Hub
                </h3>
                <p className="text-xs text-[#1F684B]">
                  Manage real customer feedback, add product video testimonials, and publish verified reviews directly to the website.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={resetToDefaults}
                  className="px-4 py-2 border border-[#74B487]/40 text-[#0E382E] hover:bg-[#E8F1E9] text-xs font-bold rounded-xl transition-colors"
                  title="Restore initial seed testimonials"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={openNewReviewModal}
                  className="btn-dust-orange px-5 py-2.5 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl inline-flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Video / Review
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/30 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">Total Reviews</span>
                <p className="text-2xl font-black text-[#0E382E]">{testimonials.length}</p>
              </div>
              <div className="p-4 bg-[#E8F1E9] rounded-2xl border border-[#74B487]/40 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#1F684B]">Video Stories</span>
                <p className="text-2xl font-black text-[#E67E22]">
                  {testimonials.filter((t) => t.mediaType === "video").length}
                </p>
              </div>
              <div className="p-4 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/30 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">Live on Site</span>
                <p className="text-2xl font-black text-[#25D366]">
                  {testimonials.filter((t) => t.isApproved).length}
                </p>
              </div>
              <div className="p-4 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/30 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">Average Rating</span>
                <p className="text-2xl font-black text-[#E67E22] flex items-center justify-center gap-1">
                  5.0 <Star className="w-4 h-4 fill-current inline stroke-none" />
                </p>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by customer name, city, or title..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl text-[#0E382E] focus:outline-none focus:border-[#E67E22]"
                />
              </div>

              <select
                value={reviewTypeFilter}
                onChange={(e) => setReviewTypeFilter(e.target.value as any)}
                className="p-2 bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl font-bold text-[#0E382E]"
              >
                <option value="all">All Types</option>
                <option value="video">Videos Only</option>
                <option value="text">Text Reviews Only</option>
              </select>

              <select
                value={reviewProductFilter}
                onChange={(e) => setReviewProductFilter(e.target.value)}
                className="p-2 bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl font-bold text-[#0E382E]"
              >
                <option value="all">All Products</option>
                {initialProducts.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Testimonials List */}
            <div className="space-y-4">
              {testimonials
                .filter((t) => {
                  if (reviewTypeFilter === "video" && t.mediaType !== "video") return false;
                  if (reviewTypeFilter === "text" && t.mediaType === "video") return false;
                  if (reviewProductFilter !== "all" && t.productSlug !== reviewProductFilter) return false;
                  if (reviewSearch) {
                    const q = reviewSearch.toLowerCase();
                    return (
                      t.customerName.toLowerCase().includes(q) ||
                      t.location.toLowerCase().includes(q) ||
                      t.title.toLowerCase().includes(q) ||
                      t.comment.toLowerCase().includes(q)
                    );
                  }
                  return true;
                })
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-5 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/40 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center hover:border-[#E67E22] transition-colors"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex gap-4 items-start">
                      {/* Video Thumbnail or Text Icon */}
                      {t.mediaType === "video" ? (
                        <div
                          onClick={() => t.videoUrl && setPreviewVideoUrl(t.videoUrl)}
                          className="relative w-24 h-24 rounded-xl overflow-hidden bg-black shrink-0 cursor-pointer border border-[#74B487]/40 group shadow-xs"
                        >
                          {t.videoPoster ? (
                            <img
                              src={t.videoPoster}
                              alt={t.customerName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0E382E]">
                              <Film className="w-6 h-6 text-[#E67E22]" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#E67E22] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Play className="w-4 h-4 fill-current stroke-none ml-0.5" />
                            </div>
                          </div>
                          {t.videoDuration && (
                            <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-black/70 px-1 rounded">
                              {t.videoDuration}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#E8F1E9] text-[#0E382E] flex items-center justify-center shrink-0 border border-[#74B487]/40">
                          <MessageSquare className="w-7 h-7 text-[#E67E22]" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-[#0E382E] text-sm">
                            {t.customerName}
                          </span>
                          <span className="text-[11px] text-stone-500">({t.location})</span>
                          {t.verifiedBuyer && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-[#1F684B] bg-[#E8F1E9] px-2 py-0.5 rounded-full border border-[#74B487]/30">
                              <CheckCircle2 className="w-3 h-3 text-[#25D366]" /> Verified Buyer
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-[#E67E22] bg-white px-2 py-0.5 rounded-full border border-[#E67E22]/30">
                            {t.mediaType === "video" ? "🎥 Video Story" : "📝 Written Review"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex text-[#E67E22]">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current stroke-none" />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-[#0E382E]">"{t.title}"</span>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2 max-w-xl">
                          {t.comment}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-500">
                          <span className="font-bold text-[#0E382E]">Product: {t.productName}</span>
                          <span>•</span>
                          <span>{t.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#E67E22] font-bold">
                            <ThumbsUp className="w-3 h-3" /> {t.helpfulCount} helpful
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        {/* Live Toggle */}
                        <button
                          onClick={() => toggleApproval(t.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-colors ${
                            t.isApproved
                              ? "bg-[#25D366]/20 text-[#0E382E] hover:bg-[#25D366]/30"
                              : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                          }`}
                        >
                          {t.isApproved ? "✓ Live on Site" : "✕ Hidden"}
                        </button>

                        {/* Featured Toggle */}
                        <button
                          onClick={() => toggleFeatured(t.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition-colors ${
                            t.isFeatured
                              ? "bg-[#E67E22] text-white"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          ★ Featured
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {t.mediaType === "video" && t.videoUrl && (
                          <button
                            onClick={() => setPreviewVideoUrl(t.videoUrl!)}
                            className="p-1.5 bg-white border border-[#74B487]/40 rounded-lg text-[#0E382E] hover:bg-[#E8F1E9]"
                            title="Preview Video"
                          >
                            <Play className="w-3.5 h-3.5 text-[#E67E22]" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditReviewModal(t)}
                          className="p-1.5 bg-white border border-[#74B487]/40 rounded-lg text-[#0E382E] hover:bg-[#E8F1E9]"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete review from "${t.customerName}"?`)) {
                              deleteTestimonial(t.id);
                            }
                          }}
                          className="p-1.5 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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
                    <th className="p-4">Investment / Type</th>
                    <th className="p-4">Message / Notes</th>
                    <th className="p-4">Status & Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#74B487]/20 text-[#1F684B]">
                  {distributorLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-500 font-medium italic">
                        No distributor inquiries received yet. When B2B leads submit the partnership form, they will appear here.
                      </td>
                    </tr>
                  ) : (
                    distributorLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#F6F5F0]/60 transition-colors">
                        <td className="p-4">
                          <p className="font-extrabold text-[#0E382E]">{lead.name}</p>
                          <p className="text-[11px] font-bold text-[#E67E22]">{lead.company}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-[#0E382E]">{lead.email}</p>
                          <p className="font-bold text-[#0E382E]">{lead.phone}</p>
                        </td>
                        <td className="p-4 font-bold text-[#0E382E]">{lead.location}</td>
                        <td className="p-4 font-semibold">{lead.channel}</td>
                        <td className="p-4 font-extrabold text-[#0E382E]">{lead.investment}</td>
                        <td className="p-4 max-w-xs">
                          {lead.message ? (
                            <div className="bg-[#F6F5F0] border border-[#74B487]/30 p-2.5 rounded-xl text-[11px] text-[#0E382E] font-medium whitespace-pre-wrap max-h-24 overflow-y-auto">
                              {lead.message}
                            </div>
                          ) : (
                            <span className="text-stone-400 italic">None</span>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="bg-[#E67E22] text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                            {lead.status}
                          </span>
                          <p className="text-[10px] text-stone-400 mt-1 font-medium">{lead.date}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add New Product Modal with Full Details Page Sync */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-[#74B487]/50 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#74B487]/30 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#E67E22] font-black">
                  DYNAMIC PRODUCT CMS
                </span>
                <h3 className="text-2xl font-extrabold text-[#0E382E]">
                  {editingProduct ? "Edit Product Details" : "Create New Product SKU & Live Page"}
                </h3>
                <p className="text-xs text-[#1F684B]">
                  {editingProduct
                    ? `Update pricing, stock, media, and description for "${editingProduct.name}".`
                    : "Fills out all sections of your dedicated /product/:slug page."}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F6F5F0] p-1.5 rounded-2xl border border-[#74B487]/30 text-xs">
              <button
                type="button"
                onClick={() => setProductModalTab("basic")}
                className={`py-2 px-3 rounded-xl font-bold transition-all ${
                  productModalTab === "basic"
                    ? "bg-[#0E382E] text-white shadow-xs"
                    : "text-[#0E382E] hover:bg-[#E8F1E9]"
                }`}
              >
                1. Basic & Pricing
              </button>
              <button
                type="button"
                onClick={() => setProductModalTab("media")}
                className={`py-2 px-3 rounded-xl font-bold transition-all ${
                  productModalTab === "media"
                    ? "bg-[#0E382E] text-white shadow-xs"
                    : "text-[#0E382E] hover:bg-[#E8F1E9]"
                }`}
              >
                2. Visuals & Media
              </button>
              <button
                type="button"
                onClick={() => setProductModalTab("nutrition")}
                className={`py-2 px-3 rounded-xl font-bold transition-all ${
                  productModalTab === "nutrition"
                    ? "bg-[#0E382E] text-white shadow-xs"
                    : "text-[#0E382E] hover:bg-[#E8F1E9]"
                }`}
              >
                3. Ingredients & Nutrition
              </button>
              <button
                type="button"
                onClick={() => setProductModalTab("ritual")}
                className={`py-2 px-3 rounded-xl font-bold transition-all ${
                  productModalTab === "ritual"
                    ? "bg-[#0E382E] text-white shadow-xs"
                    : "text-[#0E382E] hover:bg-[#E8F1E9]"
                }`}
              >
                4. Ritual & Story
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              {/* TAB 1: Basic & Pricing */}
              {productModalTab === "basic" && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-[#0E382E] uppercase mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="e.g. Royal Paan Digestive Shots"
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Category *
                      </label>
                      <select
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value as any)}
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      >
                        <option value="heritage-wellness">Heritage Wellness (Digestion, Herbal)</option>
                        <option value="wholesome-millets">Wholesome Laddoo Premix (Millets, Nuts)</option>
                        <option value="pure-fruit-powders">Pure Fruit Powders</option>
                        <option value="pure-nut-powders">Pure Nut Powders (Almond, Cashew)</option>
                        <option value="herbal-haircare">Herbal Haircare</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Stock Quantity (Units) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newProductStock}
                        onChange={(e) => setNewProductStock(Number(e.target.value))}
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(Number(e.target.value))}
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Compare Price / MRP (₹)
                      </label>
                      <input
                        type="number"
                        value={newProductOriginalPrice}
                        onChange={(e) => setNewProductOriginalPrice(Number(e.target.value))}
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Net Weight *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProductWeight}
                        onChange={(e) => setNewProductWeight(e.target.value)}
                        placeholder="e.g. 200g or Box of 10 Sachets"
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Servings / Pack Info *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProductServings}
                        onChange={(e) => setNewProductServings(e.target.value)}
                        placeholder="e.g. Makes 20 Shots / Yields 12 Laddoos"
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#0E382E] uppercase mb-1">
                      Header Subtitle
                    </label>
                    <input
                      type="text"
                      value={newProductSubtitle}
                      onChange={(e) => {
                        setNewProductSubtitle(e.target.value);
                        setNewProductPitch(e.target.value);
                      }}
                      placeholder="e.g. Royal Betel Leaf & Gulkand After-Meal Digestive"
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Visuals & Media */}
              {productModalTab === "media" && (
                <div className="space-y-5">
                  {/* Main Product Image */}
                  <div className="bg-[#F6F5F0] border border-[#74B487]/40 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-[#0E382E] uppercase text-xs">
                        Main Product Image *
                      </label>
                      <span className="text-[11px] text-stone-500 font-medium">Device upload or URL</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isUploadingMainImg
                          ? "bg-stone-300 text-stone-600 cursor-not-allowed"
                          : "bg-[#0E382E] text-white hover:bg-[#164d40]"
                      }`}>
                        {isUploadingMainImg ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#E67E22]" />
                            <span>Uploading Photo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-[#E67E22]" />
                            <span>Upload from Computer / Phone</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingMainImg}
                          onChange={handleMainImageUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-stone-400 font-semibold">or enter URL below</span>
                    </div>

                    <input
                      type="text"
                      required
                      value={newProductImageUrl}
                      onChange={(e) => setNewProductImageUrl(e.target.value)}
                      placeholder="/paan_image_2.jpeg or uploaded image link"
                      className="w-full bg-white border border-[#74B487]/30 rounded-xl p-3 text-[#0E382E] font-semibold text-xs"
                    />

                    {newProductImageUrl && (
                      <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-[#74B487]/30">
                        <img
                          src={newProductImageUrl}
                          alt="Main preview"
                          className="w-14 h-14 object-cover rounded-lg border border-stone-200 shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#0E382E] truncate">Main Image Selected</p>
                          <p className="text-[10px] text-stone-500 font-mono truncate">{newProductImageUrl}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewProductImageUrl("")}
                          className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Gallery Images */}
                  <div className="bg-[#F6F5F0] border border-[#74B487]/40 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-[#0E382E] uppercase text-xs">
                        Additional Gallery Images
                      </label>
                      <span className="text-[11px] text-stone-500 font-medium">Multiple photos allowed</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isUploadingGallery
                          ? "bg-stone-300 text-stone-600 cursor-not-allowed"
                          : "bg-[#0E382E] text-white hover:bg-[#164d40]"
                      }`}>
                        {isUploadingGallery ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#E67E22]" />
                            <span>Uploading Photos...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-[#E67E22]" />
                            <span>Upload Multiple Photos from Device</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={isUploadingGallery}
                          onChange={handleGalleryImagesUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-stone-400 font-semibold">Select 1 or more files</span>
                    </div>

                    <textarea
                      value={newProductGalleryUrls}
                      onChange={(e) => setNewProductGalleryUrls(e.target.value)}
                      placeholder="/paan_image_1.jpeg&#10;/paan_image_3.jpeg&#10;or uploaded links"
                      className="w-full bg-white border border-[#74B487]/30 rounded-xl p-3 text-[#0E382E] font-semibold text-xs h-20"
                    />

                    {/* Gallery Thumbnails Preview */}
                    {newProductGalleryUrls.trim() && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {newProductGalleryUrls
                          .split(/[\n,]+/)
                          .map((u) => u.trim())
                          .filter((u) => u.length > 0)
                          .map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className="relative group w-14 h-14 rounded-lg overflow-hidden border border-stone-300 bg-white shadow-xs"
                            >
                              <img
                                src={imgUrl}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                              <button
                                type="button"
                                title="Remove photo"
                                onClick={() => {
                                  const list = newProductGalleryUrls
                                    .split(/[\n,]+/)
                                    .map((u) => u.trim())
                                    .filter((u) => u.length > 0 && u !== imgUrl);
                                  setNewProductGalleryUrls(list.join("\n"));
                                }}
                                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Badges and Theme Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Promotional Badges (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newProductBadges}
                        onChange={(e) => setNewProductBadges(e.target.value)}
                        placeholder="100% NATURAL, SPRAY-DRIED, NO PRESERVATIVES"
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Theme Accent Color
                      </label>
                      <select
                        value={newProductAccent}
                        onChange={(e) => setNewProductAccent(e.target.value as any)}
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      >
                        <option value="rose">Rose (Deep Green & Royal Amber)</option>
                        <option value="emerald">Emerald (Fresh Herbal Green)</option>
                        <option value="amber">Amber (Golden Grain Warmth)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Ingredients & Nutrition */}
              {productModalTab === "nutrition" && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-[#0E382E] uppercase mb-1">
                      Detailed Description (Double enter for multiple paragraphs)
                    </label>
                    <textarea
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                      placeholder="Crafted with authentic ingredients...&#10;&#10;Our spray-drying process retains 98% of natural micronutrients without artificial chemicals."
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold h-24"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0E382E] uppercase mb-1">
                      Key Health Claims / Benefits (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newProductClaims}
                      onChange={(e) => setNewProductClaims(e.target.value)}
                      placeholder="Instant Digestive Relief, 98% Nutrient Retention, Zero Synthetic Chemicals"
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0E382E] uppercase mb-1">
                      Full Ingredients List *
                    </label>
                    <textarea
                      required
                      value={newProductIngredients}
                      onChange={(e) => setNewProductIngredients(e.target.value)}
                      placeholder="Real Betel Leaf Solids, Gulkand, Fennel, Cardamom, Inulin Fiber"
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold h-16"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Allergen / Safety Info
                      </label>
                      <input
                        type="text"
                        value={newProductAllergen}
                        onChange={(e) => setNewProductAllergen(e.target.value)}
                        placeholder="Contains no common allergens. 100% vegetarian."
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Storage Instructions
                      </label>
                      <input
                        type="text"
                        value={newProductStorage}
                        onChange={(e) => setNewProductStorage(e.target.value)}
                        placeholder="Store in a cool dry place away from direct sunlight."
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>
                  </div>

                  {/* Nutrition Breakdown Sub-Grid */}
                  <div className="p-4 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/40 space-y-3">
                    <h4 className="font-extrabold text-[#0E382E] uppercase text-[11px]">
                      Nutritional Values Table (Per Serving)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600">Energy (kcal)</label>
                        <input
                          type="text"
                          value={newProductEnergy}
                          onChange={(e) => setNewProductEnergy(e.target.value)}
                          className="w-full bg-white border border-[#74B487]/30 rounded-lg p-2 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600">Protein (g)</label>
                        <input
                          type="text"
                          value={newProductProtein}
                          onChange={(e) => setNewProductProtein(e.target.value)}
                          className="w-full bg-white border border-[#74B487]/30 rounded-lg p-2 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600">Carbohydrates (g)</label>
                        <input
                          type="text"
                          value={newProductCarbs}
                          onChange={(e) => setNewProductCarbs(e.target.value)}
                          className="w-full bg-white border border-[#74B487]/30 rounded-lg p-2 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600">Dietary Fiber (g)</label>
                        <input
                          type="text"
                          value={newProductFiber}
                          onChange={(e) => setNewProductFiber(e.target.value)}
                          className="w-full bg-white border border-[#74B487]/30 rounded-lg p-2 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600">Total Fat (g)</label>
                        <input
                          type="text"
                          value={newProductFat}
                          onChange={(e) => setNewProductFat(e.target.value)}
                          className="w-full bg-white border border-[#74B487]/30 rounded-lg p-2 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Ritual & Story */}
              {productModalTab === "ritual" && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-[#0E382E] uppercase mb-1">
                      Ritual Section Heading
                    </label>
                    <input
                      type="text"
                      value={newProductRitualLabel}
                      onChange={(e) => setNewProductRitualLabel(e.target.value)}
                      placeholder="e.g. Preparation Ritual or How to Use"
                      className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                    />
                  </div>

                  <div className="space-y-3 p-4 bg-[#F6F5F0] rounded-2xl border border-[#74B487]/40">
                    <h4 className="font-extrabold text-[#0E382E] uppercase text-[11px]">
                      Step-by-Step Usage Instructions
                    </h4>

                    {/* Step 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newProductStep1Title}
                        onChange={(e) => setNewProductStep1Title(e.target.value)}
                        placeholder="Step 1 Title (e.g. Pour)"
                        className="bg-white border border-[#74B487]/30 rounded-lg p-2 font-bold text-[#0E382E]"
                      />
                      <input
                        type="text"
                        value={newProductStep1Detail}
                        onChange={(e) => setNewProductStep1Detail(e.target.value)}
                        placeholder="Step 1 Instruction detail"
                        className="sm:col-span-2 bg-white border border-[#74B487]/30 rounded-lg p-2 font-medium"
                      />
                    </div>

                    {/* Step 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newProductStep2Title}
                        onChange={(e) => setNewProductStep2Title(e.target.value)}
                        placeholder="Step 2 Title (e.g. Stir)"
                        className="bg-white border border-[#74B487]/30 rounded-lg p-2 font-bold text-[#0E382E]"
                      />
                      <input
                        type="text"
                        value={newProductStep2Detail}
                        onChange={(e) => setNewProductStep2Detail(e.target.value)}
                        placeholder="Step 2 Instruction detail"
                        className="sm:col-span-2 bg-white border border-[#74B487]/30 rounded-lg p-2 font-medium"
                      />
                    </div>

                    {/* Step 3 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newProductStep3Title}
                        onChange={(e) => setNewProductStep3Title(e.target.value)}
                        placeholder="Step 3 Title (e.g. Savor)"
                        className="bg-white border border-[#74B487]/30 rounded-lg p-2 font-bold text-[#0E382E]"
                      />
                      <input
                        type="text"
                        value={newProductStep3Detail}
                        onChange={(e) => setNewProductStep3Detail(e.target.value)}
                        placeholder="Step 3 Instruction detail"
                        className="sm:col-span-2 bg-white border border-[#74B487]/30 rounded-lg p-2 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Heritage Story Title
                      </label>
                      <input
                        type="text"
                        value={newProductHeritageTitle}
                        onChange={(e) => setNewProductHeritageTitle(e.target.value)}
                        placeholder="e.g. Inspired by Banaras Traditions"
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Heritage Quote / Sourcing Note
                      </label>
                      <input
                        type="text"
                        value={newProductHeritageQuote}
                        onChange={(e) => setNewProductHeritageQuote(e.target.value)}
                        placeholder="e.g. Handcrafted from farmers' surplus harvests."
                        className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation & Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#74B487]/30">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="sm:w-1/3 bg-stone-200 text-stone-700 py-3 rounded-xl font-bold uppercase transition-colors hover:bg-stone-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="sm:w-2/3 btn-dust-orange text-white py-3.5 rounded-xl font-extrabold uppercase shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
                >
                  {editingProduct ? "Save & Update Product SKU 💾" : "Publish Product SKU & Live Page 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Testimonial Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 space-y-5 border border-[#74B487]/50 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold text-[#0E382E]">
                {editingTestimonial ? "Edit Customer Review / Story" : "Add Customer Video / Review"}
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              {/* Media Type Selection */}
              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">
                  Format / Media Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTMediaType("video")}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold flex items-center justify-center gap-2 ${
                      tMediaType === "video"
                        ? "bg-[#0E382E] text-white border-[#0E382E]"
                        : "bg-[#F6F5F0] text-[#0E382E] border-[#74B487]/40"
                    }`}
                  >
                    <Video className="w-4 h-4 text-[#E67E22]" /> 🎥 Video Testimonial
                  </button>
                  <button
                    type="button"
                    onClick={() => setTMediaType("text")}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold flex items-center justify-center gap-2 ${
                      tMediaType === "text"
                        ? "bg-[#0E382E] text-white border-[#0E382E]"
                        : "bg-[#F6F5F0] text-[#0E382E] border-[#74B487]/40"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-[#E67E22]" /> 📝 Written Review
                  </button>
                </div>
              </div>

              {/* Customer Name & City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sneha Kulkarni"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">
                    Location / City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune, Maharashtra"
                    value={tLocation}
                    onChange={(e) => setTLocation(e.target.value)}
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">
                  Product Reviewed *
                </label>
                <select
                  value={tProductSlug}
                  onChange={(e) => setTProductSlug(e.target.value)}
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-bold"
                >
                  {initialProducts.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} ({p.netWeight})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">
                  Star Rating (1 - 5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setTRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= tRating ? "fill-current text-[#E67E22]" : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Video URL & Poster (if video) */}
              {tMediaType === "video" && (
                <div className="space-y-3 p-4 bg-[#E8F1E9]/50 rounded-2xl border border-[#74B487]/40">
                  <div>
                    <label className="block font-bold text-[#0E382E] uppercase mb-1">
                      Video URL (MP4, YouTube, or Reel link) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://.../video.mp4 or YouTube link"
                      value={tVideoUrl}
                      onChange={(e) => setTVideoUrl(e.target.value)}
                      className="w-full bg-white border border-[#74B487]/40 rounded-xl p-2.5 text-[#0E382E] font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Video Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0:45"
                        value={tVideoDuration}
                        onChange={(e) => setTVideoDuration(e.target.value)}
                        className="w-full bg-white border border-[#74B487]/40 rounded-xl p-2.5 text-[#0E382E] font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#0E382E] uppercase mb-1">
                        Poster Image URL (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Image URL or leave blank"
                        value={tVideoPoster}
                        onChange={(e) => setTVideoPoster(e.target.value)}
                        className="w-full bg-white border border-[#74B487]/40 rounded-xl p-2.5 text-[#0E382E] font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Review Headline & Comment */}
              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Authentic taste and zero sugar spike!"
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">
                  Customer Review Comment *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed customer experience and review..."
                  value={tComment}
                  onChange={(e) => setTComment(e.target.value)}
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0E382E]">
                  <input
                    type="checkbox"
                    checked={tVerified}
                    onChange={(e) => setTVerified(e.target.checked)}
                    className="rounded accent-[#E67E22] w-4 h-4"
                  />
                  <span>Verified Buyer</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0E382E]">
                  <input
                    type="checkbox"
                    checked={tApproved}
                    onChange={(e) => setTApproved(e.target.checked)}
                    className="rounded accent-[#E67E22] w-4 h-4"
                  />
                  <span>Publish Live on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0E382E]">
                  <input
                    type="checkbox"
                    checked={tFeatured}
                    onChange={(e) => setTFeatured(e.target.checked)}
                    className="rounded accent-[#E67E22] w-4 h-4"
                  />
                  <span>Feature on Home</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="w-1/2 bg-stone-200 text-stone-700 py-3 rounded-xl font-bold uppercase"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 btn-dust-orange text-white py-3 rounded-xl font-bold uppercase shadow-md"
                >
                  {editingTestimonial ? "Save Changes" : "Publish Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Player Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0E382E] rounded-3xl overflow-hidden border border-[#74B487]/50 shadow-2xl">
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#E67E22] text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              {previewVideoUrl.includes("youtube") || previewVideoUrl.includes("youtu.be") ? (
                <iframe
                  src={
                    previewVideoUrl.includes("watch?v=")
                      ? previewVideoUrl.replace("watch?v=", "embed/")
                      : previewVideoUrl
                  }
                  title="Video Preview"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={previewVideoUrl} controls autoPlay className="w-full h-full object-contain">
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div className="p-4 bg-[#0E382E] text-white flex items-center justify-between text-xs">
              <span className="font-bold text-[#E67E22]">Admin Video Playback Preview</span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Upcoming Product Banner Modal */}
      {isUpcomingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#74B487]/40 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#74B487]/20 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E67E22] bg-[#E67E22]/15 px-2.5 py-0.5 rounded-full">
                  {editingUpcomingBanner ? "Edit Existing Banner" : "Create New Banner"}
                </span>
                <h3 className="text-xl font-extrabold text-[#0E382E] mt-1">
                  {editingUpcomingBanner ? "Edit Upcoming Product Banner" : "Add Upcoming Product Banner"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUpcomingModalOpen(false)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpcomingBanner} className="space-y-5 text-xs">
              {/* Title & Subtitle */}
              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">
                  Banner Title / Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayurvedic Herbal Haircare & Pure Fruit Powders"
                  value={upcomingForm.title}
                  onChange={(e) => setUpcomingForm({ ...upcomingForm, title: e.target.value })}
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold focus:outline-none focus:border-[#0E382E]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">
                  Subtitle / High-Concept Hook
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next-Generation Heritage Wellness Formulations Inspired by Nature"
                  value={upcomingForm.subtitle}
                  onChange={(e) => setUpcomingForm({ ...upcomingForm, subtitle: e.target.value })}
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold focus:outline-none focus:border-[#0E382E]"
                />
              </div>

              {/* Tagline & Launch Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">
                    Tagline Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. COMING SOON • IN THE PIPELINE"
                    value={upcomingForm.tagline}
                    onChange={(e) => setUpcomingForm({ ...upcomingForm, tagline: e.target.value })}
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold focus:outline-none focus:border-[#0E382E]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">
                    Expected Launch Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Expected Launch: Q1 2027"
                    value={upcomingForm.launch_date}
                    onChange={(e) => setUpcomingForm({ ...upcomingForm, launch_date: e.target.value })}
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold focus:outline-none focus:border-[#0E382E]"
                  />
                </div>
              </div>

              {/* Banner Image Upload & URL */}
              <div className="space-y-3 p-4 bg-[#E8F1E9]/40 rounded-2xl border border-[#74B487]/40">
                <label className="block font-bold text-[#0E382E] uppercase">
                  Showcase Banner Image *
                </label>

                {/* Upload from device */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <label className="flex-1 cursor-pointer bg-white border border-[#74B487]/60 hover:bg-[#E8F1E9] text-[#0E382E] px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-2xs">
                    <Upload className="w-4 h-4 text-[#E67E22]" />
                    <span>{isUploadingUpcomingImg ? "Uploading Image..." : "Upload Photo from Laptop / Mobile"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpcomingImageUpload}
                      disabled={isUploadingUpcomingImg}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Fallback image URL input */}
                <div>
                  <label className="block text-[11px] font-bold text-[#1F684B] uppercase mb-1">
                    Or Enter Image URL / Public Path
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/dust-wellness-combo-advertisement.webp or https://..."
                    value={upcomingForm.image_url}
                    onChange={(e) => setUpcomingForm({ ...upcomingForm, image_url: e.target.value })}
                    className="w-full bg-white border border-[#74B487]/40 rounded-xl p-2.5 text-[#0E382E] font-semibold focus:outline-none focus:border-[#0E382E]"
                  />
                </div>

                {/* Preview Box */}
                {upcomingForm.image_url && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-[#1F684B] uppercase mb-1">Live Image Preview:</p>
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-stone-900 border border-[#74B487]/50 shadow-inner">
                      <img
                        src={upcomingForm.image_url}
                        alt="Upcoming Banner Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/dust-wellness-combo-advertisement.webp";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-[#0E382E] uppercase mb-1">
                  Teaser Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a teaser of the ingredients, formulation process, or health benefits..."
                  value={upcomingForm.description}
                  onChange={(e) => setUpcomingForm({ ...upcomingForm, description: e.target.value })}
                  className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold focus:outline-none focus:border-[#0E382E]"
                />
              </div>

              {/* CTA Details & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pre-Order Inquiry"
                    value={upcomingForm.cta_text}
                    onChange={(e) => setUpcomingForm({ ...upcomingForm, cta_text: e.target.value })}
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold focus:outline-none focus:border-[#0E382E]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /combos or /contact"
                    value={upcomingForm.cta_link}
                    onChange={(e) => setUpcomingForm({ ...upcomingForm, cta_link: e.target.value })}
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold focus:outline-none focus:border-[#0E382E]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0E382E] uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={upcomingForm.display_order}
                    onChange={(e) => setUpcomingForm({ ...upcomingForm, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl p-3 text-[#0E382E] font-semibold focus:outline-none focus:border-[#0E382E]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#74B487]/20">
                <button
                  type="button"
                  onClick={() => setIsUpcomingModalOpen(false)}
                  className="w-1/2 bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-xl font-bold uppercase transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingUpcomingBanner}
                  className="w-1/2 bg-[#0E382E] hover:bg-[#E67E22] text-white py-3 rounded-xl font-bold uppercase transition-colors shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingUpcomingBanner ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : editingUpcomingBanner ? (
                    "Save Changes"
                  ) : (
                    "Create Banner"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
