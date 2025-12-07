import React from 'react';
import { PortfolioItem } from '../types';
import { formatDate } from '../utils';
import { X, ExternalLink, Download, FileText } from 'lucide-react';

interface DetailModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-10 flex justify-between items-start">
            <div>
                 <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary mb-2">
                    {item.section} {item.subsection ? ` / ${item.subsection}` : ''}
                </span>
                <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
            </div>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-8 space-y-8">
            <div className="prose prose-slate max-w-none">
                <p className="text-lg leading-relaxed text-slate-700">{item.content}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Metadata</span>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex justify-between">
                            <span>Date:</span> 
                            <span className="font-medium text-slate-900">{formatDate(item.date)}</span>
                        </li>
                         <li className="flex justify-between">
                            <span>Type:</span> 
                            <span className="font-medium text-slate-900">{item.itemType}</span>
                        </li>
                         <li className="flex justify-between">
                            <span>Status:</span> 
                            <span className="font-medium text-slate-900">{item.status}</span>
                        </li>
                    </ul>
                 </div>

                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Tags</span>
                     <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">
                                {tag}
                            </span>
                        ))}
                     </div>
                 </div>
            </div>

            {(item.artifact || item.link) && (
                <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Resources</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {item.artifact && (
                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium">
                                <Download className="w-4 h-4" />
                                Download Artifact
                            </button>
                        )}
                         {item.link && (
                            <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open Link
                            </a>
                        )}
                        {!item.artifact && !item.link && (
                            <div className="text-sm text-slate-400 italic flex items-center gap-2">
                                <FileText className="w-4 h-4" /> No attached resources
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
