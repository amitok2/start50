
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { CareerReferral } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, Calendar, Target, Brain, Sparkles, Clock, Building2, User as UserIcon, Phone, MapPin, ArrowLeft, TrendingUp, FileText, Eye, Mail, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import CareerReferralForm from '../components/career/CareerReferralForm';
import ReferralProgressBar from '../components/career/ReferralProgressBar';
import JobSearchWidget from '../components/shared/JobSearchWidget';
import InterviewFeedbackModal from '../components/career/InterviewFeedbackModal';
import EmailDraftModal from '../components/career/EmailDraftModal';

export default function CareerReferrals() {
    const [user, setUser] = useState(null);
    const [referrals, setReferrals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingReferral, setEditingReferral] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showEmailDraft, setShowEmailDraft] = useState(false);
    const [selectedReferralForEmail, setSelectedReferralForEmail] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);

            if (currentUser?.email) {
                const userReferrals = await CareerReferral.filter(
                    { created_by: currentUser.email },
                    '-created_date'
                );
                setReferrals(userReferrals || []);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingReferral) {
                await CareerReferral.update(editingReferral.id, formData);
            } else {
                await CareerReferral.create(formData);
            }
            setShowForm(false);
            setEditingReferral(null);
            loadData();
        } catch (error) {
            console.error('Error saving referral:', error);
            alert('שגיאה בשמירת הפניית הקריירה');
        }
    };

    const handleEdit = (referral) => {
        setEditingReferral(referral);
        setShowForm(true);
    };

    const handleViewFeedback = (referral) => {
        setSelectedFeedback(referral.interview_feedback);
        setShowFeedbackModal(true);
    };

    const handleOpenEmailDraft = (referral) => {
        setSelectedReferralForEmail(referral);
        setShowEmailDraft(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'ממתין': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
            'זומנתי לראיון': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Calendar },
            'בתהליך': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: TrendingUp },
            'קיבלתי הצעה': { color: 'bg-green-100 text-green-800 border-green-200', icon: Target },
            'התחלתי לעבוד': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Sparkles },
            'נדחיתי': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: UserIcon },
            'הושלם': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Target }
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: UserIcon };
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} border flex items-center gap-1 px-3 py-1`}>
                <Icon className="w-3 h-3" />
                {status}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">טוען את ההפניות שלך...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="w-32 h-32 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white overflow-hidden">
                        <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/84daf714e_.jpg"
                            alt="ReStart 50+"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        מעקב הפניות קריירה
                    </h1>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-xl text-gray-700 leading-relaxed mb-2">
                            זה המקום שבו כל הצעדים שלך בדרך לקריירה החדשה מתכנסים למסלול אחד ברור.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            כאן תוכלי לרכז את כל המשרות שפנית אליהן, לעקוב אחר סטטוס הטיפול, לקבוע תזכורות לראיונות ולהתכונן להצלחה.
                        </p>
                    </div>
                </div>

                {/* Add/Form Section */}
                <div className="mb-12 text-center">
                    {!showForm && (
                        <Button
                            size="lg"
                            onClick={() => { setEditingReferral(null); setShowForm(true); }}
                            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full shadow-lg"
                        >
                            <Plus className="w-5 h-5 ml-2" />
                            הוספת הפניית קריירה חדשה
                        </Button>
                    )}
                </div>

                {showForm && (
                    <Card className="mb-12 shadow-2xl bg-white/90 backdrop-blur-sm border-0">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-800">{editingReferral ? 'עריכת הפניית קריירה' : 'הוספת הפניית קריירה חדשה'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CareerReferralForm
                                referral={editingReferral}
                                onSubmit={handleFormSubmit}
                                onCancel={() => { setShowForm(false); setEditingReferral(null); }}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Referrals List Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">ההפניות שלי</h2>
                    {referrals.length > 0 ? (
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                            {referrals.map(referral => (
                                <Card key={referral.id} className="bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl flex flex-col">
                                    <CardHeader className="flex-grow-0 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">{referral.job_title}</CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1 text-gray-600">
                                                    <Building2 className="w-4 h-4" />{referral.company_name}
                                                </CardDescription>
                                            </div>
                                            {getStatusBadge(referral.status)}
                                        </div>
                                    </CardHeader>
                                    
                                    {/* Progress Bar */}
                                    <div className="px-6">
                                        <ReferralProgressBar status={referral.status} />
                                    </div>
                                    
                                    <CardContent className="space-y-4 flex-grow pt-4">
                                        {referral.recommender_details && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <UserIcon className="w-4 h-4" />
                                                <span>הופנתה דרך: {referral.recommender_details}</span>
                                            </div>
                                        )}
                                        {referral.referral_date && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>תאריך הפניה: {format(new Date(referral.referral_date), 'dd/MM/yyyy', { locale: he })}</span>
                                            </div>
                                        )}

                                        {(referral.interview_date_1 || referral.interview_date_2) && (
                                            <div className="border-t pt-4 mt-4 space-y-3">
                                                {referral.interview_date_1 && (
                                                    <div className="text-sm">
                                                        <p className="font-semibold text-gray-700">ראיון ראשון:</p>
                                                        <p className="flex items-center gap-2 text-gray-600">
                                                            <Calendar className="w-4 h-4" /> 
                                                            {format(new Date(referral.interview_date_1), 'EEEE, dd MMMM yyyy', { locale: he })}
                                                            {referral.interview_time_1 && ` בשעה ${referral.interview_time_1}`}
                                                        </p>
                                                    </div>
                                                )}
                                                {referral.interview_date_2 && (
                                                    <div className="text-sm">
                                                        <p className="font-semibold text-gray-700">ראיון שני:</p>
                                                        <p className="flex items-center gap-2 text-gray-600">
                                                            <Calendar className="w-4 h-4" /> 
                                                            {format(new Date(referral.interview_date_2), 'EEEE, dd MMMM yyyy', { locale: he })}
                                                            {referral.interview_time_2 && ` בשעה ${referral.interview_time_2}`}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {referral.notes && (
                                            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 border">
                                                <p className="font-semibold mb-1">הערות:</p>
                                                <p className="whitespace-pre-wrap">{referral.notes}</p>
                                            </div>
                                        )}

                                        {/* Interview Feedback Indicator */}
                                        {referral.interview_feedback && (
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-2 text-sm text-green-800 mb-2">
                                                    <FileText className="w-4 h-4" />
                                                    <span className="font-semibold">יש לך פידבק משמור מסימולציית ראיון!</span>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                    
                                    <div className="p-4 pt-0 mt-auto space-y-2">
                                        <div className="flex gap-2 w-full">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenEmailDraft(referral)}
                                                className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                                            >
                                                <Mail className="w-4 h-4 ml-2" />
                                                הכן טיוטת מייל
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(referral)}
                                                className="flex-1"
                                            >
                                                <Edit className="w-4 h-4 ml-2" />
                                                עריכה
                                            </Button>
                                        </div>
                                        
                                        {/* Interview Prep Button */}
                                        <Button 
                                            asChild
                                            variant="outline"
                                            className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 text-purple-700 hover:bg-purple-100"
                                        >
                                            <Link to={createPageUrl(`InterviewPrepAI?referralId=${referral.id}`)}>
                                                <Brain className="w-4 h-4 ml-2" />
                                                הכנה לראיון עם AI
                                            </Link>
                                        </Button>

                                        {/* View Feedback Button - only if feedback exists */}
                                        {referral.interview_feedback && (
                                            <Button
                                                variant="outline"
                                                onClick={() => handleViewFeedback(referral)}
                                                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-700 hover:bg-green-100"
                                            >
                                                <Eye className="w-4 h-4 ml-2" />
                                                תראי ראיון סימולציה שביצעת למשרה
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        !showForm && (
                            <div className="text-center py-12 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
                                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">עדיין לא הוספת הפניות</h3>
                                <p className="text-gray-500">לחצי על "הוספת הפניית קריירה חדשה" כדי להתחיל לעקוב.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Interview Prep Section */}
                <Card className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-purple-200 shadow-xl mt-16">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
                            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">🎯 הכנה לראיון עם ReStart – ביטחון, מקצועיות והצלחה</h3>
                                <p className="text-gray-600 text-lg">
                                    קבלי הכנה מותאמת אישית לכל ראיון! המערכת שלנו תעזור לך להתאמן על שאלות נפוצות, לנסח תשובות מנצחות ולהגיע הכי מוכנה שיש.
                                </p>
                            </div>
                            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-full mt-4 md:mt-0 flex-shrink-0">
                                <Link to={createPageUrl("InterviewPrepAI")}>
                                    <Brain className="w-5 h-5 ml-2" />
                                    בואי נתאמן לראיון
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Success Congratulations Message */}
                {referrals.some(ref => ref.status === 'קיבלתי הצעה' || ref.status === 'הושלם' || ref.status === 'התחלתי לעבוד') && (
                    <div className="mt-16">
                        <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200 shadow-xl overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
                                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
                                        <Sparkles className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-2xl md:text-3xl font-bold text-green-800 mb-3 flex items-center justify-center md:justify-start gap-2">
                                            🎉 ברכות על תחילת הדרך החדשה! 🎉
                                        </h3>
                                        <p className="text-lg text-green-700 leading-relaxed">
                                            בקרוב מחכות לך כלים ותכנים שיתמכו בך גם בצעדים הראשונים בתפקיד החדש.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Job Search Recommendations Section */}
                <div className="mt-16">
                    <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border-blue-200 shadow-xl overflow-hidden">
                        <CardContent className="p-8">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    🔗 רוצה לגלות עוד הזדמנויות?
                                </h3>
                                <p className="text-gray-600">
                                    ראי עוד משרות בתחום שלך ברשת
                                </p>
                            </div>
                            
                            <div className="max-w-2xl mx-auto">
                                <JobSearchWidget />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <InterviewFeedbackModal
                    feedback={selectedFeedback}
                    onClose={() => setShowFeedbackModal(false)}
                />
            )}

            {/* Email Draft Modal */}
            {showEmailDraft && (
                <EmailDraftModal
                    isOpen={showEmailDraft}
                    onClose={() => setShowEmailDraft(false)}
                    referral={selectedReferralForEmail}
                    user={user}
                />
            )}
        </div>
    );
}
