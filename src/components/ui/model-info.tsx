"use client"

import { motion } from 'motion/react';
import { Brain, Zap, Globe, Code } from 'lucide-react';

const ModelInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center text-slate-500 mt-32 max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-slate-700">🔍 Web Sitesi Analiz AI</h2>
        <p className="text-slate-600 mb-6">
          Herhangi bir web sitesi URL'si girin - otomatik olarak kapsamlı analiz yapılır ve sonuçlar sunulur
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <Globe className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-slate-700">URL Tespiti</div>
          <div className="text-xs text-slate-500">Otomatik</div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-slate-700">N8N Analizi</div>
          <div className="text-xs text-slate-500">Gerçek Zamanlı</div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <Brain className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-slate-700">AI Yorumu</div>
          <div className="text-xs text-slate-500">Akıllı Analiz</div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <Code className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-slate-700">Detaylı Rapor</div>
          <div className="text-xs text-slate-500">Kapsamlı</div>
        </div>
      </div>

      <div className="text-sm text-slate-500">
        <p className="mb-2">🔗 <strong>URL Girişi:</strong> Herhangi bir web sitesi adresini yazın</p>
        <p className="mb-2">⚡ <strong>Otomatik Tespit:</strong> URL otomatik olarak algılanır</p>
        <p className="mb-2">🔄 <strong>N8N Workflow:</strong> Gerçek zamanlı analiz başlatılır</p>
        <p className="mb-2">📊 <strong>Kapsamlı Rapor:</strong> SEO, performans, tasarım analizi</p>
        <p>🤖 <strong>AI Yorumu:</strong> Sonuçlar akıllıca yorumlanır ve özetlenir</p>
      </div>
    </motion.div>
  );
};

export { ModelInfo };