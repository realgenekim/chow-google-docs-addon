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

const PART2_SUMMARY =
`

# Essential Framework of "The Vibe Coding Handbook" Part 2: The How of Vibe Coding

## Structure and Progression

Part 2 shifts from the "why" of vibe coding to the practical "how," presenting a journey through implementation that follows a natural progression:

The authors first address the **dramatic shift in mindset** required to make the leap from manual coding to vibe coding. They emphasize that treating AI as a teammate rather than a tool is crucial for success. The book then progresses through increasingly sophisticated tooling options, from simple chatbots to full-featured coding assistants and finally to semi-autonomous coding agents.

The narrative mirrors the actual evolution of AI coding tools, showing how each advance builds on previous capabilities while introducing new challenges. This evolution follows three overlapping waves:
1. Manual coding (traditional development)
2. Chat coding (conversational development with AI)
3. Agentic coding (delegating to semi-autonomous AI agents)

Despite rapid advances in AI coding capabilities, the authors emphasize that all three approaches remain relevant, with vibe coding techniques applicable across the spectrum.

## Core Terminology and Conceptual Distinctions

Part 2 clarifies important distinctions that are essential for effective implementation:

**Vibe Coding vs. Vibe Engineering**: While both involve AI collaboration, vibe coding represents Karpathy's casual, "turn your brain off" approach best suited for prototyping and personal projects. Vibe engineering maintains rigorous standards while leveraging AI capabilities, making it appropriate for production systems.

**Chatbots, Coding Assistants, and Agents** form a progression of increasing capability and autonomy:
- **Chatbots** like ChatGPT and Claude lack specific code context but offer large screen real estate and superior conversation management
- **Coding Assistants** provide deep understanding of your codebase through indexing and integration with your IDE
- **Coding Agents** can execute multi-step tasks with minimal supervision, effectively turning individual developers into teams

The book documents the surprising reality that ChatGPT remains the #1 coding assistant worldwide despite its limitations, showing how screen real estate and conversation management compensate for lack of code context.

## Key Practical Frameworks

Several practical frameworks form the backbone of effective vibe coding implementation:

**The Chat Mindset** reframes the developer-AI relationship as pair programming rather than tool usage. The AI is a human-like partner with strengths and weaknesses who complements your skills, not a deterministic tool to be used once and discarded if it fails.

**Task Graphs** provide a mental model for breaking complex projects into manageable chunks that AI can tackle. The authors introduce the concept of "leaf nodes" – small, independent tasks that AI can accelerate 10-100x. Large-scale projects require decomposition into these smaller tasks, even as AI capabilities grow.

**Prompt and Context Management** techniques help optimize AI interactions:
- Initial prompts should be proportionally sized to the problem complexity
- Reusable "prompt chunks" with different lifetimes can be stored in prompt libraries
- Context selection becomes more important as projects grow beyond what can fit in a single query

**Validation and Verification** approaches ensure AI-generated code is correct and appropriate:
- LLMs should review their own work through iterative refinement
- Multiple models can cross-check each other's output (while being aware of bias)
- Traditional testing and verification remain essential

**Agent Management Strategies** introduce the concept of orchestrating multiple AI agents simultaneously:
- Current interfaces make multi-agent management challenging
- Reading comprehension becomes a limiting factor
- Future tools will enable developers to oversee dozens of agents concurrently

## Practical Implementation Guidance

The book provides actionable guidance for implementing vibe coding effectively:

**When to Choose Chatbots vs. Coding Assistants**:
- Use chatbots for smaller projects where the whole codebase fits in context
- Switch to coding assistants when projects grow beyond what fits in a single query
- Consider factors like screen real estate, conversation management, and context fetching

**Context Management Techniques**:
- For small projects, upload the entire repo as context
- For larger projects, selectively include relevant modules
- Use @-mentions to reference specific code elements
- Implement custom RAG (Retrieval-Augmented Generation) for enterprise systems

**Code Validation Approaches**:
- Ask the AI to critique its own code (self-review)
- Use multiple models to cross-check solutions (avoiding the "Multiple Witness Effect")
- Leverage IDE tools for early detection of issues
- Fix bugs as early as possible in the development cycle

**Automation with Agents**:
- Break tasks into well-defined chunks with clear success criteria
- Maintain appropriate supervision based on task complexity
- Create specialized "task machines" for recurring workflows
- Consider parallel deployment of multiple agents for greater productivity

## Illustrative War Stories and Examples

The authors share revealing personal experiences that highlight both pitfalls and successes:

**Steve's Ruby-to-Kotlin Port**: A seemingly straightforward task of porting a 3,500-line Ruby script to Kotlin reveals the limitations of LLMs when dealing with Gradle configuration. This demonstrates the importance of knowing when to fold your cards and switch approaches when the AI gets stuck in circular reasoning.

**Steve's Embarrassing TypeScript Code**: A complex but pointless asynchronous function approved by an LLM turned out to be equivalent to a simple one-liner, highlighting the need to ask the AI about code elegance and simplicity.

**Gene and Steve's Pair Programming Session**: Using a mix of chatbot and coding assistant tools to modify a Clojure project demonstrates how different AI tools excel at different aspects of development, and how combining them creates a powerful workflow.

These real-world examples illustrate common failure modes to watch for:
- LLMs confidently generating needlessly complex code
- Getting stuck in loops of incorrect suggestions
- Hitting context window limitations
- Failing to recognize when a task exceeds AI capabilities

The stories also demonstrate successful strategies:
- Breaking problems into appropriate chunks
- Knowing when to switch between AI tools
- Using multiple models for verification
- Maintaining a healthy skepticism while still leveraging AI capabilities

## Conclusion

Part 2 provides a comprehensive roadmap for implementing vibe coding in real-world development. It acknowledges the current limitations while demonstrating how to maximize the benefits available today. The techniques presented will remain relevant even as AI tools evolve, since the fundamental approach of effective collaboration with AI assistants applies regardless of how autonomous they become.

The authors conclude that while programming is changing dramatically, the essence remains: creating software that delivers value. Vibe coding just makes it exponentially faster and more accessible, allowing developers to focus on higher-level concerns while delegating implementation details to their AI partners.

`

