
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User } from '@/api/entities';
import { BudgetLineItem } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Info, FileSpreadsheet, LogIn, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for Link

const MONTHS = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
const EXPENSE_CATEGORIES = ['שיווק ופרסום', 'משרד ואדמיניסטרציה', 'שכר ופרילנסרים', 'שירותים מקצועיים', 'תפעול וציוד', 'שונות'];

const formatCurrency = (value) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 }).format(value);

// Placeholder for createPageUrl function. In a real app, this would be imported or globally defined.
const createPageUrl = (pageName) => {
    switch (pageName) {
        case "ResourceLibrary":
            return "/resource-library";
        case "EntrepreneurshipHub":
            return "/entrepreneurship-hub";
        default:
            return "/";
    }
};

const AddItemForm = ({ type, onAddItem }) => {
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = () => {
        if (!itemName.trim()) {
            alert('אנא הזיני שם לסעיף');
            return;
        }
        
        onAddItem({
            item_name: itemName.trim(),
            type,
            category: type === 'expense' ? category : 'הכנסות',
            monthly_values: Array(12).fill(0)
        });
        
        setItemName('');
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" /> הוספת {type === 'income' ? 'מקור הכנסה' : 'סוג הוצאה'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>הוספת סעיף חדש</DialogTitle>
                    <DialogDescription>הוסיפי {type === 'income' ? 'מקור הכנסה' : 'סוג הוצאה'} חדש לתקציב שלך.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input 
                        placeholder="שם הסעיף (למשל: ייעוץ, מכירת מוצרים)" 
                        value={itemName} 
                        onChange={(e) => setItemName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    {type === 'expense' && (
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {EXPENSE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>ביטול</Button>
                    <Button onClick={handleSubmit}>הוספה</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function BudgetPlanner() {
    const [lineItems, setLineItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const debounceTimeout = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                const items = await BudgetLineItem.list(); // RLS automatically filters by created_by
                setLineItems(items);
            } catch (error) {
                console.error("User not logged in or failed to load data:", error);
                setUser(null);
                setLineItems([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleUpdateItem = (itemId, monthIndex, value) => {
        // Update state immediately for responsive UI
        const newItems = lineItems.map(item => {
            if (item.id === itemId) {
                const newMonthlyValues = [...item.monthly_values];
                newMonthlyValues[monthIndex] = Number(value) || 0;
                return { ...item, monthly_values: newMonthlyValues };
            }
            return item;
        });
        setLineItems(newItems);
        
        // Debounce the backend update
        setIsSaving(true);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        
        debounceTimeout.current = setTimeout(async () => {
            const updatedItem = newItems.find(item => item.id === itemId);
            if (updatedItem) {
                try {
                    await BudgetLineItem.update(updatedItem.id, { monthly_values: updatedItem.monthly_values });
                } catch (error) {
                    console.error("Failed to save item:", error);
                    alert("שגיאה בשמירת הנתונים. נסי שוב.");
                } finally {
                    setIsSaving(false);
                }
            }
        }, 1000);
    };
    
    const handleAddItem = async (newItemData) => {
        if (!user) {
            alert("עליך להיות מחוברת כדי להוסיף סעיף.");
            return;
        }

        try {
            const savedItem = await BudgetLineItem.create(newItemData);
            setLineItems(prev => [...prev, savedItem]);
        } catch (error) {
            console.error("Failed to add item:", error);
            alert("שגיאה בהוספת הסעיף. נסי שוב.");
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!confirm("האם את בטוחה שברצונך למחוק סעיף זה?")) return;
        
        try {
            await BudgetLineItem.delete(itemId);
            setLineItems(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Failed to delete item:", error);
            alert("שגיאה במחיקת הסעיף. נסי שוב.");
        }
    };

    const { incomeItems, expenseItems, totals } = useMemo(() => {
        const income = lineItems.filter(item => item.type === 'income');
        const expenses = lineItems.filter(item => item.type === 'expense');
        
        const monthlyTotals = Array(12).fill(0).map((_, monthIndex) => {
            const monthlyIncome = income.reduce((sum, item) => sum + (item.monthly_values[monthIndex] || 0), 0);
            const monthlyExpenses = expenses.reduce((sum, item) => sum + (item.monthly_values[monthIndex] || 0), 0);
            return {
                income: monthlyIncome,
                expenses: monthlyExpenses,
                profit: monthlyIncome - monthlyExpenses
            };
        });
        
        return { incomeItems: income, expenseItems: expenses, totals: monthlyTotals };
    }, [lineItems]);
    
    const chartData = useMemo(() => 
        MONTHS.map((month, index) => ({
            month,
            הכנסות: totals[index].income,
            הוצאות: totals[index].expenses,
            רווח: totals[index].profit
        }))
    , [totals]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-8">
                <Card className="max-w-md w-full shadow-lg">
                    <CardHeader>
                        <FileSpreadsheet className="w-12 h-12 mx-auto text-purple-500 mb-4" />
                        <CardTitle className="text-2xl">מתכנן התקציב האישי שלך</CardTitle>
                        <CardDescription className="text-lg text-gray-600 pt-2">כדי להשתמש בכלי ולשמור את הנתונים שלך באופן מאובטח, עליך להתחבר לחשבונך.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button size="lg" onClick={() => User.login()} className="w-full">
                            <LogIn className="w-5 h-5 ml-2" />
                            התחברות
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const yearlyIncome = totals.reduce((sum, month) => sum + month.income, 0);
    const yearlyExpenses = totals.reduce((sum, month) => sum + month.expenses, 0);
    const yearlyProfit = yearlyIncome - yearlyExpenses;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="text-center">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 mb-6">
                        <FileSpreadsheet className="w-5 h-5 text-purple-500" />
                        <span className="text-sm font-medium text-purple-700">כלי לתכנון תקציב שנתי</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">הכסף שלך, השליטה שלך</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">תכנני את התקציב השנתי של העסק שלך, עקבי אחר התזרים, וקבלי החלטות פיננסיות חכמות.</p>
                     {isSaving && (
                        <div className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            שומרת שינויים...
                        </div>
                    )}
                    <div className="mt-4 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block">
                        ✅ הנתונים נשמרים אוטומטית בחשבונך.
                    </div>
                </header>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">הכנסות שנתיות</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(yearlyIncome)}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">הוצאות שנתיות</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(yearlyExpenses)}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">רווח צפוי</CardTitle>
                            <DollarSign className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${yearlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(yearlyProfit)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>תזרים חודשי</CardTitle>
                        <CardDescription>מעקב אחר הכנסות, הוצאות ורווח לאורך השנה</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={formatCurrency} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="הכנסות" fill="#10b981" />
                                <Bar dataKey="הוצאות" fill="#ef4444" />
                                <Bar dataKey="רווח" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Budget Tables */}
                <div className="space-y-8">
                   {/* Income Table */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>הכנסות</CardTitle>
                            <AddItemForm type="income" onAddItem={handleAddItem} />
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[200px]">סעיף</TableHead>
                                            {MONTHS.map(m => <TableHead key={m} className="text-center">{m}</TableHead>)}
                                            <TableHead className="text-center font-bold">סה"כ</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {incomeItems.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.item_name}</TableCell>
                                                {item.monthly_values.map((val, i) => (
                                                    <TableCell key={i}>
                                                        <Input 
                                                            type="number" 
                                                            value={val || ''} 
                                                            onChange={(e) => handleUpdateItem(item.id, i, e.target.value)} 
                                                            className="min-w-[80px] text-center" 
                                                            placeholder="0"
                                                        />
                                                    </TableCell>
                                                ))}
                                                <TableCell className="text-center font-bold">
                                                    {formatCurrency(item.monthly_values.reduce((a,b)=>a+b,0))}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {incomeItems.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={15} className="text-center text-gray-500 py-8">
                                                    עדיין לא הוספת מקורות הכנסה. לחצי על "הוספת מקור הכנסה" להתחלה.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell className="font-bold">סה"כ הכנסות</TableCell>
                                            {totals.map((month, i) => (
                                                <TableCell key={i} className="text-center font-bold">
                                                    {formatCurrency(month.income)}
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-center font-bold text-green-600">
                                                {formatCurrency(yearlyIncome)}
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expenses Table */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>הוצאות</CardTitle>
                            <AddItemForm type="expense" onAddItem={handleAddItem} />
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[200px]">סעיף</TableHead>
                                            {MONTHS.map(m => <TableHead key={m} className="text-center">{m}</TableHead>)}
                                            <TableHead className="text-center font-bold">סה"כ</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {EXPENSE_CATEGORIES.map(cat => {
                                            const categoryItems = expenseItems.filter(item => item.category === cat);
                                            if (categoryItems.length === 0) return null;
                                            return (
                                                <React.Fragment key={cat}>
                                                    <TableRow>
                                                        <TableCell colSpan={15} className="font-semibold bg-gray-50 text-gray-700">
                                                            {cat}
                                                        </TableCell>
                                                    </TableRow>
                                                    {categoryItems.map(item => (
                                                         <TableRow key={item.id}>
                                                            <TableCell className="font-medium pl-8">{item.item_name}</TableCell>
                                                            {item.monthly_values.map((val, i) => (
                                                                <TableCell key={i}>
                                                                    <Input 
                                                                        type="number" 
                                                                        value={val || ''} 
                                                                        onChange={(e) => handleUpdateItem(item.id, i, e.target.value)} 
                                                                        className="min-w-[80px] text-center" 
                                                                        placeholder="0"
                                                                    />
                                                                </TableCell>
                                                            ))}
                                                            <TableCell className="text-center font-bold">
                                                                {formatCurrency(item.monthly_values.reduce((a,b)=>a+b,0))}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </React.Fragment>
                                            )
                                        })}
                                        {expenseItems.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={15} className="text-center text-gray-500 py-8">
                                                    עדיין לא הוספת סוגי הוצאות. לחצי על "הוספת סוג הוצאה" להתחלה.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                     <TableFooter>
                                        <TableRow>
                                            <TableCell className="font-bold">סה"כ הוצאות</TableCell>
                                            {totals.map((month, i) => (
                                                <TableCell key={i} className="text-center font-bold">
                                                    {formatCurrency(month.expenses)}
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-center font-bold text-red-600">
                                                {formatCurrency(yearlyExpenses)}
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Profit/Loss Summary */}
                    <Card className={`border-2 ${yearlyProfit >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5" />
                                סיכום שנתי
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>סוג</TableHead>
                                            {MONTHS.map(m => <TableHead key={m} className="text-center">{m}</TableHead>)}
                                            <TableHead className="text-center font-bold">סה"כ שנתי</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow className="bg-green-50">
                                            <TableCell className="font-bold text-green-700">רווח/הפסד נקי</TableCell>
                                            {totals.map((month, i) => (
                                                <TableCell key={i} className={`text-center font-bold ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(month.profit)}
                                                </TableCell>
                                            ))}
                                            <TableCell className={`text-center font-bold text-lg ${yearlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(yearlyProfit)}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

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
                <div className="text-center mt-6 mb-8">
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
