import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wngTemplateData } from '../data/wngTemplate';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [currency, setCurrency] = useState('学习币');
  const [isLoading, setIsLoading] = useState(true);

  // 初始化应用数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 尝试从存储中加载数据
        const storedTasks = await AsyncStorage.getItem('tasks');
        const storedRewards = await AsyncStorage.getItem('rewards');
        const storedPoints = await AsyncStorage.getItem('points');
        const storedHistory = await AsyncStorage.getItem('history');
        const storedCurrency = await AsyncStorage.getItem('currency');

        if (storedTasks) setTasks(JSON.parse(storedTasks));
        if (storedRewards) setRewards(JSON.parse(storedRewards));
        if (storedPoints) setPoints(JSON.parse(storedPoints));
        if (storedHistory) setHistory(JSON.parse(storedHistory));
        if (storedCurrency) setCurrency(storedCurrency);

        // 如果没有数据，使用默认模板
        if (!storedTasks && !storedRewards) {
          // 可以调用importWNGTemplate函数
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 保存数据
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      await AsyncStorage.setItem('rewards', JSON.stringify(rewards));
      await AsyncStorage.setItem('points', JSON.stringify(points));
      await AsyncStorage.setItem('history', JSON.stringify(history));
      await AsyncStorage.setItem('currency', currency);
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  };

  // 添加任务
  const addTask = task => {
    setTasks([...tasks, {...task, id: Date.now().toString()}]);
    saveData();
  };

  // 删除任务
  const deleteTask = taskId => {
    setTasks(tasks.filter(task => task.id !== taskId));
    saveData();
  };

  // 完成任务
  const completeTask = (taskId, earnedPoints) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? {...task, completed: true} : task,
      ),
    );
    setPoints(points + earnedPoints);
    saveData();
  };

  // 添加奖励
  const addReward = reward => {
    setRewards([...rewards, {...reward, id: Date.now().toString()}]);
    saveData();
  };

  // 删除奖励
  const deleteReward = rewardId => {
    setRewards(rewards.filter(reward => reward.id !== rewardId));
    saveData();
  };

  // 兑换奖励
  const redeemReward = rewardId => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && points >= reward.cost) {
      setPoints(points - reward.cost);
      return true;
    }
    return false;
  };

  // WNG模板导入
  const importWNGTemplate = () => {
    setTasks(wngTemplateData.tasks);
    setRewards(wngTemplateData.rewards);
    saveData();
  };

  // 导出所有数据
  const exportData = async () => {
    const data = {
      tasks,
      rewards,
      points,
      history,
      currency,
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data);
  };

  // 导入数据
  const importData = async (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      setTasks(data.tasks || []);
      setRewards(data.rewards || []);
      setPoints(data.points || 0);
      setHistory(data.history || []);
      if (data.currency) setCurrency(data.currency);
      
      await saveData();
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  };

  // 重置数据
  const resetData = async () => {
    setTasks([]);
    setRewards([]);
    setPoints(0);
    setHistory([]);
    setCurrency('学习币');
    await saveData();
  };

  // 上下文值
  const contextValue = {
    tasks,
    rewards,
    points,
    history,
    currency,
    isLoading,
    setCurrency,
    addTask,
    deleteTask,
    completeTask,
    addReward,
    deleteReward,
    redeemReward,
    importWNGTemplate,
    exportData,
    importData,
    resetData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}; 