
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
];

type LanguageSelectorProps = {
  language: string;
  onLanguageChange: (language: string) => void;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Language:</span>
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[180px] h-8">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map(lang => (
            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
