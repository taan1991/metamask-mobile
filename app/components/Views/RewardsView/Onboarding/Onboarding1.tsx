import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../util/theme';
import Engine from '../../../../core/Engine';
import { OnboardingStep } from '../../../../core/Engine/controllers/rewards-controller/types';
import Routes from '../../../../constants/navigation/Routes';
import StorageWrapper from '../../../../store/storage-wrapper';
import Text, {
  TextVariant,
} from '../../../../component-library/components/Texts/Text';
import Button, {
  ButtonSize,
  ButtonVariants,
} from '../../../../component-library/components/Buttons/Button';
import {
  ButtonIcon,
  ButtonIconSize,
  IconName,
} from '@metamask/design-system-react-native';
import { Colors } from '../../../../util/theme/models';
import { REWARDS_ONBOARDING_COMPLETED_KEY } from '../../../../util/rewards';

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    closeIcon: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      marginTop: 80,
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
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 40,
      width: '100%',
    },
    button: {
      width: '100%',
    },
  });

const Onboarding1: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleNext = async () => {
    // Check if onboarding was already completed
    const isCompleted = await StorageWrapper.getItem(
      REWARDS_ONBOARDING_COMPLETED_KEY,
    );

    if (isCompleted === 'true') {
      // Jump directly to step 5 if already completed
      Engine.context.RewardsController.setOnboardingStep(OnboardingStep.STEP_5);
      navigation.navigate(Routes.REWARDS_ONBOARDING_5);
    } else {
      // Normal flow - move to step 2
      Engine.context.RewardsController.setOnboardingStep(OnboardingStep.STEP_2);
      navigation.navigate(Routes.REWARDS_ONBOARDING_2);
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ButtonIcon
        size={ButtonIconSize.Lg}
        iconName={IconName.Close}
        onPress={handleSkip}
        style={styles.closeIcon}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant={TextVariant.DisplayLG} style={styles.title}>
            Season 1 is Live
          </Text>
          <Text variant={TextVariant.BodyMD} style={styles.subtitle}>
            Earn bonus points and perks based on your MetaMask activity, unlock
            rewards, and advance through the levels
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          variant={ButtonVariants.Primary}
          size={ButtonSize.Lg}
          label="Claim 250 points now"
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding1;