// ====

const PROJECT_GOALS_TEXT = `
Steve Yegge (of Amazon and Google fame) and Gene Kim (of Phoenix Project and DevOps Handbook fame) are working on this book, with tentative titles of:

"The Vibe Coding Handbook: How To Engineer Production-Grade Software With GenAI, Chat, Agents, and Beyond"

Claude and any LLMs: Please note: There are certain sections of this manuscript that we love. They are enclosed in XML <exemplar> tags. When asked to generate text, please use these sections for tone, style, etc.

<exemplar>
`;

const YOUR_TASK_TEXT = 
`Study this text.  It's  more difficult to read than i want, the sections seem to blur into each other.  There are some aha moments, but they're kind of lost.

Enclosed in this prompt is "mansuscript-context" which contains the full manscript.  I love Part 1 — the tone, style, inviting nature.

Please critique this portion, included as as "section-to-be-worked-on".
Then make your revisions and put them into an artifact in the artifacts window.
Only output into Artifacts the the section to be worked on.
`;

// Export this variable to make it accessible in main.ts
// Changed from object to array of objects to preserve order
const PROMPTS = [
  { 
    id: "put-in-artifacts", 
    label: "Put in Artifacts", 
    text: YOUR_TASK_TEXT 
  },
  { 
    id: "generate-3-options", 
    label: "Generate 3 Options", 
    text: `
    Study this text. 
    Enclosed in this prompt is "manuscript-context" which contains the full manscript.  I love Part 1 — the tone, style, inviting nature.

    We're going to work on "section-to-be-worked-on".  Put this into the Artifacts window unchanged.

    In the chat window, critique it, and then generate options for this text in the chat session.
    `
  }
]

