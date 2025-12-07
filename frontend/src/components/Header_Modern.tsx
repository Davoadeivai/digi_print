import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
    Menu,
    Phone,
    Mail,
    Clock,
    ArrowLeft,
    Sparkles,
    Search,
    ChevronDown,
    X,
    User,
    LogOut,
    Package,
    Settings,
    Star,
    Zap,
    Bell,
    Heart,
    ShoppingCart,
    Flame
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

// ==================== Enhanced Constants ====================
const BRAND = {
    name: 'دیجی چاپوگراف',
    shortName: 'DG',
    tagline: 'چاپ و گرافیک دیجیتال حرفه‌ای',
} as const;

const CONTACT_INFO = {
    phone: '۰۲۱-۱۲۳۴۵۶۷۸',
    phoneRaw: '+982112345678',
    email: 'info@digichapograph.com',
    workingHours: 'شنبه تا پنجشنبه: ۸:۰۰ - ۱۸:۰۰',
} as const;

const PRODUCT_CATEGORIES = [
    { id: '1', name: 'لیبل و برچسب', slug: 'label', icon: '🏷️', color: 'from-orange-400 to-pink-500' },
    { id: '2', name: 'جعبه و کارتن', slug: 'box', icon: '📦', color: 'from-blue-400 to-purple-500' },
    { id: '3', name: 'ساک دستی', slug: 'bag', icon: '🛍️', color: 'from-green-400 to-teal-500' },
    { id: '4', name: 'بسته‌بندی', slug: 'packaging', icon: '🎁', color: 'from-red-400 to-rose-500' },
    { id: '5', name: 'لیوان کاغذی', slug: 'cup', icon: '☕', color: 'from-amber-400 to-orange-500' },
    { id: '6', name: 'کاتالوگ', slug: 'catalog', icon: '📖', color: 'from-cyan-400 to-blue-500' },
    { id: '7', name: 'کارت ویزیت', slug: 'card', icon: '💳', color: 'from-violet-400 to-purple-500' },
] as const;

const NAVIGATION = [
    { id: 'home', name: 'خانه', page: 'home' },
    { id: 'products', name: 'محصولات', page: 'products', badge: 'جدید', hasDropdown: true },
    { id: 'services', name: 'خدمات', page: 'services' },
    { id: 'portfolio', name: 'نمونه کارها', page: 'portfolio' },
    { id: 'about', name: 'درباره ما', page: 'about' },
    { id: 'contact', name: 'تماس', page: 'contact' },
];

// ==================== Enhanced Logo Component ====================
const ModernLogo = memo(function ModernLogo({ onClick }: { onClick: () => void }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Enhanced Logo with 3D Effect */}
            <div className="relative">
                <motion.div
                    className="relative w-12 h-12"
                    animate={isHovered ? { rotateY: 360 } : { rotateY: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Glow Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 rounded-2xl blur-xl opacity-50"
                        animate={isHovered ? { scale: 1.2, opacity: 0.7 } : { scale: 1, opacity: 0.5 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Main Logo */}
                    <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 border border-white/20">
                        <span className="text-white font-black text-xl tracking-tighter">
                            {BRAND.shortName}
                        </span>
                    </div>

                    {/* Animated Particles */}
                    <AnimatePresence>
                        {isHovered && (
                            <>
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-purple-400 rounded-full"
                                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            scale: [0, 1, 0],
                                            x: [0, (Math.random() - 0.5) * 40],
                                            y: [0, (Math.random() - 0.5) * 40],
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                    />
                                ))}
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Status Indicator */}
                <motion.span
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            </div>

            {/* Brand Text */}
            <div className="hidden sm:block">
                <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                    {BRAND.name}
                </h1>
                <p className="text-[10px] text-muted-foreground font-medium tracking-wide">
                    {BRAND.tagline}
                </p>
            </div>
        </motion.div>
    );
});

// ==================== Magnetic Button Component ====================
interface MagneticButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    isActive?: boolean;
}

const MagneticButton = memo(function MagneticButton({
    children,
    onClick,
    className,
    isActive
}: MagneticButtonProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springConfig = { damping: 15, stiffness: 150 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.1);
        y.set((e.clientY - centerY) * 0.1);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: xSpring, y: ySpring }}
            className={cn(
                "relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                isActive
                    ? "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-gray-100 dark:hover:bg-gray-800",
                className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}

            {/* Active Indicator */}
            {isActive && (
                <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </motion.button>
    );
});

// ==================== Floating Mega Menu ====================
interface FloatingMegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (slug: string) => void;
}

