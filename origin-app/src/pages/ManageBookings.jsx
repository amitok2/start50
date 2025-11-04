
import React, { useState, useEffect, useCallback } from 'react';
import { Appointment } from '@/api/entities'; // Changed from MentorApplication
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Search, CheckCircle, XCircle, Eye, Trash2, Hourglass } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";


export default function ManageBookings() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingApplication, setDeletingApplication] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { toast } = useToast();

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      // Admin can list all appointments directly, sorted by creation date (newest first)
      const allAppointments = await Appointment.list('-created_date');
      setApplications(allAppointments);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      toast({
        title: "שגיאה בטעינת הבקשות",
        description: error.message,
        variant: "destructive"
      });
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        await loadApplications();
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        setIsUserLoading(false);
      }
    };

    init();
  }, [loadApplications]);

  const filterApplications = useCallback(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.mentor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  useEffect(() => {
    filterApplications();
  }, [filterApplications]);
  
  const handleStatusUpdate = async (applicationId, newStatus) => {
    setIsUpdating(true);
    try {
        await Appointment.update(applicationId, { status: newStatus });
        
        setShowDetailsModal(false);
        setSelectedApplication(null);
        await loadApplications();
        toast({
            title: "סטטוס הבקשה עודכן",
            description: `הסטטוס עודכן ל: ${newStatus}`,
            className: "bg-green-100 text-green-800"
        });
    } catch (error) {
        console.error("Failed to update application status:", error);
        toast({ title: "שגיאה בעדכון הסטטוס", description: error.message, variant: "destructive" });
    } finally {
        setIsUpdating(false);
    }
  };

  const handleDelete = (app) => {
    setDeletingApplication(app);
  };
  
  const confirmDelete = async () => {
    if (!deletingApplication) return;
    setIsDeleting(true);
    try {
      await Appointment.delete(deletingApplication.id);
      toast({ title: "הבקשה נמחקה", description: `הבקשה של ${deletingApplication.user_name} נמחקה לצמיתות.` });
      setDeletingApplication(null);
      await loadApplications();
    } catch (error) {
      console.error("Failed to delete application:", error);
      toast({ title: "שגיאה במחיקת הבקשה", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 ml-1" />אושר</Badge>;
            case 'pending_approval':
                return <Badge className="bg-yellow-100 text-yellow-800"><Hourglass className="w-3 h-3 ml-1" />ממתין לאישור</Badge>;
            case 'cancelled_by_user':
            case 'cancelled_by_mentor':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 ml-1" />בוטל</Badge>;
            case 'completed':
                 return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 ml-1" />הושלם</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

  if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 text-purple-500 animate-spin" /></div>;
  }
  
  if (!currentUser || currentUser.role !== 'admin') {
      return <div className="text-center p-8">אין לך הרשאה לגשת לעמוד זה.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600"/>
            ניהול בקשות לפגישה
          </h1>
          <p className="text-gray-600">צפייה וטיפול בבקשות פגישה שנשלחו למנטוריות</p>
        </header>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש לפי שם שולחת או שם מנטורית..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="סינון לפי סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  <SelectItem value="pending_approval">ממתין לאישור</SelectItem>
                  <SelectItem value="confirmed">אושר</SelectItem>
                  <SelectItem value="cancelled_by_user">בוטל על ידי משתמש</SelectItem>
                  <SelectItem value="cancelled_by_mentor">בוטל על ידי מנטור</SelectItem>
                  <SelectItem value="completed">הושלם</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((app) => (
                  <Card key={app.id} className="bg-white shadow-md flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg">{app.user_name}</CardTitle>
                        <p className="text-sm text-gray-500 truncate">אל: {app.mentor_name}</p>
                        <div className="mt-2">
                          {getStatusBadge(app.status)}
                        </div>
                    </CardHeader>
                    <CardContent className="mt-auto flex flex-col">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 font-medium">
                        "{app.user_message}"
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        הוגש: {new Date(app.created_date).toLocaleDateString('he-IL')}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowDetailsModal(true);
                          }}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 ml-2" /> 
                          צפייה וטיפול
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(app)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredApplications.length === 0 && !isLoading && (
              <p className="text-center py-10 text-gray-500">לא נמצאו בקשות התואמות את הסינון.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">פרטי בקשת פגישה</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6 py-4">
               <div>
                <h4 className="font-semibold text-gray-800">מאת:</h4>
                <p className="text-gray-600">{selectedApplication.user_name} ({selectedApplication.user_email})</p>
                <p className="text-gray-600">טלפון: {selectedApplication.user_phone}</p>
              </div>
               <div>
                <h4 className="font-semibold text-gray-800">אל:</h4>
                <p className="text-gray-600">{selectedApplication.mentor_name}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">הודעה:</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedApplication.user_message}</p>
              </div>

              {selectedApplication.status === 'pending_approval' && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button 
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'confirmed')}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    אישור בקשה
                  </Button>
                  <Button 
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'cancelled_by_mentor')}
                    disabled={isUpdating}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    דחיית בקשה
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingApplication} onOpenChange={(isOpen) => !isOpen && setDeletingApplication(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>אישור מחיקה</AlertDialogTitle>
            <AlertDialogDescription>
              האם את בטוחה שברצונך למחוק את הבקשה של {deletingApplication?.user_name}? לא ניתן לשחזר פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              כן, מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
