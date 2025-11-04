
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Edit, Trash2, Phone, Mail, Building, Calendar, DollarSign, ArrowLeft, Crown, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// יצירת entity זמני בצד הלקוח בלבד
const CrmContact = {
  _storage: [],
  _loadFromStorage() {
    const stored = localStorage.getItem('crm_contacts');
    this._storage = stored ? JSON.parse(stored) : [];
    return this._storage;
  },
  _saveToStorage() {
    localStorage.setItem('crm_contacts', JSON.stringify(this._storage));
  },
  list() {
    return Promise.resolve(this._loadFromStorage());
  },
  create(data) {
    const newContact = { ...data, id: Date.now().toString() };
    this._storage.push(newContact);
    this._saveToStorage();
    return Promise.resolve(newContact);
  },
  update(id, data) {
    const index = this._storage.findIndex(c => c.id === id);
    if (index !== -1) {
      this._storage[index] = { ...this._storage[index], ...data };
      this._saveToStorage();
      return Promise.resolve(this._storage[index]);
    }
    return Promise.reject('Contact not found');
  },
  delete(id) {
    this._storage = this._storage.filter(c => c.id !== id);
    this._saveToStorage();
    return Promise.resolve();
  }
};

export default function SimpleCrm() {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    deal_value: '',
    notes: '',
    last_contact: ''
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const data = await CrmContact.list();
    setContacts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingContact) {
      await CrmContact.update(editingContact.id, formData);
    } else {
      await CrmContact.create(formData);
    }
    await loadContacts();
    resetForm();
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData(contact);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('האם את בטוחה שברצונך למחוק איש קשר זה?')) {
      await CrmContact.delete(id);
      await loadContacts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead',
      deal_value: '',
      notes: '',
      last_contact: ''
    });
    setEditingContact(null);
    setShowForm(false);
  };

  const exportToCSV = () => {
    const headers = ['שם', 'אימייל', 'טלפון', 'חברה', 'סטטוס', 'ערך עסקה', 'הערות', 'תאריך איש קשר אחרון'];
    const rows = contacts.map(c => [
      c.name, c.email, c.phone, c.company, c.status, c.deal_value, c.notes, c.last_contact
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'crm_contacts.csv';
    link.click();
  };

  const getStatusColor = (status) => {
    const colors = {
      lead: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      negotiating: 'bg-orange-100 text-orange-800',
      customer: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.lead;
  };

  const getStatusLabel = (status) => {
    const labels = {
      lead: 'ליד חדש',
      contacted: 'יצרנו קשר',
      negotiating: 'במשא ומתן',
      customer: 'לקוחה',
      inactive: 'לא פעיל'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-200 mb-6">
            <Crown className="w-5 h-5 text-cyan-500" />
            <span className="text-sm font-medium text-cyan-700">כלי בלעדי מספריית המשאבים</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            CRM פשוט - ניהול לקוחות 👥
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            עקבי אחרי הלידים והלקוחות שלך בצורה פשוטה ומסודרת
          </p>
          <p className="text-sm text-gray-500 mt-2">
            💾 הנתונים נשמרים במכשיר שלך בלבד (Local Storage)
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          >
            <Plus className="w-5 h-5 ml-2" />
            {showForm ? 'ביטול' : 'הוספת לקוח חדש'}
          </Button>
          
          {contacts.length > 0 && (
            <Button 
              onClick={exportToCSV}
              variant="outline"
              className="border-cyan-300 text-cyan-600 hover:bg-cyan-50"
            >
              <Download className="w-5 h-5 ml-2" />
              ייצוא ל-CSV
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              <CardTitle>{editingContact ? 'עריכת איש קשר' : 'הוספת איש קשר חדש'}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">שם מלא *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">אימייל</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">טלפון</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">חברה</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">סטטוס</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">ליד חדש</SelectItem>
                        <SelectItem value="contacted">יצרנו קשר</SelectItem>
                        <SelectItem value="negotiating">במשא ומתן</SelectItem>
                        <SelectItem value="customer">לקוחה</SelectItem>
                        <SelectItem value="inactive">לא פעיל</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="deal_value">ערך עסקה משוער (₪)</Label>
                    <Input
                      id="deal_value"
                      type="number"
                      value={formData.deal_value}
                      onChange={(e) => setFormData({...formData, deal_value: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="last_contact">תאריך יצירת קשר אחרון</Label>
                    <Input
                      id="last_contact"
                      type="date"
                      value={formData.last_contact}
                      onChange={(e) => setFormData({...formData, last_contact: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">הערות</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="h-24"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    ביטול
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                    {editingContact ? 'עדכון' : 'הוספה'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">עדיין אין לקוחות</h3>
            <p className="text-gray-500">התחילי בהוספת הליד הראשון שלך!</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <Card key={contact.id} className="card-hover shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{contact.name}</CardTitle>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                      {getStatusLabel(contact.status)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(contact)}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">{contact.phone}</a>
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span>{contact.company}</span>
                      </div>
                    )}
                    {contact.deal_value && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">₪{Number(contact.deal_value).toLocaleString()}</span>
                      </div>
                    )}
                    {contact.last_contact && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(contact.last_contact).toLocaleDateString('he-IL')}</span>
                      </div>
                    )}
                    {contact.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm">{contact.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="border-cyan-300 text-cyan-600 hover:bg-cyan-50">
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
