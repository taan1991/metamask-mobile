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
import Routes from '../../../../constants/navigation/Routes';
import { Colors } from '../../../../util/theme/models';
import { useRewards } from '../../../../core/Engine/controllers/rewards-controller/RewardsAuthProvider';

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
  });

const Onboarding5: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { optin } = useRewards();

  const handleSkip = () => {
    Engine.context.RewardsController.resetOnboardingState();
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

      <View style={styles.content}>
        <Text variant={TextVariant.HeadingLG} style={styles.title}>
          Ready to Start Earning?
        </Text>
        <Text variant={TextVariant.BodyMD} style={styles.subtitle}>
          You&apos;re all set! Start trading, swapping, and using MetaMask to
          earn points and unlock exclusive rewards. Your journey begins now.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          variant={ButtonVariants.Primary}
          size={ButtonSize.Lg}
          label="Get Started"
          onPress={optin}
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

export default Onboarding5;
