
import React, { useState, useEffect, useContext } from 'react';
import { MentorArticle } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, User, Calendar, Search, Heart } from 'lucide-react'; // Added Heart import
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { UserContext } from '../components/auth/UserContext';
// We are no longer using the backend function
// import { getPublishedArticles } from '@/api/functions';

const ArticleCard = ({ article }) => {
    if (!article) return null;

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-rose-300 border-transparent border-2">
            {article.image_url && (
                <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover" />
            )}
            <CardHeader>
                <CardTitle className="text-xl font-bold leading-tight text-gray-800">{article.title}</CardTitle>
                <CardDescription className="flex items-center text-sm text-gray-500 mt-2">
                    <User className="w-4 h-4 ml-2" />
                    {article.mentor_profile_id ? (
                        <Link
                            to={createPageUrl(`MentorProfile?id=${article.mentor_profile_id}`)}
                            className="text-rose-600 hover:text-rose-800 font-medium hover:underline transition-colors"
                        >
                            {article.mentor_name}
                        </Link>
                    ) : (
                        <span>{article.mentor_name}</span>
                    )}
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4 ml-1" />
                    <span>{format(new Date(article.publication_date || article.created_date), 'd בMMMM yyyy', { locale: he })}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-gray-600 leading-relaxed">{article.summary}</p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
                <Button asChild variant="link" className="p-0 text-rose-600">
                    <Link to={createPageUrl(`ArticlePage?id=${article.id}`)}>
                        קראי עוד...
                    </Link>
                </Button>
            </div>
        </Card>
    );
};

export default function Articles() {
    const { isLoadingUser } = useContext(UserContext);
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            console.log("[Articles] Fetching articles directly from entity...");
            setIsLoading(true);
            try {
                // Fetch all articles, relying on the now-public RLS
                const allArticles = await MentorArticle.list('-created_date');
                console.log(`[Articles] Direct fetch returned ${allArticles.length} total articles.`);

                if (allArticles.length > 0) {
                    console.log("[Articles] Sample from fetched data:", { title: allArticles[0].title, status: allArticles[0].status });
                }

                // Filter for published articles on the client side
                const publishedArticles = allArticles.filter(article => article.status === 'published');
                console.log(`[Articles] Found ${publishedArticles.length} published articles after filtering.`);

                setArticles(publishedArticles);
                setFilteredArticles(publishedArticles);

            } catch (error) {
                console.error("[Articles] Error fetching articles directly:", error);
                setArticles([]);
                setFilteredArticles([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredArticles(articles);
        } else {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filtered = articles.filter(article =>
                article.title.toLowerCase().includes(lowercasedFilter) ||
                (article.summary && article.summary.toLowerCase().includes(lowercasedFilter)) ||
                (article.mentor_name && article.mentor_name.toLowerCase().includes(lowercasedFilter))
            );
            setFilteredArticles(filtered);
        }
    }, [searchTerm, articles]);

    if (isLoadingUser) {
        return (
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
          </div>
        );
    }

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">מאמרים ותובנות</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        ספרייה של ידע, השראה וכלים מעשיים שנכתבו על ידי המומחיות שלנו כדי לתמוך בך במסע.
                    </p>
                </header>

                <div className="mb-8 max-w-lg mx-auto">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="חיפוש במאמרים..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 p-6 rounded-full shadow-md"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
                    </div>
                ) : (
                    filteredArticles.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    )
                )}

                {/* If no articles found after loading, and optionally after search */}
                {filteredArticles.length === 0 && !isLoading && (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">לא נמצאו מאמרים התואמים את החיפוש</p>
                    </div>
                )}
            </div>

            {/* Back to My Profile Button */}
            <div className="flex justify-center mt-12 mb-8">
                <Button asChild variant="outline" size="lg" className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-md">
                    <Link to={createPageUrl('MyProfile')}>
                        <Heart className="w-4 h-4 ml-2" />
                        חזרה למקום שלי
                    </Link>
                </Button>
            </div>
        </div>
    );
}
