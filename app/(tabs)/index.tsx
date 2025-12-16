import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={style.view}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

// Place as stylesheet below the component
const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navButton: {
    width: 200,
    height: 40,
    backgroundColor: 'coral',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 20,
    textAlign: "center"
  }
});
