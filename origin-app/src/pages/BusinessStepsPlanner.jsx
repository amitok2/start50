
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { BusinessPlanStep } from '@/api/entities';
import { PathfinderResponse } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  CheckCircle,
  Circle,
  Lightbulb,
  Target,
  LogIn,
  ChevronDown,
  ChevronRight,
  Star,
  Settings,
  Globe,
  Zap,
  TrendingUp,
  Heart,
  Sparkles,
  BookOpen,
  Library,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import PathfinderResultWidget from '../components/profile/PathfinderResultWidget';
import EntrepreneurshipQuizWidget from '../components/profile/EntrepreneurshipQuizWidget';

const BUSINESS_STEPS = [
  {
    id: 1,
    name: "גיבוש רעיון ומחקר שוק",
    description: "גלי מי הלקוחות שלך ומה הופך את העסק שלך לייחודי",
    motivationalText: "גיבושי את הרעיון שלך – זה הרגע לתת לחלום שלך מילים ✨",
    icon: Lightbulb,
    color: "from-pink-400 to-rose-500",
    subtasks: [
      "הגדרת הרעיון העסקי בבהירות",
      "זיהוי קהל היעד המדויק",
      "מחקר מתחרים ואנליזה תחרותית",
      "הגדרת הערך הייחודי של המוצר/השירות",
      "בדיקת כדאיות ראשונית"
    ]
  },
  {
    id: 2,
    name: "בניית תוכנית עסקית",
    description: "מפת הדרכים המפורטת שתוביל אותך להצלחה",
    motivationalText: "כתבי את תוכנית הפעולה שלך – בלי דחיות, רק צעדים קדימה 💪",
    icon: Target,
    color: "from-purple-400 to-indigo-500",
    subtasks: [
      "הגדרת חזון ומטרות העסק",
      "תכנון אסטרטגיית שיווק",
      "חישוב תחזית הכנסות והוצאות",
      "תכנון מבנה התפעול",
      "הגדרת מדדי הצלחה ויעדים"
    ]
  },
  {
    id: 3,
    name: "בחירת שם, לוגו ומיתוג",
    description: "זהות חזותית ומסר שיגרמו ללקוחות להתאהב בעסק שלך",
    motivationalText: "בחרי שם ולוגו – צרי את זהות העסק שלך היום! 🎨",
    icon: Star,
    color: "from-rose-400 to-pink-500",
    subtasks: [
      "בחירת שם העסק ובדיקת זמינות",
      "עיצוב לוגו או הזמנתו ממעצב",
      "הגדרת פלטת צבעים ופונטים",
      "יצירת סלוגן או מסר מרכזי",
      "הכנת קווים מנחים למיתוג"
    ]
  },
  {
    id: 4,
    name: "היבטים חוקיים וחשבונאיים",
    description: "כל הניירת והרישומים שיתנו לך שקט נפשי",
    motivationalText: "סיימי את הרישום והסידורים החוקיים עכשיו – את כמעט שם! 📋",
    icon: Settings,
    color: "from-gray-400 to-gray-600",
    subtasks: [
      "בחירת מעמד עסקי (עוסק פטור/מורשה/בע\"מ)",
      "רישום במס הכנסה ומע\"מ",
      "רישום בביטוח לאומי",
      "בחירת רואה חשבון והסכמה איתו",
      "פתיחת חשבון בנק עסקי"
    ]
  },
  {
    id: 5,
    name: "הקמת תשתיות",
    description: "הבית הדיגיטלי שלך שבו לקוחות ימצאו אותך",
    motivationalText: "בני את האתר והפרופילים החברתיים שלך מיד – הלקוחות כבר מחכים! 🌐",
    icon: Globe,
    color: "from-teal-400 to-cyan-500",
    subtasks: [
      "הקמת אתר אינטרנט או דף נחיתה",
      "פתיחת עמודים ברשתות חברתיות",
      "הכנת כרטיסי ביקור וחומרי שיווק",
      "רכישת ציוד בסיסי או תוכנות נדרשות",
      "הכנת מערכת CRM או ניהול לקוחות"
    ]
  },
  {
    id: 6,
    name: "השקת פיילוט",
    description: "התנסות ראשונה עם לקוחות אמיתיים וקבלת משובים",
    motivationalText: "השיקי את הפיילוט ובדקי את הרעיון שלך עם לקוחות אמיתיים – הגיע הזמן! 🚀",
    icon: Zap,
    color: "from-orange-400 to-red-500",
    subtasks: [
      "הגדרת מטרות הפיילוט",
      "בחירת לקוחות ראשונים לבדיקה",
      "הפעלת הפיילוט ומתן השירות/מכירת המוצר",
      "איסוף משוב ותגובות מלקוחות",
      "שיפור המוצר/השירות על בסיס המשוב"
    ]
  },
  {
    id: 7,
    name: "פתיחה רשמית",
    description: "ההשקה הרשמית שתציג את העסק שלך לעולם",
    motivationalText: "הגיע הזמן – השיקי את העסק שלך והכריזי לעולם! 🎉",
    icon: TrendingUp,
    color: "from-fuchsia-400 to-purple-500",
    subtasks: [
      "תכנון קמפיין השקה",
      "הכנת חומרי שיווק והודעה לעיתונות",
      "יצירת אירוע השקה או פרסום מיוחד",
      "הפעלת קמפיין ברשתות חברתיות",
      "מעקב ומדידת תוצאות ההשקה"
    ]
  }
];

