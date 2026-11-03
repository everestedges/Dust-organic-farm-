import React, { useState } from "react";
import {
  Star,
  Play,
  CheckCircle2,
  ThumbsUp,
  X,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Film,
  Filter,
  Plus,
} from "lucide-react";
import { useTestimonialsStore, Testimonial } from "@/lib/testimonials-store";
import { products } from "@/lib/data";

interface CustomerTestimonialsProps {
  currentProductSlug?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const CustomerTestimonials: React.FC<CustomerTestimonialsProps> = ({
  currentProductSlug,
  className = "",
  title = "Real Stories & Verified Experiences",
  subtitle = "Discover why thousands of Indian households have made DUST their daily tradition for nutrition and digestive wellness.",
}) => {
  const { testimonials, likeTestimonial, addTestimonial } = useTestimonialsStore();

  const [activeFilter, setActiveFilter] = useState<string>(
    currentProductSlug ?? "all"
  );
  const [selectedVideo, setSelectedVideo] = useState<Testimonial | null>(null);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // New Review Form State
  const [authorName, setAuthorName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(
    currentProductSlug ?? products[0]?.slug ?? "shahi-ragi-dry-fruit-laddoo-mix"
  );
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isMediaVideo, setIsMediaVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const approvedList = testimonials.filter((t) => t.isApproved);

  const filteredTestimonials = approvedList.filter((item) => {
    if (activeFilter === "video") return item.mediaType === "video";
    if (activeFilter === "all") return true;
    return item.productSlug === activeFilter || item.productSlug.includes(activeFilter);
  });

  const videoTestimonials = filteredTestimonials.filter(
    (t) => t.mediaType === "video" && t.videoUrl
  );
  const textReviews = filteredTestimonials.filter(
    (t) => t.mediaType !== "video"
  );

  const handleLike = (id: string) => {
    if (likedMap[id]) return;
    likeTestimonial(id);
    setLikedMap((prev) => ({ ...prev, [id]: true }));
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    const matchedProduct = products.find(
      (p) => p.slug === selectedProduct || p.id === selectedProduct
    );

    addTestimonial({
      customerName: authorName.trim(),
      location: location.trim() || "India",
      productSlug: selectedProduct,
      productName: matchedProduct ? matchedProduct.name : "DUST Superfoods",
      rating,
      title: reviewTitle.trim() || "Wholesome natural taste!",
      comment: reviewComment.trim(),
      mediaType: isMediaVideo && videoUrl.trim() ? "video" : "text",
      videoUrl: isMediaVideo && videoUrl.trim() ? videoUrl.trim() : undefined,
      videoPoster: matchedProduct ? matchedProduct.storyImage : undefined,
      videoDuration: isMediaVideo ? "0:45" : undefined,
      verifiedBuyer: true,
      isFeatured: true,
      isApproved: true,
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setIsWriteReviewOpen(false);
      setAuthorName("");
      setLocation("");
      setReviewTitle("");
      setReviewComment("");
      setVideoUrl("");
      setIsMediaVideo(false);
    }, 1800);
  };

  return (
    <section className={`py-20 px-4 sm:px-8 md:px-12 lg:px-16 w-full ${className}`}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header with Stats & Write Review Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#74B487]/30">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F1E9] border border-[#74B487]/40 text-[#0E382E] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>Customer Feedback & Video Stories</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0E382E] tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-sm sm:text-base text-[#1F684B] font-medium leading-relaxed">
              {subtitle}
            </p>

            {/* Rating Summary Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-[#74B487]/40 shadow-2xs">
                <div className="flex text-[#E67E22]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current stroke-none" />
                  ))}
                </div>
                <span className="text-xs font-black text-[#0E382E]">4.9 / 5.0</span>
              </div>
              <span className="text-xs text-stone-600 font-bold">
                Based on <strong className="text-[#0E382E]">1,420+</strong> verified reviews
              </span>
              <span className="text-xs text-[#25D366] font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 100% Genuine Buyers
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsWriteReviewOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#0E382E] hover:bg-[#E67E22] text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider flex items-center gap-1 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all shrink-0 ${
              activeFilter === "all"
                ? "bg-[#0E382E] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#E8F1E9] border border-[#74B487]/40"
            }`}
          >
            All Reviews ({approvedList.length})
          </button>

          <button
            onClick={() => setActiveFilter("video")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === "video"
                ? "bg-[#E67E22] text-white shadow-xs"
                : "bg-white text-[#E67E22] hover:bg-[#E8F1E9] border border-[#E67E22]/40"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video Stories ({approvedList.filter((t) => t.mediaType === "video").length})</span>
          </button>

          <button
            onClick={() => setActiveFilter("shahi-ragi-dry-fruit-laddoo-mix")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all shrink-0 ${
              activeFilter.includes("ragi")
                ? "bg-[#0E382E] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#E8F1E9] border border-[#74B487]/40"
            }`}
          >
            Ragi Laddoo Mix
          </button>

          <button
            onClick={() => setActiveFilter("pure-almond-powder")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all shrink-0 ${
              activeFilter.includes("almond")
                ? "bg-[#0E382E] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#E8F1E9] border border-[#74B487]/40"
            }`}
          >
            Almond Powder
          </button>

          <button
            onClick={() => setActiveFilter("premium-cashew-powder")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all shrink-0 ${
              activeFilter.includes("cashew")
                ? "bg-[#0E382E] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#E8F1E9] border border-[#74B487]/40"
            }`}
          >
            Cashew Powder
          </button>

          <button
            onClick={() => setActiveFilter("natural-powder-shampoo-men")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all shrink-0 ${
              activeFilter.includes("shampoo")
                ? "bg-[#0E382E] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#E8F1E9] border border-[#74B487]/40"
            }`}
          >
            Herbal Powder Shampoo
          </button>
          <button
            onClick={() => setActiveFilter("banarasi-paan-01")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all shrink-0 ${
              activeFilter.includes("paan")
                ? "bg-[#0E382E] text-white shadow-xs"
                : "bg-white text-[#0E382E] hover:bg-[#E8F1E9] border border-[#74B487]/40"
            }`}
          >
            Paan Digestive Shot
          </button>
        </div>

        {/* Section 1: Video Stories Reel Carousel */}
        {videoTestimonials.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E382E] flex items-center gap-2">
                <Film className="w-5 h-5 text-[#E67E22]" />
                <span>Customer Video Stories</span>
              </h3>
              <span className="text-xs text-stone-500 font-bold">
                Click any card to play video
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videoTestimonials.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedVideo(item)}
                  className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl border-2 border-[#74B487]/40 hover:border-[#E67E22] transition-all duration-300 bg-[#0E382E]"
                >
                  {/* Poster / Thumbnail Background */}
                  {item.videoPoster && (
                    <img
                      src={item.videoPoster}
                      alt={item.customerName}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                  {/* Top Bar Badges */}
                  <div className="relative z-10 p-4 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#E67E22] px-2.5 py-0.5 rounded-full shadow-xs">
                      {item.productName.split(" ")[0]} {item.productName.split(" ")[1]}
                    </span>
                    {item.videoDuration && (
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        {item.videoDuration}
                      </span>
                    )}
                  </div>

                  {/* Center Play Icon with Pulse Effect */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-14 h-14 rounded-full bg-[#E67E22] text-white flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-white group-hover:text-[#E67E22] transition-all duration-300">
                      <Play className="w-6 h-6 fill-current stroke-none ml-1" />
                    </div>
                  </div>

                  {/* Bottom Info Card */}
                  <div className="absolute bottom-0 inset-x-0 p-5 z-10 text-white space-y-2">
                    <div className="flex text-[#E67E22]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current stroke-none" />
                      ))}
                    </div>

                    <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-2">
                      "{item.title}"
                    </h4>

                    <div className="flex items-center justify-between pt-1 border-t border-white/20 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white">{item.customerName}</span>
                        {item.verifiedBuyer && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                        )}
                      </div>
                      <span className="text-[11px] text-stone-300 font-medium">
                        {item.location.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Written Reviews & Detailed Customer Feedback */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E382E] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#E67E22]" />
              <span>Customer Reviews & Experience</span>
            </h3>
            <span className="text-xs text-stone-500 font-bold">
              Showing {textReviews.length} reviews
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textReviews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#74B487]/40 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#E67E22]/60 transition-all duration-300 space-y-4"
              >
                <div className="space-y-3">
                  {/* Rating + Date Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#E67E22]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current stroke-none" />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium">{item.date}</span>
                  </div>

                  {/* Title & Comment */}
                  <h4 className="text-base font-extrabold text-[#0E382E] leading-snug">
                    "{item.title}"
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {item.comment}
                  </p>
                </div>

                {/* Footer with Customer Info & Product Tag */}
                <div className="pt-4 border-t border-[#74B487]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-[#0E382E]">
                          {item.customerName}
                        </span>
                        {item.verifiedBuyer && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-[#1F684B] bg-[#E8F1E9] px-2 py-0.5 rounded-full border border-[#74B487]/30">
                            <CheckCircle2 className="w-3 h-3 text-[#25D366]" /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500">{item.location}</p>
                    </div>

                    {/* Upvote / Helpful Button */}
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        likedMap[item.id]
                          ? "bg-[#E67E22] text-white"
                          : "bg-[#F6F5F0] hover:bg-[#E8F1E9] text-stone-600"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.helpfulCount}</span>
                    </button>
                  </div>

                  {/* Product Badge */}
                  <div className="text-[10px] text-[#E67E22] font-black uppercase tracking-wider bg-[#E8F1E9]/70 px-2.5 py-1 rounded-md inline-block">
                    Product: {item.productName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#0E382E] rounded-3xl overflow-hidden border border-[#74B487]/50 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#E67E22] text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {selectedVideo.videoUrl?.includes("youtube") || selectedVideo.videoUrl?.includes("youtu.be") ? (
                <iframe
                  src={
                    selectedVideo.videoUrl.includes("watch?v=")
                      ? selectedVideo.videoUrl.replace("watch?v=", "embed/")
                      : selectedVideo.videoUrl
                  }
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedVideo.videoUrl}
                  poster={selectedVideo.videoPoster}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Video Detail Footer */}
            <div className="p-6 bg-[#0E382E] text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#E67E22] bg-white/10 px-2.5 py-1 rounded-full">
                  {selectedVideo.productName}
                </span>
                <div className="flex text-[#E67E22]">
                  {[...Array(selectedVideo.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current stroke-none" />
                  ))}
                </div>
              </div>

              <h4 className="text-lg font-extrabold text-white">
                "{selectedVideo.title}"
              </h4>

              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                {selectedVideo.comment}
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white">{selectedVideo.customerName}</span>
                  <span>• {selectedVideo.location}</span>
                </div>
                <span className="text-[#25D366] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Verified Customer Story
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#74B487]/40 space-y-5">
            <button
              onClick={() => setIsWriteReviewOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E67E22] bg-[#E8F1E9] px-2.5 py-1 rounded-full">
                Share Your Feedback
              </span>
              <h3 className="text-2xl font-extrabold text-[#0E382E] mt-2">
                Write a Customer Review
              </h3>
              <p className="text-xs text-[#1F684B]">
                Tell other families about your experience with DUST products.
              </p>
            </div>

            {reviewSubmitted ? (
              <div className="p-8 text-center space-y-3 bg-[#E8F1E9] rounded-2xl border border-[#74B487]/50">
                <CheckCircle2 className="w-12 h-12 text-[#25D366] mx-auto animate-bounce" />
                <h4 className="text-lg font-extrabold text-[#0E382E]">
                  Thank you for your review!
                </h4>
                <p className="text-xs text-[#1F684B]">
                  Your review has been successfully submitted and is now live on our website.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
                {/* Product Selection */}
                <div>
                  <label className="block font-bold text-[#0E382E] mb-1">
                    Select Product *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-2.5 bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl font-bold text-[#0E382E] focus:outline-none focus:border-[#E67E22]"
                  >
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} ({p.netWeight})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Stars */}
                <div>
                  <label className="block font-bold text-[#0E382E] mb-1">Rating *</label>
                  <div className="flex gap-1.5 text-[#E67E22]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? "fill-current text-[#E67E22]" : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0E382E] mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Deshmukh"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full p-2.5 bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl text-[#0E382E] focus:outline-none focus:border-[#E67E22]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0E382E] mb-1">City, State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune, Maharashtra"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-2.5 bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl text-[#0E382E] focus:outline-none focus:border-[#E67E22]"
                    />
                  </div>
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block font-bold text-[#0E382E] mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tastes authentic and made with real dry fruits!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full p-2.5 bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl text-[#0E382E] focus:outline-none focus:border-[#E67E22]"
                  />
                </div>

                {/* Feedback Comment */}
                <div>
                  <label className="block font-bold text-[#0E382E] mb-1">
                    Detailed Review *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share what you loved about the product, preparation ritual, or taste..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-2.5 bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl text-[#0E382E] focus:outline-none focus:border-[#E67E22]"
                  />
                </div>

                {/* Optional Video Toggle */}
                <div className="pt-2 border-t border-[#74B487]/20 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0E382E]">
                    <input
                      type="checkbox"
                      checked={isMediaVideo}
                      onChange={(e) => setIsMediaVideo(e.target.checked)}
                      className="rounded accent-[#E67E22] w-4 h-4"
                    />
                    <span>I have a video review / YouTube / reel link to share</span>
                  </label>

                  {isMediaVideo && (
                    <input
                      type="url"
                      placeholder="Enter video URL (MP4 link, YouTube link, Google Drive, or Cloudinary)"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full p-2.5 bg-[#F6F5F0] border border-[#74B487]/40 rounded-xl text-[#0E382E] focus:outline-none focus:border-[#E67E22]"
                    />
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0E382E] hover:bg-[#E67E22] text-white font-extrabold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

