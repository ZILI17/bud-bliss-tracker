
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileSaveButtonProps {
  onSave: () => void;
}

const ProfileSaveButton = ({ onSave }: ProfileSaveButtonProps) => {
  return (
    <Button onClick={onSave} className="w-full glass-button neon-glow">
      💾 Sauvegarder toutes les modifications
    </Button>
  );
};

export default ProfileSaveButton;
