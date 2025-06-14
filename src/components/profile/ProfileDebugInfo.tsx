
import React from 'react';

interface ProfileDebugInfoProps {
  profile: any;
}

const ProfileDebugInfo = ({ profile }: ProfileDebugInfoProps) => {
  return (
    <div className="text-xs text-muted-foreground p-2 bg-gray-100 rounded">
      Profile loaded: {profile ? 'Oui' : 'Non'} | 
      Age: {profile?.age || 'Non défini'} | 
      Poids: {profile?.weight_kg || 'Non défini'}
    </div>
  );
};

export default ProfileDebugInfo;
