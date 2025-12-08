import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { WalletService } from '../../services/api';
import { toast } from 'sonner';
import {
    Loader2,
    Wallet,
    TrendingUp,
    TrendingDown,
    Plus,
    ArrowRight,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    ShoppingCart,
    Gift,
    Calendar,
    Sparkles,
    Zap
} from 'lucide-react';

interface WalletData {
    balance: number;
    currency: string;
    is_active: boolean;
}

interface Transaction {
    id: number;
    amount: number;
    type: string;
    reference_id: string;
    description: string;
    created_at: string;
}

const transactionTypeIcons: Record<string, any> = {
    deposit: ArrowDownRight,
    withdraw: ArrowUpRight,
    refund: RefreshCw,
    purchase: ShoppingCart,
    bonus: Gift,
};

const transactionTypeLabels: Record<string, string> = {
    deposit: 'واریز',
    withdraw: 'برداشت',
    refund: 'بازگشت وجه',
    purchase: 'خرید',
    bonus: 'جایزه',
};

const transactionTypeColors: Record<string, string> = {
    deposit: 'from-emerald-500 to-teal-500',
    withdraw: 'from-rose-500 to-pink-500',
    refund: 'from-blue-500 to-cyan-500',
    purchase: 'from-orange-500 to-amber-500',
    bonus: 'from-purple-500 to-pink-500',
};

