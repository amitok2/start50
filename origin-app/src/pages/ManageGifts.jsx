import React, { useState, useEffect } from "react";
import { PayItForward } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, Gift } from "lucide-react";
import CreateGiftForm from "../components/payitforward/CreateGiftForm";

export default function ManageGifts() {
  const [gifts, setGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserAndGifts = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user);
        const giftsData = await PayItForward.list("-created_date");
        setGifts(giftsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAndGifts();
  }, []);

  const loadGifts = async () => {
    setIsLoading(true);
    try {
        const giftsData = await PayItForward.list("-created_date");
        setGifts(giftsData);
    } catch (error) {
        console.error("Failed to reload gifts:", error);
    } finally {
        setIsLoading(false);
    }
  }

  const handleAddNew = () => {
    setEditingGift(null);
    setShowModal(true);
  };

  const handleEdit = (gift) => {
    setEditingGift(gift);
    setShowModal(true);
  };

  const handleDelete = async (giftId) => {
    if (window.confirm("האם את בטוחה שאת רוצה למחוק את המתנה הזו? הפעולה תסמן אותה כ'נמחקה'.")) {
      try {
        await PayItForward.update(giftId, { status: "expired" });
        await loadGifts();
        alert("המתנה נמחקה בהצלחה.");
      } catch (error) {
        console.error("Failed to delete gift:", error);
        alert("נכשל במחיקת המתנה.");
      }
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditingGift(null);
    loadGifts();
  };

  const getStatusColor = (status) => {
    switch (status) {
        case "available": return "bg-blue-100 text-blue-800";
        case "taken": return "bg-green-100 text-green-800";
        case "expired": return "bg-gray-100 text-gray-800";
        default: return "bg-gray-100 text-gray-800";
    }
  }

  const getStatusText = (status) => {
    switch (status) {
        case "available": return "זמין";
        case "taken": return "נלקח";
        case "expired": return "נמחק/פג תוקף";
        default: return status;
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      "משרה": "bg-blue-100 text-blue-800",
      "טיפ": "bg-yellow-100 text-yellow-800",
      "פריט": "bg-green-100 text-green-800",
      "חוויה": "bg-purple-100 text-purple-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ניהול מתנות (תעביר את זה הלאה)</h1>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 ml-2" />
            הוספת מתנה חדשה
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
          </div>
        ) : gifts.length === 0 ? (
            <Card>
                <CardContent className="p-8 text-center">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-600 mb-2">אין מתנות במערכת</h2>
                    <p className="text-gray-500 mb-6">הוסיפי את המתנה הראשונה כדי להתחיל</p>
                    <Button onClick={handleAddNew}>
                        <Plus className="w-4 h-4 ml-2" />
                        הוספת מתנה
                    </Button>
                </CardContent>
            </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift) => (
              <Card key={gift.id} className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{gift.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 text-sm mt-2">
                    <Badge className={getStatusColor(gift.status)}>{getStatusText(gift.status)}</Badge>
                    <Badge className={getCategoryColor(gift.category)}>{gift.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{gift.description}</p>
                   <p className="text-xs text-gray-500 mb-2">מאת: {gift.giver_name}</p>
                   {gift.status === 'taken' && <p className="text-xs text-green-600 mb-2">נלקח ע"י: {gift.receiver_name}</p>}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(gift)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(gift.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGift ? "עריכת מתנה" : "הוספת מתנה חדשה"}
            </DialogTitle>
          </DialogHeader>
          {currentUser && (
            <CreateGiftForm 
              gift={editingGift} 
              currentUser={currentUser}
              onSuccess={handleSuccess} 
              onCancel={() => setShowModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}