import React from 'react';
import { X, CheckCircle, TrendingUp, Lightbulb, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InterviewFeedbackModal({ feedback, onClose }) {
    if (!feedback) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <CheckCircle className="w-6 h-6" />
                            תוצאות הסימולציה שלך
                        </h2>
                        <p className="text-green-100 text-sm mt-1">הפידבק המלא מהראיון המדומה</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Overall Impression */}
                    {feedback.overall_impression && (
                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                    <Star className="w-5 h-5" />
                                    הרושם הכללי
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {String(feedback.overall_impression)}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Strengths */}
                    {feedback.strengths && Array.isArray(feedback.strengths) && feedback.strengths.length > 0 && (
                        <Card className="bg-green-50 border-green-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-800">
                                    <CheckCircle className="w-5 h-5" />
                                    נקודות חוזק
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {feedback.strengths.map((strength, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                ✓
                                            </span>
                                            <span className="text-gray-800 flex-1">{String(strength)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Areas for Improvement */}
                    {feedback.areas_for_improvement && Array.isArray(feedback.areas_for_improvement) && feedback.areas_for_improvement.length > 0 && (
                        <Card className="bg-orange-50 border-orange-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-800">
                                    <TrendingUp className="w-5 h-5" />
                                    תחומים לשיפור
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {feedback.areas_for_improvement.map((area, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                ⚡
                                            </span>
                                            <span className="text-gray-800 flex-1">{String(area)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Specific Answer Feedback */}
                    {feedback.answer_feedback && Array.isArray(feedback.answer_feedback) && feedback.answer_feedback.length > 0 && (
                        <Card className="bg-purple-50 border-purple-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-purple-800">
                                    <MessageSquare className="w-5 h-5" />
                                    פידבק ספציפי לתשובות
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {feedback.answer_feedback.map((fb, index) => (
                                        <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                                            <p className="font-semibold text-purple-900 mb-2">שאלה {index + 1}</p>
                                            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{String(fb)}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Items */}
                    {feedback.action_items && Array.isArray(feedback.action_items) && feedback.action_items.length > 0 && (
                        <Card className="bg-indigo-50 border-indigo-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-indigo-800">
                                    <Lightbulb className="w-5 h-5" />
                                    המלצות לפעולה
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {feedback.action_items.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-800 flex-1">{String(item)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t flex justify-center">
                    <Button onClick={onClose} className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                        סגור
                    </Button>
                </div>
            </div>
        </div>
    );
}