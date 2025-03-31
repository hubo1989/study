import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 导入上下文提供者
import { AppProvider } from './src/context/AppContext';

// 导入屏幕组件
import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import RewardDetailScreen from './src/screens/RewardDetailScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// 创建堆栈导航器
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="light-content" backgroundColor="#4a6da7" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4a6da7',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#f8f9fa',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Tasks" 
            component={TasksScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="TaskDetail" 
            component={TaskDetailScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Rewards" 
            component={RewardsScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="RewardDetail" 
            component={RewardDetailScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Analytics" 
            component={AnalyticsScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
} 