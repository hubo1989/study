import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const AnalyticsScreen = () => {
  const { tasks, rewards, history, currency } = useContext(AppContext);
  const [taskData, setTaskData] = useState({});
  const [rewardData, setRewardData] = useState({});
  const [timeData, setTimeData] = useState({});

  const screenWidth = Dimensions.get('window').width - 40;

  useEffect(() => {
    // 初始化数据分析
    analyzeData();
  }, [history]);

  const analyzeData = () => {
    // 分析历史记录中的任务完成情况
    analyzeTaskCompletions();
    
    // 分析奖励兑换情况
    analyzeRewardRedemptions();
    
    // 分析时间趋势
    analyzeTimeTrends();
  };

  const analyzeTaskCompletions = () => {
    // 任务类别完成分布
    const categoryCompletions = {};
    const taskCompletions = {};
    
    // 从历史记录中统计任务完成情况
    history.filter(item => item.type === 'task').forEach(item => {
      // 查找对应任务
      const task = tasks.find(t => t.id === item.taskId);
      if (task) {
        // 按类别统计
        if (!categoryCompletions[task.category]) {
          categoryCompletions[task.category] = {
            count: 0,
            points: 0
          };
        }
        categoryCompletions[task.category].count += 1;
        categoryCompletions[task.category].points += task.points;
        
        // 按任务统计
        if (!taskCompletions[task.id]) {
          taskCompletions[task.id] = {
            name: task.name,
            count: 0,
            points: 0
          };
        }
        taskCompletions[task.id].count += 1;
        taskCompletions[task.id].points += task.points;
      }
    });
    
    setTaskData({
      categoryCompletions,
      taskCompletions,
      totalTasksCompleted: history.filter(item => item.type === 'task').length,
      totalPointsEarned: history.filter(item => item.type === 'task').reduce((sum, item) => sum + item.points, 0)
    });
  };

  const analyzeRewardRedemptions = () => {
    // 奖励类别兑换分布
    const categoryRedemptions = {};
    const rewardRedemptions = {};
    
    // 从历史记录中统计奖励兑换情况
    history.filter(item => item.type === 'reward').forEach(item => {
      // 查找对应奖励
      const reward = rewards.find(r => r.id === item.rewardId);
      if (reward) {
        // 按类别统计
        if (!categoryRedemptions[reward.category]) {
          categoryRedemptions[reward.category] = {
            count: 0,
            points: 0
          };
        }
        categoryRedemptions[reward.category].count += 1;
        categoryRedemptions[reward.category].points += reward.cost;
        
        // 按奖励统计
        if (!rewardRedemptions[reward.id]) {
          rewardRedemptions[reward.id] = {
            name: reward.name,
            count: 0,
            points: 0
          };
        }
        rewardRedemptions[reward.id].count += 1;
        rewardRedemptions[reward.id].points += reward.cost;
      }
    });
    
    setRewardData({
      categoryRedemptions,
      rewardRedemptions,
      totalRewardsRedeemed: history.filter(item => item.type === 'reward').length,
      totalPointsSpent: history.filter(item => item.type === 'reward').reduce((sum, item) => sum + item.cost, 0)
    });
  };

  const analyzeTimeTrends = () => {
    // 按周统计数据
    const weeklyData = {};
    const now = new Date();
    
    // 获取过去12周的日期范围
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // 设置为周日
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      
      weeklyData[weekLabel] = {
        earned: 0,
        spent: 0,
        completed: 0,
        redeemed: 0
      };
    }
    
    // 遍历历史记录，按周统计
    history.forEach(item => {
      const itemDate = new Date(item.date);
      
      // 找到对应的周
      const weekLabelKeys = Object.keys(weeklyData);
      for (let i = 0; i < weekLabelKeys.length; i++) {
        const weekLabel = weekLabelKeys[i];
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        if (itemDate >= weekStart && itemDate <= weekEnd) {
          if (item.type === 'task') {
            weeklyData[weekLabel].earned += item.points;
            weeklyData[weekLabel].completed += 1;
          } else if (item.type === 'reward') {
            weeklyData[weekLabel].spent += item.cost;
            weeklyData[weekLabel].redeemed += 1;
          }
          break;
        }
      }
    });
    
    setTimeData(weeklyData);
  };

  // 准备饼图数据
  const preparePieChartData = (categoryData, type) => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC24A', '#EC407A'];
    
    return Object.keys(categoryData).map((category, index) => ({
      name: category,
      count: type === 'task' ? categoryData[category].count : categoryData[category].count,
      points: type === 'task' ? categoryData[category].points : categoryData[category].points,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
  };

  // 准备线图数据
  const prepareLineChartData = () => {
    const labels = Object.keys(timeData).reverse();
    
    return {
      labels,
      datasets: [
        {
          data: labels.map(label => timeData[label].earned),
          color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
          strokeWidth: 2
        },
        {
          data: labels.map(label => timeData[label].spent),
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ['获得积分', '消费积分']
    };
  };

  // 准备柱状图数据
  const prepareBarChartData = () => {
    const labels = Object.keys(timeData).reverse().slice(0, 6);
    
    return {
      labels,
      datasets: [
        {
          data: labels.map(label => timeData[label].completed),
        }
      ]
    };
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(74, 109, 167, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 10,
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>数据分析</Text>
      </View>
      
      {/* 总体统计 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>总体统计</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{taskData.totalTasksCompleted || 0}</Text>
            <Text style={styles.statLabel}>完成任务数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{taskData.totalPointsEarned || 0}</Text>
            <Text style={styles.statLabel}>获得{currency}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{rewardData.totalRewardsRedeemed || 0}</Text>
            <Text style={styles.statLabel}>兑换奖励数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{rewardData.totalPointsSpent || 0}</Text>
            <Text style={styles.statLabel}>消费{currency}</Text>
          </View>
        </View>
      </View>
      
      {/* 积分走势 */}
      {Object.keys(timeData).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>积分走势 (近12周)</Text>
          <LineChart
            data={prepareLineChartData()}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'rgba(54, 162, 235, 1)' }]} />
              <Text style={styles.legendText}>获得积分</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 99, 132, 1)' }]} />
              <Text style={styles.legendText}>消费积分</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* 任务完成情况 */}
      {Object.keys(timeData).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>任务完成数量 (近6周)</Text>
          <BarChart
            data={prepareBarChartData()}
            width={screenWidth}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
            }}
            style={styles.chart}
          />
        </View>
      )}
      
      {/* 任务类别分布 */}
      {Object.keys(taskData.categoryCompletions || {}).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>任务类别分布</Text>
          <PieChart
            data={preparePieChartData(taskData.categoryCompletions, 'task')}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="points"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}
      
      {/* 奖励类别分布 */}
      {Object.keys(rewardData.categoryRedemptions || {}).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>奖励类别分布</Text>
          <PieChart
            data={preparePieChartData(rewardData.categoryRedemptions, 'reward')}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            accessor="points"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}
      
      {/* 建议与提示 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>建议与提示</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>任务完成效率</Text>
          <Text style={styles.tipText}>
            {taskData.totalTasksCompleted > 20 
              ? '您的孩子任务完成情况良好，保持激励机制的新鲜感以维持积极性。' 
              : '建议增加一些日常容易完成的小任务，以提高完成率和成就感。'}
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>奖励偏好分析</Text>
          <Text style={styles.tipText}>
            {Object.keys(rewardData.rewardRedemptions || {}).length > 0 
              ? `孩子最喜欢的奖励是${Object.entries(rewardData.rewardRedemptions).sort((a, b) => b[1].count - a[1].count)[0][1].name}，可以考虑增加类似奖励。` 
              : '暂无足够数据分析奖励偏好，建议多样化奖励类型，观察孩子的选择。'}
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>积分平衡建议</Text>
          <Text style={styles.tipText}>
            {(taskData.totalPointsEarned || 0) > (rewardData.totalPointsSpent || 0) * 2 
              ? '当前积分累积较多，可以增加一些高价值奖励，提高兑换意愿。' 
              : (taskData.totalPointsEarned || 0) < (rewardData.totalPointsSpent || 0) 
                ? '积分消耗较快，建议适当提高任务难度与积分奖励。' 
                : '积分获取与消费较为平衡，当前激励机制运行良好。'}
          </Text>
        </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a6da7',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  tipCard: {
    backgroundColor: '#f5f8ff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4a6da7',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a6da7',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default AnalyticsScreen; 
 