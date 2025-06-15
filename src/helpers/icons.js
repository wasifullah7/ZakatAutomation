import React from 'react';

export const KTIcon = ({ iconName, className = '' }) => {
  const getIconClass = (name) => {
    const iconMap = {
      'element-11': 'ki-duotone ki-element-11',
      'profile-user': 'ki-duotone ki-profile-user',
      'chart-line': 'ki-duotone ki-chart-line',
      'calculator': 'ki-duotone ki-calculator',
      'dollar': 'ki-duotone ki-dollar',
      'clock': 'ki-duotone ki-clock',
      'document': 'ki-duotone ki-document',
      'check': 'ki-duotone ki-check',
      'check-circle': 'ki-duotone ki-check-circle',
      'calendar': 'ki-duotone ki-calendar',
      'abstract-14': 'ki-duotone ki-abstract-14',
      'arrow-left': 'ki-duotone ki-arrow-left',
      'user': 'ki-duotone ki-user',
    };

    return iconMap[name] || 'ki-duotone ki-element-11';
  };

  return (
    <i className={`${getIconClass(iconName)} ${className}`}></i>
  );
}; 