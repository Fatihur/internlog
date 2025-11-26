import React from 'react';
import { CopyButton } from './CopyButton';
import { BookOpen, AlertTriangle, Activity } from 'lucide-react';
import { ReportSection } from '../types';

interface ResultCardProps {
  title: string;
  content: string;
  type: ReportSection;
  delayIndex: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, content, type, delayIndex }) => {
  const getIcon = () => {
    switch (type) {
      case ReportSection.ACTIVITY:
        return <Activity className="w-5 h-5 text-blue-600" />;
      case ReportSection.LEARNING:
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case ReportSection.CHALLENGES:
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case ReportSection.ACTIVITY:
        return "bg-blue-50 border-blue-100 text-blue-900";
      case ReportSection.LEARNING:
        return "bg-emerald-50 border-emerald-100 text-emerald-900";
      case ReportSection.CHALLENGES:
        return "bg-amber-50 border-amber-100 text-amber-900";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-500 ease-out transform translate-y-0 opacity-100`}
      style={{ animationDelay: `${delayIndex * 150}ms` }}
    >
      <div className={`px-5 py-3 border-b flex items-center justify-between ${getHeaderColor()}`}>
        <div className="flex items-center gap-2 font-semibold">
          {getIcon()}
          <h3>{title}</h3>
        </div>
        <CopyButton text={content} />
      </div>
      <div className="p-5">
        <p className="text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
          {content}
        </p>
        <div className="mt-4 text-xs text-slate-400 text-right">
          {content.length} karakter
        </div>
      </div>
    </div>
  );
};