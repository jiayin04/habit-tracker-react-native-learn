import { Account, Client } from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM as string);

export const account = new Account(client);