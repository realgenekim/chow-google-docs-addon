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
- **sidebar.html**: UI for the Google Docs add-on sidebar

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