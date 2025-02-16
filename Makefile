gitadd:
	git diff | llm -s "write commit message" > /tmp/g; cat /tmp/g
	git add . ; git commit -F /tmp/g

clasp-watch:
	clasp push --watch
