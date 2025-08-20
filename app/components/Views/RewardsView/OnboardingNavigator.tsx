import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { OnboardingStep } from '../../../core/Engine/controllers/rewards-controller/types';
import { selectOnboardingState } from '../../../selectors/rewardscontroller';
import Routes from '../../../constants/navigation/Routes';
import {
  Onboarding1,
  Onboarding2,
  Onboarding3,
  Onboarding4,
  Onboarding5,
} from './Onboarding';

const Stack = createStackNavigator();

const OnboardingNavigator: React.FC = () => {
  const onboardingState = useSelector(selectOnboardingState);
  const { currentStep } = onboardingState || { currentStep: 'step_1' };

  const getInitialRoute = () => {
    switch (currentStep) {
      case OnboardingStep.STEP_2:
        return Routes.REWARDS_ONBOARDING_2;
      case OnboardingStep.STEP_3:
        return Routes.REWARDS_ONBOARDING_3;
      case OnboardingStep.STEP_4:
        return Routes.REWARDS_ONBOARDING_4;
      case OnboardingStep.STEP_5:
        return Routes.REWARDS_ONBOARDING_5;
      default:
        return Routes.REWARDS_ONBOARDING_1;
    }
  };

  return (
    <Stack.Navigator initialRouteName={getInitialRoute()}>
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
      <Stack.Screen
        name={Routes.REWARDS_ONBOARDING_5}
        component={Onboarding5}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
