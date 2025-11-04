import React, { useState, useEffect, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

const specialtyOptions = [
  "פיתוח קריירה ושינוי מקצוע",
  "יזמות ועסקים קטנים", 
  "התפתחות אישית וביטחון עצמי",
  "טכנולוגיה ודיגיטל לנשים 50+",
  "כלכלת משפחה וניהול פיננסי",
  "יחסים, זוגיות ומשפחה בגיל 50+",
  "בריאות, תזונה ואורח חיים",
  "יצירה, תחביבים וזהות עצמית",
  "הכנה לפרישה ומעבר שלב",
  "קהילה, שייכות והעצמה נשית"
];

export default function MentorFilters({ onFilterChange, allMentors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('all');
  
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({
        searchTerm: searchTerm,
        specialty: specialty,
      });
    }, 300); // Debounce search input

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, specialty, onFilterChange]);

  return (
    <div className="mb-8 flex justify-center">
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-md w-full max-w-3xl">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <Search className="w-5 h-5 text-gray-500" />
          <Input 
            placeholder="חיפוש לפי שם או תחום..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus-visible:ring-0 shadow-none"
          />
        </div>
        
        <div className="w-full md:w-px bg-gray-200 h-px md:h-8"></div>

        <div className="flex items-center gap-2 w-full md:w-1/2">
          <Filter className="w-5 h-5 text-gray-500" />
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="בחרי תחום התמחות..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל התחומים</SelectItem>
              {specialtyOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}