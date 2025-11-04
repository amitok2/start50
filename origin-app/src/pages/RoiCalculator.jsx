
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Calculator, AlertCircle, CheckCircle, ArrowLeft, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function RoiCalculator() {
  const [investment, setInvestment] = useState('');
  const [revenue, setRevenue] = useState('');
  const [timeframe, setTimeframe] = useState('12');
  const [showResults, setShowResults] = useState(false);

  const calculateROI = () => {
    const investmentNum = parseFloat(investment) || 0;
    const revenueNum = parseFloat(revenue) || 0;
    const profit = revenueNum - investmentNum;
    const roi = investmentNum > 0 ? ((profit / investmentNum) * 100) : 0;
    const monthlyROI = roi / parseInt(timeframe);
    
    return {
      profit,
      roi: roi.toFixed(2),
      monthlyROI: monthlyROI.toFixed(2),
      breakEven: investmentNum > 0 ? (investmentNum / (revenueNum / parseInt(timeframe))).toFixed(1) : 0
    };
  };

  const handleCalculate = () => {
    if (investment && revenue) {
      setShowResults(true);
    }
  };

  const results = showResults ? calculateROI() : null;
  
  const pieData = results ? [
    { name: 'רווח', value: Math.max(0, results.profit), color: '#10b981' },
    { name: 'השקעה', value: parseFloat(investment), color: '#ef4444' }
  ] : [];

  const getROIStatus = (roi) => {
    if (roi >= 200) return { text: 'מצוין! תשואה גבוהה מאוד', color: 'text-green-600', icon: <CheckCircle className="w-6 h-6" /> };
    if (roi >= 100) return { text: 'טוב מאוד! תשואה חיובית', color: 'text-green-500', icon: <CheckCircle className="w-6 h-6" /> };
    if (roi >= 50) return { text: 'בסדר. יש מקום לשיפור', color: 'text-yellow-600', icon: <AlertCircle className="w-6 h-6" /> };
    if (roi >= 0) return { text: 'נמוך. כדאי לבחון מחדש', color: 'text-orange-600', icon: <AlertCircle className="w-6 h-6" /> };
    return { text: 'הפסד. יש לשנות אסטרטגיה', color: 'text-red-600', icon: <AlertCircle className="w-6 h-6" /> };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-200 mb-6">
            <Crown className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">כלי בלעדי מספריית המשאבים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            מחשבון החזר השקעה (ROI) 📊
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            חשבי את התשואה על ההשקעה שלך בעסק ובני החלטות פיננסיות חכמות
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl mb-8">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Calculator className="w-8 h-8" />
              הזיני את הנתונים שלך
            </CardTitle>
            <CardDescription className="text-emerald-50">
              מלאי את השדות הבאים כדי לחשב את ה-ROI שלך
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="investment" className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                סכום ההשקעה הראשונית (₪)
              </Label>
              <Input
                id="investment"
                type="number"
                placeholder="לדוגמה: 50000"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-gray-500">כולל: ציוד, שיווק, עלויות הקמה וכו'</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                הכנסות צפויות/בפועל (₪)
              </Label>
              <Input
                id="revenue"
                type="number"
                placeholder="לדוגמה: 80000"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-gray-500">סך ההכנסות בתקופה שנבחרה</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe" className="text-lg font-semibold">
                תקופת מדידה (חודשים)
              </Label>
              <select
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg"
              >
                <option value="3">3 חודשים</option>
                <option value="6">6 חודשים</option>
                <option value="12">שנה (12 חודשים)</option>
                <option value="24">שנתיים (24 חודשים)</option>
              </select>
            </div>

            <Button 
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg py-6"
              disabled={!investment || !revenue}
            >
              <Calculator className="w-5 h-5 ml-2" />
              חשבי ROI
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {showResults && results && (
          <div className="space-y-6 animate-fade-in">
            {/* Main Result */}
            <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">התשואה על ההשקעה שלך</h2>
                <div className="text-7xl font-bold mb-4">{results.roi}%</div>
                <div className={`flex items-center justify-center gap-2 text-xl ${getROIStatus(parseFloat(results.roi)).color.replace('text-', 'text-white/')}`}>
                  {getROIStatus(parseFloat(results.roi)).icon}
                  <span className="text-white">{getROIStatus(parseFloat(results.roi)).text}</span>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">רווח נקי</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₪{results.profit.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">הכנסות פחות השקעה</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ROI חודשי ממוצע</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600">{results.monthlyROI}%</div>
                  <p className="text-sm text-gray-500 mt-2">תשואה חודשית</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">נקודת איזון</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{results.breakEven}</div>
                  <p className="text-sm text-gray-500 mt-2">חודשים עד איזון</p>
                </CardContent>
              </Card>
            </div>

            {/* Visual Chart */}
            <Card>
              <CardHeader>
                <CardTitle>התפלגות השקעה ורווח</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ₪${entry.value.toLocaleString()}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₪${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  💡 טיפים לשיפור ה-ROI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-purple-900">
                <p><strong>צמצמי הוצאות:</strong> בדקי אילו עלויות ניתן לחתוך מבלי לפגוע באיכות.</p>
                <p><strong>הגדילי הכנסות:</strong> התמקדי בשיווק יעיל יותר ובמכירות נוספות ללקוחות קיימות.</p>
                <p><strong>מדדי ביניים:</strong> עקבי אחר ROI באופן חודשי כדי לזהות מגמות.</p>
                <p><strong>השווי להשקעות:</strong> השקעות עם ROI נמוך מ-50% בטווח שנתי דורשות הערכה מחדש.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-emerald-300 text-emerald-600 hover:bg-emerald-50">
            <Link to={createPageUrl("ResourceLibrary")}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              חזרה לספריית המשאבים
            </Link>
          </Button>
        </div>

        {/* Back to Entrepreneurship Hub */}
        <div className="text-center mt-6">
          <Button asChild variant="outline" size="lg" className="border-orange-300 text-orange-600 hover:bg-orange-50">
            <Link to={createPageUrl("EntrepreneurshipHub")}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              חזרה לארגז הכלים לעצמאית
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
