/**
 * @jest-environment jsdom
 */

import { mockAssignmentEntry } from "./mock/generator";
import { Settings } from "../features/setting/types";
import { getClosestTime } from "../utils";
import { EntryProtocol } from "../features/entity/type";
import { MaxTimestamp } from "../constant";

const mockVersion = jest.fn();
jest.mock("../constant", () => ({
    get VERSION() {
        return mockVersion();
    },
    get MaxTimestamp() {
        return 99999999999999;
    }
}));

describe("getFetchTime(showCompleted)", () => {
    test("All greater than or equal to currentTime", () => {
        const settings = new Settings();
        settings.miniSakaiOption = {
            showCompletedEntry: true,
            showLateAcceptedEntry: false
        };
        settings.appInfo.currentTime = 100;
        const input: Array<EntryProtocol> = [
            mockAssignmentEntry("id1", 300, 100, false),
            mockAssignmentEntry("id2", 200, 100, false),
            mockAssignmentEntry("id3", 100, 100, false)
        ];
        const output = getClosestTime(settings, input);
        expect(output).toBe(100);
    });

    test("Some older than currentTime", () => {
        const settings = new Settings();
        settings.miniSakaiOption = {
            showCompletedEntry: true,
            showLateAcceptedEntry: false
        };
        settings.appInfo.currentTime = 100;
        const input: Array<EntryProtocol> = [
            mockAssignmentEntry("id1", 300, 100, false),
            mockAssignmentEntry("id2", 200, 100, false),
            mockAssignmentEntry("id3", 50, 100, false)
        ];
        const output = getClosestTime(settings, input);
        expect(output).toBe(200);
    });

    test("All older than currentTime", () => {
        const settings = new Settings();
        settings.miniSakaiOption = {
            showCompletedEntry: true,
            showLateAcceptedEntry: false
        };
        settings.appInfo.currentTime = 500;
        const input: Array<EntryProtocol> = [
            mockAssignmentEntry("id1", 300, 100, false),
            mockAssignmentEntry("id2", 200, 100, false),
            mockAssignmentEntry("id3", 50, 100, false)
        ];
        const output = getClosestTime(settings, input);
        expect(output).toBe(MaxTimestamp);
    });
});
