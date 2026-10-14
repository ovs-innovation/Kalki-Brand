import React from 'react';

const Card = ({ title, Icon, quantity, className }) => {
  const colorMap = {
    red: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
    orange: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
    indigo: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
    blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
    store: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  };

  const colorMatch = className?.match(/text-(\w+)-/);
  const colorKey = colorMatch ? colorMatch[1] : 'blue';
  const colors = colorMap[colorKey] || { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' };

  return (
    <div className="flex h-full group">
      <div className="flex items-center w-full bg-[#0c0d16] p-4 sm:p-5 rounded-2xl border border-white/10 hover:border-blue-500/40 shadow-lg transition-all duration-300">
        <div className={`shrink-0 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border ${colors.bg} ${colors.text} ${colors.border}`}>
          <Icon className="text-xl sm:text-2xl" />
        </div>
        <div className="ml-4 text-left min-w-0">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {quantity || 0}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Card;
