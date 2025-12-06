import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RoleSelectionScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome to FinApp</Text>
                <Text style={styles.subtitle}>Customer Support Ticketing System</Text>
            </View>

            <View style={styles.roleContainer}>
                <Text style={styles.question}>Who are you?</Text>

                <TouchableOpacity
                    style={[styles.roleButton, styles.customerButton]}
                    onPress={() => navigation.navigate('Login', { role: 'customer' })}
                >
                    <Text style={styles.roleIcon}>👤</Text>
                    <Text style={styles.roleTitle}>Customer</Text>
                    <Text style={styles.roleDescription}>
                        Register or login to create support tickets
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.roleButton, styles.adminButton]}
                    onPress={() => navigation.navigate('Login', { role: 'admin' })}
                >
                    <Text style={styles.roleIcon}>👨‍💼</Text>
                    <Text style={styles.roleTitle}>Admin</Text>
                    <Text style={styles.roleDescription}>
                        Login to manage customer tickets
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Finance Firm Support System
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    header: {
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 20,
        backgroundColor: '#667eea',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
    },
    roleContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    question: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 40,
    },
    roleButton: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 30,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    customerButton: {
        borderWidth: 2,
        borderColor: '#667eea',
    },
    adminButton: {
        borderWidth: 2,
        borderColor: '#764ba2',
    },
    roleIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    roleTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    roleDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    },
});

export default RoleSelectionScreen;
