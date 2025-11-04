import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GoToMentorsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-2xl font-bold mb-4">המנטורית אושרה בהצלחה!</h1>
      <p className="mb-6">
        כעת היא מופיעה בדף הציבורי. לחצי על הכפתור כדי לראות את כל המנטוריות הפעילות.
      </p>
      <Button asChild size="lg">
        <Link to={createPageUrl('MeetMentors')}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          לדף "הכירי את המנטוריות"
        </Link>
      </Button>
    </div>
  );
}