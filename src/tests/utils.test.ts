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

describe("getFetchTime", () => {
    test("Has no old assignment", () => {
        const settings = new Settings();
        settings.miniSakaiOption = {
            showCompletedEntry: false,
            showLateAcceptedEntry: false
        };
        settings.appInfo.currentTime = 100000;
        const input: Array<EntryProtocol> = [
            mockAssignmentEntry("id1", 300, 100, false),
            mockAssignmentEntry("id2", 200, 100, false),
            mockAssignmentEntry("id3", 100, 100, false)
        ];
        console.log("result", settings, MaxTimestamp);
        const output = getClosestTime(settings, input);
        expect(output).toBe(100);
    });
});
