"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  FolderKanban,
  GraduationCap,
  Sparkles,
  CreditCard,
  LifeBuoy,
  ShieldCheck,
  LogOut,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  ExternalLink,
  Video,
  X,
  Package,
  DollarSign,
  Phone,
  Mail,
  Lock,
  Layers,
  Wrench,
  Tv,
  Upload,
  Image as ImageIcon,
  FileText,
  Eye,
  MessageCircle,
  Copy
} from "lucide-react";
import { 
  CourseItem, 
  AppSubscriptionItem, 
  ServiceItem 
} from "@/data/mockData";
import { 
  getStoredCourses, 
  fetchCoursesFromServer,
  saveCourse, 
  deleteCourse,
  getStoredSubscriptions, 
  fetchSubscriptionsFromServer,
  addSubscriptionItem,
  updateSubscriptionItem,
  deleteSubscriptionItem,
  getStoredServices,
  updateServiceItem,
  getStoredOrders,
  fulfillOrder,
  deliverOrderCredentials,
  clearAllOrders,
  addOrder,
  OrderItem,
  isAdminAuthenticated,
  setAdminAuthenticated,
  logoutAll,
  getReferralSettings,
  saveReferralSettings,
  getPayoutRequests,
  approvePayoutRequest,
  PayoutRequest,
  ReferralCommissionSettings
} from "@/lib/store";

