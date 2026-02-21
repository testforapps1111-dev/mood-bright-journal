import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    userId: number | null;
    loading: boolean;
    isMock: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMock, setIsMock] = useState(false);

    const [loadingMessage, setLoadingMessage] = useState("Preparing your journal...");

    useEffect(() => {
        const messages = [
            "Setting the mood...",
            "Getting things ready for you...",
            "Personalizing your experience...",
            "Creating a safe space...",
            "Almost there..."
        ];
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % messages.length;
            setLoadingMessage(messages[i]);
        }, 1500);

        const handleAuth = async () => {
            // 1. Remove Mock Mode (Activating Real Auth)
            // Real auth will now be required even on localhost

            // 2. Check sessionStorage
            const savedUserId = sessionStorage.getItem('user_id');
            if (savedUserId) {
                setUserId(parseInt(savedUserId, 10));
                setLoading(false);
                return;
            }

            // 3. Extract Token from URL
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (token) {
                try {
                    // 4. Validate Token via MantraCare API
                    const response = await fetch('https://api.mantracare.com/user/user-info', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const id = data.user_id;

                        if (id) {
                            // 5. Initialize/Cleanup
                            sessionStorage.setItem('user_id', id.toString());
                            await initializeUser(id);
                            setUserId(id);

                            // 6. Clean URL
                            const newUrl = window.location.origin + window.location.pathname;
                            window.history.replaceState({}, document.title, newUrl);
                        } else {
                            throw new Error("User ID missing from response");
                        }
                    } else {
                        throw new Error("Auth failed");
                    }
                } catch (error) {
                    console.error("Auth Handshake Failed:", error);
                    window.location.href = '/token';
                } finally {
                    setLoading(false);
                }
            } else {
                // No token, no session -> Don't redirect, just stop loading
                setLoading(false);
            }
        };

        const initializeUser = async (id: number) => {
            // Upsert user in Supabase to ensure they exist for FK constraints
            const { error } = await supabase
                .from('users')
                .upsert({ id }, { onConflict: 'id' });

            if (error) console.error("Error initializing user in Supabase:", error);
        };

        handleAuth();
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ userId, loading, isMock }}>
            {loading ? (
                <div className="flex min-h-screen items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg"></div>
                        <p className="text-sm font-bold text-foreground animate-pulse tracking-wide italic">{loadingMessage}</p>
                    </div>
                </div>
            ) : !userId ? (
                <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
                    <div className="flex max-w-sm flex-col items-center gap-6 animate-fade-in">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                            <span className="text-4xl">🔐</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-foreground">Access Required</h1>
                            <p className="text-muted-foreground leading-relaxed">
                                Please access this journal through the official link provided to you.
                            </p>
                        </div>
                        <div className="w-full rounded-2xl bg-secondary/50 p-4 text-xs text-muted-foreground">
                            <p className="font-semibold mb-1">Testing locally?</p>
                            <p>Append a token to your URL: <br /> <code className="text-primary font-bold">?token=your_test_token</code></p>
                        </div>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
