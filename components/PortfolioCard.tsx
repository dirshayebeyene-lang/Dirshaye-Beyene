import React from 'react';
import { PortfolioItem } from '../types';
import { formatDate } from '../utils';
import { 
  FileText, 
  Briefcase, 
  Award, 
  GraduationCap, 
  BookOpen, 
  BarChart2, 
  Shield, 
  Calendar 
} from 'lucide-react';

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'Project': return <Briefcase className="w-4 h-4" />;
    case 'Report': return <FileText className="w-4 h-4" />;
    case 'Training': return <BookOpen className="w-4 h-4" />;
    case 'Evaluation': return <BarChart2 className="w-4 h-4" />;
    case 'Certification': return <Award className="w-4 h-4" />;
    case 'Degree': return <GraduationCap className="w-4 h-4" />;
    case 'Case Study': return <BookOpen className="w-4 h-4" />;
    case 'Risk': return <Shield className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onClick }) => {
  return (
    <div 
      onClick={() => onClick(item)}
      className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-200 cursor-pointer flex flex-col h-full group"
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors`}>
              {getIcon(item.itemType)}
              {item.itemType}
            </span>
            {item.status === 'Featured' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700">
                Featured
              </span>
            )}
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-tight group-hover:text-brand-primary transition-colors">
          {item.title}
        </h3>
        
        <p className="text-sm text-brand-muted line-clamp-3 mb-4 flex-1">
          {item.content}
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto pt-4 border-t border-slate-100">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(item.date)}</span>
          {item.subsection && (
            <>
              <span>•</span>
              <span className="truncate">{item.subsection}</span>
            </>
          )}
        </div>
      </div>
      
      {item.tags.length > 0 && (
        <div className="px-5 pb-5 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100">
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 text-slate-400">+{item.tags.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioCard;
