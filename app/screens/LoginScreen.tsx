
import { useRouter } from 'expo-router';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, StatusBar} from 'react-native';
import { useAuth } from '../../hooks/useAuth';


export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    router.replace('/(tabs)/inicio'); // volta pro root, que já mostrará as tabs
  };


  return (
    <ImageBackground
      source={require('../../assets/images/bannerIFPB.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      {/* Filtro verde sobre a imagem */}
      <View style={styles.overlay}>
        <Text style={styles.logo}>SAPE</Text>
        <Text style={styles.subtitle}>Falta pouco para você acessar!</Text>

        <TextInput
          style={styles.input}
          placeholder="Matrícula"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
      
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#ccc"
          secureTextEntry
          
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 128, 0, 0.7)', // verde com transparência
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#006400', // verde escuro (harmonizando com o fundo)
    fontWeight: 'bold',
    fontSize: 16,
  },
});