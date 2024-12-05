// FILEPATH: /Users/hisashi/Documents/chrome-app/chrome-app-env-identification/src/ts/tests/optionClass.test.ts
import OptionClass from "../optionClass";

describe("OptionClass", () => {
  describe("validateHttpOrHttps", () => {
    it("should return -1 when all envSettings have http or https", () => {
      const optionClass = new OptionClass();
      const envSettings = [
        {
          projectName: "test",
          envName: "test",
          envUrl: "http://example.com",
          message: "test",
          color: "test",
          labelPosition: "test",
          activeFlag: true,
        },
        {
          projectName: "test",
          envName: "test",
          envUrl: "https://example.com",
          message: "test",
          color: "test",
          labelPosition: "test",
          activeFlag: true,
        },
      ];
      const result = optionClass.validateHttpOrHttps(envSettings);
      expect(result).toEqual(-1);
    });

    it("should return the index of the first envSetting without http or https", () => {
      const optionClass = new OptionClass();
      const envSettings = [
        {
          projectName: "test",
          envName: "test",
          envUrl: "http://example.com",
          message: "test",
          color: "test",
          labelPosition: "test",
          activeFlag: true,
        },
        {
          projectName: "test",
          envName: "test",
          envUrl: "ftp://example.com",
          message: "test",
          color: "test",
          labelPosition: "test",
          activeFlag: true,
        },
        {
          projectName: "test",
          envName: "test",
          envUrl: "https://example.com",
          message: "test",
          color: "test",
          labelPosition: "test",
          activeFlag: true,
        },
      ];
      const result = optionClass.validateHttpOrHttps(envSettings);
      expect(result).toEqual(1);
    });

    it("should return 0 when all envSettings do not have http or https", () => {
      const optionClass = new OptionClass();
      const envSettings = [
        {
          projectName: "test",
          envName: "test",
          envUrl: "ftp://example.com",
          message: "test",
          color: "test",
          labelPosition: "test",
          activeFlag: true,
        },
        {
          projectName: "test",
          envName: "test",
          envUrl: "ws://example.com",
          message: "test",
          color: "test",
          labelPosition: "test",
          activeFlag: true,
        },
      ];
      const result = optionClass.validateHttpOrHttps(envSettings);
      expect(result).toEqual(0);
    });
  });
});
