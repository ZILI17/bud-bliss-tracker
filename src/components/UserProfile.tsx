
import React from 'react';
import { useProfileForm } from '@/hooks/useProfileForm';
import PersonalInfoSection from './profile/PersonalInfoSection';
import HealthActivitySection from './profile/HealthActivitySection';
import ConsumptionGoalsSection from './profile/ConsumptionGoalsSection';
import DetailedGoalsSection from './profile/DetailedGoalsSection';
import DefaultQuantitiesSection from './profile/DefaultQuantitiesSection';
import ProfileDebugInfo from './profile/ProfileDebugInfo';
import ProfileSaveButton from './profile/ProfileSaveButton';
import ProfileLoading from './profile/ProfileLoading';

const UserProfile = () => {
  const { formData, setFormData, handleSave, loading, profile } = useProfileForm();

  if (loading) {
    return <ProfileLoading />;
  }

  return (
    <div className="space-y-6">
      <ProfileDebugInfo profile={profile} />
      
      <PersonalInfoSection 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <HealthActivitySection 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <ConsumptionGoalsSection 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <DetailedGoalsSection 
        formData={formData} 
        setFormData={setFormData} 
      />
      
      <DefaultQuantitiesSection 
        formData={formData} 
        setFormData={setFormData} 
      />

      <ProfileSaveButton onSave={handleSave} />
    </div>
  );
};

export default UserProfile;
