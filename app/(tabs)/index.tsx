import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habits } from "@/types/database.type";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {

  const { signOut, user } = useAuth();

  const [habits, setHabits] = useState<Habits[]>();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [])
  );

  useEffect(() => {
    const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
    const habitSubscription = client.subscribe(channel, (response: RealTimeResponse) => {
      if (response.events.includes("databases.*.collections.*.create")) {

        fetchHabits();
      }
      else if (response.events.includes("databases.*.collections.*.update")) {

        fetchHabits();
      }
      else if (response.events.includes("databases.*.collections.*.delete")) {

        fetchHabits();
      }
    });
    fetchHabits();

    return () => {
      habitSubscription();
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: HABITS_COLLECTION_ID,
        queries: [Query.equal("user_id", user?.$id ?? "")],
      });
      setHabits(response.documents as unknown as Habits[])
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteHabits = async (documentId: string) => {
    try {
      setHabits((prev) => prev?.filter((habit) => habit.$id !== documentId));

      await databases.deleteDocument({
        databaseId: DATABASE_ID,
        collectionId: HABITS_COLLECTION_ID,
        documentId: documentId,
      });

    } catch (error) {
      console.error(error);
    }
  }

  const renderLeftActions = () => {
    return (
      <View style={style.swapActionRight}>
        <MaterialCommunityIcons name="trash-can-outline" size={32} color={"#fff"} />
      </View>
    );
  }

  const renderRightActions = () => {
    return (
      <View style={style.swapActionLeft}>
        <MaterialCommunityIcons name="check-circle-outline" size={32} color={"#fff"} />
      </View>
    );
  }

  return (
    <View
      style={style.container}
    >
      <View style={style.header}>
        <Text variant="headlineSmall" style={style.title}>Today's Habits</Text>
        <Button mode="text" onPress={signOut} icon={"logout"}> Sign Out </Button>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {habits?.length === 0 ? (
          <View style={style.emptyState}>
            <Text style={style.emptyStateText}>No habits yet. Add your first habit! </Text>
          </View>
        ) : (
          habits?.map((habit, key) => (
            <Swipeable ref={(ref) => {
              swipeableRefs.current[habit.$id] = ref;
            }}
              key={key}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={renderLeftActions}
              renderRightActions={renderRightActions}
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  handleDeleteHabits(habit.$id);
                }

                swipeableRefs.current[habit.$id]?.close();
              }}
            >
              <Surface style={style.card}>
                <View style={style.cardContent}>
                  <Text style={style.cardTitle}>
                    {habit.title}
                  </Text>
                  <Text style={style.cardDescription}>
                    {habit.description}
                  </Text>
                  <View style={style.cardFooter}>
                    <View style={style.streakBadge}>
                      <MaterialCommunityIcons name={"fire"} size={18} color={"#ff9800"} />
                      <Text style={style.streakText}>

                        {habit.streak_count} day streak
                      </Text>
                    </View>
                    <View style={style.frequencyBadge}>
                      <Text style={style.frequencyText}>
                        {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                      </Text>
                    </View>
                  </View>
                  {/* <Text>
                {habit.last_completed}
              </Text> */}
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Place as stylesheet below the component
const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",

  },

  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardContent: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },

  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },

  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14
  },

  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "uppercase",
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyStateText: {
    color: "#666666"
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
  },

  swapActionLeft: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },

  swapActionRight: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },

});
