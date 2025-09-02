import React, { createContext, useContext, useState, useRef } from 'react';
import { Animated, Dimensions, TouchableWithoutFeedback, View } from 'react-native';
import ConfigScreen from '@/app/screens/ConfigScreen';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface MenuContextProps {
  toggleMenu: () => void;
  closeMenu: () => void;
  isMenuOpen: boolean;
  menuAnimatedStyle: { left: Animated.Value };
}

const MenuContext = createContext<MenuContextProps>({
  toggleMenu: () => {},
  closeMenu: () => {},
  isMenuOpen: false,
  menuAnimatedStyle: { left: new Animated.Value(-SCREEN_WIDTH * 0.7) },
});

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH * 0.7)).current;

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? -SCREEN_WIDTH * 0.7 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH * 0.7,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsMenuOpen(false);
  };

  return (
    <MenuContext.Provider value={{ toggleMenu, closeMenu, isMenuOpen, menuAnimatedStyle: { left: slideAnim } }}>
      {children}

      {/* Overlay clicável */}
      {isMenuOpen && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 5,
            }}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Menu lateral */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: SCREEN_WIDTH * 0.7,
          backgroundColor: '#fff',
          paddingVertical: 20,
          zIndex: 10,
          left: slideAnim,
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowOffset: { width: 2, height: 0 },
          shadowRadius: 5,
          elevation: 10,
        }}
      >
        <ConfigScreen />
      </Animated.View>
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
