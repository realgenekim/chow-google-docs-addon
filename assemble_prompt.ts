interface PromptSection {
  [key: string]: string;
}

const PART1_SUMMARY =
`# Essential Framework from Part 1: "The Vibe Coding Handbook"

## Outline/Structure of Part 1

**Preface**: Steve and Gene's personal aha moments
- Steve's transition from leadership to hands-on coding to explore AI capabilities
- Gene's return to coding after 17 years and his breakthrough moments with AI
- Both authors' sleepless nights from excitement about AI coding possibilities

**Chapter 3: The Major Shift in Programming Happening Now**
- Dr. Erik Meijer's declaration: "The days of writing code by hand are coming to an end"
- Dr. Andrej Karpathy's "vibe coding" concept versus traditional programming
- The spectrum of positions: Brendan Humphreys (skeptical) to Sergey Brin (enthusiastic)
- Introduction of "vibe engineering" as a middle path

**Chapter 4: Seven Decades of Technology Revolutions**
- Programming languages evolution: from machine code to high-level abstractions
- Development environment transformation: from punch cards to modern IDEs
- Knowledge access revolution: from physical manuals to instant online resources
- The persistent complexity challenges despite these advances
- Parallels with graphics programming evolution (Steve's war story)

**Chapter 5: AI Changing All Knowledge Work**
- OpenAI Jobs Report findings: 80% of US workers affected, knowledge workers most exposed
- Impact on junior developers and the restructuring of work hierarchies
- Tim O'Reilly's perspective: AI will create more developer jobs, not fewer
- Potential economic impacts and timeline predictions for AGI

**Chapter 6: Who This Book Is For**
- Target audiences: active developers, tech leaders, returning coders, product owners, infrastructure engineers, tech-adjacent roles, students
- Gene's story: returning to coding after 17 years
- Steve's story: revitalizing a 30-year game project with AI

**Chapter 7: What Becomes More Important in a World of Coding AI**
- The concept of sociotechnical maestros
- Architecture as enabler of independence
- Fast feedback loops for quality and progress
- Experience and judgment for guiding AI

**Chapter 8: Pairing vs. Delegation with AI**
- The spectrum from tight collaboration to autonomous delegation
- Andy Grove's framework for delegation applied to AI
- Historical examples of extreme delegation contrasted with AI usage
- Guidance on when to pair versus when to delegate

**Chapter 9: The Value That Vibe Coding Creates (FAAFO)**
- Fast: Writing code significantly faster
- Ambitious: Tackling previously unattainable projects
- Alone: Accomplishing multi-person tasks independently
- Fun: Making programming more enjoyable
- Optionality: Exploring multiple approaches before committing

## Key Terminology

**Vibe Coding vs. Vibe Engineering**:
- **Vibe coding** (Karpathy's term): The casual, "turn your brain off" approach where you "fully give in to the vibes," letting AI handle all details with minimal oversight. Suitable for prototyping and personal projects.
- **Vibe engineering**: Our proposed disciplined approach that maintains engineering rigor while leveraging AI's capabilities. The developer maintains executive control while using AI as a powerful tool for production systems.

**The Kitchen/Chef Metaphor**:
- You are the head chef in charge of the kitchen (your software project)
- AI serves as your sous chef - knowledgeable but needs direction
- You don't personally cook every dish (write every line of code) but maintain responsibility for the final product
- Chef Isabella vs. Chef Vincent examples demonstrate good vs. poor approaches to architecture, feedback, and judgment

## The FAAFO Framework

**Fast**: Tasks that took days now take hours. Projects previously requiring weeks can be completed in days.

**Ambitious**: The scope of what's achievable expands dramatically:
- Small tasks previously "not worth the effort" become quick wins
- Massive projects that seemed out of reach become feasible

**Alone**: Work independently that once required multiple specialists:
- Escape coordination costs and scheduling dependencies
- Eliminate communication overhead and "mind reading" problems
- Use ideal technologies without team knowledge constraints

**Fun**: Programming becomes more enjoyable:
- Less time debugging trivial errors and syntax issues
- More focus on creative problem-solving and design
- Reduction in tedious implementation details

**Optionality**: Explore multiple solutions before committing:
- Transform architectural decisions from "one-way doors" to reversible choices
- Prototype different approaches in parallel
- Experience options hands-on rather than evaluating them theoretically
- Create enormous competitive advantage through exploration (Toyota, Amazon examples)

## Our Position on the AI Spectrum

We advocate a balanced middle path between:
- **Skeptics** (Humphreys): "No, you won't be vibe coding your way to production"
- **Enthusiasts** (Brin, Karpathy): "Instead of fixing code, you regenerate it" and "forget the code even exists"

Our position: Vibe engineering embraces AI's capabilities while maintaining engineering discipline:
- Use "brain off" vibe coding for rapid prototyping and exploration
- Apply rigorous vibe engineering for production systems
- Human judgment and oversight remain essential
- The role shifts from implementation to direction, not from responsibility

## Three Critical Elements That Become More Important

**1. Architecture**: Creating systems where humans and AI can work effectively
- Good architecture enables independence of action
- Reduces coordination costs and dependencies
- Chef Isabella's kitchen with clear stations and interfaces vs. Chef Vincent's chaotic shared workspace

**2. Fast Feedback Loops**: Getting immediate signals about progress and quality
- Multiple levels of feedback: development, integration, production
- Monitoring and observability become critical
- Chef Isabella's constant tasting and rapid refinement vs. Chef Vincent's delayed quality checks

**3. Human Judgment**: Guiding AI and recognizing its limitations
- Developing a strong "nonsense detector"
- Recognizing when AI is confidently wrong
- Stopping unproductive approaches early
- Chef Isabella's rigorous standards vs. Chef Vincent's overconfidence

## Pairing vs. Delegation with AI

**The Spectrum of Collaboration**:
- **Full Delegation** (Rare): Simple, low-risk tasks with clear success criteria
- **Guided Delegation** (Common): Medium-complexity tasks with defined boundaries
- **Active Pairing** (Most Common): Complex, ambiguous, or high-risk tasks
- **Expert Consultation**: When you need ideas rather than implementation

**When to Delegate vs. Pair**:
- Task novelty: How well-defined and familiar is the task?
- Past experience: Has the AI shown success with similar tasks?
- Skill level: How capable is the AI at this type of task?
- Task impact: What are the consequences of failure?
- Monitoring needs: How much oversight is required?

**Warning Signs of Over-Delegation**:
- Scope creep beyond original task
- Unfamiliar patterns in generated code
- Increasing solution complexity
- Performance degradation
- Documentation diverging from actual code behavior

This framework provides the foundation for Part 2's practical guidance on implementing vibe engineering in daily development work.`

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
