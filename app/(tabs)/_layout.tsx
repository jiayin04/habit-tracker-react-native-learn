import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{tabBarActiveTintColor: "coral"}}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({color, focused}) =>  focused ? <FontAwesome name="home" size={24} color={color} /> : <Ionicons name="home-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="login" options={{ title: "Login" }} />
    </Tabs>
  );
}
