import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import aboutBannerLaddoo from "@/assets/about-banner-laddoo.png";
import paanPoster from "@/assets/paan-poster.jpeg";
import almondCollage from "@/assets/almond-powder-collage.png";
import cashewCollage from "@/assets/cashew-powder-collage.png";

export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  productSlug: string;
  productName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  mediaType: "video" | "text" | "image";
  videoUrl?: string | undefined;
  videoPoster?: string | undefined;
  videoDuration?: string | undefined;
  verifiedBuyer: boolean;
  isFeatured: boolean;
  isApproved: boolean;
  date: string;
  helpfulCount: number;
}

interface TestimonialsStore {
  testimonials: Testimonial[];
  addTestimonial: (data: Omit<Testimonial, "id" | "date" | "helpfulCount">) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  toggleApproval: (id: string) => void;
  toggleFeatured: (id: string) => void;
  likeTestimonial: (id: string) => void;
  resetToDefaults: () => void;
}

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-01",
    customerName: "Dr. Sneha Kulkarni",
    location: "Kothrud, Pune",
    productSlug: "shahi-ragi-dry-fruit-laddoo-mix",
    productName: "Shahi Ragi & Dry Fruit Laddoo Mix",
    rating: 5,
    title: "Fresh, healthy laddoos in 5 minutes with warm ghee!",
    comment:
      "As a practicing nutritionist and mother of two, finding a snack with zero refined sugar and high calcium was tough. We just poured warm desi ghee into the mix, rolled 15 laddoos in 5 minutes, and the kids loved them. Clean label at its finest!",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    videoPoster: aboutBannerLaddoo,
    videoDuration: "0:48",
    verifiedBuyer: true,
    isFeatured: true,
    isApproved: true,
    date: "3 days ago",
    helpfulCount: 42,
  },
  {
    id: "test-02",
    customerName: "Vikramaditya Singh",
    location: "Civil Lines, Jaipur",
    productSlug: "banarasi-paan-01",
    productName: "Banarasi Paan Digestive Shots",
    rating: 5,
    title: "Authentic royal paan experience after celebratory dinners",
    comment:
      "I was skeptical about a powdered paan shot until I tasted it. Real betel leaf extract, fragrant gulkand, and fennel with zero artificial chemicals or tobacco. It resets your palate immediately and aids digestion. A masterpiece!",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    videoPoster: paanPoster,
    videoDuration: "0:36",
    verifiedBuyer: true,
    isFeatured: true,
    isApproved: true,
    date: "1 week ago",
    helpfulCount: 57,
  },
  {
    id: "test-03",
    customerName: "Ananya Roy",
    location: "Indiranagar, Bengaluru",
    productSlug: "pure-almond-powder",
    productName: "DUST™ Almond Powder",
    rating: 5,
    title: "100% skin-on pure almonds — perfect for morning smoothies!",
    comment:
      "I add two scoops of this almond powder to my morning oats and post-workout protein shake. It's finely ground with natural almond skin intact, giving you healthy fats, protein and vitamin E without any grinding mess.",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    videoPoster: almondCollage,
    videoDuration: "0:52",
    verifiedBuyer: true,
    isFeatured: true,
    isApproved: true,
    date: "2 weeks ago",
    helpfulCount: 38,
  },
  {
    id: "test-04",
    customerName: "Meera Joshi",
    location: "Shivaji Nagar, Pune",
    productSlug: "premium-cashew-powder",
    productName: "DUST™ Premium Cashew Powder",
    rating: 5,
    title: "Restaurant-style rich shahi gravies without soaking or grinding",
    comment:
      "Making shahi paneer and kaju kheer used to take 30 minutes of soaking and grinding cashews. DUST Cashew Powder dissolves seamlessly, creating that rich velvety restaurant texture with zero additives. Total kitchen lifesaver!",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    videoPoster: cashewCollage,
    videoDuration: "0:41",
    verifiedBuyer: true,
    isFeatured: true,
    isApproved: true,
    date: "4 days ago",
    helpfulCount: 29,
  },
  {
    id: "test-05",
    customerName: "Rajesh Kulkarni",
    location: "Dadar, Mumbai",
    productSlug: "shahi-ragi-dry-fruit-laddoo-mix",
    productName: "Shahi Ragi & Dry Fruit Laddoo Mix",
    rating: 5,
    title: "Zero sugar crash — sustained energy for senior citizens",
    comment:
      "My elderly parents have sweet cravings but must avoid refined sugar. This ragi premix uses pure date powder sweetness and crunchy roasted seeds. It is light on the stomach and keeps their energy steady throughout the morning.",
    mediaType: "text",
    verifiedBuyer: true,
    isFeatured: true,
    isApproved: true,
    date: "5 days ago",
    helpfulCount: 21,
  },
  {
    id: "test-06",
    customerName: "Ishita Banerjee",
    location: "Assi Ghat, Varanasi",
    productSlug: "banarasi-paan-01",
    productName: "Banarasi Paan Digestive Shots",
    rating: 5,
    title: "My Banarasi grandmother approved — highest certification!",
    comment:
      "Coming from Varanasi, we know what authentic paan tastes like. When my grandmother tested the 60ml chilled shot after lunch, she gave it a 10/10. The gulkand and fennel balance is truly royal.",
    mediaType: "text",
    verifiedBuyer: true,
    isFeatured: true,
    isApproved: true,
    date: "2 weeks ago",
    helpfulCount: 64,
  },
  {
    id: "test-07",
    customerName: "Rohan Deshmukh",
    location: "Manali, Himachal Pradesh",
    productSlug: "pure-almond-powder",
    productName: "DUST™ Almond Powder",
    rating: 5,
    title: "A warm cup of badam milk every winter evening",
    comment:
      "Stirring a big spoonful into warm milk with saffron is the ultimate comfort drink. No preservatives or chemical smell — just genuine roasted nutty aroma. The 500g pouch lasts our family nearly a month.",
    mediaType: "text",
    verifiedBuyer: true,
    isFeatured: true,
    isApproved: true,
    date: "3 weeks ago",
    helpfulCount: 19,
  },
];

export const useTestimonialsStore = create<TestimonialsStore>()(
  persist(
    (set) => ({
      testimonials: INITIAL_TESTIMONIALS,

      addTestimonial: (data) =>
        set((state) => ({
          testimonials: [
            {
              ...data,
              id: `test-${Date.now()}`,
              date: "Just now",
              helpfulCount: 0,
            },
            ...state.testimonials,
          ],
        })),

      updateTestimonial: (id, updates) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTestimonial: (id) =>
        set((state) => ({
          testimonials: state.testimonials.filter((t) => t.id !== id),
        })),

      toggleApproval: (id) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, isApproved: !t.isApproved } : t
          ),
        })),

      toggleFeatured: (id) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, isFeatured: !t.isFeatured } : t
          ),
        })),

      likeTestimonial: (id) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, helpfulCount: t.helpfulCount + 1 } : t
          ),
        })),

      resetToDefaults: () => set({ testimonials: INITIAL_TESTIMONIALS }),
    }),
    {
      name: "dust_testimonials_store_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