export default function UserWalletPage() {
    const { user } = useAuth();
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isChargeDialogOpen, setIsChargeDialogOpen] = useState(false);
    const [chargeAmount, setChargeAmount] = useState('');
    const [charging, setCharging] = useState(false);

    useEffect(() => {
        loadWalletData();
    }, []);

    const loadWalletData = async () => {
        try {
            const mockWallet: WalletData = {
                balance: 5000000,
                currency: 'تومان',
                is_active: true,
            };

            const mockTransactions: Transaction[] = [
                {
                    id: 1,
                    amount: 2000000,
                    type: 'deposit',
                    reference_id: 'DEP-12345',
                    description: 'شارژ کیف پول',
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 2,
                    amount: 500000,
                    type: 'purchase',
                    reference_id: 'ORD-1234',
                    description: 'خرید سفارش #ORD-1234',
                    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 3,
                    amount: 3500000,
                    type: 'deposit',
                    reference_id: 'DEP-12344',
                    description: 'شارژ کیف پول',
                    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 4,
                    amount: 100000,
                    type: 'bonus',
                    reference_id: 'BON-001',
                    description: 'جایزه خوش‌آمدگویی',
                    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ];

            setWallet(mockWallet);
            setTransactions(mockTransactions);
        } catch (error) {
            console.error('خطا در بارگذاری کیف پول:', error);
            toast.error('خطا در بارگذاری اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const handleChargeWallet = async () => {
        const amount = parseInt(chargeAmount.replace(/,/g, ''));

        if (!amount || amount < 10000) {
            toast.error('حداقل مبلغ شارژ ۱۰,۰۰۰ تومان است');
            return;
        }

        setCharging(true);
        try {
            await WalletService.chargeWallet(amount);
            toast.success('درخواست شارژ با موفقیت ثبت شد');
            setIsChargeDialogOpen(false);
            setChargeAmount('');
            loadWalletData();
        } catch (error) {
            console.error('خطا در شارژ کیف پول:', error);
            toast.error('خطا در ثبت درخواست');
        } finally {
            setCharging(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('fa-IR');
    };

    const handleAmountChange = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setChargeAmount(numericValue ? parseInt(numericValue).toLocaleString('fa-IR') : '');
    };

    if (!user) {
        navigate('login');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-emerald-600" />
                    <div className="absolute inset-0 blur-xl bg-emerald-400 opacity-20 animate-pulse"></div>
                </div>
            </div>
        );
    }

    const totalDeposits = transactions
        .filter(t => ['deposit', 'refund', 'bonus'].includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdraws = transactions
        .filter(t => ['withdraw', 'purchase'].includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.2); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.3); }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .wallet-card-3d {
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        .wallet-card-3d:hover {
          transform: rotateY(5deg) rotateX(5deg);
        }
        .transaction-item {
          animation: slide-up 0.5s ease-out;
        }
        .transaction-item:nth-child(1) { animation-delay: 0.1s; }
        .transaction-item:nth-child(2) { animation-delay: 0.2s; }
        .transaction-item:nth-child(3) { animation-delay: 0.3s; }
        .transaction-item:nth-child(4) { animation-delay: 0.4s; }
      `}</style>

            <div className="container mx-auto px-4">
                {/* Floating Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                {/* Header */}
                <div className="mb-8 relative">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('dashboard')}
                        className="mb-4 glass-card hover:scale-105 transition-all duration-300"
                    >
                        <ArrowRight className="w-4 h-4 ml-2" />
                        بازگشت به داشبورد
                    </Button>
                    <div className="flex items-center gap-3 mb-2">
                        <Wallet className="w-8 h-8 text-emerald-600 animate-pulse" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                            کیف پول
                        </h1>
                    </div>
                    <p className="text-gray-600 mr-11">مدیریت موجودی و تراکنش‌ها</p>
                </div>

                {/* Wallet Balance Card - 3D Effect */}
                <div className="wallet-card-3d glass-card rounded-3xl p-8 mb-8 relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-emerald-100 text-sm mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    موجودی کیف پول
                                </p>
                                <div className="flex items-baseline gap-3">
                                    <h2 className="text-5xl font-bold text-white">
                                        {formatCurrency(wallet?.balance || 0)}
                                    </h2>
                                    <span className="text-2xl text-emerald-100">{wallet?.currency}</span>
                                </div>
                            </div>
                            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                                <Wallet className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Dialog open={isChargeDialogOpen} onOpenChange={setIsChargeDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex-1">
                                        <Plus className="w-5 h-5 ml-2" />
                                        شارژ کیف پول
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-card">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            شارژ کیف پول
                                        </DialogTitle>
                                        <DialogDescription>
                                            مبلغ مورد نظر برای شارژ کیف پول را وارد کنید
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount" className="text-sm font-medium">مبلغ (تومان)</Label>
                                            <Input
                                                id="amount"
                                                value={chargeAmount}
                                                onChange={(e) => handleAmountChange(e.target.value)}
                                                placeholder="حداقل ۱۰,۰۰۰ تومان"
                                                className="text-lg border-2 border-emerald-200 focus:border-emerald-400 transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[50000, 100000, 500000].map((amount) => (
                                                <Button
                                                    key={amount}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setChargeAmount(formatCurrency(amount))}
                                                    className="hover:bg-emerald-50 hover:border-emerald-400 hover:scale-105 transition-all"
                                                >
                                                    {formatCurrency(amount)}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsChargeDialogOpen(false)}
                                            disabled={charging}
                                        >
                                            انصراف
                                        </Button>
                                        <Button
                                            onClick={handleChargeWallet}
                                            disabled={charging}
                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                        >
                                            {charging ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                                    در حال پردازش...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-4 h-4 ml-2" />
                                                    پرداخت
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    کل واریزی‌ها
                                </p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    {formatCurrency(totalDeposits)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">تومان</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4" />
                                    کل برداشت‌ها
                                </p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                    {formatCurrency(totalWithdraws)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">تومان</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                                <TrendingDown className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-emerald-600" />
                            تاریخچه تراکنش‌ها
                        </CardTitle>
                        <CardDescription>لیست تمام تراکنش‌های کیف پول</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {transactions.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <Wallet className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">هنوز تراکنشی ثبت نشده است</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.map((transaction, index) => {
                                    const Icon = transactionTypeIcons[transaction.type] || Wallet;
                                    const isPositive = ['deposit', 'refund', 'bonus'].includes(transaction.type);
                                    const gradientClass = transactionTypeColors[transaction.type];

                                    return (
                                        <div
                                            key={transaction.id}
                                            className="transaction-item glass-card p-5 rounded-xl hover:shadow-xl transition-all duration-300 group"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                                                        <Icon className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-lg">{transactionTypeLabels[transaction.type]}</p>
                                                        <p className="text-sm text-gray-600">{transaction.description}</p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>{new Date(transaction.created_at).toLocaleDateString('fa-IR')}</span>
                                                            </div>
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <span className="text-xs text-gray-400">{transaction.reference_id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <p className={`text-2xl font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {isPositive ? '+' : '-'} {formatCurrency(transaction.amount)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">تومان</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </div>
            </div>
        </div>
    );
}
