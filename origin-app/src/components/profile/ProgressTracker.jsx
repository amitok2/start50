import React from 'react';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgressTracker({ 
    hasSocialProfile, 
    hasPathfinder, 
    hasGoals, 
    hasCv, 
    hasAppointment, 
    hasCommunityPost 
}) {
    const steps = [
        { 
            id: 'profile', 
            label: 'יצירת פרופיל', 
            completed: hasSocialProfile,
            color: 'from-purple-400 to-pink-400'
        },
        { 
            id: 'pathfinder', 
            label: 'אבחון קריירה', 
            completed: hasPathfinder,
            color: 'from-pink-400 to-rose-400'
        },
        { 
            id: 'cv', 
            label: 'העלאת קו״ח', 
            completed: hasCv,
            color: 'from-rose-400 to-orange-400'
        },
        { 
            id: 'goals', 
            label: 'הגדרת יעדים', 
            completed: hasGoals,
            color: 'from-orange-400 to-amber-400'
        },
        { 
            id: 'mentor', 
            label: 'פגישה עם מנטורית', 
            completed: hasAppointment,
            color: 'from-amber-400 to-yellow-400'
        },
        { 
            id: 'community', 
            label: 'שיתוף בקהילה', 
            completed: hasCommunityPost,
            color: 'from-yellow-400 to-green-400'
        }
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progressPercentage = (completedCount / steps.length) * 100;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">המסלול שלך להצלחה</h3>
                    <span className="text-lg font-bold text-rose-600">{completedCount}/{steps.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-purple-500 rounded-full"
                    />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    {progressPercentage === 100 
                        ? 'כל הכבוד! השלמת את כל השלבים! 🎉' 
                        : `עוד ${steps.length - completedCount} שלבים להשלמה`}
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative flex flex-col items-center text-center p-4 rounded-xl transition-all ${
                            step.completed 
                                ? 'bg-gradient-to-br ' + step.color + ' text-white shadow-md' 
                                : 'bg-gray-50 text-gray-400'
                        }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                            step.completed ? 'bg-white/30' : 'bg-gray-200'
                        }`}>
                            {step.completed ? (
                                <CheckCircle2 className="w-6 h-6" />
                            ) : (
                                <Circle className="w-6 h-6" />
                            )}
                        </div>
                        <span className="text-xs sm:text-sm font-medium leading-tight">
                            {step.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}