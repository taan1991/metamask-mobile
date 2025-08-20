import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Button, {
  ButtonVariants,
  ButtonSize,
} from '../../../../component-library/components/Buttons/Button';
import {
  ButtonIcon,
  ButtonIconSize,
  IconName,
} from '@metamask/design-system-react-native';
import Text, {
  TextVariant,
} from '../../../../component-library/components/Texts/Text';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../util/theme';
import Engine from '../../../../core/Engine';
import { OnboardingStep } from '../../../../core/Engine/controllers/rewards-controller/types';
import Routes from '../../../../constants/navigation/Routes';
import { Colors } from '../../../../util/theme/models';
import StorageWrapper from '../../../../store/storage-wrapper';
import { REWARDS_ONBOARDING_COMPLETED_KEY } from '../../../../util/rewards';

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    backIcon: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 1,
    },
    topPagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      marginTop: 420,
    },
    title: {
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      color: colors.text.alternative,
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 40,
      gap: 16,
    },
    buttons: {
      width: '100%',
    },
    dot: {
      width: 9,
      height: 9,
      borderRadius: 6,
      backgroundColor: colors.text.alternative,
      marginHorizontal: 4,
    },
    activeBar: {
      width: 28,
      height: 9,
      borderRadius: 6,
      backgroundColor: colors.text.default,
      marginHorizontal: 4,
    },
  });

const Onboarding4: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleNext = async () => {
    // Update controller state to step 4
    Engine.context.RewardsController.setOnboardingStep(OnboardingStep.STEP_5);

    // Store onboarding completion flag
    await StorageWrapper.setItem(REWARDS_ONBOARDING_COMPLETED_KEY, 'true');

    navigation.navigate(Routes.REWARDS_ONBOARDING_5);
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: Routes.WALLET.HOME }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ButtonIcon
        size={ButtonIconSize.Lg}
        iconName={IconName.ArrowLeft}
        onPress={handleSkip}
        style={styles.backIcon}
      />
      <View style={styles.topPagination}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.activeBar} />
      </View>
      <View style={styles.content}>
        <Text variant={TextVariant.HeadingLG} style={styles.title}>
          Exclusive Seasonal Rewards
        </Text>
        <Text variant={TextVariant.BodyMD} style={styles.subtitle}>
          Compete and collect rewards that refresh every season. Carry over a
          portion of your points to the next season and keep your momentum
          going.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          variant={ButtonVariants.Primary}
          size={ButtonSize.Lg}
          label="Continue"
          onPress={handleNext}
          style={styles.buttons}
        />
        <Button
          variant={ButtonVariants.Secondary}
          size={ButtonSize.Lg}
          label="Not now"
          onPress={handleSkip}
          style={styles.buttons}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding4;