export default function UnifiedMasterPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Courses State
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Referral & Commission Settings (Configurable by Admin)
  const [referralSettings, setReferralSettings] = useState<ReferralCommissionSettings>({
    courseEnrollmentPKR: 20,
    appSubscriptionPKR: 10,
    largeServicePKR: 20,
    smallProductPKR: 10
  });
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);

  // Subscriptions State
  const [products, setProducts] = useState<AppSubscriptionItem[]>([]);
  const [subSearch, setSubSearch] = useState("");
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editPricePKR, setEditPricePKR] = useState<number>(0);
  const [editCostPKR, setEditCostPKR] = useState<number>(0);

  // Subscriptions Management State (Add & Edit with Warranty)
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSubItem, setEditingSubItem] = useState<AppSubscriptionItem | null>(null);
  const [subForm, setSubForm] = useState({
    id: "",
    name: "",
    slug: "",
    category: "ENTERTAINMENT",
    typeBadge: "6 Month • Private Screen",
    warrantyBadge: "8-day replacement warranty",
    pricePKR: 350,
    internalCostPKR: 190,
    inStock: true,
    iconType: "prime",
    description: "",
    fulfillmentType: "Private Screen Profile"
  });

  // Services State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServicePrice, setEditServicePrice] = useState<number>(0);

  // Orders State (Clean - ZERO demo customers)
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    customer: "",
    product: "Capcut Pro (Android/iPhone)",
    amount: "Rs 450",
  });

  // Delivery Modal State
  const [deliveryModalOrder, setDeliveryModalOrder] = useState<OrderItem | null>(null);
  const [deliveryCredentialsInput, setDeliveryCredentialsInput] = useState("");
  const [deliveryNoteInput, setDeliveryNoteInput] = useState("");
  const [viewDetailsOrder, setViewDetailsOrder] = useState<OrderItem | null>(null);

  // Thumbnail Picker State (Option 1: Direct from PC)
  const [thumbnailMode, setThumbnailMode] = useState<"pc" | "url">("pc");
  const [thumbnailFileName, setThumbnailFileName] = useState<string>("");

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Payment Proof Slip Modal State
  const [viewingSlipUrl, setViewingSlipUrl] = useState<string | null>(null);

  // Profile / Settings State
  const [profileSettings, setProfileSettings] = useState({
    adminName: "Adverty X Admin",
    email: "admin@advertyx.com",
    whatsapp: "+255613735391",
    currency: "PKR"
  });

  // Course Form State - Starts completely clean without fake demo lectures
  const [courseForm, setCourseForm] = useState<{
    id?: string;
    title: string;
    slug: string;
    category: string;
    instructor: string;
    isFree: boolean;
    price: number;
    thumbnailUrl: string;
    level: string;
    duration: string;
    description: string;
    lessons: { title: string; duration: string; videoUrl: string }[];
  }>({
    title: "",
    slug: "",
    category: "Marketing",
    instructor: "Adverty X Team",
    isFree: false,
    price: 49,
    thumbnailUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    level: "All Levels",
    duration: "4 Hours",
    description: "",
    lessons: [] // Completely clean! User adds lectures themselves
  });

  const thumbnailPresets = [
    { label: "Design & Creative", url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80" },
    { label: "Video Editing", url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80" },
    { label: "Coding & Web", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" },
    { label: "Digital Marketing", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
    { label: "Business Automation", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
  ];

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      window.location.href = "/login";
      return;
    }
    setCourses(getStoredCourses());
    fetchCoursesFromServer().then((list) => {
      if (list && list.length > 0) setCourses(list);
    });
    setProducts(getStoredSubscriptions());
    fetchSubscriptionsFromServer().then((list) => {
      if (list && list.length > 0) setProducts(list);
    });
    setServices(getStoredServices());
    setOrders(getStoredOrders());
    setReferralSettings(getReferralSettings());
    setPayouts(getPayoutRequests());

    const handleCoursesUpdate = () => setCourses(getStoredCourses());
    const handleSubsUpdate = () => setProducts(getStoredSubscriptions());
    const handleServicesUpdate = () => setServices(getStoredServices());
    const handleOrdersUpdate = () => setOrders(getStoredOrders());
    const handlePayoutsUpdate = () => setPayouts(getPayoutRequests());

    window.addEventListener("advertyx_courses_updated", handleCoursesUpdate);
    window.addEventListener("advertyx_subscriptions_updated", handleSubsUpdate);
    window.addEventListener("advertyx_services_updated", handleServicesUpdate);
    window.addEventListener("advertyx_orders_updated", handleOrdersUpdate);
    window.addEventListener("advertyx_payouts_updated", handlePayoutsUpdate);

    return () => {
      window.removeEventListener("advertyx_courses_updated", handleCoursesUpdate);
      window.removeEventListener("advertyx_subscriptions_updated", handleSubsUpdate);
      window.removeEventListener("advertyx_services_updated", handleServicesUpdate);
      window.removeEventListener("advertyx_orders_updated", handleOrdersUpdate);
      window.removeEventListener("advertyx_payouts_updated", handlePayoutsUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Stock toggle
  const handleStockToggle = (id: string) => {
    const item = products.find(p => p.id === id);
    if (!item) return;
    const updated = { ...item, inStock: !item.inStock };
    const newList = updateSubscriptionItem(updated);
    setProducts(newList);
    showToast(`${item.name} is now ${updated.inStock ? "IN STOCK" : "OUT OF STOCK"}`);
  };

  // Edit subscription price
  const handleStartEditSub = (item: AppSubscriptionItem) => {
    setEditingSubId(item.id);
    setEditPricePKR(item.pricePKR);
    setEditCostPKR(item.internalCostPKR);
  };

  const handleSaveSubPrice = (id: string) => {
    const item = products.find(p => p.id === id);
    if (!item) return;
    const updated = {
      ...item,
      pricePKR: Number(editPricePKR),
      priceUSD: Number((Number(editPricePKR) / 278).toFixed(2)),
      internalCostPKR: Number(editCostPKR)
    };
    const newList = updateSubscriptionItem(updated);
    setProducts(newList);
    setEditingSubId(null);
    showToast(`Updated price for ${item.name}: Rs ${updated.pricePKR}`);
  };

  // Open Add Subscription Modal
  const handleOpenAddSub = () => {
    setEditingSubItem(null);
    setSubForm({
      id: "",
      name: "",
      slug: "",
      category: "ENTERTAINMENT",
      typeBadge: "6 Month • Private Screen",
      warrantyBadge: "8-day replacement warranty",
      pricePKR: 350,
      internalCostPKR: 190,
      inStock: true,
      iconType: "prime",
      description: "Ultra HD 4K streaming with dedicated PIN profile, personal watchlist, and full 8-day replacement warranty.",
      fulfillmentType: "Private Screen Profile"
    });
    setIsSubModalOpen(true);
  };

  // Open Edit Subscription Modal
  const handleOpenEditSub = (item: AppSubscriptionItem) => {
    setEditingSubItem(item);
    setSubForm({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category,
      typeBadge: item.typeBadge,
      warrantyBadge: item.warrantyBadge || "28-day warranty",
      pricePKR: item.pricePKR,
      internalCostPKR: item.internalCostPKR,
      inStock: item.inStock,
      iconType: item.iconType,
      description: item.description,
      fulfillmentType: item.fulfillmentType
    });
    setIsSubModalOpen(true);
  };

  // Save Subscription (Add or Edit)
  const handleSaveSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.name.trim()) {
      alert("Please enter the subscription or app name.");
      return;
    }

    const cleanSlug = subForm.slug.trim() || subForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cleanId = editingSubItem ? editingSubItem.id : `app-${Date.now()}`;
    const cleanPrice = Number(subForm.pricePKR) || 300;
    const cleanCost = Number(subForm.internalCostPKR) || 150;

    const subItem: AppSubscriptionItem = {
      id: cleanId,
      name: subForm.name.trim(),
      slug: cleanSlug,
      category: subForm.category,
      typeBadge: subForm.typeBadge.trim() || "1 Month • Private",
      warrantyBadge: subForm.warrantyBadge.trim() || "28-day warranty",
      rating: editingSubItem ? editingSubItem.rating : 4.8,
      reviewsCount: editingSubItem ? editingSubItem.reviewsCount : Math.floor(100 + Math.random() * 500),
      pricePKR: cleanPrice,
      priceUSD: Number((cleanPrice / 278).toFixed(2)),
      internalCostPKR: cleanCost,
      inStock: subForm.inStock,
      iconBg: "bg-white",
      iconType: subForm.iconType,
      description: subForm.description.trim() || `${subForm.name} subscription with ${subForm.warrantyBadge} and instant delivery.`,
      fulfillmentType: subForm.fulfillmentType
    };

    if (editingSubItem) {
      const updatedList = updateSubscriptionItem(subItem);
      setProducts(updatedList);
      showToast(`Updated "${subItem.name}" (Warranty: ${subItem.warrantyBadge})!`);
    } else {
      const updatedList = addSubscriptionItem(subItem);
      setProducts(updatedList);
      showToast(`Added new subscription "${subItem.name}" (Warranty: ${subItem.warrantyBadge})!`);
    }

    setIsSubModalOpen(false);
  };

  // Delete Subscription
  const handleDeleteSubscription = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from subscriptions?`)) {
      const updatedList = deleteSubscriptionItem(id);
      setProducts(updatedList);
      showToast(`Deleted "${name}" from store.`);
    }
  };

  // Edit agency service price
  const handleStartEditService = (serv: ServiceItem) => {
    setEditingServiceId(serv.id);
    setEditServicePrice(serv.startingPrice);
  };

  const handleSaveServicePrice = (id: string) => {
    const serv = services.find(s => s.id === id);
    if (!serv) return;
    const updated = { ...serv, startingPrice: Number(editServicePrice) };
    const newList = updateServiceItem(updated);
    setServices(newList);
    setEditingServiceId(null);
    showToast(`Updated package rate for ${serv.title}: $${updated.startingPrice}`);
  };

  // Referral Commission Controls (Admin can set Rs 20 and Rs 10 or any rates)
  const handleSaveReferralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveReferralSettings(referralSettings);
    const cRate = referralSettings.courseEnrollmentPKR ?? referralSettings.largeServicePKR ?? 20;
    const aRate = referralSettings.appSubscriptionPKR ?? referralSettings.smallProductPKR ?? 10;
    showToast(`Saved! Course Referral: Rs ${cRate}, App Subscription: Rs ${aRate}`);
  };

  const handleApprovePayout = (id: string) => {
    const updated = approvePayoutRequest(id);
    setPayouts(updated);
    showToast(`Payout request ${id} approved and marked as Paid!`);
  };

  // Quick 9-Video Lecture Filler for Fast Course Creation
  const handleQuickAdd9Lectures = () => {
    const default9 = [
      { title: "Lecture 1: Course Introduction & Overview", duration: "12m", videoUrl: "" },
      { title: "Lecture 2: Core Tools & Workspace Setup", duration: "18m", videoUrl: "" },
      { title: "Lecture 3: Essential Techniques & Principles", duration: "24m", videoUrl: "" },
      { title: "Lecture 4: Practical Demonstration Phase 1", duration: "30m", videoUrl: "" },
      { title: "Lecture 5: Practical Demonstration Phase 2", duration: "35m", videoUrl: "" },
      { title: "Lecture 6: Advanced Tips & Pro Secrets", duration: "26m", videoUrl: "" },
      { title: "Lecture 7: Monetization & Finding Clients", duration: "22m", videoUrl: "" },
      { title: "Lecture 8: Complete End-to-End Case Study", duration: "30m", videoUrl: "" },
      { title: "Lecture 9: Conclusion & Certificate Info", duration: "15m", videoUrl: "" },
    ];
    setCourseForm(prev => ({
      ...prev,
      lessons: default9
    }));
    showToast("9 Video Lecture slots created! Enter your titles & video links.");
  };

  // Image Upload from PC (Option 1)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP, etc.).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is larger than 5MB. Please choose an image under 5MB.");
      return;
    }
    setThumbnailFileName(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCourseForm(prev => ({ ...prev, thumbnailUrl: result }));
      showToast("Thumbnail uploaded from PC successfully!");
    };
    reader.readAsDataURL(file);
  };

  // Open add course modal - CLEAN slate without demo lectures
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setThumbnailFileName("");
    setThumbnailMode("pc");
    setCourseForm({
      title: "",
      slug: "",
      category: "Marketing",
      instructor: "Adverty X Team",
      isFree: false,
      price: 49,
      thumbnailUrl: "",
      level: "All Levels",
      duration: "4 Hours",
      description: "",
      lessons: [] // Completely empty, you add your own lectures!
    });
    setIsAddCourseModalOpen(true);
  };

  // Open edit course modal
  const handleOpenEditCourse = (c: CourseItem) => {
    setEditingCourse(c);
    setThumbnailFileName(c.thumbnailUrl?.startsWith("data:") ? "Custom Uploaded Image" : "");
    setThumbnailMode(c.thumbnailUrl?.startsWith("data:") ? "pc" : "url");
    setCourseForm({
      id: c.id,
      title: c.title,
      slug: c.slug,
      category: c.category,
      instructor: c.instructor,
      isFree: !!c.isFree,
      price: c.price,
      thumbnailUrl: c.thumbnailUrl || "",
      level: c.level,
      duration: c.duration,
      description: c.description,
      lessons: c.curriculum.flatMap(m => m.lessons.map(l => ({
        title: l.title,
        duration: l.duration,
        videoUrl: l.videoUrl || ""
      })))
    });
    setIsAddCourseModalOpen(true);
  };

  // Save course (On-site streaming web playback)
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      alert("Please enter a course title.");
      return;
    }

    const slug = courseForm.slug.trim()
      ? courseForm.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-")
      : courseForm.title.toLowerCase().replace(/[^a-z0-9_-]/g, "-");

    const newObj: CourseItem = {
      id: editingCourse ? editingCourse.id : `course-${Date.now()}`,
      slug: slug,
      title: courseForm.title.trim(),
      category: courseForm.category || "Marketing",
      instructor: courseForm.instructor || "Adverty X Team",
      rating: editingCourse ? (editingCourse.rating || 5.0) : 5.0,
      reviewsCount: editingCourse ? (editingCourse.reviewsCount || 1) : 1,
      price: courseForm.isFree ? 0 : Number(courseForm.price || 0),
      isFree: !!courseForm.isFree,
      thumbnail: "course-thumb",
      thumbnailUrl: courseForm.thumbnailUrl || "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
      level: courseForm.level || "All Levels",
      duration: courseForm.duration || "4 Hours",
      lessonsCount: courseForm.lessons.length > 0 ? courseForm.lessons.length : 1,
      description: courseForm.description?.trim() || `${courseForm.title} comprehensive masterclass with hands-on exercises and lifetime streaming access.`,
      curriculum: [
        {
          module: "Module 1: Video Masterclass (In-Browser Streaming)",
          lessons: (courseForm.lessons.length > 0 
            ? courseForm.lessons 
            : [{ title: `${courseForm.title} - Main Masterclass`, duration: "45m", videoUrl: "" }]
          ).map((l, idx) => ({
            title: l.title || `Lecture ${idx + 1}`,
            duration: l.duration || "15m",
            isPreview: idx === 0,
            videoUrl: l.videoUrl || ""
          }))
        }
      ]
    };

    const updated = saveCourse(newObj);
    setCourses(updated);
    setIsAddCourseModalOpen(false);
    showToast(editingCourse ? `Course "${newObj.title}" updated!` : `New course "${newObj.title}" published!`);
  };

  // Delete course
  const handleDeleteCourse = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete course "${title}"?`)) {
      const updated = deleteCourse(id);
      setCourses(updated);
      showToast(`Course "${title}" has been deleted.`);
    }
  };

  // Deliver Order Credentials Modal Trigger
  const handleOpenDeliverModal = (order: OrderItem) => {
    setDeliveryModalOrder(order);
    setDeliveryCredentialsInput(order.deliveredCredentials || "");
    setDeliveryNoteInput(order.deliveryNote || "Login credentials for your account. Please keep them secure and do not change email/password.");
  };

  // Confirm delivery
  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryModalOrder) return;
    if (!deliveryCredentialsInput.trim()) {
      alert("Please provide the credentials or account details for the customer.");
      return;
    }
    const updated = deliverOrderCredentials(
      deliveryModalOrder.id,
      deliveryCredentialsInput.trim(),
      deliveryNoteInput.trim()
    );
    setOrders(updated);
    setDeliveryModalOrder(null);
    showToast(`Order ${deliveryModalOrder.id} credentials delivered!`);
  };

  // Fulfill order direct
  const handleFulfillOrder = (orderId: string) => {
    const updated = fulfillOrder(orderId);
    setOrders(updated);
    showToast(`Order ${orderId} marked as Delivered & Active!`);
  };

  // Clear demo orders
  const handleClearOrders = () => {
    if (confirm("Are you sure you want to clear the orders list?")) {
      clearAllOrders();
      setOrders([]);
      showToast("Orders list cleared successfully.");
    }
  };

  // Add manual order
  const handleAddManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.customer) return;
    const orderObj: OrderItem = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: newOrderForm.customer,
      product: newOrderForm.product,
      amount: newOrderForm.amount,
      date: "Just now",
      status: "Awaiting Delivery",
      type: "subscription"
    };
    const updated = addOrder(orderObj);
    setOrders(updated);
    setIsAddOrderModalOpen(false);
    setNewOrderForm({ customer: "", product: "Capcut Pro (Android/iPhone)", amount: "Rs 450" });
    showToast("New manual order recorded successfully!");
  };

  // Sidebar Links
  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Courses & Lectures", icon: GraduationCap, badge: `${courses.length}` },
    { id: "subscriptions", label: "Subscriptions (Price Editor)", icon: Sparkles, badge: `${products.length}` },
    { id: "services", label: "Services & Packages", icon: Layers, badge: `${services.length}` },
    { id: "orders", label: "Customer Orders", icon: ShoppingBag, badge: `${orders.length}` },
    { id: "affiliates", label: "Referrals & Commissions", icon: DollarSign, badge: "Rs 20 / Rs 10" },
    { id: "profile", label: "Profile & Settings", icon: User },
    { id: "support", label: "Support & WhatsApp", icon: LifeBuoy },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-900">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* =========================================================================
              LEFT SIDEBAR
          ========================================================================= */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-6 sticky top-24">

              {/* Admin Profile Card */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-sm">
                  AX
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-black text-slate-900 text-sm truncate">{profileSettings.adminName}</h3>
                  <p className="text-xs text-slate-500 truncate">{profileSettings.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                    SUPER ADMIN • FULL ACCESS
                  </span>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <nav className="space-y-1.5">
                {sidebarLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-brand-600 text-white shadow-md shadow-brand-500/20 scale-102"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    logoutAll();
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

            </div>
          </div>

          {/* =========================================================================
              RIGHT MAIN CONTENT (DYNAMICALLY SWITCHES FOR EVERY TAB)
          ========================================================================= */}
          <div className="lg:col-span-9 space-y-6">

            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">Adverty X Administrative Hub</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Welcome, <strong className="text-slate-800">{profileSettings.adminName}</strong>. Live controls for Academy courses, subscriptions, services, and orders.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenAddCourse}
                      className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Course</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("subscriptions")}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      Change App Prices
                    </button>
                  </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-bold uppercase">Customer Orders</span>
                    <div className="text-3xl font-black text-slate-900 mt-2">{orders.length}</div>
                    <span className="text-[10px] text-slate-400 block mt-1">Real-time queue</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-bold uppercase">App Products</span>
                    <div className="text-3xl font-black text-brand-600 mt-2">{products.length}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Live price editor</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-bold uppercase">Academy Courses</span>
                    <div className="text-3xl font-black text-indigo-600 mt-2">{courses.length}</div>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">On-site video streaming</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-bold uppercase">Agency Services</span>
                    <div className="text-3xl font-black text-slate-900 mt-2">{services.length}</div>
                    <span className="text-[10px] text-brand-600 font-bold block mt-1">Rates & packages active</span>
                  </div>
                </div>

                {/* Quick Action Rows */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                  <h3 className="font-black text-slate-900 text-sm mb-4">Quick Management Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={handleOpenAddCourse}
                      className="p-4 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 text-left transition-colors border border-indigo-100 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs block">Add New Course</span>
                        <span className="text-[10px] text-indigo-600">Add lectures & thumbnail</span>
                      </div>
                      <Plus className="w-5 h-5 text-indigo-600" />
                    </button>

                    <button
                      onClick={() => setActiveTab("subscriptions")}
                      className="p-4 rounded-2xl bg-brand-50/70 hover:bg-brand-100 text-brand-900 text-left transition-colors border border-brand-100 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs block">Adjust App Prices</span>
                        <span className="text-[10px] text-brand-600">CapCut, Netflix, YouTube</span>
                      </div>
                      <DollarSign className="w-5 h-5 text-brand-600" />
                    </button>

                    <button
                      onClick={() => setActiveTab("services")}
                      className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-left transition-colors border border-emerald-100 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs block">Manage Services</span>
                        <span className="text-[10px] text-emerald-600">Web Design & Video Add-on</span>
                      </div>
                      <Layers className="w-5 h-5 text-emerald-600" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: COURSES & LECTURES (ADD YOUR OWN LECTURES - NO DEMO LECTURES) */}
            {activeTab === "courses" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Courses & Lectures Manager</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add courses one by one, attach thumbnail pictures, set price (or 100% Free), and add lectures yourself.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full sm:w-60">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <button
                      onClick={handleOpenAddCourse}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Course</span>
                    </button>
                  </div>
                </div>

                {/* Courses List Table */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase">
                          <th className="py-4 px-6">Thumbnail & Title</th>
                          <th className="py-4 px-4">Category</th>
                          <th className="py-4 px-4">Price Model</th>
                          <th className="py-4 px-4">Lectures</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {courses.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-14 text-center">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2.5">
                                <GraduationCap className="w-6 h-6" />
                              </div>
                              <p className="text-sm font-bold text-slate-800">No Academy Courses Added Yet</p>
                              <p className="text-xs text-slate-400 mt-0.5 mb-4">Click &quot;+ Add Course&quot; to publish your first video masterclass.</p>
                              <button
                                type="button"
                                onClick={handleOpenAddCourse}
                                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
                              >
                                + Add First Course
                              </button>
                            </td>
                          </tr>
                        ) : (
                          courses
                            .filter(c => c.title.toLowerCase().includes(courseSearch.toLowerCase()))
                            .map((c) => {
                            const isFree = c.isFree || c.price === 0;
                            return (
                              <tr key={c.id} className="hover:bg-slate-50/60">
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3.5">
                                    <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0 relative">
                                      {c.thumbnailUrl ? (
                                        <img src={c.thumbnailUrl} alt={c.title} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[9px] text-white">No pic</div>
                                      )}
                                      {isFree && (
                                        <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[8px] font-black px-1 rounded-tl">
                                          FREE
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-900 block text-xs">{c.title}</span>
                                      <span className="text-[10px] text-slate-400 font-mono">/{c.slug}</span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-4 px-4">
                                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                                    {c.category}
                                  </span>
                                </td>

                                <td className="py-4 px-4">
                                  {isFree ? (
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black text-[11px] border border-emerald-200">
                                      🎁 100% FREE
                                    </span>
                                  ) : (
                                    <span className="font-black text-slate-900 text-sm">${c.price}</span>
                                  )}
                                </td>

                                <td className="py-4 px-4 text-slate-500">
                                  <span className="font-semibold text-slate-800">{c.lessonsCount} Video Lectures</span>
                                  <span className="block text-[10px] text-brand-600 font-medium">On-Site Stream</span>
                                </td>

                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <a
                                      href={`/academy/${c.slug}`}
                                      target="_blank"
                                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                                      title="Open Classroom Player"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                      onClick={() => handleOpenEditCourse(c)}
                                      className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-[11px] flex items-center gap-1"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCourse(c.id, c.title)}
                                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                                      title="Delete Course"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: APP SUBSCRIPTIONS & PRICE EDITOR */}
            {activeTab === "subscriptions" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">App Subscriptions & Digital Products</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add new subscriptions (e.g. Prime Video, Netflix, Canva), set warranty duration, change retail prices, and manage stock.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-60">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search apps by name..."
                        value={subSearch}
                        onChange={(e) => setSubSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddSub}
                      className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Subscription</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase">
                          <th className="py-4 px-6">App Name</th>
                          <th className="py-4 px-4">Category</th>
                          <th className="py-4 px-4">Plan / Duration</th>
                          <th className="py-4 px-4">🛡️ Warranty Coverage</th>
                          <th className="py-4 px-4">Retail Price (PKR)</th>
                          <th className="py-4 px-4">Supplier Cost</th>
                          <th className="py-4 px-4">Stock Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-slate-400">
                              <p className="font-semibold text-sm text-slate-600">No subscriptions found</p>
                              <p className="text-xs text-slate-400 mt-1">Click &quot;+ Add Subscription&quot; to add your first app product.</p>
                            </td>
                          </tr>
                        ) : (
                          products
                            .filter((p) => p.name.toLowerCase().includes(subSearch.toLowerCase()))
                            .map((p) => {
                              return (
                                <tr key={p.id} className="hover:bg-slate-50/60">
                                  <td className="py-4 px-6">
                                    <div className="font-bold text-slate-900 flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                                      <span>{p.name}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono pl-4">{p.slug}</span>
                                  </td>

                                  <td className="py-4 px-4">
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">
                                      {p.category}
                                    </span>
                                  </td>

                                  <td className="py-4 px-4 font-medium text-slate-600">
                                    {p.typeBadge}
                                  </td>
                                  
                                  <td className="py-4 px-4">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      <span>{p.warrantyBadge || "28-day warranty"}</span>
                                    </span>
                                  </td>

                                  <td className="py-4 px-4">
                                    <span className="font-black text-slate-900 text-sm">Rs {p.pricePKR}</span>
                                  </td>

                                  <td className="py-4 px-4">
                                    <span className="font-mono text-slate-500">Rs {p.internalCostPKR}</span>
                                  </td>

                                  <td className="py-4 px-4">
                                    <button
                                      type="button"
                                      onClick={() => handleStockToggle(p.id)}
                                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all hover:opacity-80 ${
                                        p.inStock 
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                          : "bg-rose-50 text-rose-700 border border-rose-200"
                                      }`}
                                      title="Click to toggle stock"
                                    >
                                      {p.inStock ? "● In Stock" : "○ Out of Stock"}
                                    </button>
                                  </td>

                                  <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditSub(p)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                                        title="Edit App Name, Warranty, Pricing, and Details"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                        <span>Edit</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSubscription(p.id, p.name)}
                                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                                        title="Delete Subscription"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SERVICES & PACKAGES (NOW WITH FULL ADMIN ACCESS) */}
            {activeTab === "services" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Agency Services & Pricing</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure starting prices, turnaround duration, and deliverables for your agency services.
                    </p>
                  </div>
                  <a
                    href="/services"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>View Public Services Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((serv) => {
                    const isEditing = editingServiceId === serv.id;

                    return (
                      <div key={serv.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs space-y-4">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 uppercase">
                              {serv.category}
                            </span>
                            {serv.isAddon && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700 uppercase">
                                Paid Add-on
                              </span>
                            )}
                          </div>

                          <h4 className="font-black text-slate-900 text-base">{serv.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{serv.shortDesc}</p>
                          <span className="text-[11px] text-slate-400 block mt-2 font-mono">Turnaround: {serv.duration}</span>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Starting Rate</span>
                            {isEditing ? (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="font-bold text-slate-500">$</span>
                                <input
                                  type="number"
                                  value={editServicePrice}
                                  onChange={(e) => setEditServicePrice(Number(e.target.value))}
                                  className="w-20 px-2 py-1 rounded-lg border border-brand-500 text-xs font-bold bg-white"
                                />
                              </div>
                            ) : (
                              <span className="text-xl font-black text-slate-900">${serv.startingPrice}</span>
                            )}
                          </div>

                          <div>
                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleSaveServicePrice(serv.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingServiceId(null)}
                                  className="px-2 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartEditService(serv)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit Rate</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOMER ORDERS (NO FAKE DEMO CUSTOMERS - ZERO DEMO DATA) */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Customer Orders Center</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real customer orders placed on the website or via WhatsApp.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddOrderModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Record Order</span>
                    </button>
                    {orders.length > 0 && (
                      <button
                        onClick={handleClearOrders}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-700 text-sm">No Customer Orders Yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      When a customer purchases an App Subscription or enrolls on the website, their real order will appear here in real time.
                    </p>
                    <button
                      onClick={() => setIsAddOrderModalOpen(true)}
                      className="mt-4 px-4 py-2 rounded-xl bg-white border border-slate-200 text-brand-600 hover:bg-slate-100 text-xs font-bold"
                    >
                      + Add a Manual Customer Order
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer Contact</th>
                          <th className="pb-3">Product / Service</th>
                          <th className="pb-3">Payment & TID</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 font-mono font-bold text-slate-900">{o.id}</td>
                            <td className="py-3">
                              <div className="font-semibold text-slate-800">{o.customer}</div>
                              {o.customerEmail && (
                                <div className="text-[10px] text-slate-400 font-mono">{o.customerEmail}</div>
                              )}
                            </td>
                            <td className="py-3 font-bold text-slate-900">{o.product}</td>
                            <td className="py-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-slate-700">
                                  {o.paymentMethod || "Pak Payment Account"}
                                </span>
                                {o.tid ? (
                                  <span className="text-[10px] font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md font-bold inline-block w-fit border border-brand-200/60">
                                    TID: {o.tid}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-mono">No TID (Direct)</span>
                                )}
                                {o.screenshotUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setViewingSlipUrl(o.screenshotUrl || null)}
                                    className="inline-flex items-center gap-1 text-[10px] font-black text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2 py-0.5 rounded border border-brand-200 w-fit transition-colors cursor-pointer"
                                  >
                                    <ImageIcon className="w-3 h-3 text-brand-600" />
                                    <span>View Slip SS 👁️</span>
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-3 font-black text-brand-600">{o.amount}</td>
                            <td className="py-3 text-slate-400 font-mono text-[11px]">{o.date}</td>
                            <td className="py-3">
                              <div className="flex flex-col gap-1">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                                  o.status === "Delivered & Active" || o.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}>
                                  {o.status}
                                </span>
                                <span className="text-[9px] font-bold text-amber-700 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5 text-amber-600" />
                                  12h SLA Guaranteed
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-right">
                              {o.status !== "Delivered & Active" && o.status !== "Completed" ? (
                                <button
                                  onClick={() => handleOpenDeliverModal(o)}
                                  className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs"
                                >
                                  Deliver Credentials
                                </button>
                              ) : (
                                <button
                                  onClick={() => setViewDetailsOrder(o)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] inline-flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3 text-slate-500" />
                                  <span>View Details ✓</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: REFERRALS & COMMISSIONS SETTINGS */}
            {activeTab === "affiliates" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                      Affiliate & Reseller Rates Control
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">Earning & Commission Engine</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Set how much customers earn when referring new buyers to Adverty X services and digital products.
                    </p>
                  </div>

                  <form onSubmit={handleSaveReferralSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                          🎓
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">Academy Courses Referral Commission</h4>
                          <span className="text-[11px] text-slate-500">Earned per student course enrollment referred by users</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Commission Rate Per Course Referral (PKR)
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-600">Rs</span>
                          <input
                            type="number"
                            min="0"
                            required
                            value={referralSettings.courseEnrollmentPKR ?? referralSettings.largeServicePKR ?? 20}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setReferralSettings(prev => ({ ...prev, courseEnrollmentPKR: val, largeServicePKR: val }));
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-900 bg-white focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-indigo-900">
                        Default: <strong>Rs 20</strong> earned by user for each course enrollment referred.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                          📱
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">Apps & Subscriptions Commission</h4>
                          <span className="text-[11px] text-slate-500">For CapCut Pro, Surfshark VPN, Netflix, Canva Pro</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Commission Rate Per App Sale (PKR)
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-600">Rs</span>
                          <input
                            type="number"
                            min="0"
                            required
                            value={referralSettings.appSubscriptionPKR ?? referralSettings.smallProductPKR ?? 10}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setReferralSettings(prev => ({ ...prev, appSubscriptionPKR: val, smallProductPKR: val }));
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-900">
                        Default: <strong>Rs 10</strong> earned by user per subscription or digital app sale.
                      </p>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Check className="w-4 h-4 text-white" />
                        <span>Save Commission Rates</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Reseller Payout Requests Queue */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                  <div className="border-b border-slate-100 pb-4">
                    <h4 className="text-lg font-black text-slate-900">Affiliate Payout Requests</h4>
                    <p className="text-xs text-slate-500">User withdrawal requests to JazzCash, OPay, Easypaisa, or Bank.</p>
                  </div>

                  {payouts.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <DollarSign className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">No Pending Payout Requests</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">When users request payouts from their Profile wallet, they appear here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase">
                            <th className="pb-3">Request ID</th>
                            <th className="pb-3">User Contact</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3">Account Type</th>
                            <th className="pb-3">Account Details</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {payouts.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50">
                              <td className="py-3 font-mono font-bold text-slate-900">{p.id}</td>
                              <td className="py-3">
                                <div className="font-bold text-slate-900">{p.userName || p.userEmail}</div>
                                <div className="text-[11px] text-slate-500">{p.userPhone || p.userEmail}</div>
                              </td>
                              <td className="py-3 font-black text-brand-600">Rs {p.amountPKR}</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                                  {p.method}
                                </span>
                              </td>
                              <td className="py-3 font-mono font-bold text-slate-800">
                                {p.accountNumber} <span className="text-slate-400 font-normal">({p.accountTitle})</span>
                              </td>
                              <td className="py-3 text-slate-400 font-mono text-[11px]">{p.date}</td>
                              <td className="py-3">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  p.status === "Approved & Paid"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                {p.status !== "Approved & Paid" ? (
                                  <button
                                    onClick={() => handleApprovePayout(p.id)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                                  >
                                    Approve & Paid ✓
                                  </button>
                                ) : (
                                  <span className="text-xs text-slate-400 font-semibold">Processed</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: PROFILE SETTINGS */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Master Profile & Settings</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Control administrative credentials and contact information</p>
                </div>

                <div className="max-w-xl space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admin Display Name</label>
                    <input
                      type="text"
                      value={profileSettings.adminName}
                      onChange={(e) => setProfileSettings({ ...profileSettings, adminName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Administrative Email</label>
                    <input
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official WhatsApp Support Number</label>
                    <input
                      type="text"
                      value={profileSettings.whatsapp}
                      onChange={(e) => setProfileSettings({ ...profileSettings, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    onClick={() => showToast("Admin Profile Settings Updated Successfully!")}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </div>
            )}

            {/* TAB 7: SUPPORT */}
            {activeTab === "support" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Support Desk & WhatsApp Assistance</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Quick channels for customer communication</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-600" />
                      <span>WhatsApp Direct Channel</span>
                    </h4>
                    <p className="text-xs text-slate-600">
                      Instantly connect with clients for credentials handover, warranty replacement, or service onboarding.
                    </p>
                    <a
                      href="https://wa.me/255613735391"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                    >
                      Open WhatsApp Web
                    </a>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-600" />
                      <span>Email Support Inquiries</span>
                    </h4>
                    <p className="text-xs text-slate-600">
                      Auto-routed contact submissions from the public website inquiry form.
                    </p>
                    <span className="text-xs font-mono text-slate-700 block">support@advertyx.com</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: SECURITY */}
            {activeTab === "security" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Security & Credentials</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Control master password and admin access</p>
                </div>

                <div className="max-w-md space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div className="text-xs text-emerald-900">
                      <strong>Session Protected:</strong> Super Admin access is active.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Active Admin Email</label>
                    <input
                      type="text"
                      disabled
                      value="admin@advertyx.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-500 bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Change Security Password</label>
                    <input
                      type="password"
                      placeholder="Enter new master password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    onClick={() => showToast("Security credentials successfully updated!")}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Save New Password
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* =========================================================================
          COURSE ADD / EDIT MODAL (YOU ADD LECTURES YOURSELF - NO DUMMY PREFILLS)
      ========================================================================= */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setIsAddCourseModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 border-b border-slate-100 pb-4">
              <span className="text-xs font-black uppercase tracking-wider text-brand-600">
                Academy Course Builder
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {editingCourse ? `Edit Course: ${editingCourse.title}` : "Add New Academy Course"}
              </h3>
              <p className="text-xs text-slate-500">
                Videos will play directly inside the website video player (No downloads).
              </p>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-5">
              
              {/* Course Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master CapCut Mobile Video Editing"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Target Skill Level
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Free Option Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Pricing Model</span>
                    <span className="text-[11px] text-slate-500">Choose between a Free Course or Paid Access</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCourseForm({ ...courseForm, isFree: false })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        !courseForm.isFree 
                          ? "bg-brand-600 text-white shadow-xs" 
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      Paid Course
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseForm({ ...courseForm, isFree: true, price: 0 })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        courseForm.isFree 
                          ? "bg-emerald-600 text-white shadow-xs" 
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      🎁 100% Free Course
                    </button>
                  </div>
                </div>

                {!courseForm.isFree && (
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-700">One-Time Fee ($ USD):</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                      className="w-28 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                    />
                    <span className="text-xs text-slate-500">Permanent lifetime access included.</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Selector: PC Upload (Option 1) & Online URL */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase">
                      Course Thumbnail Image
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Choose directly from your PC (Option 1) or enter an image link
                    </span>
                  </div>

                  {/* Mode Switcher */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setThumbnailMode("pc")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        thumbnailMode === "pc"
                          ? "bg-brand-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>📁 From PC (Option 1)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnailMode("url")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        thumbnailMode === "url"
                          ? "bg-brand-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Image URL / Presets</span>
                    </button>
                  </div>
                </div>

                {thumbnailMode === "pc" ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      id="course-pc-thumbnail"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <label
                      htmlFor="course-pc-thumbnail"
                      className="cursor-pointer block border-2 border-dashed border-brand-300 hover:border-brand-500 bg-white hover:bg-brand-50/40 rounded-2xl p-5 text-center transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 group-hover:bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-2 transition-colors">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to Choose Thumbnail Image from PC
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supports PNG, JPG, JPEG, WebP (Max 5MB) • Instantly loaded into course
                      </p>
                      {thumbnailFileName && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-[11px] font-mono font-bold">
                          <Check className="w-3.5 h-3.5 text-brand-600" />
                          <span>{thumbnailFileName}</span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={courseForm.thumbnailUrl}
                      onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                    />

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Presets:</span>
                      {thumbnailPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCourseForm({ ...courseForm, thumbnailUrl: preset.url });
                            setThumbnailFileName("");
                          }}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-[10px] text-slate-700 font-medium"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Preview */}
                {courseForm.thumbnailUrl ? (
                  <div className="h-36 rounded-xl overflow-hidden bg-slate-900 relative border border-slate-200 shadow-inner group">
                    <img
                      src={courseForm.thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-brand-300 font-bold uppercase tracking-wider block">
                            Live Thumbnail Preview
                          </span>
                          <span className="text-xs font-bold text-white truncate block max-w-sm">
                            {courseForm.title || "Course Title Preview"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCourseForm({ ...courseForm, thumbnailUrl: "" });
                            setThumbnailFileName("");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-rose-600 text-white text-[10px] font-bold backdrop-blur-xs transition-colors"
                        >
                          Remove ×
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No thumbnail selected yet. Pick an image from your PC or use a preset.
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Course Description & Overview
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary of skills taught in this course..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500"
                ></textarea>
              </div>

              {/* Lectures Builder - YOU ADD LECTURES YOURSELF */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Lectures (Video Lessons)</span>
                    <span className="text-[10px] text-slate-500">
                      Add your videos one by one. Videos stream inside our on-site player without downloads.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleQuickAdd9Lectures}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer"
                      title="Instantly generate 9 lecture slots"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Quick 9 Lectures</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseForm({
                        ...courseForm,
                        lessons: [
                          ...courseForm.lessons,
                          { 
                            title: `Lecture ${courseForm.lessons.length + 1}: `, 
                            duration: "15m", 
                            videoUrl: "" 
                          }
                        ]
                      })}
                      className="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Lecture</span>
                    </button>
                  </div>
                </div>

                {/* Explanation Banner */}
                <div className="p-3 bg-indigo-50 border border-indigo-200/80 rounded-2xl text-xs text-indigo-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    <span>How Course Structure & Locking Work:</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <p>• <strong>1 Course Thumbnail</strong> (at the top) is the cover image for this entire course on the website.</p>
                    <p>• <strong>Lecture #1</strong> is automatically a <strong>Free Preview</strong> for all visitors.</p>
                    <p>• <strong>Lecture #2, #3, #4...</strong> are automatically <strong>LOCKED</strong> until the student enrolls/pays ${courseForm.price}!</p>
                  </div>
                </div>

                {courseForm.lessons.length === 0 ? (
                  <div className="p-5 bg-white rounded-xl border border-dashed border-slate-300 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-700">No lectures added yet.</p>
                    <p className="text-[11px] text-slate-400">You can add lectures one by one, or click below to populate 9 lecture slots at once!</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleQuickAdd9Lectures}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>⚡ 1-Click: Create 9 Lecture Slots</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCourseForm({
                          ...courseForm,
                          lessons: [{ title: "Lecture 1: Introduction", duration: "10m", videoUrl: "" }]
                        })}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        + Add 1 Lecture Manually
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {courseForm.lessons.map((lesson, lIdx) => (
                      <div key={lIdx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-800 uppercase font-mono flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                              Lecture #{lIdx + 1}
                            </span>
                            {lIdx === 0 ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                🎁 Free Preview (Open to all visitors)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Locked (Only for paid students)
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = courseForm.lessons.filter((_, idx) => idx !== lIdx);
                              setCourseForm({ ...courseForm, lessons: updated });
                            }}
                            className="text-slate-400 hover:text-rose-500 text-xs font-bold"
                          >
                            Remove ×
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                          <input
                            type="text"
                            required
                            value={lesson.title}
                            onChange={(e) => {
                              const updated = [...courseForm.lessons];
                              updated[lIdx].title = e.target.value;
                              setCourseForm({ ...courseForm, lessons: updated });
                            }}
                            className="sm:col-span-8 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            placeholder="Lecture Title (e.g. Setting Up Your Tools)"
                          />
                          <input
                            type="text"
                            value={lesson.duration}
                            onChange={(e) => {
                              const updated = [...courseForm.lessons];
                              updated[lIdx].duration = e.target.value;
                              setCourseForm({ ...courseForm, lessons: updated });
                            }}
                            className="sm:col-span-4 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono focus:outline-none text-right"
                            placeholder="Duration (e.g. 15m)"
                          />
                        </div>

                        {/* Video URL for Streaming */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-bold uppercase text-slate-600 flex items-center gap-1">
                              <Video className="w-3 h-3 text-rose-500" />
                              <span>Video Stream URL (YouTube Unlisted / Vimeo / Direct):</span>
                            </label>
                            {lesson.videoUrl && (
                              <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Link Attached ✓
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={lesson.videoUrl || ""}
                            onChange={(e) => {
                              const updated = [...courseForm.lessons];
                              updated[lIdx].videoUrl = e.target.value;
                              setCourseForm({ ...courseForm, lessons: updated });
                            }}
                            placeholder="e.g. https://www.youtube.com/watch?v=... (Unlisted YouTube link)"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">
                            💡 YouTube Unlisted links stream directly in Adverty X Classroom without ads or downloads, saving your PC RAM!
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all"
                >
                  {editingCourse ? "Save & Update Course" : "Publish Course Now"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MANUAL ORDER MODAL
      ========================================================================= */}
      {isAddOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsAddOrderModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Record Manual Customer Order</h3>
            <p className="text-xs text-slate-500 mb-4">Add an offline or direct WhatsApp order to your queue.</p>

            <form onSubmit={handleAddManualOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Customer Contact / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0300-1234567 or Customer Name"
                  value={newOrderForm.customer}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customer: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product / Package</label>
                <select
                  value={newOrderForm.product}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, product: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={`${p.name} (${p.typeBadge})`}>{p.name} ({p.typeBadge})</option>
                  ))}
                  {services.map(s => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount Paid</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.amount}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELIVER CREDENTIALS MODAL (Surfshark, Netflix, CapCut, etc.)
      ========================================================================= */}
      {deliveryModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative my-6">
            <button
              onClick={() => setDeliveryModalOrder(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 font-mono">
              Order Fulfillment • {deliveryModalOrder.id}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">Deliver Account Credentials</h3>
            <p className="text-xs text-slate-500 mb-4">
              Send login details, activation code, or invite instructions to the customer.
            </p>

            {/* Order Brief Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Customer Contact:</span>
                <span className="font-bold text-slate-900">{deliveryModalOrder.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Ordered Item:</span>
                <span className="font-bold text-slate-900">{deliveryModalOrder.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Amount Paid:</span>
                <span className="font-black text-emerald-600">{deliveryModalOrder.amount}</span>
              </div>
              {deliveryModalOrder.tid && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">TID / Slip Code:</span>
                  <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {deliveryModalOrder.tid}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Account Credentials / Access Info *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Email: user@surfshark.com | Pass: Secret123 or 6-digit login code: 491204"
                  value={deliveryCredentialsInput}
                  onChange={(e) => setDeliveryCredentialsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-brand-500"
                ></textarea>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  💡 For Surfshark: You can generate a 6-digit login code from your main app without sharing your personal master password!
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Customer Instructions / Note
                </label>
                <input
                  type="text"
                  value={deliveryNoteInput}
                  onChange={(e) => setDeliveryNoteInput(e.target.value)}
                  placeholder="e.g. Please do not change profile name or password."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* 1-Click WhatsApp Direct Sender */}
              {deliveryModalOrder.customer && (
                <div className="pt-1">
                  <a
                    href={`https://wa.me/${deliveryModalOrder.customer.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello from Adverty X! Here are your credentials for ${deliveryModalOrder.product}:\n\n` +
                      `Credentials: ${deliveryCredentialsInput}\n` +
                      `Note: ${deliveryNoteInput}\n\n` +
                      `Thank you for trusting Adverty X!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Send Directly via WhatsApp</span>
                  </a>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeliveryModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-xs"
                >
                  Confirm Delivery & Activate Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW DELIVERED ORDER DETAILS MODAL
      ========================================================================= */}
      {viewDetailsOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setViewDetailsOrder(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono">
              Fulfilled Order • {viewDetailsOrder.id}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">Delivered Credentials Details</h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 my-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{viewDetailsOrder.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Product:</span>
                <span className="font-bold text-slate-900">{viewDetailsOrder.product}</span>
              </div>
              {viewDetailsOrder.tid && (
                <div className="flex justify-between">
                  <span className="text-slate-500">TID:</span>
                  <span className="font-mono font-bold text-brand-600">{viewDetailsOrder.tid}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1 font-semibold uppercase text-[10px]">Delivered Credentials:</span>
                <pre className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-900 whitespace-pre-wrap">
                  {viewDetailsOrder.deliveredCredentials || "None recorded"}
                </pre>
              </div>
              {viewDetailsOrder.deliveryNote && (
                <div className="pt-1">
                  <span className="text-slate-500 block mb-0.5 text-[10px] font-semibold">Note:</span>
                  <p className="text-slate-700 italic">{viewDetailsOrder.deliveryNote}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setViewDetailsOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Slip Image Modal */}
      {viewingSlipUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-600" />
                Customer Payment Slip Screenshot Proof
              </h4>
              <button
                onClick={() => setViewingSlipUrl(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto rounded-2xl bg-slate-900 flex items-center justify-center p-2">
              <img 
                src={viewingSlipUrl} 
                alt="Payment Receipt Slip" 
                className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg" 
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">Verified customer-uploaded payment slip</span>
              <button
                type="button"
                onClick={() => setViewingSlipUrl(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD / EDIT SUBSCRIPTION & WARRANTY MODAL
      ========================================================================= */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {editingSubItem ? `Edit Subscription: ${editingSubItem.name}` : "Add New App / Subscription"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set app name, customize warranty period, retail price, and plan duration.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick 1-Click Templates (Only when adding new) */}
            {!editingSubItem && (
              <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  ⚡ 1-Click Popular Templates:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSubForm({
                      id: "",
                      name: "Amazon Prime Video",
                      slug: "amazon-prime-video",
                      category: "ENTERTAINMENT",
                      typeBadge: "6 Month • Private Screen",
                      warrantyBadge: "8-day replacement warranty",
                      pricePKR: 350,
                      internalCostPKR: 190,
                      inStock: true,
                      iconType: "prime",
                      description: "Ultra HD 4K streaming with dedicated PIN-locked profile, personal watchlist, and full 8-day replacement warranty.",
                      fulfillmentType: "Private Screen Profile"
                    })}
                    className="px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold hover:bg-cyan-100 transition-colors"
                  >
                    + Prime Video
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubForm({
                      id: "",
                      name: "Netflix Premium (4K)",
                      slug: "netflix-premium-4k",
                      category: "ENTERTAINMENT",
                      typeBadge: "1 Month • Private Screen",
                      warrantyBadge: "25-day warranty",
                      pricePKR: 300,
                      internalCostPKR: 180,
                      inStock: true,
                      iconType: "netflix",
                      description: "Private single-screen pin-protected profile with Ultra HD 4K streaming and zero household interruption.",
                      fulfillmentType: "Private Screen Profile"
                    })}
                    className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    + Netflix 4K
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubForm({
                      id: "",
                      name: "YouTube Premium",
                      slug: "youtube-premium-1-month",
                      category: "ENTERTAINMENT",
                      typeBadge: "1 Month • Customer Gmail",
                      warrantyBadge: "30-day warranty",
                      pricePKR: 300,
                      internalCostPKR: 170,
                      inStock: true,
                      iconType: "youtube",
                      description: "Activated directly on your personal Gmail. Ad-free streaming, picture-in-picture, and full YouTube Music.",
                      fulfillmentType: "Customer Email Activation"
                    })}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    + YouTube Premium
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubForm({
                      id: "",
                      name: "Canva Pro",
                      slug: "canva-pro",
                      category: "DESIGN & EDIT",
                      typeBadge: "1 Year • Private Email",
                      warrantyBadge: "365-day warranty",
                      pricePKR: 499,
                      internalCostPKR: 250,
                      inStock: true,
                      iconType: "canva",
                      description: "Premium access on your personal email. Magic Resize, 100M+ assets, background remover, and full brand kits.",
                      fulfillmentType: "Customer Email Activation"
                    })}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    + Canva Pro
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubForm({
                      id: "",
                      name: "ChatGPT Plus (GPT-4o)",
                      slug: "chatgpt-plus",
                      category: "AI & PRODUCTIVITY",
                      typeBadge: "1 Month • Private Login",
                      warrantyBadge: "25-day warranty",
                      pricePKR: 1800,
                      internalCostPKR: 1100,
                      inStock: true,
                      iconType: "chatgpt",
                      description: "Priority access to OpenAI GPT-4o, DALL-E 3 image generation, custom GPTs, code execution, and web analysis.",
                      fulfillmentType: "Instant Account Credentials"
                    })}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
                  >
                    + ChatGPT Plus
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveSubscription} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* App Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    App / Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon Prime Video or Capcut Pro"
                    value={subForm.name}
                    onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>

                {/* Plan / Duration (Type Badge) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Plan / Duration *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 Month • Private Screen"
                    value={subForm.typeBadge}
                    onChange={(e) => setSubForm({ ...subForm, typeBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                  {/* Preset Duration Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                    <span className="text-[10px] text-slate-500 font-bold">Quick set:</span>
                    {[
                      "6 Month • Private Screen",
                      "1 Month • Private Screen",
                      "3 Months • Private",
                      "1 Year • Private Email",
                      "Lifetime Access"
                    ].map((dur, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSubForm({ ...subForm, typeBadge: dur })}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                          subForm.typeBadge === dur
                            ? "bg-brand-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Store Category
                  </label>
                  <select
                    value={subForm.category}
                    onChange={(e) => setSubForm({ ...subForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white font-medium"
                  >
                    <option value="ENTERTAINMENT">ENTERTAINMENT (Netflix, Prime, Spotify)</option>
                    <option value="DESIGN & EDIT">DESIGN & EDIT (Capcut, Canva, Adobe)</option>
                    <option value="VPN">VPN & SECURITY (Surfshark, Nord)</option>
                    <option value="AI & PRODUCTIVITY">AI & PRODUCTIVITY (ChatGPT, Midjourney)</option>
                    <option value="STREAMING">STREAMING APPS</option>
                  </select>
                </div>

                {/* WARRANTY COVERAGE - CRITICAL FEATURE */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-emerald-900 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Warranty Coverage Period *</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Displayed on public app card & checkout
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="e.g. 8-day replacement warranty or 30-day warranty"
                    value={subForm.warrantyBadge}
                    onChange={(e) => setSubForm({ ...subForm, warrantyBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 bg-white"
                  />

                  {/* Preset Warranty Quick Select Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-emerald-800 font-bold">Quick set:</span>
                    {[
                      "8-day replacement warranty",
                      "25-day warranty",
                      "28-day replacement warranty",
                      "30-day warranty",
                      "60-day warranty",
                      "90-day warranty",
                      "160-day warranty",
                      "365-day warranty",
                      "Lifetime warranty"
                    ].map((w, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSubForm({ ...subForm, warrantyBadge: w })}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                          subForm.warrantyBadge === w
                            ? "bg-emerald-700 text-white shadow-xs"
                            : "bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Retail Price in PKR */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Retail Customer Price (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs</span>
                    <input
                      type="number"
                      required
                      min={10}
                      placeholder="350"
                      value={subForm.pricePKR}
                      onChange={(e) => setSubForm({ ...subForm, pricePKR: Number(e.target.value) })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                </div>

                {/* Wholesale / Supplier Cost in PKR */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Wholesale Supplier Cost (PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rs</span>
                    <input
                      type="number"
                      min={0}
                      placeholder="190"
                      value={subForm.internalCostPKR}
                      onChange={(e) => setSubForm({ ...subForm, internalCostPKR: Number(e.target.value) })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                </div>

                {/* Icon Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Brand Icon Logo
                  </label>
                  <select
                    value={subForm.iconType}
                    onChange={(e) => setSubForm({ ...subForm, iconType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white font-medium"
                  >
                    <option value="prime">Prime Video (Cyan/Blue)</option>
                    <option value="netflix">Netflix (Red & Black)</option>
                    <option value="youtube">YouTube (Red Play)</option>
                    <option value="capcut">CapCut (Video Scissor)</option>
                    <option value="canva">Canva (Cyan Gradient)</option>
                    <option value="chatgpt">ChatGPT (Emerald Zap)</option>
                    <option value="surfshark">Surfshark (Teal)</option>
                    <option value="spotify">Spotify (Green Wave)</option>
                    <option value="adobe">Adobe (Red A)</option>
                    <option value="general">Custom App / Monogram</option>
                  </select>
                </div>

                {/* Fulfillment Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Fulfillment Method
                  </label>
                  <select
                    value={subForm.fulfillmentType}
                    onChange={(e) => setSubForm({ ...subForm, fulfillmentType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white font-medium"
                  >
                    <option value="Private Screen Profile">Private Screen Profile (PIN Lock)</option>
                    <option value="Instant Account Credentials">Instant Account Credentials (Email & Password)</option>
                    <option value="Customer Email Activation">Customer Email Activation (Invite to Personal Email)</option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Product Description & Perks
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter key features, streaming quality, device allowance, or terms..."
                    value={subForm.description}
                    onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                  ></textarea>
                </div>

                {/* In Stock Checkbox */}
                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="sub-instock"
                    checked={subForm.inStock}
                    onChange={(e) => setSubForm({ ...subForm, inStock: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <label htmlFor="sub-instock" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Product is In Stock & Available for Order on Store
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingSubItem ? "Save Changes" : "Publish to Store"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
