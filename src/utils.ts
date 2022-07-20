import { getLeadingCommentRanges } from "typescript";
import type { Node, SourceFile } from "typescript";

export function getComment(node: Node, sourceFile: SourceFile) {
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

export function getCommentContent(node: Node, sourceFile: SourceFile) {
  const comment = getComment(node, sourceFile);
  return comment2Text(comment);
}
