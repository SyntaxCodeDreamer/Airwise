import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0b1120',
          borderTopColor: '#1e293b',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'AQI Dashboard',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🍃</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="advisor"
        options={{
          title: 'AI Advisor',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🤖</Text>
          ),
        }}
      />
    </Tabs>
  );
}

