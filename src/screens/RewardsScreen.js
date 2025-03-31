import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

const RewardsScreen = ({ navigation }) => {
  const { rewards, addReward, redeemReward, points, currency } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    category: '',
    cost: '',
    description: ''
  });
  const [filter, setFilter] = useState('all');

  // 根据过滤器和是否可以兑换过滤奖励
  const getFilteredRewards = () => {
    if (filter === 'all') return rewards;
    if (filter === 'available') return rewards.filter(reward => reward.cost <= points);
    if (filter === 'unavailable') return rewards.filter(reward => reward.cost > points);
    
    // 按类别过滤
    return rewards.filter(reward => reward.category === filter);
  };

  const filteredRewards = getFilteredRewards();

  // 获取所有类别
  const categories = [...new Set(rewards.map(reward => reward.category))];

  // 添加新奖励
  const handleAddReward = () => {
    if (!newReward.name || !newReward.category || !newReward.cost) {
      Alert.alert('提示', '请填写必要的奖励信息');
      return;
    }
    
    addReward({
      ...newReward,
      cost: parseInt(newReward.cost, 10)
    });
    
    setNewReward({
      name: '',
      category: '',
      cost: '',
      description: ''
    });
    setModalVisible(false);
  };

  // 处理奖励兑换
  const handleRedeemReward = (id) => {
    const reward = rewards.find(r => r.id === id);
    
    if (reward.cost > points) {
      Alert.alert('积分不足', `需要${reward.cost}${currency}，当前仅有${points}${currency}`);
      return;
    }
    
    Alert.alert(
      '确认兑换',
      `确定要兑换"${reward.name}"吗？将消耗${reward.cost}${currency}`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            const success = redeemReward(id);
            if (success) {
              Alert.alert('兑换成功', `成功兑换了"${reward.name}"！`);
            }
          } 
        }
      ]
    );
  };

  // 渲染奖励项
  const renderRewardItem = ({ item }) => {
    const isAvailable = item.cost <= points;
    
    return (
      <View style={[styles.rewardItem, !isAvailable && styles.unavailableReward]}>
        <TouchableOpacity 
          style={styles.rewardContent}
          onPress={() => navigation.navigate('RewardDetail', { rewardId: item.id })}
        >
          <View style={styles.rewardInfo}>
            <Text style={[styles.rewardName, !isAvailable && styles.unavailableText]}>
              {item.name}
            </Text>
            <Text style={styles.rewardCategory}>{item.category}</Text>
            {item.description ? (
              <Text style={styles.rewardDescription} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </View>
          <Text style={[styles.rewardCost, !isAvailable && styles.unavailableCost]}>
            -{item.cost}
          </Text>
        </TouchableOpacity>
        
        {isAvailable && (
          <TouchableOpacity 
            style={styles.redeemButton}
            onPress={() => handleRedeemReward(item.id)}
          >
            <Text style={styles.redeemButtonText}>兑换</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>奖励商店</Text>
        <View style={styles.headerRight}>
          <Text style={styles.pointsText}>{points} {currency}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>添加奖励</Text>
          </TouchableOpacity>
        </View>
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
            style={[styles.filterButton, filter === 'available' && styles.activeFilter]}
            onPress={() => setFilter('available')}
          >
            <Text style={[styles.filterText, filter === 'available' && styles.activeFilterText]}>可兑换</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'unavailable' && styles.activeFilter]}
            onPress={() => setFilter('unavailable')}
          >
            <Text style={[styles.filterText, filter === 'unavailable' && styles.activeFilterText]}>不可兑换</Text>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity 
              key={category}
              style={[styles.filterButton, filter === category && styles.activeFilter]}
              onPress={() => setFilter(category)}
            >
              <Text style={[styles.filterText, filter === category && styles.activeFilterText]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 奖励列表 */}
      {filteredRewards.length > 0 ? (
        <FlatList
          data={filteredRewards}
          renderItem={renderRewardItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>暂无奖励</Text>
        </View>
      )}

      {/* 添加奖励的模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加新奖励</Text>
            
            <Text style={styles.inputLabel}>奖励名称 *</Text>
            <TextInput
              style={styles.input}
              value={newReward.name}
              onChangeText={(text) => setNewReward({...newReward, name: text})}
              placeholder="输入奖励名称"
            />
            
            <Text style={styles.inputLabel}>类别 *</Text>
            <TextInput
              style={styles.input}
              value={newReward.category}
              onChangeText={(text) => setNewReward({...newReward, category: text})}
              placeholder="输入奖励类别"
            />
            
            <Text style={styles.inputLabel}>消耗{currency} *</Text>
            <TextInput
              style={styles.input}
              value={newReward.cost}
              onChangeText={(text) => setNewReward({...newReward, cost: text})}
              placeholder={`输入兑换所需${currency}`}
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>描述</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newReward.description}
              onChangeText={(text) => setNewReward({...newReward, description: text})}
              placeholder="输入奖励描述"
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddReward}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
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
  rewardItem: {
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
  unavailableReward: {
    opacity: 0.7,
  },
  rewardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  rewardInfo: {
    flex: 1,
    paddingRight: 10,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  unavailableText: {
    color: '#888',
  },
  rewardCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
    marginBottom: 5,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#555',
  },
  rewardCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  unavailableCost: {
    color: '#999',
  },
  redeemButton: {
    backgroundColor: '#E91E63',
    padding: 10,
    alignItems: 'center',
  },
  redeemButtonText: {
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

export default RewardsScreen; 