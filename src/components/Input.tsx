import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  helperText,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles: ViewStyle = {
    marginBottom: 16,
    ...containerStyle,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: error ? '#ef4444' : isFocused ? '#d946ef' : '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  };

  const inputStyle: TextStyle = {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  };

  const errorTextStyle: TextStyle = {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  };

  const helperTextStyle: TextStyle = {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  };

  return (
    <View style={containerStyles}>
      {label && <Text style={labelStyle}>{label}</Text>}
      
      <View style={inputContainerStyle}>
        <TextInput
          style={[inputStyle, style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#94a3b8"
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={Boolean(!onRightIconPress)}
            activeOpacity={0.7}
            style={{ padding: 4 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={errorTextStyle}>{error}</Text>}
      {!error && helperText && <Text style={helperTextStyle}>{helperText}</Text>}
    </View>
  );
}

