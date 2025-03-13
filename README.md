# CHOW - Chat-Oriented Writing Add-On for Google Docs

## Installation

For developers who want to modify or run their own version:

```
npm install -g @google/clasp
clasp login

# Enable Script API access
# Go to https://script.google.com/home/usersettings

clasp create --title "CHOW" --type standalone
```

## Dev Notes

This project was built with TypeScript and Google Apps Script in just three hours using "vibe engineering" techniques. The development process itself demonstrated how AI tools can help build functional products in unfamiliar languages and ecosystems.

For full details on the development journey, check out my [blog post](https://itrevolution.com/articles/how-i-built-a-google-docs-add-on-in-three-hours/).

## Why This Exists

I'm co-authoring a book with Steve Yegge (known for his 20 years at Amazon and Google) that explores how developers can leverage GenAI to transform their work. With working titles like "The CHOP Handbook," "Chat and Vibe Engineering for Professionals," or "Vibe Engineering In Production," our goal is to show developers how GenAI enables them to:

- Build things faster
- Be more ambitious about what they can build
- Work independently rather than depending on teams
- Have more fun coding
- Explore vastly larger design spaces

## What are CHOP and CHOW?

**CHOP (Chat-Oriented Programming)** is an approach where developers use AI assistants to accelerate and enhance their programming workflow. By providing appropriate context and crafting effective prompts, developers can solve complex coding challenges they might not tackle alone.  Think of it as somewhat synonymous with "vibe engineering" or "vibe coding" — but it doesn't involve turning your brain off — it's more about cranking your brain all the way up.

**CHOW (Chat-Oriented Writing)** applies these same principles to writing. Just as CHOP helps with programming, CHOW helps with drafting, editing, and revising text. Both CHOP and CHOW rely on similar techniques: providing appropriate context and crafting effective prompts.

## Why This Tool Helps CHOW

While working on our book, we noticed inconsistent results when using AI to help review and revise our text. The CHOW Add-On standardizes the prompt generation process to ensure consistent, high-quality assistance by:

1. Including the entire manuscript context (even spanning multiple Google Doc files)
2. Focusing the AI on the specific selected text
3. Providing consistent prompt templates
4. Streamlining the workflow between Google Docs and AI tools

## What This Add-On Does

The CHOW Add-On enables this workflow:

1. **Select text** in your Google Docs document
2. **Click a button** in the CHOW sidebar to generate a prompt
3. **Copy the prompt** to your clipboard with all necessary context
4. **Paste into Claude** (or other AI tools) for review/revision
5. **Apply the AI's suggestions** back to your document

## Key Features

- Concatenates multiple Google Docs for full manuscript context
- Word count display
- Easy clipboard integration
- Instant sidebar reloading during development

## Next

- Multiple prompt templates via dropdown selector (not done yet)

## License

MIT

---

🚀 Part of the CHOP/CHOW ecosystem: Chat-Oriented Programming/Writing techniques that help you build and write faster, better, and with more ambition!