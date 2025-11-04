
import React, { useState, useEffect } from 'react';
import { Goal } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2, Loader2, Target, Calendar, ListChecks, Check } from 'lucide-react';

const GoalForm = ({ goal, onSave, onCancel }) => {
    const [formData, setFormData] = useState(goal || {
        title: '',
        description: '',
        category: 'קריירה',
        status: 'מתחילה',
        due_date: '',
        sub_tasks: []
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubtaskChange = (index, value) => {
        const newSubTasks = [...formData.sub_tasks];
        newSubTasks[index].text = value;
        setFormData(prev => ({ ...prev, sub_tasks: newSubTasks }));
    };

    const addSubtask = () => {
        setFormData(prev => ({ ...prev, sub_tasks: [...(prev.sub_tasks || []), { text: '', is_completed: false }] }));
    };

    const removeSubtask = (index) => {
        const newSubTasks = formData.sub_tasks.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, sub_tasks: newSubTasks }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title" className="text-lg">כותרת המטרה</Label>
                <Input id="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description" className="text-lg">תיאור</Label>
                <Textarea id="description" value={formData.description} onChange={handleInputChange} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">קטגוריה</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="קריירה">קריירה</SelectItem>
                            <SelectItem value="התפתחות אישית">התפתחות אישית</SelectItem>
                            <SelectItem value="בריאות ואיכות חיים">בריאות ואיכות חיים</SelectItem>
                            <SelectItem value="פיננסי">פיננסי</SelectItem>
                            <SelectItem value="חברתי">חברתי</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="due_date">תאריך יעד</Label>
                    <Input id="due_date" type="date" value={formData.due_date ? formData.due_date.split('T')[0] : ''} onChange={handleInputChange} />
                </div>
            </div>
             <div className="space-y-4">
                <Label className="text-lg">שלבי ביניים</Label>
                {formData.sub_tasks?.map((task, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input value={task.text} onChange={(e) => handleSubtaskChange(index, e.target.value)} placeholder={`שלב ${index + 1}`} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSubtask(index)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addSubtask}>
                    <Plus className="w-4 h-4 ml-2" /> הוספת שלב
                </Button>
            </div>
            <div className="flex justify-end gap-4">
                <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {goal ? 'שמירת שינויים' : 'שמירת מטרה'}
                </Button>
            </div>
        </form>
    );
};

const GoalItem = ({ goal, onEdit, onDelete, onUpdate }) => {
    const completedTasks = goal.sub_tasks?.filter(t => t.is_completed).length || 0;
    const totalTasks = goal.sub_tasks?.length || 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : (goal.status === 'הושלם' ? 100 : 0);

    const handleToggleSubtask = async (index) => {
        const newSubTasks = [...goal.sub_tasks];
        newSubTasks[index].is_completed = !newSubTasks[index].is_completed;
        const newStatus = newSubTasks.every(t => t.is_completed) ? 'הושלם' : (newSubTasks.some(t => t.is_completed) ? 'בתהליך' : 'מתחילה');
        await onUpdate(goal.id, { sub_tasks: newSubTasks, status: newStatus });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-rose-500"/>{goal.title}</CardTitle>
                        <p className="text-sm text-gray-500">{goal.category}{goal.due_date && ` - עד ${new Date(goal.due_date).toLocaleDateString('he-IL')}`}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {goal.description && <p className="mb-4 text-gray-600">{goal.description}</p>}
                
                {totalTasks > 0 && (
                     <div className="space-y-3">
                         <Label className="flex items-center gap-2"><ListChecks/> שלבי ביניים</Label>
                        {goal.sub_tasks.map((task, index) => (
                             <div key={index} className="flex items-center gap-3">
                                <Checkbox id={`task-${goal.id}-${index}`} checked={task.is_completed} onCheckedChange={() => handleToggleSubtask(index)} />
                                <label htmlFor={`task-${goal.id}-${index}`} className={`text-sm ${task.is_completed ? 'line-through text-gray-500' : ''}`}>{task.text}</label>
                            </div>
                        ))}
                         <Progress value={progress} className="mt-4" />
                     </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function GoalsManager({ user, goals, onGoalUpdate }) {
    const [isLoading, setIsLoading] = useState(false); // Changed to false, as goals are passed as prop
    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    // Removed useEffect and loadGoals as goals are now passed as a prop
    // The parent component is responsible for loading and passing goals

    const handleSaveGoal = async (data) => {
        setIsLoading(true);
        try {
            if (editingGoal) {
                await Goal.update(editingGoal.id, data);
            } else {
                await Goal.create(data);
            }
            setShowForm(false);
            setEditingGoal(null);
            onGoalUpdate(); // Notify parent to reload all data
        } catch (error) {
            console.error("Failed to save goal:", error);
            alert("שגיאה בשמירת המטרה.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteGoal = async (id) => {
        if (confirm("את בטוחה שאת רוצה למחוק את המטרה?")) {
            setIsLoading(true);
            try {
                await Goal.delete(id);
                onGoalUpdate(); // Notify parent to reload all data
            } catch (error) {
                console.error("Failed to delete goal:", error);
                alert("שגיאה במחיקת המטרה.");
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    const handleUpdateGoal = async (id, data) => {
        try {
            await Goal.update(id, data);
            onGoalUpdate(); // Notify parent to reload all data
        } catch (error) {
             console.error("Failed to update goal:", error);
        }
    }

    const handleAddNew = () => {
        setEditingGoal(null);
        setShowForm(true);
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setShowForm(true);
    };

    // isLoading now indicates a save/delete operation is in progress, not initial data loading
    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>;
    }

    if (showForm) {
        return <GoalForm goal={editingGoal} onSave={handleSaveGoal} onCancel={() => setShowForm(false)} />;
    }

    return (
        <div className="space-y-6 pt-4">
            <div className="flex justify-end">
                <Button onClick={handleAddNew}><Plus className="w-4 h-4 ml-2" />הוספת מטרה חדשה</Button>
            </div>
            {goals.length === 0 ? (
                <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">עדיין לא הגדרת מטרות</h3>
                    <p className="text-gray-500 mb-4">זה הזמן לחלום בגדול ולהציב יעדים שיקדמו אותך.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {goals.map(goal => (
                        <GoalItem key={goal.id} goal={goal} onEdit={handleEdit} onDelete={handleDeleteGoal} onUpdate={handleUpdateGoal} />
                    ))}
                </div>
            )}
        </div>
    );
}
