/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'
import axios from 'axios'; 
import {Shield,  ArrowRight, ArrowUpRight,TrendingUp,Bell,X,ArrowUp, ArrowDown} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


type Crypto = {
  symbol: string;
  price: number;
  percentChange: number;
};


export default function Home() {

  const [response, setresponse] = useState<Crypto[]>([]);

   const [showModal, setShowModal] = useState(false);
const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    symbol: '',
    targetPrice: '',
    direction: 'above' 
  });

 const openModal = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
    setFormData({
      email: '',
      symbol: crypto.symbol,
      targetPrice: '',
      direction: 'above'
    });
    setShowModal(true);

  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCrypto(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post('/api/alerts', {
    email: formData.email,
    symbol: formData.symbol,
    targetPrice: formData.targetPrice,
    direction: formData.direction
  });
    // Handle form submission here
    console.log('Alert created:', formData);
    closeModal();
    
    setShowSuccess(true);
        // Hide modal after 1 second
        setTimeout(() => setShowSuccess(false), 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  useEffect(() => {

    const ws = new WebSocket("wss://cryptra.onrender.com");
    ws.onopen = () => console.log("Connected");
    ws.onmessage = (event) => {
  try {
    const parsed = JSON.parse(event.data.toString());
    if (Array.isArray(parsed)) {
      setresponse(parsed as Crypto[]);
    }
  } catch (e) {
    console.error("Failed to parse WS message", e);
  }
};
  }, []);

  const router = useRouter();

  return (
    
    <div className=" inset-0 -z-10 h-full w-full items-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <nav className="z-10 p-4  bg-dark w-full rounded-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r bg-gradient-to-r from-white via-gray-200 to-purple-200 bg-clip-text text-transparent">
            Cryptra
          </div>
          <div className="hidden md:flex space-x-8 ml-4">
            <button type='button' className="text-xl hover:text-purple-400 transition-colors hover:cursor-pointer" onClick={() => router.push('/')}>About</button>
            <button className="text-xl hover:text-purple-400 transition-colors hover:cursor-pointer" onClick={() => router.push('/pairs')} >Pairs</button>
            <button className="text-xl hover:text-purple-400 transition-colors hover:cursor-pointer" onClick={() => router.push('/')}>Community</button>

          </div>
          <button className="bg-purple-400 px-6 py-2 rounded-full font-bold text-md hover:cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center group">
            Sign Up<ArrowUpRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>


      <section className="relative z-10 pt-40 pb-32 px-6 ">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 `}>
            <h1 className="text-6xl md:text-8xl p-2 font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-purple-200 bg-clip-text text-transparent leading-tight break-words">
              Cryptra
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Scan 50+ global cryptocurrencies for trading opportunities <br />
              Track market prices, trading volume and volatility <br />
              Receive notifications via Email/SMS
            </p>

            <div className="bg-white flex px-1 py-1 mb-12 rounded-full border border-purple-400 overflow-hidden max-w-3xl mx-auto">
              <input type='email' placeholder='Enter your Email' className="w-full outline-none bg-white pl-4 text-lg text-gray-500" />
              <button type='button'
                className="bg-purple-400 w-40 hover:bg-purple-500 transition-all text-white text-lg rounded-full px-6 py-3 line-clamp-1 whitespace-nowrap overflow-hidden text-ellipsis hover:cursor-pointer">Sign Up</button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-purple-400 px-8 py-4 rounded-full font-semibold text-lg hover:cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center group">
                Browse All Pairs
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-purple-400 px-8 py-4 rounded-full hover:cursor-pointer font-semibold text-lg hover:bg-purple-400/10 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
      

<section className="relative z-10 px-2 sm:px-2 lg:px-8 pb-20">
  <div className="mx-auto w-full max-w-7xl">
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <h3 className="text-2xl font-bold flex items-center mb-4 sm:mb-0">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
          Live Prices
        </h3>
        <div className="flex items-center text-sm text-slate-400">
          <TrendingUp className="w-4 h-4 mr-1" />
          Real-time data
        </div>
      </div>

      {response?.length > 0 ? (
        <div className="space-y-4">
          {response.map((crypto, index) => (
            <div
              key={index}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-4 sm:px-6 rounded-2xl hover:bg-white/5 transition-all duration-300 group border-b border-white/5 last:border-b-0 ${response.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {crypto.symbol.replace('USDT', '').slice(0, 3)}
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-semibold text-white">
                    {crypto.symbol}
                  </span>
                  <div className="text-sm text-slate-400">
                    24h Volume: ${(Math.random() * 1000).toFixed(0)}M
                  </div>
                </div>
              </div>

              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    ${Number(crypto.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      crypto.percentChange >= 0
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {crypto.percentChange >= 0 ? '+' : ''}
                    {Number(crypto.percentChange).toFixed(2)}%
                  </div>
                </div>

                <button className="bg-white/10 border border-white/20 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 flex items-center justify-center" onClick={()=>{openModal(crypto)}}>
                  <Bell className="w-4 h-4 mr-2" />
                  Add Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg">Loading market data...</p>
          </div>
        </div>
      )}
    </div>
  </div>
</section>

      {showSuccess && (
         <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg">
        ✅ Alert Created Successfully!
      </div>
    </div>
      )}

      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Cryptra?</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Advanced features designed for modern crypto traders
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Real-time Tracking",
                description: "Monitor 50+ cryptocurrencies with live price updates and market analysis"
              },
              {
                icon: <Bell className="w-8 h-8" />,
                title: "Smart Alerts",
                description: "Get notified via email or SMS when your target prices are reached"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with 99.9% uptime guarantee"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                <div className="text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-purple/500 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-purple-1000 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {selectedCrypto?.symbol.split('/')[0].slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create Alert</h2>
                  <p className="text-sm text-slate-400">{selectedCrypto?.symbol}</p>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Price */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Price</span>
                <span className="text-2xl font-bold text-white">
                  ${Number(selectedCrypto?.price)}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                />
              </div>

              {/* Target Price Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    name="targetPrice"
                    value={formData.targetPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Direction Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Alert Direction
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, direction: 'above' })}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all ${
                      formData.direction === 'above'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-white/5 border-white/20 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                    <span>Above</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, direction: 'below' })}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all ${
                      formData.direction === 'below'
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-white/5 border-white/20 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <ArrowDown className="w-4 h-4" />
                    <span>Below</span>
                  </button>
                </div>
              </div>

              {/* Alert Preview */}
              <div className="bg-white/5 rounded-2xl p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Alert Preview</h4>
                <p className="text-sm text-slate-400">
                  Notify me when <span className="text-white font-medium">{selectedCrypto?.symbol}</span> goes{' '}
                  <span className={`font-medium ${formData.direction === 'above' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formData.direction}
                  </span>{' '}
                  <span className="text-white font-medium">
                    ${formData.targetPrice || '0.00'}
                  </span>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-white text-slate-900 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all duration-300 flex items-center justify-center group"
              >
                Create Alert
                <Bell className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>

  );
}
