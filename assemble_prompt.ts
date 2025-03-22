interface PromptSection {
  [key: string]: string;
}

const PART1_SUMMARY =
`

When working on Part 2 of "The Vibe Coding Handbook," please maintain continuity with Part 1 by following this essential framework and writing style guidance:

## Part 1 Framework Summary

1. **Outline/Structure of Part 1**:
   - Preface: Steve and Gene's personal aha moments with AI coding
   - Chapter 3: The Major Shift in Programming Happening Now
   - Chapter 4: Seven Decades of Technology Revolutions
   - Chapter 5: AI Changing All Knowledge Work
   - Chapter 6: Who This Book Is For
   - Chapter 7: What Becomes More Important in a World of Coding AI
   - Chapter 8: Pairing vs. Delegation with AI
   - Chapter 9: The Value That Vibe Coding Creates (FAAFO)

2. **Key Terminology**:
   - "Vibe coding": Karpathy's casual "turn your brain off" approach
   - "Vibe engineering": Our disciplined approach maintaining engineering rigor
   - The kitchen/chef metaphor: You as head chef, AI as sous chef

3. **The FAAFO Framework**:
   - Fast: Writing code significantly faster
   - Ambitious: Tackling previously unattainable projects
   - Alone: Accomplishing multi-person tasks independently
   - Fun: Making programming more enjoyable
   - Optionality: Exploring multiple approaches before committing

4. **Our Middle-Path Position**:
   Between skeptics (Humphreys) and enthusiasts (Brin, Karpathy)

5. **Three Critical Elements**:
   - Architecture enabling independence of action
   - Fast feedback loops for quality assessment
   - Human judgment guiding AI capabilities

6. **Pairing vs. Delegation Spectrum**:
   From full delegation (rare) to active pairing (most common)

## Style and Tone Guidance

Please emulate the style and tone of these exemplary sections from Part 1:

### Exemplar 1: The Master Chef Metaphor
"Let's explore what it means to do vibe engineering. Whether you've been programming for decades or are returning after years away, this new paradigm requires us to reimagine our relationship with software creation from the ground up.

The first time you sit down to program with an AI assistant, you might feel a bit like a head chef being paired with a brilliant but occasionally erratic sous chef who has somehow memorized every cookbook ever written. This new partner can work incredibly fast and has encyclopedic knowledge, but also occasionally suggests using ingredients that don't exist or insists on techniques that make no sense.

Your AI sous chef has essentially read everything on the internet, can generate code in seconds that might take you hours, and never gets tired or frustrated. You can suddenly tackle projects that would have required an entire team. Five-year projects become feasible in five months, maybe even five weeks. You can explore multiple solution paths simultaneously instead of committing to just one. Perhaps most importantly, you'll likely find yourself having more fun as you're liberated from tedious implementation details to focus on creative problem-solving."

### Exemplar 2: Writing in First Person Plural
"We believe vibe coding creates five dimensions of value that together revolutionize what individual developers can accomplish — and therefore, it also impacts the organizations they are part of. To help you remember, we call these dimensions FAAFO — fast, ambitious, alone, fun, and optionality.

First, vibe coding helps you write code faster. Tasks that once took days can often be completed in hours. The acceleration comes not just from code generation, but from having an intelligent assistant to help with debugging, testing, and documentation."

### Exemplar 3: Personal Stories and Direct Address
"For both of us, these aren't just theoretical benefits—they've transformed our lives in deeply personal ways. Steve, after watching his beloved game Wyvern with over thirty years of unfixed bugs and aspirations, suddenly found a path to tackle them in the 4MM+ LoC codebase. For Gene, vibe engineering reopened doors to coding that had seemed closed since 1998, enabling him to write more code in 2024 than in any previous year of his career."

## Style Elements to Maintain:
1. Use first person plural ("we believe," "we suggest") for statements of opinion or guidance
2. Use vivid metaphors and examples, especially extending the kitchen/chef comparison
3. Address the reader directly ("you") when describing their experiences or providing advice
4. Balance technical precision with accessible language for readers of varying backgrounds
5. Include practical, concrete examples that illustrate abstract concepts
6. Maintain a tone that is enthusiastic but grounded in engineering reality
7. Use storytelling to illustrate key points, drawing from your experiences when relevant
8. Inject occasional humor while maintaining overall professionalism

Please use this framework and style guidance to inform the practical "how-to" focus of Part 2, ensuring consistency with Part 1 while avoiding unnecessary repetition of background material.
`