const SimpleProgressBar = ({ value, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export default function BusinessStepsPlanner() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const [expandedStep, setExpandedStep] = useState(null);
  const [pathfinderResult, setPathfinderResult] = useState(null);
  const [pathfinderCompleted, setPathfinderCompleted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (currentUser && currentUser.email) {
        const userSteps = await BusinessPlanStep.filter({ created_by: currentUser.email });
        setSteps(userSteps || []);

        try {
          const pathfinderResults = await PathfinderResponse.filter({ created_by: currentUser.email }, '-created_date', 1);
          const hasPathfinderResult = pathfinderResults && pathfinderResults.length > 0;
          setPathfinderResult(hasPathfinderResult ? pathfinderResults[0] : null);
          setPathfinderCompleted(hasPathfinderResult);
        } catch (pathfinderError) {
          console.warn('Could not load pathfinder results:', pathfinderError);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepData = (stepNumber) => {
    return steps.find(s => s.step_number === stepNumber);
  };

  const toggleSubtask = async (stepNumber, subtaskIndex) => {
    const stepData = getStepData(stepNumber);
    
    if (stepData) {
      const updatedSubtasks = [...(stepData.subtasks || [])];
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        is_completed: !updatedSubtasks[subtaskIndex].is_completed,
        completion_date: !updatedSubtasks[subtaskIndex].is_completed ? new Date().toISOString() : null
      };

      await BusinessPlanStep.update(stepData.id, { subtasks: updatedSubtasks });
      await loadData();
    } else {
      const step = BUSINESS_STEPS.find(s => s.id === stepNumber);
      const newSubtasks = step.subtasks.map((task, index) => ({
        task: task,
        is_completed: index === subtaskIndex,
        completion_date: index === subtaskIndex ? new Date().toISOString() : null
      }));

      await BusinessPlanStep.create({
        step_number: stepNumber,
        step_name: step.name,
        subtasks: newSubtasks,
        is_completed: false
      });
      await loadData();
    }
  };

  const toggleStepCompletion = async (stepNumber) => {
    const stepData = getStepData(stepNumber);
    
    if (stepData) {
      await BusinessPlanStep.update(stepData.id, {
        is_completed: !stepData.is_completed,
        completion_date: !stepData.is_completed ? new Date().toISOString() : null
      });
    } else {
      const step = BUSINESS_STEPS.find(s => s.id === stepNumber);
      await BusinessPlanStep.create({
        step_number: stepNumber,
        step_name: step.name,
        is_completed: true,
        completion_date: new Date().toISOString(),
        subtasks: []
      });
    }
    await loadData();
  };

  const updateNotes = async (stepNumber, notes) => {
    const stepData = getStepData(stepNumber);
    
    if (stepData) {
      await BusinessPlanStep.update(stepData.id, { notes });
    } else {
      const step = BUSINESS_STEPS.find(s => s.id === stepNumber);
      await BusinessPlanStep.create({
        step_number: stepNumber,
        step_name: step.name,
        notes: notes,
        subtasks: []
      });
    }
    await loadData();
  };

  const getCompletedStepsCount = () => {
    return steps.filter(s => s.is_completed).length;
  };

  const getOverallProgress = () => {
    if (steps.length === 0) return 0;
    
    const totalSubtasks = steps.reduce((acc, step) => {
      return acc + (step.subtasks?.length || 0);
    }, 0);
    
    const completedSubtasks = steps.reduce((acc, step) => {
      return acc + (step.subtasks?.filter(t => t.is_completed).length || 0);
    }, 0);
    
    if (totalSubtasks === 0) return 0;
    return Math.round((completedSubtasks / totalSubtasks) * 100);
  };

  const getNextStep = () => {
    for (let i = 0; i < BUSINESS_STEPS.length; i++) {
      const stepData = getStepData(BUSINESS_STEPS[i].id);
      if (!stepData || !stepData.is_completed) {
        return BUSINESS_STEPS[i];
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <Card className="max-w-md w-full text-center border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">התחברות נדרשת</h2>
            <p className="text-gray-600 mb-6">
              כדי להשתמש במתכנן השלבים העסקי, יש להתחבר למערכת תחילה.
            </p>
            <Button
              onClick={() => User.login()}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              <LogIn className="w-5 h-5 ml-2" />
              התחברות למערכת
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedSteps = getCompletedStepsCount();
  const overallProgress = getOverallProgress();
  const nextStep = getNextStep(); // Keep nextStep for other logic if needed, but not rendered in Hero
  const userName = user.full_name ? user.full_name.split(' ')[0] : 'יקירה';

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Section with Image */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl mb-12"
          style={{ minHeight: '400px' }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/b758261ae_1.jpg)',
              backgroundPosition: 'center center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-pink-900/30 to-rose-900/45"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center text-center px-6 py-16 md:py-24">
            <div className="max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
              >
                שלום {userName}! 🌸<br/>
                המקום שלך כיזמת ועצמאית
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/25 backdrop-blur-md rounded-2xl p-6 border-2 border-white/50"
              >
                <p className="text-lg md:text-xl font-bold text-white leading-relaxed drop-shadow-lg">
                  הפכי את הרעיון שלך לתוכנית, עם הליווי של היועץ העסקי של ריסטרט,<br/>
                  בדרך לעסק מצליח.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">ההתקדמות שלך במסע היזמי</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-semibold text-gray-700">{completedSteps} מתוך 7 שלבים הושלמו</span>
                      <span className="text-lg font-bold text-rose-600">{overallProgress}%</span>
                    </div>
                    <SimpleProgressBar value={overallProgress} />
                  </div>
                  
                  {overallProgress < 100 ? (
                    <p className="text-gray-600 leading-relaxed">
                      <Heart className="w-5 h-5 text-rose-500 inline ml-1" />
                      המסע שלך רק מתחיל – צעד קטן ראשון יוצר שינוי גדול 💪
                    </p>
                  ) : (
                    <p className="text-green-600 font-semibold leading-relaxed">
                      <Sparkles className="w-5 h-5 inline ml-1" />
                      מדהים! השלמת את כל השלבים! את מוכנה להמריא 🎉
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border-2 border-rose-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💡 טיפ קטן להיום:</h3>
                <p className="text-gray-700 leading-relaxed">
                  "אל תפחדי לכתוב אפילו רעיון לא שלם – כל עסק מצליח התחיל ממשפט אחד."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Steps */}
        <div className="space-y-6 mb-12">
          {BUSINESS_STEPS.map((step, index) => {
            const stepData = getStepData(step.id);
            const isCompleted = stepData?.is_completed || false;
            const StepIcon = step.icon;
            const isExpanded = expandedStep === step.id;

            const subtasksToShow = stepData?.subtasks || step.subtasks.map(task => ({
              task: task,
              is_completed: false
            }));

            const completedSubtasks = subtasksToShow.filter(t => t.is_completed).length;
            const totalSubtasks = subtasksToShow.length;
            const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl ${
                  isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-white'
                }`}>
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <StepIcon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl md:text-2xl">
                            שלב {step.id}: {step.name}
                          </CardTitle>
                          {isCompleted && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                              <CheckCircle className="w-4 h-4 ml-1" />
                              הושלם
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base text-gray-600">
                          {step.description}
                        </CardDescription>
                        
                        {totalSubtasks > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>{completedSubtasks} מתוך {totalSubtasks} משימות הושלמו</span>
                              <span className="font-semibold">{Math.round(subtaskProgress)}%</span>
                            </div>
                            <SimpleProgressBar value={subtaskProgress} />
                          </div>
                        )}
                      </div>

                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </Button>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0 pb-6">
                          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 mb-6 border-2 border-rose-200">
                            <p className="text-rose-800 font-semibold text-lg leading-relaxed">
                              {step.motivationalText}
                            </p>
                          </div>

                          <div className="space-y-4 mb-6">
                            <h4 className="font-bold text-gray-900">משימות לביצוע:</h4>
                            {subtasksToShow.map((subtask, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Checkbox
                                  checked={subtask.is_completed}
                                  onCheckedChange={() => toggleSubtask(step.id, idx)}
                                  className="mt-0.5"
                                />
                                <label
                                  className={`flex-1 cursor-pointer ${
                                    subtask.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
                                  }`}
                                  onClick={() => toggleSubtask(step.id, idx)}
                                >
                                  {subtask.task}
                                  {subtask.completion_date && (
                                    <span className="text-xs text-green-600 mr-2">
                                      (הושלם ב-{format(new Date(subtask.completion_date), 'dd/MM/yy')})
                                    </span>
                                  )}
                                </label>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-bold text-gray-900">הערות אישיות:</h4>
                            <Textarea
                              placeholder="הוסיפי הערות, רעיונות או שאלות שיעזרו לך להתקדם..."
                              value={stepData?.notes || ''}
                              onChange={(e) => updateNotes(step.id, e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>

                          <div className="mt-6 flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setExpandedStep(null)}
                            >
                              סגירה
                            </Button>
                            <Button
                              onClick={() => toggleStepCompletion(step.id)}
                              className={isCompleted 
                                ? "bg-gray-400 hover:bg-gray-500" 
                                : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                              }
                            >
                              {isCompleted ? (
                                <>
                                  <Circle className="w-5 h-5 ml-2" />
                                  סמני כלא הושלם
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5 ml-2" />
                                  סמני כהושלם
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Resource Library Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white border-0 shadow-xl overflow-hidden">
            <CardContent className="p-6 md:p-10">
              <div className="flex flex-col items-center gap-6 mb-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center shadow-md"
                >
                  <Library className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
                </motion.div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    ספריית המשאבים ליזמות
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    כלים, תבניות ומדריכים שיעזרו לך להקים את העסק.
                  </p>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-center"
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white rounded-full px-8 py-6 text-base md:text-lg font-semibold shadow-xl">
                  <Link to={createPageUrl('ResourceLibrary')}>
                    <BookOpen className="w-5 h-5 ml-2" />
                    כניסה לספרייה
                  </Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pathfinder Section */}
        <div className="mb-8">
          {pathfinderCompleted ? (
            <PathfinderResultWidget result={pathfinderResult} />
          ) : (
            <EntrepreneurshipQuizWidget />
          )}
        </div>

        {/* Back to Profile */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to={createPageUrl('MyProfile')}>
              <ArrowLeft className="w-5 h-5 ml-2" />
              חזרה לפרופיל שלי
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
