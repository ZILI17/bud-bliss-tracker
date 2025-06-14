
import React from 'react';

const ProfileLoading = () => {
  return (
    <div className="text-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
      <p>Chargement de votre profil...</p>
    </div>
  );
};

export default ProfileLoading;
