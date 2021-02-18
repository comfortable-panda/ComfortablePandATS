.PHONY: clean
clean:
	rm -rf src/*.js

.PHONY: compile
compile:
	npm run tsc
