import React from 'react';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  AccessTime as ClockIcon,
  Tune as Settings2Icon,
} from '@mui/icons-material';

const iconMap = {
  'element-11': DashboardIcon,
  'profile-user': PersonIcon,
  'dollar': MoneyIcon,
  'clock': ClockIcon,
  'setting-2': Settings2Icon,
  'arrow-left': ArrowBackIcon,
};

export const KTIcon = ({ iconName, className }) => {
  const Icon = iconMap[iconName];
  return Icon ? <Icon className={className} /> : null;
}; 