import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { List, FAB, Text, Snackbar, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { tasks } from '../lib/api';
import { useFocusEffect } from 'expo-router';

type Task = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
};

export default function Home() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setError('');
      const data = await tasks.getAll();
      console.log('Fetched tasks:', data);
      setTaskList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchTasks();
    } catch (error) {
      console.error('Error refreshing tasks:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh tasks');
    } finally {
      setRefreshing(false);
    }
  };

  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    if (!taskId) {
      console.error('Task ID is undefined');
      return;
    }

    if (updatingTaskId === taskId) {
      console.log('Task update already in progress:', taskId);
      return;
    }

    console.log('Toggling task completion:', { taskId, currentStatus: completed });

    try {
      setError('');
      setUpdatingTaskId(taskId);

      // Optimistically update the UI
      setTaskList(prevTasks => prevTasks.map(task =>
        task._id === taskId ? { ...task, completed: !completed } : task
      ));

      // Make API call
      const updatedTask = await tasks.update(taskId, { completed: !completed });
      console.log('Task update successful:', updatedTask);

      // Update the task in the list with the server response
      setTaskList(prevTasks => prevTasks.map(task =>
        task._id === taskId ? { ...task, ...updatedTask } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert the optimistic update on error
      setTaskList(prevTasks => prevTasks.map(task =>
        task._id === taskId ? { ...task, completed } : task
      ));
      setError(error instanceof Error ? error.message : 'Failed to update task status');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const navigateToTask = (taskId: string) => {
    if (!taskId) {
      console.error('Task ID is undefined');
      return;
    }

    router.push({
      pathname: '/task/[id]',
      params: { id: taskId }
    });
  };

  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, fetching tasks');
      fetchTasks();
    }, [])
  );

  const renderItem = ({ item }: { item: Task }) => {
    console.log('Rendering task item:', item);
    return (
      <List.Item
        title={item.title}
        description={item.description}
        onPress={() => navigateToTask(item._id)}
        left={props => (
          <IconButton
            {...props}
            icon={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
            onPress={() => toggleTaskComplete(item._id, item.completed)}
            disabled={updatingTaskId === item._id}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      {taskList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No tasks yet</Text>
          <Text variant="bodyMedium">Add your first task by tapping the + button</Text>
        </View>
      ) : (
        <FlatList
          data={taskList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={item => item._id}
          renderItem={renderItem}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/task/new')}
      />
      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        action={{
          label: 'Close',
          onPress: () => setError(''),
        }}>
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 
