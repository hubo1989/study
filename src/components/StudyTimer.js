import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const StudyTimer = () => {
  // 时间状态（以秒为单位）
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 默认25分钟
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  
  // 计时器引用
  const timerRef = useRef(null);

  // 格式化时间显示
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 开始/暂停计时器
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // 重置计时器
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  // 切换工作/休息模式
  const toggleMode = () => {
    setIsActive(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(25 * 60); // 工作时间25分钟
    } else {
      setIsBreak(true);
      setTimeLeft(5 * 60); // 休息时间5分钟
    }
  };

  // 计时器逻辑
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // 时间到时自动切换模式
      toggleMode();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={[styles.modeText, isBreak ? styles.breakText : styles.workText]}>
          {isBreak ? '休息时间' : '学习时间'}
        </Text>
        <Text style={styles.timeText}>{formatTime()}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetTimer}>
            <Text style={styles.buttonText}>重置</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isActive ? styles.pauseButton : styles.startButton]}
            onPress={toggleTimer}>
            <Text style={styles.buttonText}>
              {isActive ? '暂停' : '开始'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.modeButton]}
            onPress={toggleMode}>
            <Text style={styles.buttonText}>
              {isBreak ? '切换到学习' : '切换到休息'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  timerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workText: {
    color: '#3478F6',
  },
  breakText: {
    color: '#30D158',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#3478F6',
  },
  pauseButton: {
    backgroundColor: '#FF9500',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  modeButton: {
    backgroundColor: '#30D158',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StudyTimer; 