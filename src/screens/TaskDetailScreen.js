import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { tasks, completeTask, deleteTask } = useContext(AppContext);
  
  // 获取任务信息
  const task = tasks.find(t => t.id === taskId);
  
  // 如果任务不存在，返回上一页
  if (!task) {
    Alert.alert('错误', '任务不存在');
    navigation.goBack();
    return null;
  }
  
  // 处理任务完成
  const handleCompleteTask = () => {
    Alert.alert(
      '确认完成',
      '确定已完成此任务吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            completeTask(taskId);
            Alert.alert('成功', `任务已完成，获得${task.points}积分！`);
            navigation.goBack();
          } 
        }
      ]
    );
  };
  
  // 处理任务删除
  const handleDeleteTask = () => {
    Alert.alert(
      '确认删除',
      '确定要删除此任务吗？此操作无法撤销。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定删除', 
          style: 'destructive',
          onPress: () => {
            deleteTask(taskId);
            Alert.alert('成功', '任务已删除');
            navigation.goBack();
          } 
        }
      ]
    );
  };
  
  // 显示频率文本
  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case 'daily':
        return '每日任务';
      case 'weekly':
        return '每周任务';
      case 'as_needed':
        return '特殊任务';
      default:
        return '未知频率';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
        <Text style={styles.title}>任务详情</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskName}>{task.name}</Text>
          <Text style={styles.taskPoints}>+{task.points}</Text>
        </View>
        
        <View style={styles.taskInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>类别</Text>
            <Text style={styles.infoValue}>{task.category}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>频率</Text>
            <Text style={styles.infoValue}>{getFrequencyText(task.frequency)}</Text>
          </View>
          
          {task.description ? (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>描述</Text>
              <Text style={styles.infoValue}>{task.description}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompleteTask}
          >
            <Text style={styles.completeButtonText}>完成任务</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteTask}
          >
            <Text style={styles.deleteButtonText}>删除任务</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 50, // 保持header对称
  },
  content: {
    flex: 1,
    padding: 20,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  taskPoints: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  taskInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  buttonGroup: {
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  deleteButtonText: {
    color: '#E91E63',
    fontSize: 16,
  },
});

export default TaskDetailScreen; 