import { Text, View, useWindowDimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import ParallaxScrollView from '@/app/components/parallax-scroll-view';
import { Image } from '@/app/components/ui/image';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  styles.useVariants({
    // isPrimary: 'special',
    size: 'medium'
  })

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
        <Text className="text-base font-bold text-primary">
          Welcome to Nativewind!
        </Text>

        <View className="bg-gray-100 p-20 rounded-lg max-sm:p-10">
          <Text className="text-sm text-gray-600 mb-3">Screen Dimensions:</Text>
          <Text className="text-xs font-mono">Width: {width.toFixed(0)}px</Text>
          <Text className="text-xs font-mono">Height: {height.toFixed(0)}px</Text>
          <Text className="text-xxs font-mono mt-2">
            Breakpoint: {width < 380 ? '< sm' : width < 420 ? 'sm' : width < 680 ? 'md' : width < 1024 ? 'lg' : 'xl'}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.text}>Hello from unistyles</Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: {
      xs: 'purple',
      sm: 'blue',
      md: 'green',
      lg: 'yellow',
    },
    variants: {
      size: {
        small: {
          width: 100,
          height: 100
        },
        medium: {
          width: 200,
          height: 200
        },
        large: {
          width: 300,
          height: 300
        }
      },
    }
  },
  text: {
    textAlign: 'center',
    variants: {
      isPrimary: {
        true: {
          color: theme.colors.primary,
          fontSize: theme.fontSizes.md
        },
        default: {
          color: theme.colors.secondary,
          fontSize: {
            xs: theme.fontSizes.xs,
            sm: theme.fontSizes.sm,
            md: theme.fontSizes.md,
            lg: theme.fontSizes.lg,
            xl: theme.fontSizes.xl
          },
        },
        special: {
          color: 'red',
          fontSize: theme.fontSizes.xl
        }
      }
    }
  }
}));