interface PromptSection {
  [key: string]: string;
}

const PROJECT_GOALS_TEXT = `Steve Yegge (of Amazon and Google fame) and Gene Kim (of Phoenix Project and DevOps Handbook fame) are working on this book, with tentative titles of:

"The CHOP Handbook: The End Of Programming As We Know It, and Why It Will Be The Best Thing Ever For Developers"

Alternate titles:

"The CHOP Handbook: The Developer's Guide to Chat-Oriented Programming" (*)
"The CHOP Handbook: The Developer's Guide to Leveraging Chat-Oriented Programming To Achieve Superhuman Levels of Greatness"
"The CHOP Handbook: The Fall and Rise of the Happy, Productive Developer"
"The Chat-Oriented Programming Handbook: CHOP as the End of Programming As We Know It, and Why It Will Be The Best Thing Ever"

Claude and any LLMs: Please note: There are certain sections of this manuscript that we love. They are enclosed in XML <exemplar> tags. When asked to generate text, please use these sections for tone, style, etc.

<exemplar>`;

const YOUR_TASK_TEXT = `Study this text.  It's  more difficult to read than i want, the sections seem to blur into each other.  There are some aha moments, but they're kind of lost.

Enclosed in this prompt is "mansuscript-context" which contains the full manscript.  I love Part 1 — the tone, style, inviting nature.

Please critique this portion, included as as "section-to-be-worked-on".`;

function assemblePrompt(manuscript: string): string {
  const promptStructure: PromptSection[] = [
    { "project-goals": PROJECT_GOALS_TEXT },
    { "your-task": YOUR_TASK_TEXT },
    { "manuscript-context": manuscript },
    { "section-to-be-worked-on": "" }
  ];
  
  return JSON.stringify(promptStructure, null, 2);
}
