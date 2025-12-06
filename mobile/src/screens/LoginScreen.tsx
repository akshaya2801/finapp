import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { loginSuccess, setError } from '../store/authSlice';
import { authAPI } from '../api/index';
import { saveTokens } from '../utils/token';

interface LoginScreenProps {
  navigation: any;
  route: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const role = route.params?.role || 'customer'; // Get role from navigation params
  const [email, setEmail] = useState(route.params?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorState('Email and password are required');
      return;
    }

    setLoading(true);
    setErrorState('');

    try {
      const response = await authAPI.login(email, password);
      const { accessToken, refreshToken, user } = response.data;

      // Check if admin role is required
      if (role === 'admin' && user.role !== 'admin') {
        setErrorState('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }

      await saveTokens(accessToken, refreshToken);

      dispatch(
        loginSuccess({
          user: { ...user, name: user.email },
          accessToken,
          refreshToken,
        })
      );

      setErrorState('');
      navigation.replace('Home');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setErrorState(message);
      dispatch(setError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>FinApp</Text>
        <Text style={styles.subtitle}>
          {role === 'admin' ? 'Admin Portal' : 'Customer Support Portal'}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        {role === 'customer' && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back to role selection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    minHeight: 500,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 16,
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#999',
    fontSize: 14,
  },
});

export default LoginScreen;
