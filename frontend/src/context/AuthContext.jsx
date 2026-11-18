import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

const DEFAULT_GUEST_USER = {
  uid: "guest_citizen",
  email: "guest@airwise.ai",
  fullName: "Guest Citizen",
  preferredLanguage: "en",
  city: "New Delhi",
  familyProfile: {
    hasElderly: true,
    hasInfants: false,
    hasAsthmaRespiratory: true,
    hasIndoorAirPurifier: false
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('airwise_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_GUEST_USER,
            ...parsed,
            familyProfile: {
              ...DEFAULT_GUEST_USER.familyProfile,
              ...(parsed.familyProfile || {})
            }
          };
        }
      }
    } catch (e) {
      console.warn("Error reading stored user:", e);
    }
    return DEFAULT_GUEST_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('airwise_auth') === 'true';
  });

  useEffect(() => {
    if (isAuthenticated) {
      authApi.getProfile()
        .then(data => {
          if (data) {
            setUser(prev => ({
              ...DEFAULT_GUEST_USER,
              ...prev,
              uid: data.uid || prev?.uid,
              email: data.email || prev?.email,
              fullName: data.full_name || prev?.fullName,
              preferredLanguage: data.preferred_language || prev?.preferredLanguage,
              city: data.city || prev?.city,
              familyProfile: {
                hasElderly: data.family_profile?.has_elderly ?? true,
                hasInfants: data.family_profile?.has_infants ?? false,
                hasAsthmaRespiratory: data.family_profile?.has_asthma_respiratory ?? true,
                hasIndoorAirPurifier: data.family_profile?.has_indoor_air_purifier ?? false,
              }
            }));
          }
        })
        .catch(err => console.log("Profile sync fallback"));
    }
  }, [isAuthenticated]);

  const login = (email, fullName, password) => {
    const newUser = {
      uid: `usr_${Date.now()}`,
      email: email || "citizen@airwise.ai",
      fullName: fullName || (email ? email.split('@')[0] : "Aarav Sharma"),
      preferredLanguage: "en",
      city: "New Delhi",
      familyProfile: {
        hasElderly: true,
        hasInfants: false,
        hasAsthmaRespiratory: true,
        hasIndoorAirPurifier: false
      }
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('airwise_user', JSON.stringify(newUser));
    localStorage.setItem('airwise_auth', 'true');
  };

  const register = (email, fullName, password) => {
    login(email, fullName, password);
  };

  const logout = () => {
    setUser(DEFAULT_GUEST_USER);
    setIsAuthenticated(false);
    localStorage.removeItem('airwise_user');
    localStorage.removeItem('airwise_auth');
  };

  const updateProfile = async (updates) => {
    setUser(prev => {
      const updated = {
        ...prev,
        ...updates,
        familyProfile: {
          ...(prev?.familyProfile || DEFAULT_GUEST_USER.familyProfile),
          ...(updates?.familyProfile || {})
        }
      };
      localStorage.setItem('airwise_user', JSON.stringify(updated));
      return updated;
    });
    try {
      await authApi.updateProfile({
        full_name: updates.fullName,
        preferred_language: updates.preferredLanguage,
        city: updates.city,
        family_profile: {
          has_elderly: updates.familyProfile?.hasElderly,
          has_infants: updates.familyProfile?.hasInfants,
          has_asthma_respiratory: updates.familyProfile?.hasAsthmaRespiratory,
          has_indoor_air_purifier: updates.familyProfile?.hasIndoorAirPurifier
        }
      });
    } catch (e) {
      console.warn("Backend update failed, kept local state", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
