import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Clock, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MentorCard({ mentor }) {
  if (!mentor || !mentor.id) {
    return null;
  }

  const getMeetingAvailabilityText = () => {
    if (!mentor.meeting_availability || mentor.meeting_availability.length === 0) {
      return "זום"; // ערך ברירת מחדל
    }
    return mentor.meeting_availability.join(" + ");
  };

  return (
    <Card className="card-hover border-0 shadow-xl bg-white flex flex-col">
      <CardHeader className="text-center pb-4">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center mb-4">
          {mentor.image_url ? (
            <img 
              src={mentor.image_url} 
              alt={mentor.mentor_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-rose-400" />
          )}
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          {mentor.mentor_name}
        </CardTitle>
        <p className="text-rose-600 font-medium text-sm">
          {mentor.specialty}
        </p>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col">
        <div className="space-y-3 mb-6 flex-grow">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-sm">זמינות: {getMeetingAvailabilityText()}</span>
          </div>

          {mentor.duration && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="text-sm">משך פגישה: {mentor.duration}</span>
            </div>
          )}

          {mentor.price !== undefined && (
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-4 h-4 text-purple-500" />
              <span className="text-sm">
                {mentor.price === 0 ? 'פגישת היכרות חינם' : `${mentor.price} ₪ לפגישה`}
              </span>
            </div>
          )}

          {mentor.description && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {mentor.description}
            </p>
          )}

          {mentor.focus_areas && mentor.focus_areas.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-2">תחומי התמחות:</h4>
              <div className="flex flex-wrap gap-1">
                {mentor.focus_areas.slice(0, 3).map((area, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 text-xs">
                    {area}
                  </Badge>
                ))}
                {mentor.focus_areas.length > 3 && (
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 text-xs">
                    +{mentor.focus_areas.length - 3} נוספים
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Button 
            asChild 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
          >
            <Link to={createPageUrl(`MentorProfile?id=${mentor.id}`)}>
              <Calendar className="w-4 h-4 ml-2" />
              לפרטים וקביעת פגישה
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}