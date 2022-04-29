import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "./helper";
import { formatTimestamp, getCourses, getEntities, updateIsReadFlag } from "../utils";
import { toggleMiniSakai } from "../eventListener";
import { EntityUnion, EntryTab, EntryUnion, MemoAddInfo } from "./entryTab";
import { SettingsChange, SettingsTab } from "./settings";
import _ from "lodash";
import { applyColorSettings, createFavoritesBarNotification } from "../minisakai";
import { Settings } from "../features/setting/types";
import { getStoredSettings } from "../features/setting/getSetting";
import { saveSettings } from "../features/setting/saveSetting";
import { addFavoritedCourseSites } from "../features/favorite";
import { getBaseURL } from "../features/api/fetch";
import { v4 as uuidv4 } from "uuid";
import { MemoEntry } from "../features/entity/memo/types";
import { saveNewMemoEntry } from "../features/entity/memo/saveMemo";

export const MiniSakaiContext = React.createContext<{
    settings: Settings;
}>({
    settings: new Settings()
});

type MiniSakaiRootProps = { subset: boolean };
type MiniSakaiRootState = {
    settings: Settings;
    entities: EntityUnion[];
    shownTab: "assignment" | "settings";
    memoBoxShown: boolean;
};
export class MiniSakaiRoot extends React.Component<MiniSakaiRootProps, MiniSakaiRootState> {
    constructor(props: MiniSakaiRootProps) {
        super(props);
        this.state = {
            settings: new Settings(),
            entities: new Array<EntityUnion>(),
            shownTab: "assignment",
            memoBoxShown: false
        };

        this.onCheck = this.onCheck.bind(this);
        this.onMemoAdd = this.onMemoAdd.bind(this);
        this.onSettingsChange = this.onSettingsChange.bind(this);
    }

    componentDidMount() {
        this.reloadEntities();
    }

    reloadEntities() {
        getEntities(this.state.settings, getCourses()).then((entities) => {
            const allEntities = [...entities.assignment, ...entities.quiz, ...entities.memo];
            this.setState({
                entities: allEntities
            });
            updateIsReadFlag(window.location.href, entities.assignment);
        });
    }

    private onCheck(entry: EntryUnion, checked: boolean) {
        entry.hasFinished = checked;
        entry.save(window.location.hostname).then(() => {
            this.reloadEntities();
        });
    }

    private onMemoAdd(memo: MemoAddInfo) {
        const newMemo = new MemoEntry(uuidv4(), memo.content, memo.due, false);
        saveNewMemoEntry(this.state.settings.appInfo.hostname, newMemo, memo.course).then(() => {
            this.reloadEntities();
        });
    }

    private onSettingsChange(change: SettingsChange) {
        const newSettings = _.cloneDeep(this.state.settings);
        if (change.type === "reset-color") {
            const _settings = new Settings();
            newSettings.color = _settings.color;
            saveSettings(this.state.settings.appInfo.hostname, newSettings).then(() => {
                this.setState({
                    settings: newSettings
                });
            });
            return;
        }

        _.set(newSettings, change.id, change.newValue);
        saveSettings(this.state.settings.appInfo.hostname, newSettings).then(() => {
            this.setState({
                settings: newSettings
            });
        });
    }

    componentDidUpdate(prevProps: MiniSakaiRootProps, prevState: MiniSakaiRootState) {
        if (!_.isEqual(prevState.entities, this.state.entities)) {
            getStoredSettings(window.location.hostname).then((s) => {
                this.setState({
                    settings: s
                });
                addFavoritedCourseSites(getBaseURL()).then(() => {
                    createFavoritesBarNotification(s, this.state.entities);
                });
            });
        }
        if (!_.isEqual(prevState.settings, this.state.settings)) {
            applyColorSettings(this.state.settings);
        }
    }

    render(): React.ReactNode {
        const entryTabShown = this.state.shownTab === "assignment";
        const settingsTabShown = this.state.shownTab === "settings";

        return (
            <MiniSakaiContext.Provider
                value={{
                    settings: this.state.settings
                }}
            >
                <MiniSakaiLogo />
                <MiniSakaiVersion />
                {this.props.subset ? null : (
                    <>
                        <MiniSakaiClose onClose={() => toggleMiniSakai()} /> {/* TODO: replace toggleMiniSakai */}
                        <MiniSakaiTabs
                            onAssignment={() =>
                                this.setState({
                                    shownTab: "assignment"
                                })
                            }
                            onSettings={() =>
                                this.setState({
                                    shownTab: "settings"
                                })
                            }
                            selection={this.state.shownTab}
                        />
                        {this.state.shownTab === "assignment" ? (
                            <>
                                <button
                                    className="cs-add-memo-btn"
                                    onClick={() => {
                                        this.setState((state) => {
                                            return {
                                                memoBoxShown: !state.memoBoxShown
                                            };
                                        });
                                    }}
                                >
                                    +
                                </button>
                                <MiniSakaiAssignmentTime />
                                <MiniSakaiQuizTime />
                            </>
                        ) : null}
                    </>
                )}
                {entryTabShown ? (
                    <EntryTab
                        showMemoBox={this.state.memoBoxShown}
                        isSubset={this.props.subset}
                        entities={this.state.entities}
                        onCheck={this.onCheck}
                        onMemoAdd={this.onMemoAdd}
                    />
                ) : null}
                {settingsTabShown ? (
                    <SettingsTab settings={this.state.settings} onSettingsChange={this.onSettingsChange} />
                ) : null}
            </MiniSakaiContext.Provider>
        );
    }
}

function MiniSakaiLogo() {
    const src = chrome.runtime.getURL("img/logo.png");
    return <img className="cs-minisakai-logo" alt="logo" src={src} />;
}

function MiniSakaiVersion() {
    const ctx = useContext(MiniSakaiContext);
    return <p className="cs-version">Version {ctx.settings.appInfo.version}</p>;
}

function MiniSakaiClose(props: { onClose: () => void }) {
    return (
        <a className="closebtn q" href="#" onClick={props.onClose}>
            x
        </a>
    );
}

function MiniSakaiTabs(props: {
    onAssignment: () => void;
    onSettings: () => void;
    selection: "assignment" | "settings";
}) {
    const assignmentTab = useTranslation("tab_assignments");
    const settingsTab = useTranslation("tab_settings");
    const assignmentChecked = props.selection === "assignment";
    const settingsChecked = props.selection === "settings";
    return (
        <>
            <input
                id="assignmentTab"
                type="radio"
                name="cs-tab"
                onClick={props.onAssignment}
                defaultChecked={assignmentChecked}
            />
            <label htmlFor="assignmentTab"> {assignmentTab} </label>
            <input
                id="settingsTab"
                type="radio"
                name="cs-tab"
                onClick={props.onSettings}
                defaultChecked={settingsChecked}
            />
            <label htmlFor="settingsTab"> {settingsTab} </label>
        </>
    );
}

function MiniSakaiTimeBox(props: { clazz: string; title: string; time: string }) {
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
    const time = formatTimestamp(ctx.settings.fetchTime.assignment);
    return <MiniSakaiTimeBox clazz="cs-assignment-time" title={title} time={time} />;
}

function MiniSakaiQuizTime() {
    const ctx = useContext(MiniSakaiContext);
    const title = useTranslation("testquiz_acquisition_date");
    const time = formatTimestamp(ctx.settings.fetchTime.quiz);
    return <MiniSakaiTimeBox clazz="cs-quiz-time" title={title} time={time} />;
}
