import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface RatingModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (rating: number, feedback: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ visible, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (rating === 0) {
            return;
        }
        onSubmit(rating, feedback);
        setRating(0);
        setFeedback('');
        onClose();
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
            >
                <MaterialIcons
                    name={star <= rating ? 'star' : 'star-border'}
                    size={40}
                    color={star <= rating ? '#FFB800' : '#CCC'}
                />
            </TouchableOpacity>
        ));
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Rate Your Experience</Text>
                    <Text style={styles.subtitle}>
                        How satisfied are you with our service?
                    </Text>

                    <View style={styles.starsContainer}>{renderStars()}</View>

                    <TextInput
                        style={styles.feedbackInput}
                        placeholder="Share your feedback (optional)"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        value={feedback}
                        onChangeText={setFeedback}
                        textAlignVertical="top"
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.submitButton,
                                rating === 0 && styles.submitButtonDisabled,
                            ]}
                            onPress={handleSubmit}
                            disabled={rating === 0}
                        >
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        width: '85%',
        maxWidth: 400,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    starButton: {
        padding: 4,
    },
    feedbackInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#1F2937',
        minHeight: 100,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
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
    submitButton: {
        backgroundColor: '#007AFF',
    },
    submitButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default RatingModal;
