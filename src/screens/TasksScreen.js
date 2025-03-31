import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

const TasksScreen = ({ navigation }) => {
  const { tasks, addTask, completeTask } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    category: '',
    points: '',
    description: '',
    frequency: 'daily'
  });
  const [filter, setFilter] = useState('all');

  // 根据过滤器过滤任务
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.frequency === filter);

  // 获取所有类别
  const categories = [...new Set(tasks.map(task => task.category))];

  // 添加新任务
  const handleAddTask = () => {
    if (!newTask.name || !newTask.category || !newTask.points) {
      Alert.alert('提示', '请填写必要的任务信息');
      return;
    }
    
    addTask({
      ...newTask,
      points: parseInt(newTask.points, 10)
    });
    
    setNewTask({
      name: '',
      category: '',
      points: '',
      description: '',
      frequency: 'daily'
    });
    setModalVisible(false);
  };

  // 处理任务完成
  const handleCompleteTask = (id) => {
    Alert.alert(
      '确认完成',
      '确定已完成此任务吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => completeTask(id) }
      ]
    );
  };

  // 渲染任务项
  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity 
        style={styles.taskContent}
        onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      >
        <View style={styles.taskInfo}>
          <Text style={styles.taskName}>{item.name}</Text>
          <Text style={styles.taskCategory}>{item.category}</Text>
          {item.description ? (
            <Text style={styles.taskDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
        <Text style={styles.taskPoints}>+{item.points}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.completeButton}
        onPress={() => handleCompleteTask(item.id)}
      >
        <Text style={styles.completeButtonText}>完成</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>任务管理</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>添加任务</Text>
        </TouchableOpacity>
      </View>

      {/* 过滤选项 */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>全部</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'daily' && styles.activeFilter]}
            onPress={() => setFilter('daily')}
          >
            <Text style={[styles.filterText, filter === 'daily' && styles.activeFilterText]}>每日任务</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'weekly' && styles.activeFilter]}
            onPress={() => setFilter('weekly')}
          >
            <Text style={[styles.filterText, filter === 'weekly' && styles.activeFilterText]}>每周任务</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'as_needed' && styles.activeFilter]}
            onPress={() => setFilter('as_needed')}
          >
            <Text style={[styles.filterText, filter === 'as_needed' && styles.activeFilterText]}>特殊任务</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 任务列表 */}
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>暂无任务</Text>
        </View>
      )}

      {/* 添加任务的模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加新任务</Text>
            
            <Text style={styles.inputLabel}>任务名称 *</Text>
            <TextInput
              style={styles.input}
              value={newTask.name}
              onChangeText={(text) => setNewTask({...newTask, name: text})}
              placeholder="输入任务名称"
            />
            
            <Text style={styles.inputLabel}>类别 *</Text>
            <TextInput
              style={styles.input}
              value={newTask.category}
              onChangeText={(text) => setNewTask({...newTask, category: text})}
              placeholder="输入任务类别"
            />
            
            <Text style={styles.inputLabel}>积分 *</Text>
            <TextInput
              style={styles.input}
              value={newTask.points}
              onChangeText={(text) => setNewTask({...newTask, points: text})}
              placeholder="输入任务积分"
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>描述</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newTask.description}
              onChangeText={(text) => setNewTask({...newTask, description: text})}
              placeholder="输入任务描述"
              multiline
              numberOfLines={4}
            />
            
            <Text style={styles.inputLabel}>频率</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, newTask.frequency === 'daily' && styles.radioSelected]}
                onPress={() => setNewTask({...newTask, frequency: 'daily'})}
              >
                <Text style={styles.radioText}>每日</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, newTask.frequency === 'weekly' && styles.radioSelected]}
                onPress={() => setNewTask({...newTask, frequency: 'weekly'})}
              >
                <Text style={styles.radioText}>每周</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, newTask.frequency === 'as_needed' && styles.radioSelected]}
                onPress={() => setNewTask({...newTask, frequency: 'as_needed'})}
              >
                <Text style={styles.radioText}>特殊</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.confirmButtonText}>添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#4a6da7',
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeFilter: {
    backgroundColor: '#e0e9f8',
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: '#4a6da7',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  taskInfo: {
    flex: 1,
    paddingRight: 10,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
  },
  taskPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  radioSelected: {
    backgroundColor: '#e0e9f8',
  },
  radioText: {
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#4a6da7',
  },
  cancelButtonText: {
    color: '#333',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TasksScreen; 