# CLAUDE.md - Claude's Memory File

## Commands
- **Setup**: `npm install -g @google/clasp` (one-time setup)
- **Login**: `clasp login` (authorize with Google account)
- **Push Changes**: `clasp push` (upload changes to Google Apps Script)
- **Watch Mode**: `make clasp-watch` or `clasp push --watch` (auto-upload on file changes)

## Codebase Structure
- **main.ts**: Entry point with Apps Script functions and UI handlers
- **markdown.ts**: Converts Google Docs to Markdown format
- **assemble_prompt.ts**: Structures prompts for LLM processing
- **reference_prompts.ts**: Contains PART1_SUMMARY and PART2_SUMMARY constants
- **sidebar.html**: UI for the Google Docs add-on sidebar

## UI Design Preferences
- Keep the manuscript context window compact to maximize log area space
- Use brief summaries rather than verbose status messages
- Show part-specific information only when it's relevant
- Keep detailed debugging logs in the dedicated logging area
- Indicate what's being used (e.g., document vs. summary constant)

## Document Loading Strategy
- Preload all documents at sidebar initialization for fast response
- For Part 1: Load full document content
- For Part 2: Use PART1_SUMMARY constant, load Part 2 document
- For Part 3: Use both summary constants, load Part 3 document
- Periodically refresh cache to keep content up-to-date

## Code Style Preferences
- TypeScript with strict typing where possible
- Document functions with JSDoc comments
- Error handling via try/catch with detailed logging
- Defensive null/undefined checks for Google Doc objects
- Async operations use retry with exponential backoff

## Project Notes
- Google Apps Script add-on for helping book authors with AI assistance
- Creates prompts with document context for LLMs (Claude)
- Uses Google Docs API for document access and manipulation
- All changes must be uploaded via clasp to see results in Google Docs