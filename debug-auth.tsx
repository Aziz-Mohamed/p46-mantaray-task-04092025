// Debug component to test local authentication
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from './src/providers/authProvider';

export default function DebugAuth() {
  const { getAllUsers, login, signup } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    setStatus(`Loaded ${allUsers.length} users locally`);
  }, []);

  const testLogin = async () => {
    try {
      setStatus('Testing login...');
      await login({
        email: 'client@test.com',
        password: '123123'
      });
      setStatus('✅ Login successful!');
    } catch (error) {
      setStatus(`❌ Login failed: ${error.message}`);
    }
  };

  const testSignup = async () => {
    try {
      setStatus('Testing signup...');
      await signup({
        name: 'Debug User',
        email: 'debug@test.com',
        password: 'debug123'
      });
      setStatus('✅ Signup successful!');
    } catch (error) {
      setStatus(`❌ Signup failed: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Authentication</Text>
      <Text style={styles.status}>{status}</Text>
      
      <Text style={styles.subtitle}>Local Users ({users.length}):</Text>
      {users.slice(0, 5).map(user => (
        <Text key={user.id} style={styles.userText}>
          {user.email} - {user.name}
        </Text>
      ))}
      
      <Button title="Test Login" onPress={testLogin} />
      <Button title="Test Signup" onPress={testSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  userText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});
