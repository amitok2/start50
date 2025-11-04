import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INTERESTS_OPTIONS, LOOKING_FOR_OPTIONS, CITIES_OPTIONS } from './constants';

export default function ProfileFilters({ 
  onFilterChange, 
  onLocationFilterChange, 
  onInterestFilterChange,
  currentLookingFor, 
  currentLocation, 
  currentInterest,
  onReset 
}) {
  return (
    <div className="mb-8 flex justify-center">
      <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-800">סינון וחיפוש חברות</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Interest Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">תחומי עניין</label>
            <Select 
              value={currentInterest || 'all'}
              onValueChange={(value) => onInterestFilterChange(value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="כל תחומי העניין" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל תחומי העניין</SelectItem>
                {INTERESTS_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Looking For Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">מה את מחפשת</label>
            <Select 
              value={currentLookingFor || 'all'}
              onValueChange={(value) => onFilterChange(value === 'all' ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="כל האפשרויות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל האפשרויות</SelectItem>
                {LOOKING_FOR_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">עיר</label>
            <Select
              value={currentLocation || 'all'}
              onValueChange={(value) => onLocationFilterChange(value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="כל הערים" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">כל הערים</SelectItem>
                {CITIES_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(currentInterest || currentLookingFor || currentLocation) && (
          <div className="flex justify-center pt-2">
            <Button 
              onClick={onReset} 
              variant="outline" 
              size="sm"
              className="border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              <X className="w-4 h-4 ml-1" />
              איפוס סינונים
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}