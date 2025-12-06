declare module 'react-native-vector-icons/MaterialIcons' {
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: React.FC<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons' {
  export * from 'react-native-vector-icons/MaterialIcons';
}
