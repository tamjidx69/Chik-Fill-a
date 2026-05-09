/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Search, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Bell,
  CreditCard,
  Gift,
  Truck,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- BRAND IDENTITY CONSTANTS ---
const COLORS = {
  primary: '#E4002B', // Chick-fil-A Red
  white: '#FFFFFF',
  gold: '#DD0031',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    300: '#D1D5DB',
    600: '#4B5563',
    900: '#111827',
  }
};

// --- TYPES ---
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  emoji: string;
  gradient: string;
}

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  occasion: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
}

// --- DATA ---
const MENU_ITEMS: MenuItem[] = [
  { 
    id: '1', 
    name: 'Classic Chicken Sandwich', 
    description: 'Freshly breaded, pressure-cooked in peanut oil.', 
    price: '$5.49', 
    emoji: '🍔',
    gradient: 'from-orange-100 to-red-100'
  },
  { 
    id: '2', 
    name: 'Spicy Deluxe', 
    description: 'A spicy breast with pepper jack cheese and lettuce.', 
    price: '$6.59', 
    emoji: '🔥',
    gradient: 'from-red-100 to-orange-200'
  },
  { 
    id: '3', 
    name: 'Waffle Potato Fries', 
    description: 'Crispy, salty, and perfect with any meal.', 
    price: '$2.99', 
    emoji: '🍟',
    gradient: 'from-yellow-100 to-orange-100'
  },
  { 
    id: '4', 
    name: 'Chick-fil-A Sauce', 
    description: 'The legendary blend of honey mustard and BBQ.', 
    price: '$0.00', 
    emoji: '🍯',
    gradient: 'from-yellow-200 to-yellow-400'
  },
];

const TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Sarah M.', quote: "The best customer service ever. My fries were piping hot!", rating: 5, occasion: 'Lunch' },
  { id: '2', name: 'David L.', quote: "The Spicy Deluxe is a spiritual experience. 10/10.", rating: 5, occasion: 'Dinner' },
  { id: '3', name: 'James K.', quote: "Always consistent, always delicious. Love the mobile app!", rating: 5, occasion: 'Catering' },
  { id: '4', name: 'Emma W.', quote: "Perfect for my daughter's birthday party. Staff was amazing.", rating: 5, occasion: 'Party' },
];

const FAKE_LOCATIONS: Location[] = [
  { id: 'l1', name: 'Chick-fil-A Peachtree Center', address: '231 Peachtree St NE, Atlanta, GA', hours: '6:30 AM - 10:00 PM', phone: '(404) 555-0123' },
  { id: 'l2', name: 'Chick-fil-A West End', address: '855 West Peachtree St NW, Atlanta, GA', hours: '6:00 AM - 11:00 PM', phone: '(404) 555-0456' },
  { id: 'l3', name: 'Chick-fil-A Midtown', address: '1100 Northside Dr NW, Atlanta, GA', hours: '6:30 AM - 10:00 PM', phone: '(404) 555-0789' },
];

const RECENT_ORDERS = [
  { name: 'James in Atlanta', item: 'Spicy Deluxe' },
  { name: 'Amy in Dallas', item: 'Classic Sandwich' },
  { name: 'Michael in Charlotte', item: 'Waffle Fries' },
  { name: 'Jessica in Orlando', item: 'Cobb Salad' },
  { name: 'Robert in Nashville', item: 'Chicken Nuggets' },
];

// --- COMPONENTS ---