function assemblePrompt(manuscript: string, currentSection: string): PromptSection[] {
  console.log('manuscript (first 250 chars):', manuscript.substring(0, 250));
  console.log('currentSection (first 250 chars):', currentSection.substring(0, 250));
  
  // Check what part we're dealing with
  const isPart2 = manuscript.startsWith('# Part 2');
  const isPart3 = manuscript.startsWith('# Part 3');
  
  // Create base prompt sections
  const promptSections = [
    { "project-goals": PROJECT_GOALS_TEXT },
    { "your-task": YOUR_TASK_TEXT }
  ];
  
  // Include the summaries for Part 2 and Part 3
  if (isPart2) {
    // For Part 2 - include Part 1 summary
    promptSections.push({ "part1-summary": PART1_SUMMARY });
  } else if (isPart3) {
    // For Part 3 - include both Part 1 and Part 2 summaries
    promptSections.push({ "part1-summary": PART1_SUMMARY });
    promptSections.push({ "part2-summary": PART2_SUMMARY });
  }
  
  // Add the section to be worked on BEFORE the manuscript context
  promptSections.push({ "section-to-be-worked-on": currentSection });
  
  // Finally add the manuscript context
  promptSections.push({ "manuscript-context": manuscript });
  
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
  
  // Now section-to-be-worked-on should be at index 2, and manuscript-context at index 3
  if (result[2]["section-to-be-worked-on"] !== testSection) {
    Logger.log("Error: Section to be worked on should be at index 2");
    return;
  }
  
  if (result[3]["manuscript-context"] !== testManuscript) {
    Logger.log("Error: Manuscript context should be at index 3");
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
  
  // Check for part1-summary field at index 2
  if (!resultPart2[2]["part1-summary"]) {
    Logger.log("Error: No part1-summary field found in Part 2 prompt");
    return;
  }
  
  if (resultPart2[2]["part1-summary"] !== PART1_SUMMARY) {
    Logger.log("Error: Part 1 summary content mismatch");
    return;
  }
  
  // Check section-to-be-worked-on at index 3
  if (resultPart2[3]["section-to-be-worked-on"] !== testSection) {
    Logger.log("Error: Section to be worked on should be at index 3 for Part 2");
    return;
  }
  
  // Check manuscript-context at index 4
  if (resultPart2[4]["manuscript-context"] !== testPart2Manuscript) {
    Logger.log("Error: Manuscript context should be at index 4 for Part 2");
    return;
  }
  
  // Test with Part 3 content
  const testPart3Manuscript = "# Part 3\n\nSome part 3 content";
  
  const resultPart3 = assemblePrompt(testPart3Manuscript, testSection);
  Logger.log("Test result (Part 3 content): " + JSON.stringify(resultPart3, null, 2));
  
  // Validate Part 3 handling - should have 6 sections with both part1-summary and part2-summary
  if (resultPart3.length !== 6) {
    Logger.log("Error: Expected 6 sections in Part 3 prompt, got " + resultPart3.length);
    return;
  }
  
  // Check for part1-summary field at index 2
  if (!resultPart3[2]["part1-summary"]) {
    Logger.log("Error: No part1-summary field found in Part 3 prompt");
    return;
  }
  
  // Check for part2-summary field at index 3
  if (!resultPart3[3]["part2-summary"]) {
    Logger.log("Error: No part2-summary field found in Part 3 prompt");
    return;
  }
  
  if (resultPart3[2]["part1-summary"] !== PART1_SUMMARY) {
    Logger.log("Error: Part 1 summary content mismatch in Part 3 prompt");
    return;
  }
  
  if (resultPart3[3]["part2-summary"] !== PART2_SUMMARY) {
    Logger.log("Error: Part 2 summary content mismatch in Part 3 prompt");
    return;
  }
  
  // Check section-to-be-worked-on at index 4
  if (resultPart3[4]["section-to-be-worked-on"] !== testSection) {
    Logger.log("Error: Section to be worked on should be at index 4 for Part 3");
    return;
  }
  
  // Check manuscript-context at index 5
  if (resultPart3[5]["manuscript-context"] !== testPart3Manuscript) {
    Logger.log("Error: Manuscript context should be at index 5 for Part 3");
    return;
  }
  
  Logger.log("All tests completed successfully");
}
