import {
  getLeadingCommentRanges,
  isEnumMember,
  isEnumDeclaration,
  createSourceFile,
  ScriptTarget,
} from "typescript";
import type { Node, SourceFile, EnumDeclaration } from "typescript";

function getComment(node: Node, sourceFile: SourceFile) {
  const fullText = sourceFile.getFullText();
  const commentRanges = getLeadingCommentRanges(fullText, node.getFullStart());
  if (commentRanges?.length) {
    const commentStrings = commentRanges.map((r) =>
      fullText.slice(r.pos, r.end)
    );
    return commentStrings[commentStrings.length - 1];
  }
  return "";
}

function comment2Text(comment: string) {
  return comment.replace(/[\/\*\s]/g, "").trim();
}

function enumNode2Code(node: EnumDeclaration, sourceFile: SourceFile) {
  const firstToken = node.getFirstToken(sourceFile)?.getFullText(sourceFile);

  const comment = getComment(node, sourceFile);

  let outputCode = `${comment ? `${comment}\n` : ""}${
    firstToken?.endsWith("export") ? "export " : ""
  }const ${node.name.text}Map: Record<${node.name.text}, string> = {`;

  const members: string[] = [];
  node.forEachChild((n) => {
    const comment = getComment(n, sourceFile);
    const text = comment2Text(comment);
    if (isEnumMember(n)) {
      const propertyName = n.name.getText(sourceFile);
      members.push(
        `  [${node.name.text}.${propertyName}]: '${text || propertyName}',`
      );
    }
  });
  outputCode += `\n${members.join("\n")}\n}`;

  return outputCode;
}

export function getEnumMap(sourceCode: string) {
  const sourceFile = createSourceFile(
    "file.ts", // filePath
    sourceCode, // fileText
    ScriptTarget.Latest
  );

  const output: string[] = [];

  function visit(node: Node) {
    if (isEnumDeclaration(node)) {
      const code = enumNode2Code(node, sourceFile);
      output.push(code);
    }

    node.forEachChild(visit);
  }

  visit(sourceFile);

  return output.join("\n\n");
}
