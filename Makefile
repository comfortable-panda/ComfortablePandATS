.PHONY: clean
clean:
	rm -rf src/*.js
	rm -rf dist
	rm -rf cpts.zip cpts-src.tar.bz2

.PHONY: compile
compile:
	npm run tsc

.PHONY: firefox
firefox:
	$(MAKE) clean
	npm install
	npm run build
	zip -r cpts.zip dist/*

.PHONY: sdist
sdist:
	$(MAKE) clean
	tar -jcvf cpts-src.tar.bz2 LICENSE Makefile package-lock.json package.json README.md tsconfig.json webpack.config.js public src

