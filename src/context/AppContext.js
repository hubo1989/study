import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wngTemplateData } from '../data/wngTemplate';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [currency, setCurrency] = useState('积分');
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

  // 任务相关函数
  const addTask = (task) => {
    const newTasks = [...tasks, { ...task, id: Date.now().toString() }];
    setTasks(newTasks);
    saveData();
  };

  const updateTask = (id, updatedTask) => {
    const newTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updatedTask } : task
    );
    setTasks(newTasks);
    saveData();
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    saveData();
  };

  const completeTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      // 添加完成记录
      const newHistory = [...history, {
        id: Date.now().toString(),
        type: 'task',
        taskId: id,
        taskName: task.name,
        points: task.points,
        date: new Date().toISOString()
      }];
      
      // 更新积分
      const newPoints = points + task.points;
      
      setHistory(newHistory);
      setPoints(newPoints);
      saveData();
    }
  };

  // 奖励相关函数
  const addReward = (reward) => {
    const newRewards = [...rewards, { ...reward, id: Date.now().toString() }];
    setRewards(newRewards);
    saveData();
  };

  const updateReward = (id, updatedReward) => {
    const newRewards = rewards.map(reward => 
      reward.id === id ? { ...reward, ...updatedReward } : reward
    );
    setRewards(newRewards);
    saveData();
  };

  const deleteReward = (id) => {
    const newRewards = rewards.filter(reward => reward.id !== id);
    setRewards(newRewards);
    saveData();
  };

  const redeemReward = (id) => {
    const reward = rewards.find(r => r.id === id);
    if (reward && points >= reward.cost) {
      // 添加兑换记录
      const newHistory = [...history, {
        id: Date.now().toString(),
        type: 'reward',
        rewardId: id,
        rewardName: reward.name,
        cost: reward.cost,
        date: new Date().toISOString()
      }];
      
      // 更新积分
      const newPoints = points - reward.cost;
      
      setHistory(newHistory);
      setPoints(newPoints);
      saveData();
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
    setCurrency('积分');
    await saveData();
  };

  return (
    <AppContext.Provider value={{
      tasks,
      rewards,
      points,
      history,
      currency,
      isLoading,
      setCurrency,
      addTask,
      updateTask,
      deleteTask,
      completeTask,
      addReward,
      updateReward,
      deleteReward,
      redeemReward,
      importWNGTemplate,
      exportData,
      importData,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
}; 