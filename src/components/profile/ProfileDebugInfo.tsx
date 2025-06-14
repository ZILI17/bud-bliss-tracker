
import React from 'react';

interface ProfileDebugInfoProps {
  profile: any;
}

const ProfileDebugInfo = ({ profile }: ProfileDebugInfoProps) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg border text-sm">
      <h3 className="font-bold mb-2">Debug - État du profil :</h3>
      <p><strong>ID utilisateur :</strong> {profile?.id || 'Non défini'}</p>
      <p><strong>Âge :</strong> {profile?.age || 'Non défini'}</p>
      <p><strong>Objectif :</strong> {profile?.consumption_goal || 'Non défini'}</p>
      <p><strong>Objectif détaillé :</strong> {profile?.goal_description ? 'Défini' : 'Non défini'}</p>
      <p><strong>Déclencheurs :</strong> {profile?.triggers_moments?.length || 0} moments, {profile?.triggers_specific?.length || 0} spécifiques</p>
      <p><strong>Profil complété :</strong> {profile?.profile_completed ? 'Oui' : 'Non'}</p>
      <p><strong>Onboarding terminé :</strong> {profile?.onboarding_completed ? 'Oui' : 'Non'}</p>
    </div>
  );
};

export default ProfileDebugInfo;
