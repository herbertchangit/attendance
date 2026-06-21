import { useEffect } from "react";
import { useLanguageStore } from "../store/languageStore";
import { zhTranslations } from "./translations";

const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ["aria-label", "placeholder", "title"];

function translateDynamic(value: string) {
  const locationCount = value.match(/^(\d+) of (\d+) locations$/);
  if (locationCount) return `${locationCount[1]}/${locationCount[2]} 个场地`;
  const accountCount = value.match(/^(\d+) of (\d+) accounts$/);
  if (accountCount) return `${accountCount[1]}/${accountCount[2]} 个账户`;
  const recordCount = value.match(/^(\d+) records$/);
  if (recordCount) return `${recordCount[1]} 条记录`;
  const pageCount = value.match(/^Page (\d+) of (\d+)$/);
  if (pageCount) return `第 ${pageCount[1]} 页，共 ${pageCount[2]} 页`;
  const venueNotice = value.match(/^(.+) was (created|updated|deleted)\.$/);
  if (venueNotice) {
    const actions = { created: "已创建", updated: "已更新", deleted: "已删除" };
    return `${venueNotice[1]}${actions[venueNotice[2] as keyof typeof actions]}。`;
  }
  const passwordNotice = value.match(/^Password reset for (.+)\.$/);
  if (passwordNotice) return `已重置 ${passwordNotice[1]} 的密码。`;
  const editAction = value.match(/^Edit (.+)$/);
  if (editAction) return `编辑 ${editAction[1]}`;
  const deleteAction = value.match(/^Delete (.+)$/);
  if (deleteAction) return `删除 ${deleteAction[1]}`;
  const resetAction = value.match(/^Reset password for (.+)$/);
  if (resetAction) return `重置 ${resetAction[1]} 的密码`;
  const attendanceDate = value.match(/^Attendance Date: (.+)$/);
  if (attendanceDate) return `出席日期：${attendanceDate[1]}`;
  const checkInMessage = value.match(/^(.+) checked in at (.+)$/);
  if (checkInMessage) return `${checkInMessage[1]} 已于 ${checkInMessage[2]} 签到`;
  return zhTranslations[value] ?? value;
}

function preserveWhitespace(source: string, translation: string) {
  const start = source.match(/^\s*/)?.[0] ?? "";
  const end = source.match(/\s*$/)?.[0] ?? "";
  return `${start}${translation}${end}`;
}

function translateRoot(language: "en" | "zh") {
  const root = document.getElementById("root");
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text | null;
  while (node) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue ?? "");
    const source = originalText.get(node) ?? "";
    const trimmed = source.trim();
    node.nodeValue = language === "zh" && trimmed
      ? preserveWhitespace(source, translateDynamic(trimmed))
      : source;
    node = walker.nextNode() as Text | null;
  }

  root.querySelectorAll("*").forEach((element) => {
    let originals = originalAttributes.get(element);
    if (!originals) {
      originals = new Map();
      originalAttributes.set(element, originals);
    }
    translatedAttributes.forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (current !== null && !originals!.has(attribute)) originals!.set(attribute, current);
      const source = originals!.get(attribute);
      if (source !== undefined) {
        element.setAttribute(attribute, language === "zh" ? translateDynamic(source) : source);
      }
    });
  });
}

export function AutoTranslator() {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = language === "zh" ? "EventFlow 考勤管理" : "EventFlow Attendance";
    let frame = 0;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") originalText.delete(mutation.target as Text);
        if (mutation.type === "attributes") originalAttributes.delete(mutation.target as Element);
      });
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        observer.disconnect();
        translateRoot(language);
        observer.observe(document.getElementById("root")!, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: translatedAttributes });
      });
    });

    translateRoot(language);
    const root = document.getElementById("root");
    if (root) observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: translatedAttributes });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [language]);

  return null;
}
