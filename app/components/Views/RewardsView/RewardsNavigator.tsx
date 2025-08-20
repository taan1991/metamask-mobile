import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import RewardsDashboard from './RewardsDashboard';
import RewardsTerms from './RewardsTerms';
import Routes from '../../../constants/navigation/Routes';
import { useRewards } from '../../../core/Engine/controllers/rewards-controller/RewardsAuthProvider';
import RewardsView from '.';
import Logger from '../../../util/Logger';
import {
  Onboarding1,
  Onboarding2,
  Onboarding3,
  Onboarding4,
} from './Onboarding';
import { OnboardingStep } from '../../../core/Engine/controllers/rewards-controller/types';
import { selectOnboardingState } from '../../../selectors/rewardscontroller';

const Stack = createStackNavigator();

interface RewardsNavigatorProps {
  children?: React.ReactNode;
}

const RewardsNavigator: React.FC<RewardsNavigatorProps> = () => {
  const { isOptIn, isLoading, currentAccount, subscriptionId } = useRewards();

  // Get onboarding state from RewardsController using selector
  const onboardingState = useSelector(selectOnboardingState);
  const { hasSeenOnboarding, currentStep } = onboardingState || {
    hasSeenOnboarding: false,
    currentStep: 'step_1',
  };

  // Show loading state or a loading component while checking auth
  if (isLoading) {
    return null;
  }

  Logger.log('RewardsAuthState:', {
    isOptIn,
    currentAccount,
    subscriptionId,
    hasSeenOnboarding,
    currentStep,
  });

  // Determine initial route based on auth state and onboarding state
  const getInitialRoute = () => {
    if (isOptIn) {
      return Routes.REWARDS_DASHBOARD;
    }

    if (!hasSeenOnboarding) {
      // Show onboarding screens based on current step
      switch (currentStep) {
        case OnboardingStep.STEP_2:
          return Routes.REWARDS_ONBOARDING_2;
        case OnboardingStep.STEP_3:
          return Routes.REWARDS_ONBOARDING_3;
        case OnboardingStep.STEP_4:
          return Routes.REWARDS_ONBOARDING_4;
        default:
          return Routes.REWARDS_ONBOARDING_1;
      }
    }

    return Routes.REWARDS_VIEW;
  };

  return (
    <Stack.Navigator initialRouteName={getInitialRoute()}>
      {/* Main Rewards Screens */}
      {isOptIn ? (
        <Stack.Screen
          name={Routes.REWARDS_DASHBOARD}
          component={RewardsDashboard}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          {/* Onboarding Screens */}
          <Stack.Screen
            name={Routes.REWARDS_ONBOARDING_1}
            component={Onboarding1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={Routes.REWARDS_ONBOARDING_2}
            component={Onboarding2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={Routes.REWARDS_ONBOARDING_3}
            component={Onboarding3}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={Routes.REWARDS_ONBOARDING_4}
            component={Onboarding4}
            options={{ headerShown: false }}
          />

          {/* Unauthenticated Rewards Screens */}
          <Stack.Screen
            name={Routes.REWARDS_VIEW}
            options={{ headerShown: false }}
            component={RewardsView}
          />
          <Stack.Screen
            name={Routes.REWARDS_TERMS}
            component={RewardsTerms}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RewardsNavigator;
