import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, Switch, Modal, Share } from 'react-native';
import { AppContext } from '../context/AppContext';

const SettingsScreen = () => {
  const { 
    currency, 
    setCurrency, 
    points,
    importWNGTemplate, 
    exportData, 
    importData, 
    resetData 
  } = useContext(AppContext);
  
  const [currencyInput, setCurrencyInput] = useState(currency);
  const [isEditing, setIsEditing] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [importText, setImportText] = useState('');
  const [pointsAdjustmentVisible, setPointsAdjustmentVisible] = useState(false);
  const [pointsAdjustment, setPointsAdjustment] = useState('');

  // 保存积分名称
  const saveCurrency = () => {
    if (currencyInput.trim()) {
      setCurrency(currencyInput.trim());
      setIsEditing(false);
      Alert.alert('成功', `积分名称已更改为"${currencyInput.trim()}"`);
    } else {
      Alert.alert('错误', '积分名称不能为空');
    }
  };

  // 导入WNG模板
  const handleImportTemplate = () => {
    Alert.alert(
      '导入模板',
      '确定要导入WNG模板吗？这将替换当前的任务和奖励设置。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            importWNGTemplate();
            Alert.alert('成功', 'WNG模板已成功导入！');
          } 
        }
      ]
    );
  };

  // 导出数据
  const handleExportData = async () => {
    try {
      const data = await exportData();
      
      // 尝试分享数据
      try {
        await Share.share({
          message: data,
          title: '学习激励管理数据导出'
        });
      } catch (error) {
        // 如果分享失败，直接显示数据
        Alert.alert('导出数据', data);
      }
    } catch (error) {
      Alert.alert('错误', '导出数据失败');
    }
  };

  // 导入数据
  const handleImportData = async () => {
    if (!importText.trim()) {
      Alert.alert('错误', '请输入有效的导入数据');
      return;
    }

    try {
      const success = await importData(importText);
      if (success) {
        setImportVisible(false);
        setImportText('');
        Alert.alert('成功', '数据导入成功！');
      } else {
        Alert.alert('错误', '导入数据格式无效');
      }
    } catch (error) {
      Alert.alert('错误', '导入数据失败，请确保数据格式正确');
    }
  };

  // 重置所有数据
  const handleResetData = () => {
    Alert.alert(
      '重置数据',
      '确定要重置所有数据吗？这将清除所有任务、奖励、积分和历史记录。该操作无法撤销！',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定重置', 
          style: 'destructive',
          onPress: () => {
            resetData();
            Alert.alert('成功', '所有数据已重置');
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>设置</Text>
      </View>

      {/* 基本设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本设置</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>积分名称</Text>
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={currencyInput}
                onChangeText={setCurrencyInput}
                placeholder="输入积分名称"
              />
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={() => {
                    setCurrencyInput(currency);
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.editButton, styles.saveButton]}
                  onPress={saveCurrency}
                >
                  <Text style={styles.saveButtonText}>保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.valueContainer}>
              <Text style={styles.settingValue}>{currency}</Text>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.editText}>编辑</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => setPointsAdjustmentVisible(true)}
        >
          <Text style={styles.settingButtonText}>调整积分余额</Text>
        </TouchableOpacity>
      </View>

      {/* 数据管理 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>数据管理</Text>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={handleImportTemplate}
        >
          <Text style={styles.settingButtonText}>导入WNG模板</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={handleExportData}
        >
          <Text style={styles.settingButtonText}>导出数据</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => setImportVisible(true)}
        >
          <Text style={styles.settingButtonText}>导入数据</Text>
        </TouchableOpacity>
      </View>

      {/* 危险区域 */}
      <View style={[styles.section, styles.dangerSection]}>
        <Text style={styles.sectionTitle}>危险区域</Text>
        
        <TouchableOpacity 
          style={[styles.settingButton, styles.dangerButton]}
          onPress={handleResetData}
        >
          <Text style={styles.dangerButtonText}>重置所有数据</Text>
        </TouchableOpacity>
      </View>

      {/* 关于 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <Text style={styles.aboutText}>
          学习激励管理 v1.0.0{'\n'}
          一款为家长设计的学习激励管理工具，帮助激励和跟踪孩子的学习进度。
        </Text>
      </View>

      {/* 导入数据模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={importVisible}
        onRequestClose={() => setImportVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>导入数据</Text>
            
            <Text style={styles.inputLabel}>将导出的数据粘贴到下方</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={importText}
              onChangeText={setImportText}
              placeholder="粘贴导出的JSON数据"
              multiline
              numberOfLines={10}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setImportVisible(false);
                  setImportText('');
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleImportData}
              >
                <Text style={styles.confirmButtonText}>导入</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 调整积分模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pointsAdjustmentVisible}
        onRequestClose={() => setPointsAdjustmentVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>调整积分余额</Text>
            
            <Text style={styles.inputLabel}>当前积分: {points}</Text>
            <TextInput
              style={styles.input}
              value={pointsAdjustment}
              onChangeText={setPointsAdjustment}
              placeholder={`输入要添加或减少的${currency}数量（如：+50 或 -20）`}
              keyboardType="number-pad"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPointsAdjustmentVisible(false);
                  setPointsAdjustment('');
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  // 这里应该处理积分调整，但这个函数尚未在AppContext中实现
                  // 可以让用户手动添加该功能
                  Alert.alert('提示', '积分调整功能尚未实现');
                  setPointsAdjustmentVisible(false);
                  setPointsAdjustment('');
                }}
              >
                <Text style={styles.confirmButtonText}>调整</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  dangerSection: {
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingItem: {
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#333',
  },
  editText: {
    color: '#4a6da7',
    fontSize: 14,
  },
  editContainer: {
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#4a6da7',
  },
  cancelButtonText: {
    color: '#555',
  },
  saveButtonText: {
    color: 'white',
  },
  settingButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  settingButtonText: {
    color: '#333',
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  dangerButtonText: {
    color: '#E91E63',
    fontSize: 16,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    marginBottom: 10,
    color: '#555',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4a6da7',
    marginLeft: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 