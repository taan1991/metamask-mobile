import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../util/theme';
import { fontStyles } from '../../../../styles/common';
import Engine from '../../../../core/Engine';
import { OnboardingStep } from '../../../../core/Engine/controllers/rewards-controller/types';
import Routes from '../../../../constants/navigation/Routes';
import Text, {
  TextVariant,
} from '../../../../component-library/components/Texts/Text';

interface Colors {
  background: { default: string; alternative: string };
  text: { default: string; alternative: string };
  border: { muted: string };
  primary: { default: string; inverse: string };
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontFamily: 'MM Poly',
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      ...fontStyles.normal,
      fontSize: 16,
      color: colors.text.alternative,
      textAlign: 'center',
      lineHeight: 24,
    },
    illustration: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 40,
    },
    placeholderIllustration: {
      width: 200,
      height: 200,
      backgroundColor: colors.background.alternative,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 80,
    },
    description: {
      paddingHorizontal: 20,
      marginBottom: 40,
    },
    descriptionText: {
      ...fontStyles.normal,
      fontSize: 16,
      color: colors.text.default,
      textAlign: 'center',
      lineHeight: 24,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 32,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border.muted,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: colors.primary.default,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skipButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    skipButtonText: {
      ...fontStyles.normal,
      fontSize: 16,
      color: colors.text.alternative,
    },
    nextButton: {
      backgroundColor: colors.primary.default,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 24,
    },
    nextButtonText: {
      ...fontStyles.bold,
      fontSize: 16,
      color: colors.primary.inverse,
    },
  });

const Onboarding1: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleNext = () => {
    // Update controller state to step 2
    Engine.context.RewardsController.setOnboardingStep(OnboardingStep.STEP_2);
    navigation.navigate(Routes.REWARDS_ONBOARDING_2);
  };

  const handleSkip = () => {
    // Mark onboarding as seen and navigate to main rewards view
    Engine.context.RewardsController.markOnboardingAsSeen();
    navigation.navigate(Routes.REWARDS_VIEW);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant={TextVariant.DisplayLG} style={styles.title}>
            Season 1 is Live
          </Text>
          <Text style={styles.subtitle}>
            Discover amazing rewards and benefits waiting for you
          </Text>
        </View>

        <View style={styles.illustration}>
          {/* Placeholder for illustration */}
          <View style={styles.placeholderIllustration}>
            <Text style={styles.placeholderText}>🎁</Text>
          </View>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Earn points for your activities and unlock exclusive rewards. Start
            your journey today!
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding1;
