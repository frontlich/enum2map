import * as vscode from "vscode";
import { isEnumMember } from "typescript";
import type { SourceFile, EnumDeclaration } from "typescript";

import { firstChar2lowerCase, getComment, getCommentContent } from "./utils";

export function toOptions(node: EnumDeclaration, sourceFile: SourceFile) {
  const options = vscode.workspace.getConfiguration("enum2map");
  const labelName = options.get("optionsLabel");
  const valueName = options.get("optionsValue");

  const firstToken = node.getFirstToken(sourceFile)?.getFullText(sourceFile);

  const comment = getComment(node, sourceFile);

  let outputCode = `${comment ? `${comment}\n` : ""}${
    firstToken?.endsWith("export") ? "export " : ""
  }const ${
    firstChar2lowerCase(node.name.text)
  }Options: Array<{ ${labelName}: string; ${valueName}: ${
    node.name.text
  } }> = [`;

  const members: string[] = [];
  node.forEachChild((n) => {
    const content = getCommentContent(n, sourceFile);
    if (isEnumMember(n)) {
      const propertyName = n.name.getText(sourceFile);
      members.push(
        `  { ${labelName}: '${content || propertyName}', ${valueName}: ${
          node.name.text
        }.${propertyName} },`
      );
    }
  });
  outputCode += `\n${members.join("\n")}\n]`;

  return outputCode;
}
