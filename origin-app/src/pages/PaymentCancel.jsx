import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PaymentCancel() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center">
            <XCircle className="w-20 h-20 text-red-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">התשלום בוטל</h1>
            <p className="text-lg text-gray-600 max-w-lg mb-8">
                נראה שתהליך התשלום לא הושלם. המנוי שלך לא הופעל.
                אם נתקלת בבעיה, את מוזמנת לנסות שוב או ליצור איתנו קשר.
            </p>
            <Link 
                to={createPageUrl("Subscribe")}
                className="inline-flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                חזרה לדף ההרשמה
            </Link>
        </div>
    );
}