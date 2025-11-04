
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Users, HeartHandshake, Library, Gift, ArrowLeft, Crown } from 'lucide-react';

const services = [
  {
    title: "הכירי את נפש התאומה שלך",
    url: createPageUrl("SocialTinder"),
    icon: HeartHandshake,
    description: "מצאי נשים בדיוק כמוך. שמבינות, תומכות וחולקות איתך את המסע. ליצירת קשרים עמוקים ומרגשים לכל החיים.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/dce67f69b_.jpg"
  },
  {
    title: "ניהול הקריירה שלך",
    url: createPageUrl("MyProfile?tab=career"),
    icon: BookOpen,
    description: "כלים, רעיונות וליווי שיאפשרו לך לבחור מחדש, להתחזק ולהתפתח מקצועית בגיל 50+.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/611e4dfde_1.jpg"
  },
  {
    title: "מאמנות ויועצות",
    url: createPageUrl("CoachesAndConsultants"),
    icon: Crown,
    description: "ליווי אישי וכלים מעשיים מנשים שכבר היו שם, כדי להזניק קדימה את הקריירה, העסק או הביטחון העצמי שלך.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/fd020a2f1_.jpg"
  },
  {
    title: "יזמות בגיל 50+",
    url: createPageUrl("EntrepreneurshipHub"), // Updated URL as per requirements
    icon: Library,
    description: "כל הכלים וההשראה לפתיחת עסק משלך. חלמת על עסק משלך בגיל 50+? כאן תמצאי את כל הכלים, המדריכים וההשראה להתחיל.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/685fd9b880a026fd49791736/bc3d288cb_.jpg"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

export default function ServicesHighlight() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            מה מחכה לך <span className="gradient-text">כאן?</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            כל מה שאת צריכה כדי להתחיל מחדש, במקום אחד.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, index) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Link to={service.url} className="block group h-full">
                <motion.div
                  className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 rounded-2xl text-center h-full flex flex-col items-center justify-between transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 border border-rose-100 overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  {service.image ? (
                    <div className="w-full h-48 relative overflow-hidden rounded-t-2xl">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="mt-6 w-20 h-20 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:from-rose-500 group-hover:to-pink-600 transition-colors">
                      <service.icon className="w-10 h-10" />
                    </div>
                  )}
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 flex-grow mb-4">{service.description}</p>
                    <div className="text-rose-500 font-semibold flex items-center justify-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                      <span>לפרטים נוספים</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
