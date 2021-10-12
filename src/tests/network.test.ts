/**
 * @jest-environment jsdom
 */
import { getAssignmentByCourseID } from "../network";

type MockXHR = {
  open: jest.Mock;
  send: jest.Mock;
  setRequestHeader: jest.Mock;
  addEventListener: jest.Mock;
  readyState: number;
  responseText: string;
}

const createMockXHR = (responseJSON?: JSON, responseType?: string) => {
  return {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    addEventListener: jest.fn(),
    readyState: 4,
    responseType: responseType || "",
    responseText: JSON.stringify(responseJSON || {}),
  };
};

describe("testapi()", (): void => {
  const oldXMLHttpRequest = window.XMLHttpRequest;
  let mockXHR: MockXHR | null = null;

  beforeEach(() => {
    mockXHR = createMockXHR();
    // @ts-ignore
    window.XMLHttpRequest = jest.fn(() => mockXHR);
  });

  afterEach(() => {
    window.XMLHttpRequest = oldXMLHttpRequest;
  });

  test("api", async (): Promise<void> => {
    const a = getAssignmentByCourseID("", "");
    // @ts-ignore
    mockXHR.responseText = JSON.stringify({ mes: "success" });
    // @ts-ignore
    mockXHR.addEventListener("load", () => {
      return "w";
    });
    a.then((res) => {
      console.log(res);
      expect(res).toBe("a");
    });

    // expect(await getAssignmentByCourseID("", "")).toBe("");
  });
});