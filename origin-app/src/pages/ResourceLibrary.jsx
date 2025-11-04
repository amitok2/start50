
import React, { useState, useEffect } from 'react';
import { Resource } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Loader2,
  BookOpen,
  Video,
  FileText,
  Link as LinkIcon,
  Crown,
  Filter,
  Search,
  MessageSquare,
  PlayCircle,
  Sparkles,
  Library
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import ResourceViewerModal from '../components/resources/ResourceViewerModal';
import AiResourceHelperModal from '../components/resources/AiResourceHelperModal';
import PremiumContentWrapper from '../components/auth/PremiumContentWrapper';

const ResourceCard = ({ resource, onOpen }) => {
  const isVideo = resource.type === 'וידאו';
  const isLink = resource.type === 'קישור'; // Added for the WhatsApp card specifically

  return (
    <Card className="card-hover border-0 shadow-lg bg-white flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          {/* תמונה עגולה */}
          <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-md">
            {resource.image_url ? (
              <img
                src={resource.image_url}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Library className="w-10 h-10 text-purple-500" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <Badge className="bg-gray-100 text-gray-800">{resource.type}</Badge>
              <Badge className="bg-purple-100 text-purple-800">{resource.category}</Badge>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">{resource.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-grow">
        <p className="text-gray-600 mb-6 min-h-[40px] flex-grow">{resource.description}</p>
        <Button
            onClick={() => onOpen(resource)}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
        >
          {isVideo ? <PlayCircle className="w-4 h-4 ml-2" /> : isLink ? <MessageSquare className="w-4 h-4 ml-2" /> : <Sparkles className="w-4 h-4 ml-2" />}
          {isVideo ? 'צפייה בסרטון' : isLink ? 'הצטרפות לקבוצה' : 'סיוע ומידע נוסף'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function ResourceLibrary() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingResource, setViewingResource] = useState(null);
  const [aiHelperResource, setAiHelperResource] = useState(null);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    let filtered = resources;
    if (categoryFilter !== "all") {
      filtered = filtered.filter(r => r.category === categoryFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredResources(filtered);
  }, [resources, categoryFilter, searchTerm]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const resourcesData = await Resource.list("-created_date");
      setResources(resourcesData);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenResource = (resource) => {
    // אם זה המדריך לרשתות חברתיות, נווט ישירות לדף
    if (resource.title === 'מדריך פתיחת דף עסקי בפייסבוק ואינסטגרם') {
      navigate(createPageUrl("SocialMediaGuide"));
      return;
    }
    
    // אם זה הצ'ק-ליסט לפתיחת עסק, נווט ישירות לדף
    if (resource.title === 'צ\'ק-ליסט לפתיחת עסק עצמאי בישראל') {
      navigate(createPageUrl("BusinessStartupChecklist"));
      return;
    }
    
    // אם זה מתכנן התקציב, נווט ישירות לדף
    if (resource.title === 'מתכנן תקציב שנתי אינטראקטיבי') {
      navigate(createPageUrl("BudgetPlanner"));
      return;
    }
    
    // אם זה מדריך Google My Business, נווט ישירות לדף
    if (resource.title === 'מדריך Google My Business') {
      navigate(createPageUrl("GoogleMyBusinessGuide"));
      return;
    }
    
    // אם זה מחשבון ROI, נווט ישירות לדף
    if (resource.title === 'מחשבון החזר השקעה (ROI)') {
      navigate(createPageUrl("RoiCalculator"));
      return;
    }
    
    // אם זה מדריך מסים, נווט ישירות לדף
    if (resource.title === 'מדריך מסים ליזמיות עצמאיות') {
      navigate(createPageUrl("TaxGuide"));
      return;
    }
    
    // אם זה CRM פשוט, נווט ישירות לדף
    if (resource.title === 'תבנית מעקב אחר לקוחות (CRM פשוט)') {
      navigate(createPageUrl("SimpleCrm"));
      return;
    }
    
    // אם זה תבנית הצעת מחיר, נווט ישירות לדף
    if (resource.title === 'תבנית הצעת מחיר מנצחת') {
      navigate(createPageUrl("ProposalTemplate"));
      return;
    }
    
    // אם זה תבניות Canva, נווט ישירות לדף
    if (resource.title === 'תבניות לפוסטים שיווקיים (Canva)' || resource.title === 'מדריך Canva למתחילות') {
      navigate(createPageUrl("CanvaTemplates"));
      return;
    }

    // אם זה רשימת כלי AI, נווט ישירות לדף
    if (resource.title === 'רשימת כלי AI בחינם ליזמיות') {
      navigate(createPageUrl("AiToolsList"));
      return;
    }

    // אם זה תבנית אסטרטגיית שיווק תוכן, נווט ישירות לדף
    if (resource.title === 'תבנית אסטרטגיית שיווק תוכן') {
      navigate(createPageUrl("ContentMarketingStrategy"));
      return;
    }

    // אם זה העלאת קורות חיים וטיוטת מייל, נווט ישירות לדף
    if (resource.title === 'העלאת קורות חיים וטיוטת מייל') {
      navigate(createPageUrl("ResumeUploaderAndEmailDraft"));
      return;
    }
    
    // אם זה קבוצת הוואטסאפ, פתח את הקישור בחלון חדש
    if (resource.title === 'קבוצת היזמיות בוואטסאפ') {
      window.open('https://chat.whatsapp.com/KRiY8hN94vjKmTi4Jk8i6f', '_blank', 'noopener,noreferrer');
      return;
    }
    
    // אם זה וידאו, פתח את מודל הוידאו
    if (resource.type === 'וידאו') {
      setViewingResource(resource);
    } else {
      // עבור כל שאר סוגי המשאבים, השתמש ב-AI Helper Modal
      setAiHelperResource(resource);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-6">
              <Crown className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-700">בלעדי לחברות פרימיום</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ספריית משאבים ל<span className="gradient-text">יזמית החדשה בגיל 50</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            חלמת להיות עצמאית בגיל 50? להקים עסק משלך?
            כאן תמצאי את כל הכלים, המדריכים והתבניות שיהפכו את החלום למציאות פורחת, בשילוב הניסיון שלי כמנכ"לית וכעצמאית, וכוח הבינה המלאכותית שמביא לך פתרונות מדויקים ומהירים.
          </p>
        </div>

        <PremiumContentWrapper
          title="ספריית המשאבים ליזמות"
          message="הגישה למאגר המלא של כלים, תבניות ומדריכים להקמת עסק שמורה למנויות פרימיום."
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-3 w-full sm:w-auto">
                      <span className="font-semibold text-gray-800 flex-shrink-0">סינון לפי קטגוריה:</span>
                      <Select onValueChange={setCategoryFilter} defaultValue="all">
                          <SelectTrigger className="w-full sm:w-[220px]">
                              <SelectValue placeholder="בחרי קטגוריה..." />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">הכל</SelectItem>
                              <SelectItem value="כלים פיננסיים">כלים פיננסיים</SelectItem>
                              <SelectItem value="כלים שיווקיים">כלים שיווקיים</SelectItem>
                              <SelectItem value="מדריכים לפתיחת עסק">מדריכים לפתיחת עסק</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-3 w-full sm:w-auto">
                      <Search className="w-5 h-5 text-gray-400" />
                      <Input
                          type="text"
                          placeholder="חיפוש לפי שם או תיאור..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1 border-none focus-visible:ring-0"
                      />
                  </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* קארד קבוצת הוואטסאפ - ראשון ברשימה */}
                  <div className="relative">
                    <ResourceCard 
                      resource={{
                        id: 'whatsapp-group-card', // Ensure a unique ID for React keys
                        title: 'קבוצת היזמיות בוואטסאפ',
                        description: 'הצטרפי לקהילה של יזמיות תומכות - שאלות, עצות והשראה בזמן אמת!',
                        type: 'קישור',
                        category: 'כלים שיווקיים', // Or any other suitable category
                        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png'
                      }} 
                      onOpen={handleOpenResource} 
                    />
                  </div>
                  
                  {/* כל שאר המשאבים */}
                  {filteredResources.map((resource) => {
                    return (
                      <div key={resource.id} className="relative">
                        <ResourceCard resource={resource} onOpen={handleOpenResource} />
                      </div>
                    );
                  })}
              </div>

              {(filteredResources.length === 0 && !isLoading && searchTerm === '' && categoryFilter === 'all') && ( // Only show if no resources and no filter/search applied (excluding the static whatsapp card)
                  <div className="text-center py-16 text-gray-500">
                      <p>לא נמצאו משאבים להצגה.</p>
                  </div>
              )}
              {((filteredResources.length === 0 && (searchTerm !== '' || categoryFilter !== 'all')) || 
                (filteredResources.length === 0 && searchTerm === '' && categoryFilter !== 'all')) && (
                <div className="text-center py-16 text-gray-500">
                    <p>לא נמצאו משאבים בקטגוריה זו או בחיפוש הנוכחי.</p>
                </div>
              )}
            </>
          )}
        </PremiumContentWrapper>

        {viewingResource && (
          <ResourceViewerModal
            resource={viewingResource}
            onClose={() => setViewingResource(null)}
          />
        )}
        {aiHelperResource && (
            <AiResourceHelperModal
                resource={aiHelperResource}
                onClose={() => setAiHelperResource(null)}
            />
        )}
      </div>
    </div>
  );
}
