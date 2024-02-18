/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useState,useEffect} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import io from 'socket.io-client';
import NotificationPermission from './NotificationPermission';
import { NativeModules } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const { ForegroundService } = NativeModules;

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connectedDevices, setConnectedDevices] = useState([]);
  console.log({Clipboard})
  Clipboard.addListener((props)=> console.log("Clip changed",props))
  const disconnectFromServer = () => {
    if (socket) {
      socket.disconnect();
      console.log('Disconnected from WebSocket server');
      setIsConnected(false); // Update the connection status
    }
  };

  const connectToServer = () => {
    console.log('clicked');
    const newSocket = io('http://192.168.0.175:3000', {
      transports: ['websocket'], // Ensuring the use of WebSockets
    });

    newSocket.on('connect', () => {
      ForegroundService.startForegroundService();
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      // Send this device's info (adjust according to your requirements)
      const deviceInfo = {
        name: 'React Native Device',
        // Additional device-specific info can be added here
      };
      newSocket.emit('device-info', deviceInfo);
    });

    newSocket.on('update-connected-devices', (devices) => {
      setConnectedDevices(devices);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    setSocket(newSocket); // Updating the socket state
  };

  

  useEffect(() => {
    const listener = Clipboard.addListener((content) => {
      if (socket) {
        socket.emit('update-clipboard', { content });
      }
    });

    return () => listener.remove();
  }, [socket]);

  return (
    <>
    <NotificationPermission></NotificationPermission>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.section}>
          <Text style={[styles.textXL, styles.appTitleText]}>
            Welcome App 👋
          </Text>
          <Text>Status: {isConnected ? 'Connected' : 'Disconnected'}</Text>
          <TouchableOpacity style={styles.button} onPress={connectToServer}>
            <Text style={styles.buttonText}>Connect to Server</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.disconnectButton]}
            onPress={disconnectFromServer}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
          <TextInput style={styles.textInput} placeholder="Type here..." />
        </View>
        <FlatList
          data={connectedDevices}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => (
            <Text style={styles.textSm}>{item.name}</Text>
          )}
          ListHeaderComponent={
            <Text style={styles.textMd}>Connected Devices:</Text>
          }
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  section: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textXL: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textMd: {
    fontSize: 18,
    marginTop: 10,
  },
  textSm: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default App;
