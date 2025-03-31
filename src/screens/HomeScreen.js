import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

const HomeScreen = ({ navigation }) => {
  const { tasks, rewards, points, currency } = useContext(AppContext);

  // 获取今日任务
  const todayTasks = tasks.filter(task => task.frequency === 'daily');
  
  // 获取可兑换的奖励
  const availableRewards = rewards.filter(reward => reward.cost <= points);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>学习激励管理</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>当前{currency}:</Text>
          <Text style={styles.points}>{points}</Text>
        </View>
      </View>

      {/* 快捷操作区 */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Tasks')}
        >
          <Text style={styles.actionButtonText}>任务管理</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Rewards')}
        >
          <Text style={styles.actionButtonText}>奖励商店</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Analytics')}
        >
          <Text style={styles.actionButtonText}>数据分析</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.actionButtonText}>设置</Text>
        </TouchableOpacity>
      </View>

      {/* 今日任务概览 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>今日任务</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={styles.seeAll}>查看全部</Text>
          </TouchableOpacity>
        </View>
        
        {todayTasks.length > 0 ? (
          todayTasks.slice(0, 5).map(task => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.taskItem}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            >
              <View style={styles.taskInfo}>
                <Text style={styles.taskName}>{task.name}</Text>
                <Text style={styles.taskCategory}>{task.category}</Text>
              </View>
              <Text style={styles.taskPoints}>+{task.points}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyMessage}>暂无今日任务</Text>
        )}
      </View>

      {/* 可兑换奖励 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>可兑换奖励</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
            <Text style={styles.seeAll}>查看全部</Text>
          </TouchableOpacity>
        </View>
        
        {availableRewards.length > 0 ? (
          availableRewards.slice(0, 3).map(reward => (
            <TouchableOpacity 
              key={reward.id} 
              style={styles.rewardItem}
              onPress={() => navigation.navigate('RewardDetail', { rewardId: reward.id })}
            >
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardName}>{reward.name}</Text>
                <Text style={styles.rewardCategory}>{reward.category}</Text>
              </View>
              <Text style={styles.rewardCost}>-{reward.cost}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyMessage}>暂无可兑换奖励</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4a6da7',
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 16,
    color: 'white',
  },
  points: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#4a6da7',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#4a6da7',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    color: '#333',
  },
  taskCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  taskPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    color: '#333',
  },
  rewardCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  rewardCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
});

export default HomeScreen; 