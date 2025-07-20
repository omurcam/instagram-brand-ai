"use client"

import { motion } from 'motion/react';
import { Wrench, Brain, Globe, Calculator, Code, Cloud } from 'lucide-react';

interface ToolStatusProps {
  isThinking?: boolean;
  isUsingTools?: boolean;
  currentTool?: string;
}

const toolIcons: Record<string, any> = {
  web_search: Globe,
  calculator: Calculator,
  code_executor: Code,
  get_weather: Cloud,
  default: Wrench
};

const ToolStatus = ({ isThinking, isUsingTools, currentTool }: ToolStatusProps) => {
  if (!isThinking && !isUsingTools) return null;

  const IconComponent = currentTool ? toolIcons[currentTool] || toolIcons.default : Brain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 text-sm text-slate-500 mb-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <IconComponent size={16} />
      </motion.div>
      
      <span>
        {isThinking && "AI düşünüyor..."}
        {isUsingTools && currentTool && `${currentTool} aracı kullanılıyor...`}
        {isUsingTools && !currentTool && "Araçlar hazırlanıyor..."}
      </span>
    </motion.div>
  );
};

export { ToolStatus };