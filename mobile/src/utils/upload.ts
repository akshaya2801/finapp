import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { DocumentPickerResponse, pick, types } from 'react-native-document-picker';

export const pickImage = async (): Promise<ImagePickerResponse> => {
  return new Promise((resolve) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.8,
        includeBase64: false,
      },
      (response) => {
        resolve(response);
      }
    );
  });
};

export const takePhoto = async (): Promise<ImagePickerResponse> => {
  return new Promise((resolve) => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
      },
      (response) => {
        resolve(response);
      }
    );
  });
};

export const pickDocument = async (): Promise<DocumentPickerResponse[]> => {
  try {
    const results = await pick({
      type: [types.pdf, types.doc, types.docx, types.xls, types.xlsx],
    });
    return results as DocumentPickerResponse[];
  } catch (err: any) {
    if (!err?.message?.includes('User cancelled')) {
      console.error('Document picker error:', err);
    }
    return [];
  }
};

export const validateFileSize = (size: number, maxSize: number = 10 * 1024 * 1024): boolean => {
  return size <= maxSize;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
