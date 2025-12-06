import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { API_BASE_URL } from '../utils/axios';

const ProfileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { user, accessToken } = useSelector((state: RootState) => state.auth);

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Profile fields
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState('');

    // Password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Activity stats
    const [stats, setStats] = useState({
        total_tickets: 0,
        open_tickets: 0,
        in_progress_tickets: 0,
        resolved_tickets: 0,
        closed_tickets: 0,
        rated_tickets: 0,
    });

    useEffect(() => {
        fetchProfile();
        fetchActivity();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/profile`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userData = response.data.user;
            setName(userData.name);
            setPhone(userData.phone);
        } catch (error) {
            console.error('Fetch profile error:', error);
        }
    };

    const fetchActivity = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/profile/activity`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setStats(response.data.activity);
        } catch (error) {
            console.error('Fetch activity error:', error);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await axios.put(
                `${API_BASE_URL}/profile`,
                { name, phone },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            Alert.alert('Success', 'Profile updated successfully');
            setEditing(false);
            fetchProfile();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await axios.put(
                `${API_BASE_URL}/profile/password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            Alert.alert('Success', 'Password changed successfully');
            setChangingPassword(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => dispatch(logout()),
            },
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <MaterialIcons name="account-circle" size={80} color="#007AFF" />
                <Text style={styles.headerName}>{user?.name}</Text>
                <Text style={styles.headerEmail}>{user?.email}</Text>
            </View>

            {/* Activity Stats */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activity Summary</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.total_tickets}</Text>
                        <Text style={styles.statLabel}>Total Tickets</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.open_tickets}</Text>
                        <Text style={styles.statLabel}>Open</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.closed_tickets}</Text>
                        <Text style={styles.statLabel}>Closed</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.rated_tickets}</Text>
                        <Text style={styles.statLabel}>Rated</Text>
                    </View>
                </View>
            </View>

            {/* Profile Information */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Profile Information</Text>
                    {!editing && (
                        <TouchableOpacity onPress={() => setEditing(true)}>
                            <MaterialIcons name="edit" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={[styles.input, !editing && styles.inputDisabled]}
                        value={name}
                        onChangeText={setName}
                        editable={editing}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, styles.inputDisabled]}
                        value={user?.email}
                        editable={false}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        style={[styles.input, !editing && styles.inputDisabled]}
                        value={phone}
                        onChangeText={setPhone}
                        editable={editing}
                        keyboardType="phone-pad"
                    />
                </View>

                {editing && (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => {
                                setEditing(false);
                                fetchProfile();
                            }}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleUpdateProfile}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Change Password */}
            <View style={styles.section}>
                <TouchableOpacity
                    style={styles.changePasswordButton}
                    onPress={() => setChangingPassword(!changingPassword)}
                >
                    <MaterialIcons name="lock" size={24} color="#007AFF" />
                    <Text style={styles.changePasswordText}>Change Password</Text>
                    <MaterialIcons
                        name={changingPassword ? 'expand-less' : 'expand-more'}
                        size={24}
                        color="#007AFF"
                    />
                </TouchableOpacity>

                {changingPassword && (
                    <View style={styles.passwordForm}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Current Password</Text>
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry
                                placeholder="Enter current password"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                placeholder="Enter new password"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                placeholder="Confirm new password"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.saveButtonText}>Update Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 12,
    },
    headerEmail: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    section: {
        backgroundColor: '#FFF',
        marginTop: 16,
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 12,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
        backgroundColor: '#FFF',
    },
    inputDisabled: {
        backgroundColor: '#F3F4F6',
        color: '#6B7280',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    cancelButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    changePasswordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    changePasswordText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
    passwordForm: {
        marginTop: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#FFF',
        marginTop: 16,
        marginHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
});

export default ProfileScreen;