const FloatingMegaMenu = memo(function FloatingMegaMenu({
    isOpen,
    onClose,
    onSelect
}: FloatingMegaMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute top-full right-0 mt-4 w-[650px] max-w-[calc(100vw-2rem)] z-50"
                    >
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden">
                            {/* Gradient Header */}
                            <div className="relative px-8 py-6 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                />

                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-black text-2xl mb-1">محصولات ما</h3>
                                        <p className="text-purple-100 text-sm">بهترین کیفیت چاپ را تجربه کنید</p>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="w-10 h-10 text-white/40" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Categories Grid */}
                            <div className="p-6">
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        visible: { transition: { staggerChildren: 0.05 } }
                                    }}
                                >
                                    {PRODUCT_CATEGORIES.map((category) => (
                                        <motion.button
                                            key={category.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                            onClick={() => {
                                                onSelect(category.slug);
                                                onClose();
                                            }}
                                            className="group relative p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 hover:from-white hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 text-right overflow-hidden"
                                            whileHover={{ scale: 1.03, y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {/* Gradient Overlay */}
                                            <div className={cn(
                                                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br",
                                                category.color
                                            )} />

                                            <div className="relative flex items-start gap-3">
                                                <motion.span
                                                    className="text-3xl"
                                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    {category.icon}
                                                </motion.span>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
                                                        {category.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">مشاهده محصولات</p>
                                                </div>
                                                <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border-t border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        onSelect('all');
                                        onClose();
                                    }}
                                    className="group flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    <span>مشاهده همه محصولات</span>
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                </button>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="font-medium">بیش از ۱۰۰۰ مشتری راضی</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

// ==================== Main Header Component ====================
export function Header() {
    const { navigate, currentPage } = useNavigation();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
    const headerY = useTransform(scrollY, [0, 100], [0, -5]);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation handler
    const handleNavigate = useCallback((page: string, data?: Record<string, string>) => {
        if (page === 'category' && data?.slug) {
            navigate('category', data);
        } else if (page === 'products') {
            navigate('products');
        } else {
            navigate(page as any);
        }
        setIsMenuOpen(false);
        setActiveDropdown(null);
    }, [navigate]);

    return (
        <motion.header
            style={{ opacity: headerOpacity, y: headerY }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled
                    ? "py-2"
                    : "py-4"
            )}
        >
            <div className="container mx-auto px-4">
                {/* Floating Navbar */}
                <motion.div
                    className={cn(
                        "relative rounded-3xl transition-all duration-500",
                        isScrolled
                            ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 border border-white/20 dark:border-gray-800/50"
                            : "bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl border border-white/10 dark:border-gray-800/30"
                    )}
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                        <motion.div
                            className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.5, 0.3, 0.5],
                            }}
                            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        />
                    </div>

                    <div className="relative px-6 py-4">
                        <div className="flex items-center justify-between gap-8">
                            {/* Logo */}
                            <ModernLogo onClick={() => handleNavigate('home')} />

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center gap-2">
                                {NAVIGATION.map((item) => {
                                    const isActive = currentPage === item.page || currentPage === item.id;
                                    const isDropdownOpen = activeDropdown === item.id;

                                    if (item.hasDropdown) {
                                        return (
                                            <div
                                                key={item.id}
                                                className="relative"
                                                onMouseEnter={() => setActiveDropdown(item.id)}
                                                onMouseLeave={() => setActiveDropdown(null)}
                                            >
                                                <MagneticButton isActive={isDropdownOpen}>
                                                    <span>{item.name}</span>
                                                    {item.badge && (
                                                        <Badge className="ml-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5 py-0 border-0">
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                    <motion.div
                                                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <ChevronDown className="w-4 h-4 ml-1" />
                                                    </motion.div>
                                                </MagneticButton>

                                                <FloatingMegaMenu
                                                    isOpen={isDropdownOpen}
                                                    onClose={() => setActiveDropdown(null)}
                                                    onSelect={(slug) => handleNavigate('category', { slug })}
                                                />
                                            </div>
                                        );
                                    }

                                    return (
                                        <MagneticButton
                                            key={item.id}
                                            onClick={() => handleNavigate(item.page)}
                                            isActive={isActive}
                                        >
                                            {item.name}
                                        </MagneticButton>
                                    );
                                })}
                            </nav>

                            {/* Right Actions */}
                            <div className="flex items-center gap-3">
                                {/* Search */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.button
                                                className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            </motion.button>
                                        </TooltipTrigger>
                                        <TooltipContent>جستجو (Ctrl+K)</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {/* Notifications */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.button
                                                className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                <motion.span
                                                    className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                />
                                            </motion.button>
                                        </TooltipTrigger>
                                        <TooltipContent>اعلان‌ها</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {/* User Menu or Auth Buttons */}
                                {user ? (
                                    <motion.button
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors backdrop-blur-sm"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleNavigate('dashboard')}
                                    >
                                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                            {user.full_name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="hidden lg:block text-right">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">
                                                {user.full_name || 'کاربر'}
                                            </p>
                                            <p className="text-xs text-gray-500 leading-tight">حساب کاربری</p>
                                        </div>
                                    </motion.button>
                                ) : (
                                    <div className="hidden md:flex items-center gap-2">
                                        <motion.button
                                            onClick={() => handleNavigate('login')}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            ورود
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleNavigate('register')}
                                            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                ثبت نام رایگان
                                            </span>
                                        </motion.button>
                                    </div>
                                )}

                                {/* Mobile Menu */}
                                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                    <SheetTrigger asChild>
                                        <motion.button
                                            className="lg:hidden p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        </motion.button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                        <div className="flex flex-col gap-4 mt-8">
                                            {NAVIGATION.map((item) => (
                                                <Button
                                                    key={item.id}
                                                    variant="ghost"
                                                    className="justify-start text-lg"
                                                    onClick={() => handleNavigate(item.page)}
                                                >
                                                    {item.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.header>
    );
}
