import React from 'react';
import { BookOpen, FileText, Calculator, FlaskConical, Sparkles } from 'lucide-react';

export const CategoryIllustration = ({ category, size = 26 }) => {
  switch (category) {
    case 'Textbooks':
      return <BookOpen size={size} strokeWidth={1.8} />;
    case 'Study Notes':
      return <FileText size={size} strokeWidth={1.8} />;
    case 'Calculators & Electronics':
      return <Calculator size={size} strokeWidth={1.8} />;
    case 'Lab & Academic Supplies':
      return <FlaskConical size={size} strokeWidth={1.8} />;
    case 'Other':
    default:
      return <Sparkles size={size} strokeWidth={1.8} />;
  }
};
