import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

interface Profile {
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  nationalId: string;
  nationalIdExpiry: Date;
  bankName: string;
  bankBranch: string;
  bankAccountNumber: string;
  documents?: Array<{
    type: string;
    filename: string;
    url: string;
    uploadedAt: Date;
    verified: boolean;
  }>;
  organizationName?: string;
  organizationType?: string;
  registrationNumber?: string;
  registrationDate?: Date;
  registrationExpiry?: Date;
  familySize?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  zakatReason?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'donor' | 'acceptor';
  profile: Profile;
  isActive: boolean;
  verificationStatus: 'pending' | 'in_review' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  isProfileComplete: (user: User) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Function to validate token
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await authAPI.getProfile();
      if (response.data) {
        const userData = response.data;
        // Ensure all required fields are present
        if (!userData?._id || !userData?.firstName || !userData?.lastName || !userData?.email || !userData?.role) {
          return false;
        }
        // Create properly typed user object
        const user: User = {
          _id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          profile: userData.profile,
          isActive: userData.isActive ?? true,
          verificationStatus: userData.verificationStatus || 'pending',
          createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
          updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date()
        };
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const isValid = await validateToken(storedToken);
          if (!isValid) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const isProfileComplete = (user: User): boolean => {
    if (!user || !user.profile) return false;

    const requiredFields = {
      common: ['phone', 'address', 'city', 'country', 'postalCode', 'nationalId', 'nationalIdExpiry', 'bankName', 'bankBranch', 'bankAccountNumber'],
      donor: ['organizationName', 'organizationType', 'registrationNumber', 'registrationDate', 'registrationExpiry'],
      acceptor: ['familySize', 'monthlyIncome', 'monthlyExpenses', 'zakatReason', 'emergencyContact']
    };

    // Check common fields
    const commonFieldsComplete = requiredFields.common.every(field => 
      user.profile && user.profile[field as keyof typeof user.profile]
    );

    // Check role-specific fields
    const roleFieldsComplete = user.role === 'donor' 
      ? requiredFields.donor.every(field => 
          user.profile && user.profile[field as keyof typeof user.profile]
        )
      : requiredFields.acceptor.every(field => 
          user.profile && user.profile[field as keyof typeof user.profile]
        );

    // Check documents
    const hasDocuments = user.profile.documents && user.profile.documents.length > 0;

    return commonFieldsComplete && roleFieldsComplete && hasDocuments;
  };

  const login = async (email: string, password: string, role?: string): Promise<{ success: boolean; error?: string; redirectTo?: string }> => {
    try {
      const response = await authAPI.login({ email, password, role });
      const { token: newToken, user: responseUser } = response.data;

      // Ensure all required fields are present
      if (!responseUser?._id || !responseUser?.firstName || !responseUser?.lastName || !responseUser?.email || !responseUser?.role) {
        throw new Error('Invalid user data received from server');
      }

      // Create properly typed user object
      const user: User = {
        _id: responseUser._id,
        firstName: responseUser.firstName,
        lastName: responseUser.lastName,
        email: responseUser.email,
        role: responseUser.role,
        profile: responseUser.profile,
        isActive: responseUser.isActive ?? true,
        verificationStatus: responseUser.verificationStatus || 'pending',
        createdAt: responseUser.createdAt ? new Date(responseUser.createdAt) : new Date(),
        updatedAt: responseUser.updatedAt ? new Date(responseUser.updatedAt) : new Date()
      };

      // Store token and user data
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(user);

      // Determine redirect path based on role
      const redirectTo = `/dashboard/${user.role === 'donor' ? 'DonorDashboard' : user.role === 'acceptor' ? 'AcceptorDashboard' : 'AdminDashboard'}`;

      return {
        success: true,
        redirectTo
      };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'donor' | 'acceptor';
  }): Promise<{ success: boolean; error?: string; redirectTo?: string }> => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, user: responseUser } = response.data;

      // Ensure all required fields are present
      if (!responseUser?._id || !responseUser?.firstName || !responseUser?.lastName || !responseUser?.email || !responseUser?.role) {
        throw new Error('Invalid user data received from server');
      }

      // Create properly typed user object
      const user: User = {
        _id: responseUser._id,
        firstName: responseUser.firstName,
        lastName: responseUser.lastName,
        email: responseUser.email,
        role: responseUser.role,
        profile: responseUser.profile,
        isActive: responseUser.isActive ?? true,
        verificationStatus: responseUser.verificationStatus || 'pending',
        createdAt: responseUser.createdAt ? new Date(responseUser.createdAt) : new Date(),
        updatedAt: responseUser.updatedAt ? new Date(responseUser.updatedAt) : new Date()
      };

      // Store token and user data
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(user);

      // Determine redirect path based on role
      const redirectTo = `/dashboard/${user.role === 'donor' ? 'DonorDashboard' : 'AcceptorDashboard'}`;

      return {
        success: true,
        redirectTo
      };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.data) {
        const updatedUser = { ...user, profile: response.data };
        setUser(updatedUser);
        
        // Check if profile is complete after update
        const isComplete = isProfileComplete(updatedUser);
        
        if (isComplete) {
          // Redirect to role-specific dashboard after profile completion
          const redirectTo = updatedUser.role === 'donor' 
            ? '/dashboard/DonorDashboard'
            : '/dashboard/AcceptorDashboard';
            
          return { 
            success: true, 
            redirectTo
          };
        }
        
        return { success: true };
      }
      return { success: false, error: 'Profile update failed' };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isProfileComplete
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 