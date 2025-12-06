import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addTicket, setError, saveDraft, Ticket } from '../store/ticketSlice';
import { ticketAPI } from '../api/index';
import { pickImage, pickDocument, formatFileSize } from '../utils/upload';

const CATEGORIES = [
  'Life Insurance',
  'General Insurance',
  'Health Insurance',
  'Vehicle Insurance',
  'Home Insurance',
  'Loans',
  'Mutual Funds',
  'SIPs',
  'Alternate Investments',
  'Other',
];

const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

interface NewTicketScreenProps {
  navigation: any;
}

const NewTicketScreen: React.FC<NewTicketScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'normal',
  });

  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);

  const handleAddAttachment = async () => {
    try {
      const image = await pickImage();
      if (!image.assets && !image.assets?.[0]) return;

      const file = image.assets[0];
      setAttachments([
        ...attachments,
        {
          name: file.fileName || 'image.jpg',
          size: file.fileSize || 0,
          type: file.type || 'image/jpeg',
          uri: file.uri,
        },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    dispatch(saveDraft(form as Partial<Ticket>));
    Alert.alert('Success', 'Ticket saved as draft');
    setForm({ title: '', description: '', category: '', priority: 'normal' });
    setAttachments([]);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category) {
      setErrorState('Please fill all required fields');
      return;
    }

    setLoading(true);
    setErrorState('');

    try {
      const response = await ticketAPI.createTicket({
        category: form.category,
        title: form.title,
        description: form.description,
        priority: form.priority,
      });

      dispatch(addTicket(response.data));
      Alert.alert('Success', 'Ticket created successfully');
      setForm({ title: '', description: '', category: '', priority: 'normal' });
      setAttachments([]);
      navigation.goBack();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create ticket';
      setErrorState(message);
      dispatch(setError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ticket title"
            value={form.title}
            onChangeText={(text) => setForm({ ...form, title: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={form.category ? styles.selectButtonTextActive : styles.selectButtonText}>
              {form.category || 'Select Category'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Priority</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setPriorityModalVisible(true)}
          >
            <Text style={styles.selectButtonTextActive}>
              {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter detailed description"
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            multiline
            numberOfLines={4}
            editable={!loading}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Attachments</Text>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleAddAttachment}
            disabled={loading}
          >
            <Text style={styles.attachButtonText}>+ Add File</Text>
          </TouchableOpacity>

          {attachments.length > 0 && (
            <View style={styles.attachmentsList}>
              {attachments.map((file, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.attachmentSize}>{formatFileSize(file.size)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
                    <Text style={styles.removeButton}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.secondaryButton, loading && styles.buttonDisabled]}
            onPress={handleSaveDraft}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Ticket</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setForm({ ...form, category: item });
                    setCategoryModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent
        visible={priorityModalVisible}
        onRequestClose={() => setPriorityModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setPriorityModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Priority</Text>
            <FlatList
              data={PRIORITIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setForm({ ...form, priority: item });
                    setPriorityModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
  },
  descriptionInput: {
    height: 100,
  },
  selectButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectButtonText: {
    fontSize: 14,
    color: '#999',
  },
  selectButtonTextActive: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  attachButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  attachButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  attachmentsList: {
    marginTop: 12,
  },
  attachmentItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  attachmentSize: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  removeButton: {
    fontSize: 18,
    color: '#d32f2f',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default NewTicketScreen;
