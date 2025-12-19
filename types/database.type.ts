import { Models } from "react-native-appwrite";


export interface Habits extends Models.Document {
    user_id: string;
    title: string;
    description: string;
    frequency: string;
    streak_count: string;
    last_completed: string;
    created_at: string;
    updated_at: string;
}