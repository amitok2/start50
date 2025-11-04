
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { Calendar as CalendarIcon, Loader2, Save } from 'lucide-react';

export default function EditUserForm({ user, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role || 'user',
        user_type: user.user_type || 'member', // Added field
        is_approved_mentor: user.is_approved_mentor || false, // Added field
        subscription_status: user.subscription_status || 'inactive',
        subscription_plan: user.subscription_plan || null,
        subscription_type: user.subscription_type || null,
        subscription_start_date: user.subscription_start_date ? parseISO(user.subscription_start_date) : null,
        subscription_end_date: user.subscription_end_date ? parseISO(user.subscription_end_date) : null,
        birth_date: user.birth_date ? parseISO(user.birth_date) : null,
      });
    }
  }, [user]);

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value === 'null' ? null : value }));
  };

  const handleDateChange = (field, date) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        subscription_start_date: formData.subscription_start_date ? format(formData.subscription_start_date, 'yyyy-MM-dd') : null,
        subscription_end_date: formData.subscription_end_date ? format(formData.subscription_end_date, 'yyyy-MM-dd') : null,
        birth_date: formData.birth_date ? format(formData.birth_date, 'yyyy-MM-dd') : null,
      };

      await User.update(user.id, dataToSave);
      onSuccess();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("שגיאה בעדכון המשתמשת.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">{user.full_name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role */}
        <div className="space-y-2">
          <Label>תפקיד</Label>
          <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="user">משתמשת</SelectItem>
              <SelectItem value="admin">מנהלת</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User Type */}
        <div className="space-y-2">
          <Label>סוג משתמש</Label>
          <Select value={formData.user_type} onValueChange={(value) => handleSelectChange('user_type', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="member">חברה</SelectItem>
              <SelectItem value="mentor">מנטורית</SelectItem>
              <SelectItem value="instructor">מרצה</SelectItem>
              <SelectItem value="admin">מנהלת</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Is Approved Mentor */}
        <div className="space-y-2">
          <Label>מנטורית מאושרת</Label>
          <Select value={formData.is_approved_mentor ? 'true' : 'false'} onValueChange={(value) => handleSelectChange('is_approved_mentor', value === 'true')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="false">לא</SelectItem>
              <SelectItem value="true">כן</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subscription Status */}
        <div className="space-y-2">
          <Label>סטטוס מנוי</Label>
          <Select value={formData.subscription_status} onValueChange={(value) => handleSelectChange('subscription_status', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="inactive">לא פעיל</SelectItem>
              <SelectItem value="active">פעיל</SelectItem>
              <SelectItem value="expired">פג תוקף</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subscription Plan */}
        <div className="space-y-2">
          <Label>תכנית מנוי</Label>
          <Select value={formData.subscription_plan || 'null'} onValueChange={(value) => handleSelectChange('subscription_plan', value)}>
            <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="null">-</SelectItem>
              <SelectItem value="basic">בסיסי</SelectItem>
              <SelectItem value="premium">פרימיום</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subscription Type */}
        <div className="space-y-2">
          <Label>סוג מנוי</Label>
          <Select value={formData.subscription_type || 'null'} onValueChange={(value) => handleSelectChange('subscription_type', value)}>
            <SelectTrigger><SelectValue placeholder="-" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="null">-</SelectItem>
              <SelectItem value="monthly">חודשי</SelectItem>
              <SelectItem value="annual">שנתי</SelectItem>
              <SelectItem value="trial">מתנה (Trial)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date */}
        <div className="space-y-2">
          <Label>תחילת מנוי</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formData.subscription_start_date ? format(formData.subscription_start_date, "PPP", { locale: he }) : <span>בחרי תאריך</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.subscription_start_date} onSelect={(date) => handleDateChange('subscription_start_date', date)} /></PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label>סיום מנוי</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formData.subscription_end_date ? format(formData.subscription_end_date, "PPP", { locale: he }) : <span>בחרי תאריך</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.subscription_end_date} onSelect={(date) => handleDateChange('subscription_end_date', date)} /></PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Birth Date */}
       <div className="space-y-2">
          <Label>תאריך לידה</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="ml-2 h-4 w-4" />
                {formData.birth_date ? format(formData.birth_date, "PPP", { locale: he }) : <span>בחרי תאריך</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.birth_date} onSelect={(date) => handleDateChange('birth_date', date)} initialFocus /></PopoverContent>
          </Popover>
        </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          שמירת שינויים
        </Button>
      </div>
    </form>
  );
}
