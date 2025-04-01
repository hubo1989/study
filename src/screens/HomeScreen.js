import React from 'react';
import {ScrollView, StyleSheet, View, SafeAreaView, StatusBar} from 'react-native';
import StudyTimer from '../components/StudyTimer';
import TodoList from '../components/TodoList';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <ScrollView style={styles.scrollView}>
        <StudyTimer />
        <View style={styles.spacer} />
        <TodoList />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  spacer: {
    height: 20,
  },
});

export default HomeScreen; 