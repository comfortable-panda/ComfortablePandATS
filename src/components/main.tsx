import { useContext, useEffect, useMemo, useState } from "react";
import { Config, loadConfigs } from "../settings";
import React from 'react';
import { useTranslation } from "./helper";
import { formatTimestamp } from "../utils";
import { toggleMiniSakai } from "../eventListener";
import { EntityUnion, EntryTab } from "./entryTab";

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
    onSettings: () => void
}) {
    const assignmentTab = useTranslation("tab_assignments");
    const settingsTab = useTranslation("tab_settings");
    return (
        <>
            <input id="assignmentTab" type="radio" name="cs-tab" onClick={props.onAssignment} />
            <label htmlFor="assignmentTab"> {assignmentTab} </label>
            <input id="settingsTab" type="radio" name="cs-tab" onClick={props.onSettings} />
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
