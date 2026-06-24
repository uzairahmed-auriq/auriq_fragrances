"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Lock, LogOut, Package, MapPin, CreditCard, Clock, ChevronRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { apiFetch } from "../utils/api";
import { getMyOrders } from "../services/orderService";
import { useGoogleLogin } from '@react-oauth/google';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register State
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // User State
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  
  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Address Form State
  const [addrLabel, setAddrLabel] = useState("Home");
  const [addrFullName, setAddrFullName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrProvince, setAddrProvince] = useState("");
  const [addrPostal, setAddrPostal] = useState("");
  const [addrDefault, setAddrDefault] = useState(false);

  const fetchUserData = async (token: string) => {
    try {
      const profileRes = await apiFetch('/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (profileRes.success) {
        setUser(profileRes.data);
        setProfileName(profileRes.data.name);
        setProfilePhone(profileRes.data.phone || "");
        localStorage.setItem('auriqUser', JSON.stringify(profileRes.data));
      }

      const addressRes = await apiFetch('/user/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (addressRes.success) {
        setAddresses(addressRes.data);
      }

      const ordersRes = await getMyOrders();
      if (ordersRes.success) {
        setOrders(ordersRes.data);
      }
    } catch (e) {
      console.error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    const checkLoginState = () => {
      const token = localStorage.getItem('auriqAccessToken');
      if (token) {
        setIsLoggedIn(true);
        fetchUserData(token);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginState();
    setIsChecking(false);

    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);

    window.addEventListener('loginStateChange', checkLoginState);
    return () => window.removeEventListener('loginStateChange', checkLoginState);
  }, [searchParams]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      
      if (response.success) {
        localStorage.setItem('auriqAccessToken', response.data.accessToken);
        localStorage.setItem('auriqRefreshToken', response.data.refreshToken);
        window.dispatchEvent(new Event('loginStateChange'));
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);
    
    try {
      const name = `${regFirstName} ${regLastName}`.trim();
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email: regEmail, password: regPassword }),
      });
      
      if (response.success) {
        localStorage.setItem('auriqAccessToken', response.data.accessToken);
        localStorage.setItem('auriqRefreshToken', response.data.refreshToken);
        window.dispatchEvent(new Event('loginStateChange'));
      }
    } catch (err: any) {
      setRegError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('auriqRefreshToken');
      if (refreshToken) {
        await apiFetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem('auriqAccessToken');
      localStorage.removeItem('auriqRefreshToken');
      localStorage.removeItem('auriqUser');
      window.dispatchEvent(new Event('loginStateChange'));
      router.push('/');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auriqAccessToken');
      const res = await apiFetch('/user/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: profileName, phone: profilePhone })
      });
      if (res.success) {
        alert("Profile updated successfully!");
        fetchUserData(token!);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const token = localStorage.getItem('auriqAccessToken');
      const res = await apiFetch('/user/password', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: oldPassword, newPassword })
      });
      if (res.success) {
        alert("Password updated successfully!");
        setIsChangingPassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update password');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auriqAccessToken');
      const res = await apiFetch('/user/addresses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          label: addrLabel,
          full_name: addrFullName,
          phone: addrPhone,
          street: addrStreet,
          city: addrCity,
          province: addrProvince,
          postal_code: addrPostal,
          is_default: addrDefault
        })
      });
      if (res.success) {
        alert("Address saved successfully!");
        setIsAddingAddress(false);
        fetchUserData(token!);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const token = localStorage.getItem('auriqAccessToken');
      const res = await apiFetch(`/user/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.success) {
        fetchUserData(token!);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook', token: string) => {
    try {
      setLoginLoading(true);
      setLoginError("");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(provider === 'google' ? { token } : { accessToken: token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `${provider} login failed`);
      
      localStorage.setItem('auriqAccessToken', data.data.accessToken);
      localStorage.setItem('auriqRefreshToken', data.data.refreshToken);
      window.dispatchEvent(new Event('loginStateChange'));
    } catch (err: any) {
      setLoginError(err.message || `${provider} login failed`);
    } finally {
      setLoginLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleSocialLogin('google', tokenResponse.access_token),
    onError: () => setLoginError('Google login failed'),
  });

  const responseFacebook = (response: any) => {
    if (response.accessToken) {
      handleSocialLogin('facebook', response.accessToken);
    } else {
      setLoginError('Facebook login failed');
    }
  };

  // --- LOGGED OUT STATE UI ---
  const renderLoggedOutView = () => (
    <div className="container-lux pt-16 pb-24">
      <div className="text-center mb-16">
        <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Membership</span>
        <h1 className="text-4xl md:text-5xl font-serif text-gradient-gold font-bold tracking-widest mb-6 pb-2">Auriq Exclusives</h1>
        <p className="text-foreground/60 max-w-xl mx-auto">
          Sign in or create an account to manage your orders, save your favorite fragrances, and receive exclusive access to new launches.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-24 max-w-5xl mx-auto">
        {/* Sign In Form */}
        <div className="flex-1 lux-glass-card p-8 md:p-12 relative z-10">
          <h2 className="text-2xl font-serif text-foreground mb-8 font-bold border-b border-foreground/10 pb-4">Sign In</h2>
          <form className="flex flex-col gap-6" onSubmit={handleLoginSubmit}>
            {loginError && <div className="text-red-500 text-xs font-bold bg-red-500/10 p-3 border border-red-500/20">{loginError}</div>}
            <div className="flex flex-col gap-3 group">
              <label htmlFor="login-email" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="email"
                  id="login-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 pl-8 text-sm focus:outline-none focus:border-gold transition-colors text-foreground"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3 group">
              <label htmlFor="login-password" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="password"
                  id="login-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-foreground/10 py-2 pl-8 text-sm focus:outline-none focus:border-gold transition-colors text-foreground"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="#" className="text-xs text-foreground/50 hover:text-gold transition-colors">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loginLoading} className="w-full bg-gold text-background py-4 mt-4 font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors disabled:opacity-50">
              {loginLoading ? "Signing In..." : "Sign In"}
            </button>

            <div className="relative flex items-center py-2 mt-2">
              <div className="flex-grow border-t border-foreground/10"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold">Or continue with</span>
              <div className="flex-grow border-t border-foreground/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => googleLogin()} className="flex items-center justify-center gap-3 w-full border border-foreground/20 text-foreground py-3 text-xs font-bold tracking-widest uppercase hover:bg-foreground/5 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

            </div>
          </form>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-foreground/10"></div>

        {/* Register Form */}
        <div className="flex-1 lux-glass-card p-8 md:p-12 relative z-10 border border-foreground/5 bg-foreground/[0.02]">
          <h2 className="text-2xl font-serif text-foreground mb-8 font-bold border-b border-foreground/10 pb-4">Create Account</h2>
          <form className="flex flex-col gap-6" onSubmit={handleRegisterSubmit}>
            {regError && <div className="text-red-500 text-xs font-bold bg-red-500/10 p-3 border border-red-500/20">{regError}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 group">
                <label htmlFor="reg-first" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">First Name</label>
                <input type="text" id="reg-first" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} className="w-full bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
              </div>
              <div className="flex flex-col gap-3 group">
                <label htmlFor="reg-last" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Last Name</label>
                <input type="text" id="reg-last" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} className="w-full bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
              </div>
            </div>

            <div className="flex flex-col gap-3 group">
              <label htmlFor="reg-email" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Email Address</label>
              <input type="email" id="reg-email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
            </div>

            <div className="flex flex-col gap-3 group">
              <label htmlFor="reg-password" className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Password</label>
              <input type="password" id="reg-password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="w-full bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" minLength={8} required />
            </div>

            <button type="submit" disabled={regLoading} className="w-full border border-foreground/20 text-foreground py-4 mt-4 font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors disabled:opacity-50">
              {regLoading ? "Registering..." : "Register"}
            </button>

            <div className="relative flex items-center py-2 mt-2">
              <div className="flex-grow border-t border-foreground/10"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold">Or register with</span>
              <div className="flex-grow border-t border-foreground/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => googleLogin()} className="flex items-center justify-center gap-3 w-full border border-foreground/20 text-foreground py-3 text-xs font-bold tracking-widest uppercase hover:bg-foreground/5 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button type="button" onClick={() => googleLogin()} className="flex items-center justify-center gap-3 w-full border border-foreground/20 text-foreground py-3 text-xs font-bold tracking-widest uppercase hover:bg-foreground/5 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // --- LOGGED IN STATE UI ---
  const renderLoggedInView = () => (
    <div className="container-lux pt-12 pb-24">
      
      {/* Dashboard Header */}
      <div className="mb-12 border-b border-foreground/10 pb-6 flex items-end justify-between">
        <div>
          <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Welcome Back</span>
          <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-widest">{user?.name || "Welcome"}</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 text-foreground/50 hover:text-red-400 transition-colors text-xs font-bold tracking-[0.2em] uppercase"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-between p-4 border border-foreground/10 transition-colors ${activeTab === 'orders' ? 'bg-gold/10 border-gold text-foreground' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              <span className="font-medium tracking-wide text-sm uppercase">Track Orders</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-between p-4 border border-foreground/10 transition-colors ${activeTab === 'profile' ? 'bg-gold/10 border-gold text-foreground' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              <span className="font-medium tracking-wide text-sm uppercase">Profile Details</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center justify-between p-4 border border-foreground/10 transition-colors ${activeTab === 'addresses' ? 'bg-gold/10 border-gold text-foreground' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <span className="font-medium tracking-wide text-sm uppercase">Addresses</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button 
            onClick={handleLogout}
            className="flex md:hidden items-center justify-between p-4 border border-foreground/10 text-foreground/60 hover:text-red-400 hover:bg-foreground/5 transition-colors mt-8"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium tracking-wide text-sm uppercase">Sign Out</span>
            </div>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lux-glass-card p-8 min-h-[400px]">
          
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-2 relative z-10">
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">Track Your Order</h2>
              
              <form className="flex flex-col md:flex-row gap-4 mb-8" onSubmit={(e) => { e.preventDefault(); alert('Tracking information will be connected to the backend soon!'); }}>
                <div className="flex-1 relative group">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-gold transition-colors" />
                  <input type="text" placeholder="Enter your Order ID (e.g. AQ-8932)" required className="w-full bg-transparent border-b border-foreground/20 py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide" />
                </div>
                <button type="submit" className="bg-gold text-background px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors shrink-0">
                  Track
                </button>
              </form>

              <div className="border-t border-foreground/10 pt-8">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/50 mb-6">Recent Orders</h3>
                <div className="flex flex-col gap-4">
                  {orders.length === 0 ? (
                    <p className="text-sm text-foreground/60">No orders found.</p>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-foreground/10 hover:border-gold/30 transition-colors gap-4 bg-foreground/[0.02]">
                        <div>
                          <p className="text-sm font-bold tracking-wide text-foreground mb-1">#AUR-{order.id}</p>
                          <p className="text-xs text-foreground/60 font-medium">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                          <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gold/10 text-gold border-gold/20'}`}>
                            {order.status}
                          </span>
                          <Link href={`/invoice/${order.id}`} className="text-gold hover:underline text-xs tracking-widest uppercase font-bold">View Details</Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="flex flex-col gap-6 relative z-10 max-w-xl">
              <h2 className="text-2xl font-serif text-foreground mb-6 font-bold">Profile Details</h2>
              <form className="flex flex-col gap-6" onSubmit={handleUpdateProfile}>
                
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3 group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Full Name</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                  </div>
                  <div className="flex flex-col gap-3 group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Email Address</label>
                    <input type="email" value={user?.email || ""} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" disabled />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3 group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Phone Number</label>
                    <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" />
                  </div>
                </div>

                <button type="submit" className="w-fit bg-gold text-background px-8 py-3 mt-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors">
                  Save Changes
                </button>
              </form>

              {/* Password Change */}
              <div className="mt-8 mb-4 border-t border-foreground/10 pt-8">
                <h3 className="text-sm font-bold tracking-widest uppercase text-foreground mb-6">Change Password</h3>
                {!isChangingPassword ? (
                  <button type="button" onClick={() => setIsChangingPassword(true)} className="border border-foreground/20 text-foreground px-6 py-2 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground/5 transition-colors">
                    Update Password
                  </button>
                ) : (
                  <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-3 group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Old Password</label>
                      <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter current password" minLength={8} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-3 group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" minLength={8} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                      </div>
                      <div className="flex flex-col gap-3 group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Retype new password" minLength={8} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button type="button" onClick={handleUpdatePassword} className="w-fit bg-gold text-background px-6 py-2 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors">
                        Save Password
                      </button>
                      <button type="button" onClick={() => setIsChangingPassword(false)} className="w-fit text-foreground/50 hover:text-red-400 px-0 py-2 text-xs font-bold tracking-[0.2em] uppercase transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-foreground font-bold">Saved Addresses</h2>
                {!isAddingAddress && (
                  <button onClick={() => setIsAddingAddress(true)} className="text-gold text-xs tracking-widest uppercase hover:underline">Add New</button>
                )}
              </div>
              
              {isAddingAddress ? (
                <form className="flex flex-col gap-6 bg-foreground/[0.02] border border-foreground/10 p-6" onSubmit={handleAddAddress}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3 group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Label (e.g. Home, Office)</label>
                      <input type="text" value={addrLabel} onChange={e => setAddrLabel(e.target.value)} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                    </div>
                    <div className="flex flex-col gap-3 group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Full Name</label>
                      <input type="text" value={addrFullName} onChange={e => setAddrFullName(e.target.value)} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Street Address</label>
                    <input type="text" value={addrStreet} onChange={e => setAddrStreet(e.target.value)} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3 group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">City</label>
                      <input type="text" value={addrCity} onChange={e => setAddrCity(e.target.value)} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                    </div>
                    <div className="flex flex-col gap-3 group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Province</label>
                      <input type="text" value={addrProvince} onChange={e => setAddrProvince(e.target.value)} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3 group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Postal Code</label>
                      <input type="text" value={addrPostal} onChange={e => setAddrPostal(e.target.value)} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" />
                    </div>
                    <div className="flex flex-col gap-3 group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-light group-focus-within:text-gold transition-colors">Phone</label>
                      <input type="tel" value={addrPhone} onChange={e => setAddrPhone(e.target.value)} className="bg-transparent border-b border-foreground/10 py-2 text-sm focus:outline-none focus:border-gold transition-colors text-foreground" required />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_default" checked={addrDefault} onChange={e => setAddrDefault(e.target.checked)} className="accent-gold" />
                    <label htmlFor="is_default" className="text-sm text-foreground">Set as default address</label>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button type="submit" className="bg-gold text-background px-6 py-2 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors">Save Address</button>
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="border border-foreground/20 text-foreground px-6 py-2 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground/5 transition-colors">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.length === 0 ? (
                    <div className="col-span-2 py-8 text-center text-foreground/50 border border-dashed border-foreground/20">
                      No addresses saved yet.
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div key={address.id} className={`border p-6 relative ${address.is_default ? 'border-gold' : 'border-foreground/10'}`}>
                        {address.is_default && (
                          <div className="absolute top-0 right-0 bg-gold text-background text-[10px] font-bold px-3 py-1 uppercase tracking-widest">Default</div>
                        )}
                        <h3 className="text-foreground font-bold mb-1 tracking-wide">{address.full_name} <span className="text-foreground/50 font-normal text-xs ml-2">({address.label})</span></h3>
                        <p className="text-foreground/60 text-sm leading-relaxed mb-4">
                          {address.street}<br />
                          {address.city}, {address.province} {address.postal_code}<br />
                          {address.phone}
                        </p>
                        <div className="flex gap-4">
                          <button onClick={() => handleDeleteAddress(address.id)} className="text-xs text-foreground/40 hover:text-red-400 uppercase tracking-widest">Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
        {isChecking ? <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div> : isLoggedIn ? renderLoggedInView() : renderLoggedOutView()}
      </main>
      <Footer />
    </>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-perfume-main" />}>
      <AccountContent />
    </Suspense>
  );
}
