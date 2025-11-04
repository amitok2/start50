import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

const eventTypes = ["מפגש", "הרצאה", "טיול", "התנדבות", "יום כיף"];

export default function EventForm({ event, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: null,
    time: '',
    location: '',
    type: 'מפגש',
    max_participants: 0,
    price: 0,
    image_url: '',
    is_public: false,
    organizer_name: '',
    organizer_contact: '',
    status: 'active'
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: event.date ? parseISO(event.date) : null,
        price: event.price || 0,
        max_participants: event.max_participants || 0,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };
  
  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
        ...formData,
        date: formData.date ? format(formData.date, 'yyyy-MM-dd') : null,
        price: Number(formData.price),
        max_participants: Number(formData.max_participants)
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">כותרת האירוע</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">סוג האירוע</Label>
          <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרי סוג אירוע" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">תיאור האירוע</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">תאריך</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-right font-normal">
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formData.date ? format(formData.date, 'PPP') : <span>בחרי תאריך</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">שעה</Label>
          <Input id="time" name="time" value={formData.time} onChange={handleChange} placeholder="למשל: 19:00" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location">מיקום</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">מחיר (בש"ח)</Label>
          <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="max_participants">מספר משתתפות מקסימלי</Label>
          <Input id="max_participants" name="max_participants" type="number" value={formData.max_participants} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image_url">קישור לתמונה</Label>
          <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2">
            <Label htmlFor="organizer_name">שם המארגנת</Label>
            <Input id="organizer_name" name="organizer_name" value={formData.organizer_name} onChange={handleChange} />
         </div>
         <div className="space-y-2">
            <Label htmlFor="organizer_contact">פרטי קשר למארגנת</Label>
            <Input id="organizer_contact" name="organizer_contact" value={formData.organizer_contact} onChange={handleChange} />
         </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="is_public" checked={formData.is_public} onCheckedChange={(checked) => handleSwitchChange('is_public', checked)} />
        <Label htmlFor="is_public" className="mr-2">פרסום האירוע באתר (גלוי לכולם)</Label>
      </div>
      
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (event ? 'עדכון אירוע' : 'יצירת אירוע')}
        </Button>
      </div>
    </form>
  );
}