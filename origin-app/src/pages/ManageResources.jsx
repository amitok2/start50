import React, { useState, useEffect } from "react";
import { Resource } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2, BookText, Video, FileText, Link as LinkIcon, Library } from "lucide-react";
import ResourceForm from "../components/resources/ResourceForm";

const resourceIcons = {
  "מאמר": <BookText className="w-5 h-5 text-blue-500" />,
  "וידאו": <Video className="w-5 h-5 text-red-500" />,
  "תבנית": <FileText className="w-5 h-5 text-green-500" />,
  "מדריך": <Library className="w-5 h-5 text-purple-500" />,
  "קישור": <LinkIcon className="w-5 h-5 text-orange-500" />,
};

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const resourceData = await Resource.list("-created_date");
      setResources(resourceData);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingResource(null);
    setShowModal(true);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setShowModal(true);
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm("האם את בטוחה שאת רוצה למחוק את המשאב הזה?")) {
      try {
        await Resource.delete(resourceId);
        loadResources();
      } catch (error) {
        console.error("Failed to delete resource:", error);
        alert("נכשל במחיקת המשאב.");
      }
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    loadResources();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ניהול ספריית המשאבים</h1>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 ml-2" />
            הוספת משאב חדש
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="bg-white shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {resourceIcons[resource.type] || <BookText className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <p className="text-sm text-rose-600">{resource.category}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{resource.description}</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(resource)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(resource.id)}>
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
              {editingResource ? "עריכת משאב" : "הוספת משאב חדש"}
            </DialogTitle>
          </DialogHeader>
          <ResourceForm resource={editingResource} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}