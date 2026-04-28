import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Modal, Image, SafeAreaView, AppState, } from 'react-native';
export const TelegramWall = ({ groupUrl, groupName, logoUrl, isUnlocked, onUnlocked, description, buttonText = 'Join Telegram Group', onVerify, children, }) => {
    const [clickedJoin, setClickedJoin] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    // Listen to AppState to detect when the user comes back from Telegram
    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [clickedJoin]);
    const handleAppStateChange = async (nextAppState) => {
        if (nextAppState === 'active' && clickedJoin && !isUnlocked) {
            if (onVerify) {
                setIsVerifying(true);
                try {
                    const verified = await onVerify();
                    if (verified) {
                        onUnlocked();
                    }
                }
                catch (error) {
                    console.error('Verification failed', error);
                }
                finally {
                    setIsVerifying(false);
                    setClickedJoin(false); // Reset so they can try again if failed
                }
            }
            else {
                // Honor system: automatically unlock
                onUnlocked();
            }
        }
    };
    const handleJoinPress = useCallback(() => {
        Linking.canOpenURL(groupUrl).then(supported => {
            if (supported) {
                setClickedJoin(true);
                Linking.openURL(groupUrl);
            }
            else {
                console.warn(`Cannot open URL: ${groupUrl}`);
                // Fallback: still consider it clicked even if it couldn't open directly (maybe open in browser)
                setClickedJoin(true);
                Linking.openURL(groupUrl);
            }
        });
    }, [groupUrl]);
    if (isUnlocked) {
        return <>{children}</>;
    }
    return (<Modal visible={!isUnlocked} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {logoUrl && (<Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain"/>)}
          
          <Text style={styles.title}>Access Restricted</Text>
          <Text style={styles.description}>
            {description || `To continue using this app, please join our Telegram group: ${groupName}`}
          </Text>

          <TouchableOpacity style={[styles.button, isVerifying && styles.buttonDisabled]} onPress={handleJoinPress} disabled={isVerifying}>
            <Text style={styles.buttonText}>
              {isVerifying ? 'Verifying...' : buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 24,
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#0088cc', // Telegram blue
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#0088cc',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#999999',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
