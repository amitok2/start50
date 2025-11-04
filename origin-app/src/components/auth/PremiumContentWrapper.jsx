import React from 'react';
import { useUser, isUserAdmin, hasValidSubscription } from './UserContext';
import SubscriptionGate from './SubscriptionGate';
import { Loader2 } from 'lucide-react';

export default function PremiumContentWrapper({ children, title, message }) {
  const { currentUser, isLoadingUser } = useUser();

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Admins or users with valid subscriptions should see the content
  if (isUserAdmin(currentUser) || hasValidSubscription(currentUser)) {
    return <>{children}</>;
  }

  return <SubscriptionGate title={title} message={message} />;
}