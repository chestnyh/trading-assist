import { actionTreeToRuleBody, createActionNode, parseRuleBodyToActionTree } from "./actionTree";

describe("actionTree", () => {
  it("creates nodes with the action's default arguments", () => {
    expect(createActionNode("log").arguments).toEqual({ message: "", level: "info" });
  });

  it("round-trips a nested rule body", () => {
    const ruleBody = {
      type: "if_then",
      arguments: {
        if: { type: "resolve", arguments: { expression: "a > b", saveTo: "result" } },
        then: [{ type: "binance_spot_get_klines", arguments: { symbol: "ETHUSDT", interval: "5m", limit: 10 } }],
      },
    };

    const tree = parseRuleBodyToActionTree(ruleBody);

    expect(tree && actionTreeToRuleBody(tree)).toEqual(ruleBody);
  });

  it("drops empty optional arguments and fills missing child slots", () => {
    const tree = createActionNode("timeout");
    tree.arguments.timeout = 500;

    expect(actionTreeToRuleBody(createActionNode("resolve"))).toEqual({ type: "resolve", arguments: { expression: "" } });
    expect(actionTreeToRuleBody(tree)).toEqual({ type: "timeout", arguments: { timeout: 500, do: null } });
  });

  it("falls back to defaults for arguments of the wrong kind", () => {
    const tree = parseRuleBodyToActionTree({ type: "timeout", arguments: { timeout: "soon", do: { type: "stop_sequence" } } });

    expect(tree?.arguments.timeout).toBe(90000);
  });

  it("rejects unknown action types", () => {
    expect(parseRuleBodyToActionTree({ type: "unknown", arguments: {} })).toBeNull();
    expect(parseRuleBodyToActionTree({ type: "sequence", arguments: { do: [{ type: "unknown" }] } })).toBeNull();
  });
});
