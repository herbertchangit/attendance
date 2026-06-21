import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "./languageStore";

describe("language preferences", () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ language: "en", userPreferences: {} });
  });

  it("persists the last language and restores each user's preference", () => {
    useLanguageStore.getState().setLanguage("zh", "usr_admin");
    expect(useLanguageStore.getState().language).toBe("zh");
    expect(useLanguageStore.getState().userPreferences.usr_admin).toBe("zh");

    useLanguageStore.getState().setLanguage("en");
    useLanguageStore.getState().applyUserPreference("usr_admin");
    expect(useLanguageStore.getState().language).toBe("zh");
    expect(localStorage.getItem("eventflow-language")).toContain('"language":"zh"');
  });
});
