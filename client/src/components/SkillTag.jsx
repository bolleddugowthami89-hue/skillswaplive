import React from 'react';

const levelColors = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  Intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
  Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
  Expert: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
};

const SkillTag = ({ skill, type = 'offered', showLevel = true, onClick }) => {
  const skillName = typeof skill === 'string' ? skill : skill.name;
  const level = typeof skill === 'object' && skill.level ? skill.level : 'Intermediate';
  const colorClass = levelColors[level] || 'bg-slate-800 text-slate-300 border-slate-700';

  const isWanted = type === 'wanted';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
        isWanted 
          ? 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:border-rose-500/40' 
          : `${colorClass} hover:opacity-90`
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span className="truncate max-w-[140px]">{skillName}</span>
      {showLevel && !isWanted && (
        <span className="text-[10px] opacity-75 font-normal uppercase tracking-wider">
          • {level}
        </span>
      )}
    </span>
  );
};

export default SkillTag;
