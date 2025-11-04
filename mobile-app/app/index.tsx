import { Redirect } from 'expo-router';

// Redirect to the tabs layout
export default function Index() {
  return <Redirect href="/(tabs)" />;
}

