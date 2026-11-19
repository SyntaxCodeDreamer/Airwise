import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0b1120',
          borderTopColor: '#1e293b',
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'AQI Gauge',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18 }}>🍃</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="advisor"
        options={{
          title: 'AI Advisor',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18 }}>🤖</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="commute"
        options={{
          title: 'Transport',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18 }}>🚇</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18 }}>🚨</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
