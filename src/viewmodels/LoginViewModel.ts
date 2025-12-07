// src/viewmodels/LoginViewModel.ts
// Hook que actúa como ViewModel: maneja estado y lógica del login

import { useState } from 'react';
import { login } from '../services/authService';
import type { User } from '../models/User';

export function useLoginViewModel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
const { usuario, token, refreshToken } = await login(username, password);   

    localStorage.setItem('token', token); // guardar token
    localStorage.setItem("refreshToken", refreshToken);
      
      setUser(usuario); // guardar usuario en estado
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    user,
    handleLogin,
  };
}

