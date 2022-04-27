import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Config, DefaultSettings, loadConfigs } from "../settings";
import React from 'react';
import { useTranslation } from "./helper";
import { formatTimestamp } from "../utils";
import { toggleMiniSakai } from "../eventListener";
import { EntityUnion, EntryTab } from "./entryTab";
import { SettingsChange, SettingsTab } from "./settings";
import _ from 'lodash';
import { saveToLocalStorage } from "../storage";

export const MiniSakaiContext = React.createContext<{
    config: Config | null
}>({
    config: null
});

export function MiniSakaiRoot(props: {
    subset: boolean,
    entities: EntityUnion[]
}): JSX.Element {
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        loadConfigs().then((c) => setConfig(c));
    }, []);

    const [shownTab, setShownTab] = useState<'assignment' | 'settings'>('assignment');
    const [memoBoxShown, setMemoBoxShown] = useState(false);

    const entryTabShown = shownTab === 'assignment';
    const settingsTabShown = shownTab === 'settings';

    const onSettingsChange = useCallback((change: SettingsChange) => {
        if (config === null) return;
        const copiedConfig = _.cloneDeep(config);

        if (change.type === 'reset-color') {
            const colorList = [
                "topColorDanger", "topColorWarning", "topColorSuccess",
                "miniColorDanger", "miniColorWarning", "miniColorSuccess"
            ];
            for (const k of colorList) {
                (copiedConfig.CSsettings as any)[k] = (DefaultSettings as any)[k];
            }
            saveToLocalStorage("CS_Settings", copiedConfig.CSsettings)
                .then(() => {
                    setConfig(copiedConfig);
                });
            return;
        }

        (copiedConfig.CSsettings as any)[change.id] = change.newValue;
        saveToLocalStorage("CS_Settings", copiedConfig.CSsettings)
            .then(() => {
                setConfig(copiedConfig);
            });
    }, [config]);

    return (
        <MiniSakaiContext.Provider value={{
            config: config
        }}>
            <MiniSakaiLogo />
            <MiniSakaiVersion />
            {(props.subset ? null :
                (<>
                    <MiniSakaiClose onClose={() => toggleMiniSakai()} /> {/* TODO: replace toggleMiniSakai */}
                    <MiniSakaiTabs
                        onAssignment={() => setShownTab('assignment')}
                        onSettings={() => setShownTab('settings')}
                        selection={shownTab}
                    />
                    {
                        (shownTab === 'assignment') ?
                            <>
                                <button className="cs-add-memo-btn" onClick={() => {
                                    setMemoBoxShown(s => !s);
                                }}>+</button>
                                <MiniSakaiAssignmentTime />
                                <MiniSakaiQuizTime />
                            </>
                            : null
                    }
                </>)
            )}
            {entryTabShown ?
                <EntryTab showMemoBox={memoBoxShown} isSubset={props.subset} entities={props.entities} />
                : null}
            {settingsTabShown && config !== null ?
                <SettingsTab config={config} onSettingsChange={onSettingsChange} /> : null
            }
        </MiniSakaiContext.Provider>
    );
}

function MiniSakaiLogo() {
    const src = chrome.runtime.getURL("img/logo.png");
    return (
        <img className="cs-minisakai-logo" alt="logo" src={src} />
    );
}

function MiniSakaiVersion() {
    const ctx = useContext(MiniSakaiContext);
    return (
        <p className="cs-version">Version {ctx.config === null ? "" : ctx.config.version}</p>
    );
}

function MiniSakaiClose(props: { onClose: () => void }) {
    return (
        <a className="closebtn q" href="#" onClick={props.onClose}>x</a>
    );
}

function MiniSakaiTabs(props: {
    onAssignment: () => void,
    onSettings: () => void,
    selection: 'assignment' | 'settings'
}) {
    const assignmentTab = useTranslation("tab_assignments");
    const settingsTab = useTranslation("tab_settings");
    const assignmentChecked = props.selection === 'assignment';
    const settingsChecked = props.selection === 'settings';
    return (
        <>
            <input id="assignmentTab" type="radio" name="cs-tab" onClick={props.onAssignment} defaultChecked={assignmentChecked} />
            <label htmlFor="assignmentTab"> {assignmentTab} </label>
            <input id="settingsTab" type="radio" name="cs-tab" onClick={props.onSettings} defaultChecked={settingsChecked} />
            <label htmlFor="settingsTab"> {settingsTab} </label>
        </>
    );
}

function MiniSakaiTimeBox(props: {
    clazz: string,
    title: string,
    time: string
}) {
    return (
        <div className={props.clazz}>
            <p className="cs-assignment-time-text">{props.title}</p>
            <p className="cs-assignment-time-text">{props.time}</p>
        </div>
    );
}

function MiniSakaiAssignmentTime() {
    const ctx = useContext(MiniSakaiContext);
    const title = useTranslation("assignment_acquisition_date");
    const time = ctx.config === null ? "" : formatTimestamp(ctx.config.fetchedTime.assignment);
    return <MiniSakaiTimeBox clazz="cs-assignment-time" title={title} time={time} />
}

function MiniSakaiQuizTime() {
    const ctx = useContext(MiniSakaiContext);
    const title = useTranslation("testquiz_acquisition_date");
    const time = ctx.config === null ? "" : formatTimestamp(ctx.config.fetchedTime.quiz);
    return <MiniSakaiTimeBox clazz="cs-quiz-time" title={title} time={time} />
}
