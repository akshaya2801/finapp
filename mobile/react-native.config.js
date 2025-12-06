module.exports = {
  project: {
    ios: {},
    android: {},
  },
  project_name: 'FinApp',
  link: {
    ios: [
      'node_modules/@react-native-firebase/app/ios',
      'node_modules/@react-native-firebase/messaging/ios',
    ],
    android: [
      'node_modules/@react-native-firebase/app/android',
      'node_modules/@react-native-firebase/messaging/android',
    ],
  },
};
