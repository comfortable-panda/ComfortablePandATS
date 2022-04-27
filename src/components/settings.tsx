import React from "react";
import { Config } from "../settings";
import { useTranslation, useTranslationArgsDeps, useTranslationDeps } from "./helper";

export type SettingsChange = {
    type: 'number',
    id: string,
    newValue: number
} | {
    type: 'string',
    id: string,
    newValue: string
} | {
    type: 'boolean',
    id: string,
    newValue: boolean
} | {
    type: 'reset-color'
};

export function SettingsTab(props: {
    onSettingsChange: (change: SettingsChange) => void,
    config: Config
}) {
    let config = props.config;

    const topColorDangerDesc = useTranslationArgsDeps("settings_colors_hour", ["Tab Bar", "24"], []);
    const topColorWarningDesc = useTranslationArgsDeps("settings_colors_day", ["Tab Bar", "5"], []);
    const topColorSuccessDesc = useTranslationArgsDeps("settings_colors_day", ["Tab Bar", "14"], []);

    const miniColorDangerDesc = useTranslationArgsDeps("settings_colors_hour", ["miniPandA", "24"], []);
    const miniColorWarningDesc = useTranslationArgsDeps("settings_colors_day", ["miniPandA", "5"], []);
    const miniColorSuccessDesc = useTranslationArgsDeps("settings_colors_day", ["miniPandA", "14"], []);

    return (
        <div className="cs-settings-tab">
            <TranslatedBooleanItem
                descriptionTag="settings_color_checked_item"
                value={config.CSsettings.getDisplayCheckedAssignment}
                onChange={(v) => props.onSettingsChange({
                    type: 'boolean',
                    id: 'displayCheckedAssignment',
                    newValue: v
                })} />
            <TranslatedBooleanItem
                descriptionTag="settings_display_late_submit_assignment"
                value={config.CSsettings.getDisplayLateSubmitAssignment}
                onChange={(v) => props.onSettingsChange({
                    type: 'boolean',
                    id: "displayLateSubmitAssignment",
                    newValue: v
                })} />
            <TranslatedNumberItem
                descriptionTag="settings_assignment_cache"
                value={config.CSsettings.getAssignmentCacheInterval}
                onChange={(v) => props.onSettingsChange({
                    type: 'number',
                    id: "assignmentCacheInterval",
                    newValue: v
                })} />
            <TranslatedNumberItem
                descriptionTag="settings_quizzes_cache"
                value={config.CSsettings.getQuizCacheInterval}
                onChange={(v) => props.onSettingsChange({
                    type: 'number',
                    id: "quizCahceInterval",
                    newValue: v
                })} />

            <StringItem
                description={topColorDangerDesc}
                value={config.CSsettings.getTopColorDanger}
                onChange={(v) => props.onSettingsChange({
                    type: 'string',
                    id: "topColorDanger",
                    newValue: v
                })} />
            <StringItem
                description={topColorWarningDesc}
                value={config.CSsettings.getTopColorWarning}
                onChange={(v) => props.onSettingsChange({
                    type: 'string',
                    id: "topColorWarning",
                    newValue: v
                })} />
            <StringItem
                description={topColorSuccessDesc}
                value={config.CSsettings.getTopColorSuccess}
                onChange={(v) => props.onSettingsChange({
                    type: 'string',
                    id: "topColorSuccess",
                    newValue: v
                })} />

            <StringItem
                description={miniColorDangerDesc}
                value={config.CSsettings.getMiniColorDanger}
                onChange={(v) => props.onSettingsChange({
                    type: 'string',
                    id: "miniColorDanger",
                    newValue: v
                })} />
            <StringItem
                description={miniColorWarningDesc}
                value={config.CSsettings.getMiniColorWarning}
                onChange={(v) => props.onSettingsChange({
                    type: 'string',
                    id: "miniColorWarning",
                    newValue: v
                })} />
            <StringItem
                description={miniColorSuccessDesc}
                value={config.CSsettings.getMiniColorSuccess}
                onChange={(v) => props.onSettingsChange({
                    type: 'string',
                    id: "miniColorSuccess",
                    newValue: v
                })} />

            <ResetColorButton
                onClick={() => props.onSettingsChange({
                    type: 'reset-color'
                })}
            />
        </div>
    );
}

function SettingsItem(props: {
    description: string,
    display: boolean,
    children: React.ReactNode,
    labelClass?: string
}) {
    if (!props.display) return null;

    return (
        <div className="cp-settings">
            <p className="cp-settings-text">{props.description}</p>
            <label className={props.labelClass ?? ""}>
                {props.children}
            </label>
        </div>
    );
}

function BooleanItem(props: {
    description: string,
    display?: boolean,
    value: boolean,
    onChange: (newValue: boolean) => void
}) {
    return (
        <SettingsItem
            description={props.description}
            display={props.display ?? true}
            labelClass="cs-toggle-btn">
            <input type="checkbox" checked={props.value} onChange={(ev) => props.onChange(ev.target.checked)}></input>
            <span className="cs-toggle-slider round"></span>
        </SettingsItem>
    );
}

function TranslatedBooleanItem(props: {
    descriptionTag: string,
    display?: boolean,
    value: boolean,
    onChange: (newValue: boolean) => void
}) {
    const description = useTranslationDeps(props.descriptionTag, [props.descriptionTag]);
    return (
        <BooleanItem
            description={description}
            display={props.display}
            value={props.value}
            onChange={props.onChange} />
    );
}

function NumberItem(props: {
    description: string,
    display?: boolean,
    value: number,
    onChange: (newValue: number) => void
}) {
    return (
        <SettingsItem
            description={props.description}
            display={props.display ?? true}>
            <input type="number" className="cp-settings-inputbox" value={props.value} onChange={(ev) => props.onChange(parseInt(ev.target.value))}></input>
        </SettingsItem>
    );
}

function TranslatedNumberItem(props: {
    descriptionTag: string,
    display?: boolean,
    value: number,
    onChange: (newValue: number) => void
}) {
    const description = useTranslationDeps(props.descriptionTag, [props.descriptionTag]);
    return (
        <NumberItem
            description={description}
            display={props.display}
            value={props.value}
            onChange={props.onChange} />
    );
}

function StringItem(props: {
    description: string,
    display?: boolean,
    value: string,
    onChange: (newValue: string) => void
}) {
    return (
        <SettingsItem
            description={props.description}
            display={props.display ?? true}>
            <input type="color" className="cp-settings-inputbox" value={props.value} onChange={(ev) => props.onChange(ev.target.value)}></input>
        </SettingsItem>
    );
}

function TranslatedStringItem(props: {
    descriptionTag: string,
    display?: boolean,
    value: string,
    onChange: (newValue: string) => void
}) {
    const description = useTranslationDeps(props.descriptionTag, [props.descriptionTag]);
    return (
        <StringItem
            description={description}
            display={props.display}
            value={props.value}
            onChange={props.onChange} />
    );
}

function ResetColorButton(props: {
    onClick: () => void
}) {
    const desc = useTranslation("settings_reset_colors");

    return (
        <div className="cp-settings">
            <p className="cp-settings-text">{desc}</p>
            <label>
                <input type="button" value="reset" onClick={props.onClick}></input>
            </label>
        </div>

    );
}