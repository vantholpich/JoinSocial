/**
 * A simple hook to manage the unlocked state.
 * In a real application, you might want to replace this or extend it
 * to use AsyncStorage or SecureStore so the user stays unlocked
 * between app sessions.
 */
export declare const useTelegramWall: (initialState?: boolean) => {
    isUnlocked: boolean;
    unlock: () => void;
    lock: () => void;
};
