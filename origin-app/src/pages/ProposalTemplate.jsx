
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Plus, Trash2, ArrowLeft, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProposalTemplate() {
  const [proposal, setProposal] = useState({
    your_name: '',
    your_business: '',
    your_email: '',
    your_phone: '',
    client_name: '',
    client_company: '',
    date: new Date().toISOString().split('T')[0],
    valid_until: '',
    project_description: '',
    items: [
      { description: '', quantity: 1, price: 0 }
    ],
    payment_terms: 'תשלום מלא עם קבלת ההצעה',
    delivery_time: '',
    notes: ''
  });

  const addItem = () => {
    setProposal({
      ...proposal,
      items: [...proposal.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = proposal.items.filter((_, i) => i !== index);
    setProposal({...proposal, items: newItems});
  };

  const updateItem = (index, field, value) => {
    const newItems = [...proposal.items];
    newItems[index][field] = value;
    setProposal({...proposal, items: newItems});
  };

  const calculateTotal = () => {
    return proposal.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const generatePDF = () => {
    const content = `
      הצעת מחיר
      
      מאת: ${proposal.your_name}
      עסק: ${proposal.your_business}
      אימייל: ${proposal.your_email}
      טלפון: ${proposal.your_phone}
      
      עבור: ${proposal.client_name}
      חברה: ${proposal.client_company}
      
      תאריך: ${new Date(proposal.date).toLocaleDateString('he-IL')}
      בתוקף עד: ${new Date(proposal.valid_until).toLocaleDateString('he-IL')}
      
      תיאור הפרויקט:
      ${proposal.project_description}
      
      פירוט השירותים:
      ${proposal.items.map((item, i) => 
        `${i + 1}. ${item.description} - כמות: ${item.quantity} - מחיר ליחידה: ₪${item.price} - סה"כ: ₪${item.quantity * item.price}`
      ).join('\n')}
      
      סה"כ לתשלום: ₪${calculateTotal().toLocaleString()}
      
      תנאי תשלום: ${proposal.payment_terms}
      זמן אספקה: ${proposal.delivery_time}
      
      הערות נוספות:
      ${proposal.notes}
    `;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `proposal_${proposal.client_name}_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-200 mb-6">
            <Crown className="w-5 h-5 text-violet-500" />
            <span className="text-sm font-medium text-violet-700">תבנית בלעדית מספריית המשאבים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            תבנית הצעת מחיר מנצחת 📋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            צרי הצעת מחיר מקצועית ומרשימה שתעזור לך לנצח עסקאות
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
            <CardTitle className="text-2xl flex items-center gap-3">
              <FileText className="w-8 h-8" />
              הצעת מחיר
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* Your Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b-2 border-violet-200 pb-2">הפרטים שלך</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>שם מלא</Label>
                  <Input value={proposal.your_name} onChange={(e) => setProposal({...proposal, your_name: e.target.value})} />
                </div>
                <div>
                  <Label>שם העסק</Label>
                  <Input value={proposal.your_business} onChange={(e) => setProposal({...proposal, your_business: e.target.value})} />
                </div>
                <div>
                  <Label>אימייל</Label>
                  <Input type="email" value={proposal.your_email} onChange={(e) => setProposal({...proposal, your_email: e.target.value})} />
                </div>
                <div>
                  <Label>טלפון</Label>
                  <Input value={proposal.your_phone} onChange={(e) => setProposal({...proposal, your_phone: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b-2 border-violet-200 pb-2">פרטי הלקוח</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>שם הלקוח</Label>
                  <Input value={proposal.client_name} onChange={(e) => setProposal({...proposal, client_name: e.target.value})} />
                </div>
                <div>
                  <Label>חברה</Label>
                  <Input value={proposal.client_company} onChange={(e) => setProposal({...proposal, client_company: e.target.value})} />
                </div>
                <div>
                  <Label>תאריך</Label>
                  <Input type="date" value={proposal.date} onChange={(e) => setProposal({...proposal, date: e.target.value})} />
                </div>
                <div>
                  <Label>בתוקף עד</Label>
                  <Input type="date" value={proposal.valid_until} onChange={(e) => setProposal({...proposal, valid_until: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div>
              <Label>תיאור הפרויקט</Label>
              <Textarea 
                value={proposal.project_description} 
                onChange={(e) => setProposal({...proposal, project_description: e.target.value})}
                className="h-24"
                placeholder="תארי בקצרה את הפרויקט והשירותים שתספקי..."
              />
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 border-b-2 border-violet-200 pb-2">פירוט השירותים/מוצרים</h3>
                <Button onClick={addItem} size="sm" className="bg-violet-500 hover:bg-violet-600">
                  <Plus className="w-4 h-4 ml-2" />
                  הוספת שורה
                </Button>
              </div>
              
              {proposal.items.map((item, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                      <Label>תיאור</Label>
                      <Input 
                        value={item.description} 
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="למשל: ייעוץ עסקי - 5 פגישות"
                      />
                    </div>
                    <div>
                      <Label>כמות</Label>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label>מחיר ליחידה (₪)</Label>
                      <Input 
                        type="number" 
                        value={item.price} 
                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-violet-600">
                      סה"כ: ₪{(item.quantity * item.price).toLocaleString()}
                    </span>
                    {proposal.items.length > 1 && (
                      <Button 
                        onClick={() => removeItem(index)} 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        הסרה
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
              
              <div className="bg-gradient-to-r from-violet-100 to-purple-100 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">סה"כ לתשלום:</span>
                  <span className="text-3xl font-bold text-violet-600">₪{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Additional Terms */}
            <div className="space-y-4">
              <div>
                <Label>תנאי תשלום</Label>
                <Input 
                  value={proposal.payment_terms} 
                  onChange={(e) => setProposal({...proposal, payment_terms: e.target.value})}
                  placeholder="למשל: 50% מראש, 50% עם סיום הפרויקט"
                />
              </div>
              <div>
                <Label>זמן אספקה/ביצוע</Label>
                <Input 
                  value={proposal.delivery_time} 
                  onChange={(e) => setProposal({...proposal, delivery_time: e.target.value})}
                  placeholder="למשל: 30 יום ממועד אישור ההצעה"
                />
              </div>
              <div>
                <Label>הערות נוספות</Label>
                <Textarea 
                  value={proposal.notes} 
                  onChange={(e) => setProposal({...proposal, notes: e.target.value})}
                  className="h-24"
                  placeholder="כל מידע נוסף שחשוב שהלקוח ידע..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={generatePDF}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-lg py-6"
              >
                <Download className="w-5 h-5 ml-2" />
                הורדת הצעת המחיר
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-fuchsia-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-800">
              <Sparkles className="w-6 h-6" />
              טיפים להצעת מחיר מנצחת
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-purple-900">
            <p><strong>היי ברורה ומפורטת:</strong> פרטי בדיוק מה הלקוח מקבל תמורת כל שקל.</p>
            <p><strong>הדגישי ערך:</strong> הסבירי למה השירות שלך שווה את המחיר (ניסיון, מומחיות, תוצאות).</p>
            <p><strong>תקופת תוקף:</strong> הגדירי מועד אחרון לאישור ההצעה - זה יוצר דחיפות.</p>
            <p><strong>תנאים ברורים:</strong> פרטי תנאי תשלום, זמני אספקה ומה קורה במקרה של שינויים.</p>
            <p><strong>הוסיפי המלצות:</strong> אם יש לך, צרפי המלצות מלקוחות קודמות.</p>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-violet-300 text-violet-600 hover:bg-violet-50">
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
