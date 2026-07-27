import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CalculatorScreen from './screens/CalculatorScreen';
import PipValueScreen from './screens/PipValueScreen';
import { Colors } from './constants/Colors';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 10,
          marginTop: 2,
          fontWeight: '700',
          color: focused ? Colors.tabActive : Colors.tabInactive,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.backgroundSecondary,
              borderBottomWidth: 1,
              borderBottomColor: Colors.glassBorder,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: Colors.textPrimary,
              fontSize: 17,
              fontWeight: '700',
            },
            tabBarStyle: {
              backgroundColor: Colors.tabBar,
              borderTopColor: Colors.tabBarBorder,
              borderTopWidth: 1,
              height: 72,
              paddingBottom: 10,
              paddingTop: 2,
            },
            tabBarShowLabel: false,
          }}
        >
          <Tab.Screen
            name="Calculator"
            component={CalculatorScreen}
            options={{
              title: '📐  Forex Pip Calculator',
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="📐" label="Calculator" focused={focused} />
              ),
            }}
          />
          <Tab.Screen
            name="PipValue"
            component={PipValueScreen}
            options={{
              title: '📋  Pip Value Table',
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="📋" label="Pip Table" focused={focused} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
