import { render, screen, fireEvent, within } from "@testing-library/react";
import { useState } from "react";
import "@testing-library/jest-dom";
import { ActionEditor } from "./ActionEditor";
import { ActionNode } from "./types";

const ControlledEditor = ({ initial, onTreeChange }: { initial: ActionNode; onTreeChange?: (tree: ActionNode) => void }) => {
  const [tree, setTree] = useState(initial);
  return (
    <ActionEditor
      action={tree}
      onChange={(next) => {
        setTree(next);
        onTreeChange?.(next);
      }}
    />
  );
};

describe("ActionEditor", () => {
  it("keeps earlier field edits when another field is edited afterwards", () => {
    const onTreeChange = jest.fn();
    render(
      <ControlledEditor
        initial={{ id: "root", type: "log", arguments: { message: "", level: "info", data: "" } }}
        onTreeChange={onTreeChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "hello" } });
    fireEvent.change(screen.getByLabelText("Data"), { target: { value: "payload" } });

    expect(onTreeChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ arguments: { message: "hello", level: "info", data: "payload" } })
    );
  });

  it("keeps earlier edits to a sibling child action", () => {
    const onTreeChange = jest.fn();
    render(
      <ControlledEditor
        initial={{
          id: "root",
          type: "sequence",
          arguments: {
            do: [
              { id: "a", type: "debug", arguments: { message: "" } },
              { id: "b", type: "debug", arguments: { message: "" } },
            ],
          },
        }}
        onTreeChange={onTreeChange}
      />
    );

    const [first, second] = screen.getAllByLabelText("Message");
    fireEvent.change(first, { target: { value: "one" } });
    fireEvent.change(second, { target: { value: "two" } });

    const lastTree = onTreeChange.mock.lastCall[0] as ActionNode;
    expect((lastTree.arguments.do as ActionNode[]).map((child) => child.arguments.message)).toEqual(["one", "two"]);
  });

  it("adds, edits and removes string list items", () => {
    render(<ControlledEditor initial={{ id: "root", type: "delete_from_heap", arguments: { keys: ["x"] } }} />);

    const addButton = screen.getByRole("button", { name: "Add Item" });
    fireEvent.click(addButton);
    expect(addButton).toBeDisabled();

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[1], { target: { value: "y" } });
    expect(addButton).toBeEnabled();

    fireEvent.click(screen.getAllByRole("button", { name: "Remove" })[0]);
    expect(screen.getAllByRole("textbox").map((input) => (input as HTMLInputElement).value)).toEqual(["y"]);
  });

  it("disables inputs and hides edit controls in read-only mode", () => {
    render(<ActionEditor action={{ id: "root", type: "delete_from_heap", arguments: { keys: ["x"] } }} readOnly />);

    expect(screen.getByRole("combobox", { name: /action type/i })).toBeDisabled();
    expect(within(screen.getByRole("textbox").parentElement as HTMLElement).queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add Item" })).not.toBeInTheDocument();
  });
});
