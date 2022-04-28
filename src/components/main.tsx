import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "./helper";
import { formatTimestamp, getCourses, getEntities, getFetchTime } from "../utils";
import { toggleMiniSakai } from "../eventListener";
import { EntityUnion, EntryTab, EntryUnion } from "./entryTab";
import { SettingsChange, SettingsTab } from "./settings";
import _ from "lodash";
import { createFavoritesBarNotification } from "../minisakai";
import { Settings } from "../features/setting/types";
import { getStoredSettings } from "../features/setting/getSetting";
import { saveSettings } from "../features/setting/saveSetting";
import { addFavoritedCourseSites } from "../favorites";
import { getBaseURL } from "../features/api/fetch";

export const MiniSakaiContext = React.createContext<{
    settings: Settings;
}>({
    settings: new Settings()
});

export function MiniSakaiRoot(props: {
    subset: boolean
}): JSX.Element {
    const [settings, setSettings] = useState<Settings>(new Settings());
    const [entities, setEntities] = useState<EntityUnion[]>([]);
    const [entityChangeTrigger, triggerEntityChange] = useState({});

    useEffect(() => {
        getStoredSettings(window.location.hostname).then((s) => setSettings(s));
    }, []);

    useEffect(() => {
        (async () => {
            const _settings = _.cloneDeep(settings);
            const entities = await getEntities(settings, getCourses());
            // TODO: Not working
            const fetchTime = await getFetchTime(settings.appInfo.hostname);
            _settings.setFetchtime(fetchTime);
            setSettings(_settings);
            console.log("_settings", _settings);

            const allEntities = [...entities.assignment, ...entities.quiz, ...entities.memo];
            setEntities(allEntities);
        })();
    }, [entityChangeTrigger]);

    useEffect(() => {
        createFavoritesBarNotification(settings, entities);
    }, [entities]);

    useEffect(() => {
        addFavoritedCourseSites(getBaseURL());
    }, []);

    const onCheck = useCallback((entry: EntryUnion, checked: boolean) => {
        entry.hasFinished = checked;
        entry.save(window.location.hostname)
            .then(() => {
                triggerEntityChange({});
            });
    }, [setEntities, triggerEntityChange]);

    const [shownTab, setShownTab] = useState<"assignment" | "settings">("assignment");
    const [memoBoxShown, setMemoBoxShown] = useState(false);

    const entryTabShown = shownTab === "assignment";
    const settingsTabShown = shownTab === "settings";

    const onSettingsChange = useCallback((change: SettingsChange) => {
        const newSettings = _.cloneDeep(settings);
        if (change.type === "reset-color") {
            const _settings = new Settings();
            newSettings.color = _settings.color;
            saveSettings(settings.appInfo.hostname, newSettings)
                .then(() => {
                    setSettings(newSettings);
                });
            return;
        }

        _.set(newSettings, change.id, change.newValue);
        saveSettings(settings.appInfo.hostname, newSettings)
            .then(() => {
                setSettings(newSettings);
            });
    }, [settings]);

    return (
        <MiniSakaiContext.Provider value={{
            settings: settings
        }}>
            <MiniSakaiLogo />
            <MiniSakaiVersion />
            {(props.subset ? null :
                    (<>
                        <MiniSakaiClose onClose={() => toggleMiniSakai()} /> {/* TODO: replace toggleMiniSakai */}
                        <MiniSakaiTabs
                            onAssignment={() => setShownTab("assignment")}
                            onSettings={() => setShownTab("settings")}
                            selection={shownTab}
                        />
                        {
                            (shownTab === "assignment") ?
                                <>
                                    <button className='cs-add-memo-btn' onClick={() => {
                                        setMemoBoxShown(s => !s);
                                    }}>+
                                    </button>
                                    <MiniSakaiAssignmentTime />
                                    <MiniSakaiQuizTime />
                                </>
                                : null
                        }
                    </>)
            )}
            {entryTabShown ?
                <EntryTab showMemoBox={memoBoxShown} isSubset={props.subset} entities={entities} onCheck={onCheck} />
                : null}
            {settingsTabShown ?
                <SettingsTab settings={settings} onSettingsChange={onSettingsChange} /> : null
            }
        </MiniSakaiContext.Provider>
    );
}

function MiniSakaiLogo() {
    const src = chrome.runtime.getURL("img/logo.png");
    return (
        <img className='cs-minisakai-logo' alt='logo' src={src} />
    );
}

function MiniSakaiVersion() {
    const ctx = useContext(MiniSakaiContext);
    return (
        <p className='cs-version'>Version {ctx.settings.appInfo.version}</p>
    );
}

function MiniSakaiClose(props: { onClose: () => void }) {
    return (
        <a className='closebtn q' href='#' onClick={props.onClose}>x</a>
    );
}

function MiniSakaiTabs(props: {
    onAssignment: () => void,
    onSettings: () => void,
    selection: "assignment" | "settings"
}) {
    const assignmentTab = useTranslation("tab_assignments");
    const settingsTab = useTranslation("tab_settings");
    const assignmentChecked = props.selection === "assignment";
    const settingsChecked = props.selection === "settings";
    return (
        <>
            <input id='assignmentTab' type='radio' name='cs-tab' onClick={props.onAssignment}
                   defaultChecked={assignmentChecked} />
            <label htmlFor='assignmentTab'> {assignmentTab} </label>
            <input id='settingsTab' type='radio' name='cs-tab' onClick={props.onSettings}
                   defaultChecked={settingsChecked} />
            <label htmlFor='settingsTab'> {settingsTab} </label>
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
            <p className='cs-assignment-time-text'>{props.title}</p>
            <p className='cs-assignment-time-text'>{props.time}</p>
        </div>
    );
}

function MiniSakaiAssignmentTime() {
    const ctx = useContext(MiniSakaiContext);
    const title = useTranslation("assignment_acquisition_date");
    const time = formatTimestamp(ctx.settings.fetchTime.assignment);
    return <MiniSakaiTimeBox clazz='cs-assignment-time' title={title} time={time} />;
}

function MiniSakaiQuizTime() {
    const ctx = useContext(MiniSakaiContext);
    const title = useTranslation("testquiz_acquisition_date");
    const time = formatTimestamp(ctx.settings.fetchTime.quiz);
    return <MiniSakaiTimeBox clazz='cs-quiz-time' title={title} time={time} />;
}
