gitadd:
	git diff | llm -s "write commit message" > /tmp/g; cat /tmp/g
	git add . ; git commit -F /tmp/g

clasp-watch:
	clasp push --watch

diff:
	git diff | llm -s "summarize the diffs; no preamble of 'The changes in the code include the following key modifications...'; just the diff descriptions." > /tmp/diffs

gitcommit:
	git commit -F /tmp/diffs