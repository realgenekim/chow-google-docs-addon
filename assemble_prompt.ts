interface PromptSection {
    [key: string]: string;
  }
  
  function assemblePrompt(): string {
    const promptStructure: PromptSection[] = [
      { "your-goal": "" },
      { "manuscript-context": "" },
      { "section-to-be-written": "" }
    ];
    
    return JSON.stringify(promptStructure, null, 2);
  }