const SectionTitle = ({ children, centered = true }: { children: React.ReactNode, centered?: boolean }) => (
  <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-gray-900 tracking-tight ${centered ? 'text-center' : ''}`}>
    {children}
  </h2>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }) => {
  const baseStyles = "px-6 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: `bg-[#E4002B] text-white hover:bg-[#C20025] shadow-lg hover:shadow-xl`,
    secondary: `bg-[#DD0031] text-white hover:bg-[#C20025]`,
    outline: `border-2 border-[#E4002B] text-[#E4002B] hover:bg-red-50`,
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentToastIdx, setCurrentToastIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchZip, setSearchZip] = useState('');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // --- HOOKS ---

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exit intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exit-modal-shown')) {
        setShowExitModal(true);
        sessionStorage.setItem('exit-modal-shown', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Countdown urgency
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  // Social Proof Toast
  useEffect(() => {
    const interval = setInterval(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setCurrentToastIdx(prev => (prev + 1) % RECENT_ORDERS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchZip.length >= 5) {
      setLocations(FAKE_LOCATIONS);
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-red-200">
      
      {/* --- NOTIFICATIONS / TOASTS --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 20, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.8 }}
            className="fixed bottom-24 left-0 z-50 p-4 bg-white rounded-xl shadow-2xl border border-gray-100 flex items-center gap-3 w-72"
          >
            <div className="bg-red-100 p-2 rounded-full">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{RECENT_ORDERS[currentToastIdx].name}</p>
              <p className="text-xs text-gray-600">just ordered a {RECENT_ORDERS[currentToastIdx].item}!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- EXIT INTENT MODAL --- */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
            >
              <button 
                onClick={() => setShowExitModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Wait! Don't Miss Out!</h3>
                <p className="text-gray-600 mb-6">Join Chick-fil-A One today and get a free Waffle Fry on your first visit.</p>
                <Button className="w-full mb-3">Claim My Free Fries</Button>
                <button onClick={() => setShowExitModal(false)} className="text-sm font-medium text-gray-400 hover:text-gray-600 underline">
                  No thanks, I'll pay full price
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- STICKY NAV --- */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-[#E4002B] font-bold text-3xl italic tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Chick-fil-A</div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 font-bold text-sm">
            <a href="#menu" className={`hover:text-[#E4002B] ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>Menu</a>
            <a href="#locations" className={`hover:text-[#E4002B] ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>Locations</a>
            <a href="#catering" className={`hover:text-[#E4002B] ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>Catering</a>
            <a href="#rewards" className={`hover:text-[#E4002B] ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}>Rewards</a>
            <Button variant="primary" className="hidden sm:flex px-8 py-2">Order Now</Button>
          </div>

          <button className="lg:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu className={`w-8 h-8 ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-50 bg-white p-8 flex flex-col gap-8"
          >
            <div className="flex justify-between items-center">
              <div className="text-[#E4002B] font-bold text-3xl italic tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Chick-fil-A</div>
              <button onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8" /></button>
            </div>
            <div className="flex flex-col gap-6 text-2xl font-bold">
              <a href="#menu" onClick={() => setIsMenuOpen(false)}>Menu</a>
              <a href="#locations" onClick={() => setIsMenuOpen(false)}>Locations</a>
              <a href="#catering" onClick={() => setIsMenuOpen(false)}>Catering</a>
              <a href="#rewards" onClick={() => setIsMenuOpen(false)}>Rewards</a>
            </div>
            <Button className="w-full text-xl py-4 mt-auto">Order Now</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Gradient Simulator */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-orange-500 opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-30" />
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
          
          {/* Animated food circles (simulating floating ingredients) */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            {/* URGENCY BAR */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30 text-white font-medium text-sm">
              <Clock className="w-4 h-4" />
              <span>Lunch Deal ends in <span className="font-bold underline">{formatTime(timeLeft)}</span></span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6">
              MORE THAN A MEAL.<br /><span className="text-red-100">IT'S AN EXPERIENCE.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl font-medium">
              Fresh, hand-breaded chicken made with care, served with a smile. Every day (except Sundays).
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" className="text-lg px-10 py-5">
                Order Online <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="text-lg px-10 py-5 border-white text-white hover:bg-white hover:text-red-600">
                Find a Location
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- FAN FAVORITES --- */}
      <section id="menu" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle>Fan Favorites</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MENU_ITEMS.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${item.gradient} opacity-50 -z-10 group-hover:opacity-100 transition-opacity`} />
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.emoji}</div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-[10px] font-bold text-gray-400 ml-1">TOP RATED</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-black text-gray-900">{item.price}</span>
                  <button className="bg-gray-100 group-hover:bg-red-600 p-3 rounded-full text-gray-900 group-hover:text-white transition-all shadow-sm">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Trust Signal */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span className="text-[8px] font-bold">FRESH</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST & SOCIAL PROOF BAR --- */}
      <section className="py-12 bg-[#E4002B] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-black mb-1">#1 RANKED</div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest text-red-100">Customer Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black mb-1">2,800+</div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest text-red-100">Locations Nationwide</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black mb-1 italic">CLOSED SUNDAYS</div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest text-red-100">Rest Matters Most</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black mb-1">NEVER FROZEN</div>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest text-red-100">Always Fresh Chicken</p>
          </div>
        </div>
      </section>

      {/* --- REWARDS SECTION --- */}
      <section id="rewards" className="py-24 overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
                <Gift className="w-4 h-4" /> Exclusive Offer
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Earn Points.<br />Eat More Chicken.</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                Join the Chick-fil-A One® loyalty program and earn points for every qualifying purchase. Redeem them for your favorite treats and unlock exclusive tiers.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg"><CreditCard className="w-5 h-5 text-gray-600" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400">STARTER</p>
                    <p className="font-bold">Member</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-red-600" /></div>
                  <div>
                    <p className="text-xs font-bold text-red-400">TIER 2</p>
                    <p className="font-bold">Silver</p>
                  </div>
                </div>
              </div>

              <Button variant="primary" className="px-10">Join for Free</Button>
            </div>
            
            <div className="relative">
              {/* Phone Mockup Simulator */}
              <div className="w-[300px] h-[600px] bg-gray-900 rounded-[50px] border-[12px] border-gray-800 shadow-2xl mx-auto relative overflow-hidden group">
                <div className="absolute top-0 w-32 h-6 bg-gray-800 left-1/2 -translate-x-1/2 rounded-b-2xl z-10" />
                <div className="h-full bg-white p-6 pt-10">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-full" />
                    <div className="w-10 h-2 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-32 bg-red-500 rounded-2xl p-4 text-white flex flex-col justify-end">
                      <p className="text-[10px] opacity-70">CURRENT POINTS</p>
                      <p className="text-2xl font-bold">1,240 pts</p>
                    </div>
                    <div className="h-8 w-2/3 bg-gray-100 rounded" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-gray-50 rounded-xl" />
                      <div className="h-24 bg-gray-50 rounded-xl" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><Phone className="w-5 h-5 text-gray-400" /></div>
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg"><ArrowRight className="w-5 h-5 text-white" /></div>
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-[20%] bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white">★</div>
                <span className="text-xs font-bold">RED TIER UNLOCKED</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATERING SECTION --- */}
      <section id="catering" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/10 backdrop-blur-md rounded-[40px] p-8 md:p-16 border border-white/20 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-6">Feed the Whole Crew</h2>
                <p className="text-xl text-white/80 mb-8 max-w-lg">
                  From office lunches to wedding receptions — we've got you covered with our iconic flavors and world-class service.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Truck className="w-5 h-5" /></div>
                    <span className="font-bold">Contactless Delivery Available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Menu className="w-5 h-5" /></div>
                    <span className="font-bold">Customizable Party Platters</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-3xl p-8 text-gray-900 shadow-2xl">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Name</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" placeholder="First Last" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Email</label>
                      <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" placeholder="you@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Event Date</label>
                      <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Guest Count</label>
                      <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none" placeholder="50" />
                    </div>
                  </div>
                  <Button variant="primary" className="w-full">Request My Quote</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionTitle>What People Are Saying</SectionTitle>
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={testimonialIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-50 rounded-[40px] p-12 relative"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(TESTIMONIALS[testimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 italic">
                  "{TESTIMONIALS[testimonialIdx].quote}"
                </p>
                <div className="flex flex-col items-center">
                  <p className="font-bold text-lg">{TESTIMONIALS[testimonialIdx].name}</p>
                  <p className="text-red-500 font-bold uppercase text-xs tracking-widest">{TESTIMONIALS[testimonialIdx].occasion}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={() => setTestimonialIdx(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="p-3 rounded-full border border-gray-200 hover:bg-white hover:shadow-lg transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setTestimonialIdx(prev => (prev + 1) % TESTIMONIALS.length)}
                className="p-3 rounded-full border border-gray-200 hover:bg-white hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOCATION FINDER --- */}
      <section id="locations" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-lg">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Find a Chicken Near You</h2>
              <p className="text-lg text-gray-600">Enter your zip code to discover your local Chick-fil-A and check current hours.</p>
            </div>
            <form onSubmit={handleLocationSearch} className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={searchZip}
                onChange={(e) => setSearchZip(e.target.value)}
                placeholder="Enter ZIP code..." 
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none font-bold" 
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-red-600 text-white px-4 rounded-xl font-bold hover:bg-red-700 transition-colors">Search</button>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {locations.length > 0 ? (
                locations.map((loc, idx) => (
                  <motion.div 
                    key={loc.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
                  >
                    <h4 className="text-xl font-bold">{loc.name}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> {loc.address}</div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-500" /> {loc.hours}</div>
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-red-500" /> {loc.phone}</div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">Get Directions</Button>
                  </motion.div>
                ))
              ) : (
                <div className="lg:col-span-3 h-64 bg-white rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <MapPin className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold">Search above to find local restaurants</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto bg-red-600 rounded-[50px] p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 blur-3xl -z-10 animate-pulse" />
          <h2 className="text-4xl font-black mb-4">Get the Good Stuff First</h2>
          <p className="text-lg text-red-100 mb-8 italic">Exclusive deals, new menu drops, and more — straight to your inbox.</p>
          
          <AnimatePresence mode="wait">
            {!isSubscribed ? (
              <motion.form 
                key="form"
                exit={{ opacity: 0, y: -20 }}
                onSubmit={(e) => { e.preventDefault(); setIsSubscribed(true); }}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <input type="email" placeholder="Enter your email" className="flex-1 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-red-200 outline-none focus:ring-2 focus:ring-white" required />
                <Button variant="secondary" className="bg-white text-red-600 hover:bg-red-50">Subscribe</Button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-4"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"><CheckCircle2 className="w-10 h-10" /></div>
                <p className="text-2xl font-bold">You're in! Check your inbox soon.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <div className="text-[#E4002B] font-bold text-3xl italic tracking-tighter mb-4" style={{ fontFamily: 'Georgia, serif' }}>Chick-fil-A</div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Serving our communities since 1946. Committed to service, hospitality, and of course, great chicken.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-red-500" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-red-500" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-red-500" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-red-500" />
            </div>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-red-500">Menu</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Sandwiches</a></li>
              <li><a href="#" className="hover:text-white">Nuggets & Strips</a></li>
              <li><a href="#" className="hover:text-white">Salads</a></li>
              <li><a href="#" className="hover:text-white">Sides & Treats</a></li>
              <li><a href="#" className="hover:text-white">Breakfast</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-red-500">Company</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="hover:text-white">Catering</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Franchising</a></li>
              <li><a href="#" className="hover:text-white">Sustainability</a></li>
            </ul>
          </div>
          
          <div className="col-span-2 lg:col-span-2">
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest text-red-500">Get the App</h5>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10 group">
                <div className="p-2 bg-white/10 rounded group-hover:bg-red-600 transition-colors"><ChevronRight className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] opacity-60">Download on</p>
                  <p className="text-sm font-bold">App Store</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/10 group">
                <div className="p-2 bg-white/10 rounded group-hover:bg-red-600 transition-colors"><ArrowRight className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] opacity-60">Get it on</p>
                  <p className="text-sm font-bold">Google Play</p>
                </div>
              </div>
            </div>
            
            {/* CLOSED SUNDAY BADGE */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-600/10 border border-red-600/30 rounded-2xl">
              <Clock className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-tighter">Closed Sundays</p>
                <p className="text-[10px] text-gray-400">See you on Monday morning!</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
          <p>© 2025 CFA Properties, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Accessibility</a>
          </div>
        </div>
      </footer>

      {/* --- STICKY MOBILE CTA BAR --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex gap-4 items-center">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Current Store</p>
          <p className="text-sm font-black truncate">Peachtree Center</p>
        </div>
        <Button variant="primary" className="flex-1 py-3 shadow-red-200">Order Now</Button>
      </div>

    </div>
  );
}
