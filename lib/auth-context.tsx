import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

// CONTEXT TYPE
type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    signIn: (email: string, password: string) => Promise<string | void>;
    signUp: (email: string, password: string) => Promise<string | void>;
    signOut: () => Promise<string | void>;
    isAuthenticated: boolean;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PROVIDER
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            // No active session
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };


    const signUp = async (email: string, password: string) => {
        try {
            await account.create({ userId: ID.unique(), email, password });
            return await signIn(email, password);
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
            return "An unknown error occurred during sign up.";
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession({ email, password });
            const u = await account.get(); // fetch authenticated user
            setUser(u);
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
            return "An unknown error occurred during sign in.";
        }
    };

    const signOut = async () => {
        try {
            await account.deleteSession({ sessionId: "current" });
            setUser(null);
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
            return "An unknown error occurred during sign out.";
        }
    };

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider
            value={{ user, signIn, signUp, signOut, isAuthenticated, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// HOOK
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}