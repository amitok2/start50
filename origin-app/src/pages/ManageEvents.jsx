import React, { useState, useEffect } from 'react';
import { Event } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2, Loader2, Calendar, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import EventForm from '../components/events/EventForm';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const eventsData = await Event.list("-created_date");
      setEvents(eventsData);
    } catch (err) {
      setError("אירעה שגיאה בטעינת האירועים.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddClick = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (eventId) => {
    try {
      await Event.delete(eventId);
      toast({ title: "האירוע נמחק בהצלחה", variant: "default" });
      fetchEvents();
    } catch (err) {
      toast({ title: "שגיאה במחיקת האירוע", description: err.message, variant: "destructive" });
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedEvent) {
        await Event.update(selectedEvent.id, formData);
        toast({ title: "האירוע עודכן בהצלחה", variant: "default" });
      } else {
        await Event.create(formData);
        toast({ title: "האירוע נוצר בהצלחה", variant: "default" });
      }
      setIsFormOpen(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (err) {
      toast({ title: "שגיאה בשמירת האירוע", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-pink-500" />
            ניהול אירועים
          </h1>
          <Button onClick={handleAddClick}>
            <PlusCircle className="ml-2 w-4 h-4" />
            הוספת אירוע חדש
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>רשימת אירועים</CardTitle>
            <CardDescription>כאן ניתן לנהל את כל האירועים והפעילויות באתר.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : error ? (
              <div className="text-red-600 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/>{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>כותרת</TableHead>
                    <TableHead>תאריך</TableHead>
                    <TableHead>מיקום</TableHead>
                    <TableHead>סטטוס פרסום</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{event.date ? format(new Date(event.date), 'dd/MM/yyyy', { locale: he }) : 'לא צוין'}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.is_public ? "מפורסם" : "טיוטה"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditClick(event)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>אישור מחיקה</AlertDialogTitle>
                                <AlertDialogDescription>
                                  האם את בטוחה שברצונך למחוק את האירוע "{event.title}"? לא ניתן לשחזר פעולה זו.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>ביטול</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(event.id)}>מחיקה</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{selectedEvent ? 'עריכת אירוע' : 'יצירת אירוע חדש'}</DialogTitle>
                    <DialogDescription>
                        מלאי את הפרטים ולחצי על שמירה.
                    </DialogDescription>
                </DialogHeader>
                <EventForm 
                    event={selectedEvent}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsFormOpen(false)}
                    isLoading={isSubmitting}
                />
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}