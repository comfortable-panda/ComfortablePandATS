import { useMemo } from "react";

export function useTranslation(tag: string): string {
    return useMemo(() => {
        return chrome.i18n.getMessage(tag);
    }, []);
}

export function useTranslationDeps(tag: string, deps: React.DependencyList) {
    return useMemo(() => {
        return chrome.i18n.getMessage(tag);
    }, deps);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTranslationArgsDeps(tag: string, args: any[], deps: React.DependencyList) {
    return useMemo(() => {
        return chrome.i18n.getMessage(tag, args);
    }, deps);
}
