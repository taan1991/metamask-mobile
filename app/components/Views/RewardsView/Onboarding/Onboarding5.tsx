import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
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
import TextField from '../../../../component-library/components/Form/TextField';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../util/theme';
import Routes from '../../../../constants/navigation/Routes';
import { Colors } from '../../../../util/theme/models';
import { useRewards } from '../../../../core/Engine/controllers/rewards-controller/RewardsAuthProvider';
import { Box } from '../../../UI/Box/Box';
import {
  FlexDirection,
  AlignItems,
  JustifyContent,
} from '../../../UI/Box/box.types';

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
      paddingTop: 60,
      alignItems: 'center',
    },
    placeholderImage: {
      width: 100,
      height: 100,
      backgroundColor: colors.text.default,
      borderRadius: 8,
      marginBottom: 24,
    },
    title: {
      textAlign: 'center',
      marginBottom: 24,
    },
    pointsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 180,
      borderWidth: 1,
      borderColor: colors.border.muted,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    pointsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    pointsText: {
      fontWeight: 'bold',
    },
    bonusText: {
      color: colors.text.alternative,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 8,
    },
    captionContainer: {
      width: '100%',
      alignItems: 'flex-start',
      marginBottom: 32,
    },
    caption: {
      color: colors.text.alternative,
      textAlign: 'left',
    },
    termsContainer: {
      width: '100%',
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background.muted,
      borderRadius: 8,
    },
    termsTitle: {
      fontWeight: 'bold',
      marginBottom: 8,
    },
    termsText: {
      color: colors.text.alternative,
      lineHeight: 20,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    button: {
      width: '100%',
    },
  });

const Onboarding5: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { optin } = useRewards();
  const [referralCode, setReferralCode] = useState('');

  const handleSkip = () => {
    // Engine.context.RewardsController.resetOnboardingState();
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

      <Box style={styles.content}>
        {/* Placeholder Image */}
        <Box style={styles.placeholderImage} />

        {/* Title */}
        <Text variant={TextVariant.HeadingLG} style={styles.title}>
          You&apos;ve unlocked 250 points!
        </Text>

        {/* Points Display */}
        <Box
          flexDirection={FlexDirection.Row}
          justifyContent={JustifyContent.spaceBetween}
          alignItems={AlignItems.center}
          style={styles.pointsContainer}
        >
          <Box
            flexDirection={FlexDirection.Row}
            alignItems={AlignItems.center}
            style={styles.pointsLeft}
          >
            <ButtonIcon size={ButtonIconSize.Sm} iconName={IconName.Edit} />
            <Text variant={TextVariant.BodyMD} style={styles.pointsText}>
              250 points
            </Text>
          </Box>
          <Text variant={TextVariant.BodyMD} style={styles.bonusText}>
            Sign up bonus
          </Text>
        </Box>

        {/* Referral Code Input */}
        <Box style={styles.inputContainer}>
          <TextField
            placeholder="Enter referral code (optional)"
            value={referralCode}
            onChangeText={setReferralCode}
          />
        </Box>

        {/* Caption */}
        <Box style={styles.captionContainer}>
          <Text variant={TextVariant.BodySM} style={styles.caption}>
            Got a code? Drop it in. Otherwise, skip ahead.
          </Text>
        </Box>

        {/* Terms */}
        <Box style={styles.termsContainer}>
          <Text variant={TextVariant.BodyMD} style={styles.termsTitle}>
            On-chain tracking
          </Text>
          <Text variant={TextVariant.BodySM} style={styles.termsText}>
            By joining, you agree to on-chain tracking for automatic rewards.
          </Text>
        </Box>
      </Box>

      <Box style={styles.footer}>
        <Button
          variant={ButtonVariants.Primary}
          size={ButtonSize.Lg}
          label="Claim my 250 points now"
          onPress={optin}
          style={styles.button}
        />
      </Box>
    </SafeAreaView>
  );
};

export default Onboarding5;
