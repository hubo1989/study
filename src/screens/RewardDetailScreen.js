import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

const RewardDetailScreen = ({ route, navigation }) => {
  const { rewardId } = route.params;
  const { rewards, points, currency, redeemReward, deleteReward } = useContext(AppContext);
  
  // 获取奖励信息
  const reward = rewards.find(r => r.id === rewardId);
  
  // 如果奖励不存在，返回上一页
  if (!reward) {
    Alert.alert('错误', '奖励不存在');
    navigation.goBack();
    return null;
  }
  
  // 检查是否有足够积分兑换
  const canRedeem = points >= reward.cost;
  
  // 处理奖励兑换
  const handleRedeemReward = () => {
    if (!canRedeem) {
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
            const success = redeemReward(rewardId);
            if (success) {
              Alert.alert('成功', `成功兑换了"${reward.name}"！`);
              navigation.goBack();
            }
          } 
        }
      ]
    );
  };
  
  // 处理奖励删除
  const handleDeleteReward = () => {
    Alert.alert(
      '确认删除',
      '确定要删除此奖励吗？此操作无法撤销。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定删除', 
          style: 'destructive',
          onPress: () => {
            deleteReward(rewardId);
            Alert.alert('成功', '奖励已删除');
            navigation.goBack();
          } 
        }
      ]
    );
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
        <Text style={styles.title}>奖励详情</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.rewardHeader}>
          <Text style={styles.rewardName}>{reward.name}</Text>
          <Text style={styles.rewardCost}>-{reward.cost}</Text>
        </View>
        
        <View style={styles.pointsStatus}>
          <Text style={styles.pointsInfo}>
            当前{currency}: <Text style={styles.pointsValue}>{points}</Text>
          </Text>
          <Text style={[styles.statusText, canRedeem ? styles.statusAvailable : styles.statusUnavailable]}>
            {canRedeem ? '可兑换' : '积分不足'}
          </Text>
        </View>
        
        <View style={styles.rewardInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>类别</Text>
            <Text style={styles.infoValue}>{reward.category}</Text>
          </View>
          
          {reward.description ? (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>描述</Text>
              <Text style={styles.infoValue}>{reward.description}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.redeemButton, !canRedeem && styles.disabledButton]}
            onPress={handleRedeemReward}
            disabled={!canRedeem}
          >
            <Text style={styles.redeemButtonText}>兑换奖励</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteReward}
          >
            <Text style={styles.deleteButtonText}>删除奖励</Text>
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
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rewardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  rewardCost: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  pointsStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  pointsInfo: {
    fontSize: 16,
    color: '#555',
  },
  pointsValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#4a6da7',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusAvailable: {
    color: '#4CAF50',
  },
  statusUnavailable: {
    color: '#E91E63',
  },
  rewardInfo: {
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
  redeemButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#f9c9d7',
  },
  redeemButtonText: {
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

export default RewardDetailScreen; 