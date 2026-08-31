'use client';
import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function UserBalanceCard({ apiKey }) {
  const [keyData, setKeyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) return;
    
    // ئینانا زانیاریێن باڵانسی ژ OpenRouter
    fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setKeyData(data.data);
        }
      })
      .catch(err => console.error("Error fetching balance:", err))
      .finally(() => setLoading(false));
  }, [apiKey]);

  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl animate-pulse flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-24"></div>
        <div className="h-4 bg-slate-800 rounded w-16"></div>
      </div>
    );
  }

  if (!keyData) return null;

  const totalLimit = keyData.limit || 0;
  const usedAmount = keyData.usage || 0;
  const remainingAmount = keyData.limit_remaining !== null ? keyData.limit_remaining : (totalLimit - usedAmount);
  const percentUsed = totalLimit > 0 ? Math.min(100, Math.round((usedAmount / totalLimit) * 100)) : 0;

  return (
    <div className="w-full bg-[#0c1022]/90 border border-purple-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md mb-6" dir="rtl">
      
      {/* سەردێڕ و باج */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600/20 border border-purple-500/40 rounded-xl flex items-center justify-center">
            <Wallet className="text-purple-400" size={16} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">باڵانس و لیمێتا ئەکاونتێ تە</h4>
            <span className="text-[10px] text-slate-400">ڕاستەوخۆ ژ OpenRouter</span>
          </div>
        </div>

        <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300">
          مەزێختن: {percentUsed}%
        </span>
      </div>

      {/* ستوونێن هژماران (Grid Cards) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 text-center">
        
        <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
          <span className="text-[10px] sm:text-xs text-slate-400 block mb-1">کۆمێ لیمێتێ</span>
          <span className="text-xs sm:text-base font-black text-white">${totalLimit.toFixed(2)}</span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
          <span className="text-[10px] sm:text-xs text-rose-400/90 block mb-1">مەزێختی</span>
          <span className="text-xs sm:text-base font-black text-rose-400">${usedAmount.toFixed(2)}</span>
        </div>

        <div className="bg-slate-950/60 border border-purple-500/30 p-2.5 rounded-xl bg-purple-950/20">
          <span className="text-[10px] sm:text-xs text-emerald-400 block mb-1">یێ مای (باڵانس)</span>
          <span className="text-xs sm:text-base font-black text-emerald-400">${remainingAmount.toFixed(2)}</span>
        </div>

      </div>

      {/* هێڵا پێشکەفتنێ (Progress Bar) */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
        <div 
          className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500"
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-1">
        <span>پێگۆڕ: $0.00</span>
        <span>دوماهیک لیمێت: ${totalLimit.toFixed(2)}</span>
      </div>

    </div>
  );
}