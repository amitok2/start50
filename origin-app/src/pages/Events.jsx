
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Event } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Filter, Plus, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import CreateEventForm from "../components/events/CreateEventForm";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]); // Simulate local registration for demo

  useEffect(() => {
    loadEvents();
    checkUserSubscription();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, selectedType]);
  
  const checkUserSubscription = async () => {
    try {
      const currentUser = await User.me();
      if (currentUser && currentUser.subscription_status === 'active' && new Date(currentUser.subscription_end_date) > new Date()) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (e) {
      // User not logged in or other error
      setIsSubscribed(false);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const loadEvents = async () => {
    // Load all public events (don't filter by status to show existing data)
    const data = await Event.filter({ is_public: true }, "date");
    setEvents(data);
  };

  const filterEvents = () => {
    const filtered = selectedType === "all" 
      ? events 
      : events.filter(event => event.type === selectedType);
    setFilteredEvents(filtered);
  };

  const handleEventCreated = () => {
    setShowCreateEventModal(false);
    loadEvents();
  };
  
  const handleRegisterToEvent = (eventId) => {
    alert("נרשמת בהצלחה לאירוע! פרטים נוספים ישלחו במייל.");
    // In a real application, you'd make an API call to register the user for the event.
    // For this demo, we're just updating local state.
    setRegisteredEvents([...registeredEvents, eventId]);
  };

  const getTypeColor = (type) => {
    const colors = {
      "מפגש": "bg-blue-100 text-blue-800",
      "הרצאה": "bg-purple-100 text-purple-800",
      "טיול": "bg-green-100 text-green-800",
      "התנדבות": "bg-orange-100 text-orange-800",
      "יום כיף": "bg-pink-100 text-pink-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const isUpcoming = (eventDate) => {
    return new Date(eventDate) > new Date();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">אירועים וחיבורים</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            מפגשים, הרצאות וטיולים שיעשירו את חייך החברתיים ויחברו אותך לנשים מדהימות
          </p>
        </div>

        {/* Create Event Button */}
        {!isLoadingUser && isSubscribed && (
            <div className="flex justify-center mb-8">
              <Button 
                onClick={() => setShowCreateEventModal(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                <Plus className="w-5 h-5 ml-2" />
                יצירת אירוע חדש
              </Button>
            </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">סינון אירועים</h3>
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="סוג אירוע" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל האירועים</SelectItem>
                <SelectItem value="מפגש">מפגש</SelectItem>
                <SelectItem value="הרצאה">הרצאה</SelectItem>
                <SelectItem value="טיול">טיול</SelectItem>
                <SelectItem value="התנדבות">התנדבות</SelectItem>
                <SelectItem value="יום כיף">יום כיף</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => setSelectedType("all")}
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              איפוס סינון
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id} 
              className={`card-hover border-0 shadow-lg overflow-hidden flex flex-col ${
                isUpcoming(event.date) ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              {event.image_url && (
                <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 relative overflow-hidden">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  {!isUpcoming(event.date) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="outline" className="bg-white text-gray-800">
                        אירוע שהתרחש
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                    {event.title}
                  </CardTitle>
                  {isUpcoming(event.date) && (
                    <Badge className="bg-green-100 text-green-800">
                      בקרוב
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex-grow flex flex-col">
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                  {event.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    <span>{format(new Date(event.date), 'EEEE, dd MMMM yyyy', { locale: he })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-rose-500" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>{event.location}</span>
                  </div>

                  {event.max_participants && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-rose-500" />
                      <span>עד {event.max_participants} משתתפות</span>
                    </div>
                  )}

                  {event.organizer_name && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">מארגנת:</span> {event.organizer_name}
                      </p>
                      {event.organizer_contact && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">יצירת קשר:</span> {event.organizer_contact}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-auto pt-4">
                  <div className="text-left">
                    {event.price && event.price > 0 ? (
                      <span className="text-xl font-bold text-gray-900">₪{event.price}</span>
                    ) : (
                      <span className="text-xl font-bold text-green-600">חינם</span>
                    )}
                  </div>
                  {isUpcoming(event.date) ? (
                    isLoadingUser ? (
                      <Button disabled className="rounded-full px-6 bg-gray-200">טוען...</Button>
                    ) : isSubscribed ? (
                      registeredEvents.includes(event.id) ? (
                        <Button disabled className="rounded-full px-6 bg-green-500 text-white">
                          <CheckCircle className="w-4 h-4 ml-2" />
                          נרשמת
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleRegisterToEvent(event.id)}
                          className="rounded-full px-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                        >
                          הרשמה
                        </Button>
                      )
                    ) : (
                      <Button asChild className="rounded-full px-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                        <Link to={createPageUrl("Subscribe")}>הרשמה</Link>
                      </Button>
                    )
                  ) : (
                    <Button disabled className="rounded-full px-6 bg-gray-300 text-gray-500 cursor-not-allowed">
                      הסתיים
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">אין אירועים</h3>
            <p className="text-gray-500">נסי לשנות את הסינון או בקרי מאוחר יותר</p>
          </div>
        )}

        {/* Create Event Modal */}
        <Dialog open={showCreateEventModal} onOpenChange={setShowCreateEventModal}>
          <DialogContent className="sm:max-w-2xl p-4 md:p-8 max-h-[90vh] overflow-y-auto">
            <CreateEventForm 
              onSuccess={handleEventCreated}
              onCancel={() => setShowCreateEventModal(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
