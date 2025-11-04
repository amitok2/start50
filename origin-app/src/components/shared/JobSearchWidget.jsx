import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, ExternalLink } from "lucide-react";

export default function JobSearchWidget() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleJobSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const searchQuery = encodeURIComponent(searchTerm.trim());
      const searchUrl = `https://www.google.com/search?q=${searchQuery}+משרה+site:jobmaster.co.il+OR+site:alljobs.co.il+OR+site:drushim.co.il+OR+site:linkedin.com`;
      window.open(searchUrl, '_blank');
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            חיפוש משרת החלום שלך
          </h3>
          <p className="text-gray-600 text-sm">
            מצאי הזדמנויות קריירה חדשות בכמה קליקים
          </p>
        </div>
        
        <form onSubmit={handleJobSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="למשל: גרפיקאית, מנהלת פרויקטים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 text-right"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full font-semibold"
          >
            <Search className="w-5 h-5 ml-2" />
            חפשי משרות
            <ExternalLink className="w-4 h-4 mr-2" />
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            החיפוש יתבצע באתרי הדרושים המובילים בישראל
          </p>
        </div>
      </CardContent>
    </Card>
  );
}