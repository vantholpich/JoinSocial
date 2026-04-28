import React from 'react';
export interface TelegramWallProps {
    /**
     * The URL to the Telegram group or channel (e.g., https://t.me/yourgroup)
     */
    groupUrl: string;
    /**
     * The name of the group to display
     */
    groupName: string;
    /**
     * Optional URL for a logo image to display above the text
     */
    logoUrl?: string;
    /**
     * If true, the wall is unlocked and its children are rendered
     */
    isUnlocked: boolean;
    /**
     * Callback fired when the wall successfully verifies/unlocks.
     * You can use this to persist the unlocked state in your app.
     */
    onUnlocked: () => void;
    /**
     * Custom description text
     */
    description?: string;
    /**
     * Custom text for the button
     */
    buttonText?: string;
    /**
     * Custom function to run when the user comes back to the app after clicking the link.
     * If this is provided, the SDK will wait for this promise to resolve to true before unlocking.
     * By default (if not provided), it will simply unlock automatically (Honor System).
     */
    onVerify?: () => Promise<boolean> | boolean;
    /**
     * The content to wrap with the wall
     */
    children: React.ReactNode;
}
export declare const TelegramWall: React.FC<TelegramWallProps>;
