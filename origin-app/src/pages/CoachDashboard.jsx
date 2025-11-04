import React from 'react';
import { Redirect } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// This component is now obsolete.
// It redirects all traffic to the unified "MentorDashboard".
// This ensures that old links or references to "CoachDashboard"
// do not break and lead users to the correct page.
const CoachDashboard = () => {
  return <Redirect to={createPageUrl('MentorDashboard')} />;
};

export default CoachDashboard;