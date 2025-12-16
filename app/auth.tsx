import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

export default function AuthScreen() {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Add loading state

    const theme = useTheme();

    const { signIn, signUp } = useAuth();

    const handleAuth = async () => {
        // Handle authentication logic here
        if (!email || !password) {
            setError("Email and Password are required");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                const error = await signUp(email, password);
                if (error) setError(error);
            } else {
                const error = await signIn(email, password);
                if (error) setError(error);
            }
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
        setError(null);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.content} >
                <Text style={styles.title} variant="headlineMedium" >
                    {isSignUp ? "Create Account" : "Welcome Back"}
                </Text>
                <TextInput 
                    placeholder="example@gmail.com" 
                    autoCapitalize="none" 
                    keyboardType="email-address" 
                    label="Email" 
                    mode="outlined" 
                    style={styles.input} 
                    value={email}
                    onChangeText={setEmail}
                    disabled={loading}
                />
                <TextInput 
                    placeholder="Your password" 
                    autoCapitalize="none" 
                    label="Password" 
                    mode="outlined" 
                    style={styles.input} 
                    value={password}
                    onChangeText={setPassword} 
                    secureTextEntry
                    disabled={loading}
                />
                {error && <Text style={{ color: theme.colors.error, marginBottom: 10 }}>{error}</Text>}

                <Button 
                    mode="contained" 
                    style={styles.button} 
                    onPress={handleAuth}
                    loading={loading}
                    disabled={loading}
                >
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <Button 
                    mode="text" 
                    onPress={handleSwitchMode} 
                    style={styles.button}
                    disabled={loading}
                >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        padding: 16,
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        gap: 5,
    },
    title: {
        paddingBottom: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        textAlign: 'center',
        marginTop: 8,
    },
});