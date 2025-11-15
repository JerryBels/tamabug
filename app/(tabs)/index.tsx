import { Text, View, useWindowDimensions } from 'react-native';

import ParallaxScrollView from '@/app/components/parallax-scroll-view';
import { Image } from 'expo-image';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          className="absolute bottom-0 left-0 h-[140px] w-[230px]"
          contentFit="contain"
        />
      }>

      <View className="flex-1 items-center justify-center bg-white gap-4">
        <Text className="font-bold text-primary">
          Welcome to Nativewind (or now Uniwind)!
        </Text>

        <View className="bg-gray-100 p-20 rounded-lg max-sm:p-10">
          <Text>Base text (responsive)</Text>
          <Text className="text-sm text-gray-600 mb-3">Screen Dimensions:</Text>
          <Text className="text-xxs font-mono">Width: {width.toFixed(0)}px</Text>
          <Text className="text-xxs font-mono max-lg:text-xl">Height: {height.toFixed(0)}px</Text>
          <Text className="text-xxs font-mono mt-2">
            Breakpoint: {width < 380 ? '< sm' : width < 420 ? 'sm' : width < 680 ? 'md' : width < 1024 ? 'lg' : 'xl'}
          </Text>
        </View>
      </View>

    </ParallaxScrollView>
  );
}
