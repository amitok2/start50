import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const getYoutubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function ResourceViewerModal({ resource, onClose }) {
  if (!resource) return null;

  const videoId = getYoutubeVideoId(resource.url);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">{resource.title}</DialogTitle>
          <DialogDescription className="text-gray-600 pt-2">{resource.description}</DialogDescription>
        </DialogHeader>
        {videoId ? (
          <div className="aspect-video w-full mt-4">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={resource.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-700">לא ניתן להציג את הסרטון ישירות. אנא פתחי אותו בקישור חיצוני.</p>
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
              פתח סרטון
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}