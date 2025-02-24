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

Please critique this portion, included as as "section-to-be-worked-on".
Then make your revisions and put them into an artifact in the artifacts window.`;

function assemblePrompt(manuscript: string, currentSection: string): PromptSection[] {
  console.log('manuscript (first 250 chars):', manuscript.substring(0, 250));
  console.log('currentSection (first 250 chars):', currentSection.substring(0, 250));
  
  return [
    { "project-goals": PROJECT_GOALS_TEXT },
    { "your-task": YOUR_TASK_TEXT },
    { "manuscript-context": manuscript },
    { "section-to-be-worked-on": currentSection }
  ];
}

function testAssemblePrompt(): void {
  const testManuscript = "manuscript";
  const testSection = "section to be worked on";
  
  const result = assemblePrompt(testManuscript, testSection);
  Logger.log("Test result: " + JSON.stringify(result, null, 2));
  
  // Basic validation
  if (result.length !== 4) {
    Logger.log("Error: Expected 4 sections in the prompt, got " + result.length);
    return;
  }
  
  if (result[2]["manuscript-context"] !== testManuscript) {
    Logger.log("Error: Manuscript content mismatch");
    return;
  }
  
  if (result[3]["section-to-be-worked-on"] !== testSection) {
    Logger.log("Error: Section content mismatch");
    return;
  }
  
  Logger.log("Test completed successfully");
}
