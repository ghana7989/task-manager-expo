import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar, Switch, Text } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { tasks } from '../../lib/api';

type Task = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
};

export default function TaskScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params?.id;
  const isNewTask = id === 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNewTask && id) {
      console.log('Fetching task details:', id);
      fetchTask();
    }
  }, [id, isNewTask]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError('');
      const task = await tasks.getOne(id);
      console.log('Fetched task details:', task);
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setCompleted(task.completed || false);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch task details');
      }
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (loading) return;

      setLoading(true);
      setError('');

      if (!title.trim()) {
        setError('Title is required');
        return;
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        completed
      };

      console.log('Saving task:', { id, isNewTask, taskData });

      if (isNewTask) {
        await tasks.create(taskData);
      } else if (id) {
        await tasks.update(id, taskData);
      }
      router.back();
    } catch (error) {
      console.error('Error saving task:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to save task');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id || isNewTask || loading) {
        router.back();
        return;
      }

      console.log('Deleting task:', id);
      setLoading(true);
      setError('');
      await tasks.delete(id);
      router.back();
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to delete task');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompletedChange = async (value: boolean) => {
    try {
      if (loading || isNewTask || !id) return;

      console.log('Updating task completion:', { id, value });
      setLoading(true);
      setError('');
      setCompleted(value);

      await tasks.update(id, { completed: value });
    } catch (error) {
      console.error('Error updating task status:', error);
      setCompleted(!value); // Revert on error
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to update task status');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        disabled={loading}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.input}
        disabled={loading}
      />
      {!isNewTask && (
        <View style={styles.switchContainer}>
          <Switch
            value={completed}
            onValueChange={handleCompletedChange}
            disabled={loading}
          />
          <Text variant="bodyMedium" style={styles.switchLabel}>
            Mark as completed
          </Text>
        </View>
      )}
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        style={styles.button}
        disabled={loading}
      >
        {isNewTask ? 'Create Task' : 'Update Task'}
      </Button>
      {!isNewTask && (
        <Button
          mode="outlined"
          onPress={handleDelete}
          loading={loading}
          style={styles.deleteButton}
          textColor="red"
          disabled={loading}
        >
          Delete Task
        </Button>
      )}
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
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    marginLeft: 8,
  },
  button: {
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 16,
    borderColor: 'red',
  },
}); 
