import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../util/theme';
import { fontStyles } from '../../../../styles/common';
import Engine from '../../../../core/Engine';
import { OnboardingStep } from '../../../../core/Engine/controllers/rewards-controller/types';
import Routes from '../../../../constants/navigation/Routes';

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
      ...fontStyles.bold,
      fontSize: 28,
      color: colors.text.default,
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
      marginBottom: 32,
    },
    descriptionText: {
      ...fontStyles.normal,
      fontSize: 16,
      color: colors.text.default,
      textAlign: 'center',
      lineHeight: 24,
    },
    features: {
      paddingHorizontal: 20,
      marginBottom: 40,
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    featureIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    featureText: {
      ...fontStyles.normal,
      fontSize: 16,
      color: colors.text.default,
      flex: 1,
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
    backButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    backButtonText: {
      ...fontStyles.normal,
      fontSize: 16,
      color: colors.text.alternative,
    },
    getStartedButton: {
      backgroundColor: colors.primary.default,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 24,
      minWidth: 140,
      alignItems: 'center',
    },
    getStartedButtonText: {
      ...fontStyles.bold,
      fontSize: 16,
      color: colors.primary.inverse,
    },
  });

const Onboarding4: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleGetStarted = () => {
    // Mark onboarding as seen and navigate to main rewards view
    Engine.context.RewardsController.markOnboardingAsSeen();
    navigation.navigate(Routes.REWARDS_VIEW);
  };

  const handleBack = () => {
    // Update controller state to step 3
    Engine.context.RewardsController.setOnboardingStep(OnboardingStep.STEP_3);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Ready to Start?</Text>
          <Text style={styles.subtitle}>
            You&apos;re all set to begin earning rewards!
          </Text>
        </View>

        <View style={styles.illustration}>
          {/* Placeholder for illustration */}
          <View style={styles.placeholderIllustration}>
            <Text style={styles.placeholderText}>🚀</Text>
          </View>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Start using MetaMask to earn points, unlock rewards, and enjoy
            exclusive benefits. Your rewards journey begins now!
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureText}>
              Earn points for every activity
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Unlock exclusive rewards</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📈</Text>
            <Text style={styles.featureText}>Track your progress</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding4;
