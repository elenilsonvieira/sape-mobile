import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, Pressable } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // useAuth do contexto
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    setError('');
    const success = await login(matricula, senha);

    if (success) {
      router.replace('/(tabs)/inicio');
    } else {
      setError('Matrícula ou senha inválida.');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bannerIFPB.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <Text style={styles.logo}>SAPE</Text>
        <Text style={styles.subtitle}>Falta pouco para você acessar!</Text>

        <View style={styles.inputContainer}>
          <Feather name="user" size={20} color="#ccc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Matrícula"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={matricula}
            onChangeText={setMatricula}
          />
        </View>

        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#ccc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#ccc"
            secureTextEntry={!isPasswordVisible}
            value={senha}
            onChangeText={setSenha}
          />
          <Pressable onPress={togglePasswordVisibility}>
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="#ccc"
            />
          </Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 128, 0, 0.7)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  logo: { fontSize: 40, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#fff', marginBottom: 40, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 48, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 16, marginBottom: 16 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%', color: '#fff', fontSize: 16 },
  button: { width: '100%', height: 48, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { color: '#006400', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', marginBottom: 10 },
});
