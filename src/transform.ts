import * as vscode from "vscode";
import { isEnumDeclaration, createSourceFile, ScriptTarget } from "typescript";
import type { Node, EnumDeclaration, SourceFile } from "typescript";

import { toRecord } from "./toRecord";
import { toMap } from "./toMap";
import { toOptions } from "./toOptions";

export function transform(
  sourceCode: string,
  convert: (node: EnumDeclaration, sourceFile: SourceFile) => string
) {
  const sourceFile = createSourceFile(
    "file.ts", // filePath
    sourceCode, // fileText
    ScriptTarget.Latest
  );

  const output: string[] = [];

  function visit(node: Node) {
    if (isEnumDeclaration(node)) {
      const code = convert(node, sourceFile);
      output.push(code);
    }

    node.forEachChild(visit);
  }

  visit(sourceFile);

  return output.join("\n\n");
}

function createGenerator(
  convert: (node: EnumDeclaration, sourceFile: SourceFile) => string
) {
  return function () {
    const selection = vscode.window.activeTextEditor?.selection;

    const sourceCode =
      vscode.window.activeTextEditor?.document.getText(selection);

    if (!selection || !sourceCode) {
      return vscode.window.showErrorMessage("no active selection");
    }

    vscode.window.activeTextEditor?.edit((builder) => {
      const outputCode = transform(sourceCode, convert);
      if (outputCode) {
        builder.insert(
          selection.end,
          `${sourceCode.endsWith("\n") ? "" : "\n"}\n${outputCode}`
        );
      } else {
        vscode.window.showErrorMessage("active selection is not enum");
      }
    });
  };
}

export const generateMap = createGenerator(toMap);
export const generateRecord = createGenerator(toRecord);
export const generateOptions = createGenerator(toOptions);
