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
        <h2 className="text-2xl font-semibold mb-3 text-slate-700">📱 Instagram Marka Stratejisti</h2>
        <p className="text-slate-600 mb-6">
          Sosyal misyon odaklı marka stratejileri ve topluluk oluşturma konusunda uzman AI danışmanınız
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <Brain className="w-6 h-6 text-pink-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-slate-700">Marka Kimliği</div>
          <div className="text-xs text-slate-500">Sosyal Misyon</div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-slate-700">İçerik Stratejisi</div>
          <div className="text-xs text-slate-500">Haftalık Planlar</div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <Globe className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-slate-700">Topluluk Analizi</div>
          <div className="text-xs text-slate-500">Persona Geliştirme</div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
          <Code className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-slate-700">Etki Ölçümleme</div>
          <div className="text-xs text-slate-500">Sosyal Metrikler</div>
        </div>
      </div>

      <div className="text-sm text-slate-500">
        <p className="mb-2">📊 <strong>Marka Analizi:</strong> Kimlik, konumlandırma ve rakip analizi</p>
        <p className="mb-2">🎯 <strong>İçerik Planlama:</strong> 3 içerikli haftalık stratejiler</p>
        <p className="mb-2">💡 <strong>Duygusal Tetikleyiciler:</strong> Nöropazarlama ilkeleri</p>
        <p>📈 <strong>Performans Takibi:</strong> Topluluk ve sosyal etki metrikleri</p>
      </div>
    </motion.div>
  );
};

export { ModelInfo };