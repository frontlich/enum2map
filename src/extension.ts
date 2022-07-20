// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { getEnumMap } from "./transform";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "enum2map" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "enum2map.generate",
    async () => {
      const selection = vscode.window.activeTextEditor?.selection;

      const sourceCode =
        vscode.window.activeTextEditor?.document.getText(selection);

      if (!selection || !sourceCode) {
        return vscode.window.showErrorMessage("no active selection");
      }

      vscode.window.activeTextEditor?.edit((builder) => {
        const enumMap = getEnumMap(sourceCode);
        if (enumMap) {
          builder.insert(
            selection.end,
            `${sourceCode.endsWith("\n") ? "" : "\n"}\n${enumMap}`
          );
        } else {
          vscode.window.showErrorMessage("active selection is not enum");
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
