import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "zh";

interface LanguageState {
  language: Language;
  userPreferences: Record<string, Language>;
  setLanguage: (language: Language, userId?: string) => void;
  applyUserPreference: (userId: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      userPreferences: {},
      setLanguage: (language, userId) =>
        set((state) => ({
          language,
          userPreferences: userId
            ? { ...state.userPreferences, [userId]: language }
            : state.userPreferences
        })),
      applyUserPreference: (userId) =>
        set((state) => ({
          language: state.userPreferences[userId] ?? state.language
        }))
    }),
    { name: "eventflow-language" }
  )
);