// ====

const PROJECT_GOALS_TEXT = `Steve Yegge (of Amazon and Google fame) and Gene Kim (of Phoenix Project and DevOps Handbook fame) are working on this book, with tentative titles of:

"The Vibe Coding Handbook: How To Engineer Production-Grade Software With GenAI, Chat, Agents, and Beyond"

Claude and any LLMs: Please note: There are certain sections of this manuscript that we love. They are enclosed in XML <exemplar> tags. When asked to generate text, please use these sections for tone, style, etc.

<exemplar>`;

const YOUR_TASK_TEXT = `Study this text.  It's  more difficult to read than i want, the sections seem to blur into each other.  There are some aha moments, but they're kind of lost.

Enclosed in this prompt is "mansuscript-context" which contains the full manscript.  I love Part 1 — the tone, style, inviting nature.

Please critique this portion, included as as "section-to-be-worked-on".
Then make your revisions and put them into an artifact in the artifacts window.`;

function assemblePrompt(manuscript: string, currentSection: string): PromptSection[] {
  console.log('manuscript (first 250 chars):', manuscript.substring(0, 250));
  console.log('currentSection (first 250 chars):', currentSection.substring(0, 250));
  
  // Check if this is Part 2 content
  const isPart2 = manuscript.startsWith('# Part 2');
  
  // Create base prompt sections
  const promptSections = [
    { "project-goals": PROJECT_GOALS_TEXT },
    { "your-task": YOUR_TASK_TEXT }
  ];
  
  // Handle Part 2 differently - add part1-summary as a separate field
  if (isPart2) {
    promptSections.push({ "part1-summary": PART1_SUMMARY });
    promptSections.push({ "manuscript-context": manuscript });
  } else {
    promptSections.push({ "manuscript-context": manuscript });
  }
  
  // Always add the section to be worked on
  promptSections.push({ "section-to-be-worked-on": currentSection });
  
  return promptSections;
}

function testAssemblePrompt(): void {
  // Test with regular content
  const testManuscript = "manuscript";
  const testSection = "section to be worked on";
  
  const result = assemblePrompt(testManuscript, testSection);
  Logger.log("Test result (regular content): " + JSON.stringify(result, null, 2));
  
  // Basic validation for regular content
  if (result.length !== 4) {
    Logger.log("Error: Expected 4 sections in the prompt, got " + result.length);
    return;
  }
  
  if (result[2]["manuscript-context"] !== testManuscript) {
    Logger.log("Error: Manuscript content mismatch for regular content");
    return;
  }
  
  if (result[3]["section-to-be-worked-on"] !== testSection) {
    Logger.log("Error: Section content mismatch");
    return;
  }
  
  // Test with Part 2 content
  const testPart2Manuscript = "# Part 2\n\nSome part 2 content";
  
  const resultPart2 = assemblePrompt(testPart2Manuscript, testSection);
  Logger.log("Test result (Part 2 content): " + JSON.stringify(resultPart2, null, 2));
  
  // Validate Part 2 handling - should have 5 sections with part1-summary
  if (resultPart2.length !== 5) {
    Logger.log("Error: Expected 5 sections in Part 2 prompt, got " + resultPart2.length);
    return;
  }
  
  // Check for part1-summary field
  if (!resultPart2[2]["part1-summary"]) {
    Logger.log("Error: No part1-summary field found in Part 2 prompt");
    return;
  }
  
  if (resultPart2[2]["part1-summary"] !== PART1_SUMMARY) {
    Logger.log("Error: Part 1 summary content mismatch");
    return;
  }
  
  // Check manuscript-context contains only Part 2 content
  if (resultPart2[3]["manuscript-context"] !== testPart2Manuscript) {
    Logger.log("Error: Manuscript context should contain only Part 2 content");
    return;
  }
  
  Logger.log("All tests completed successfully");
}
