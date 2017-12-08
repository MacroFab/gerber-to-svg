DESTDIR =
MFDIR = $(DESTDIR)/var/mfab
MODPATH = $(MFDIR)/node_modules/gerber-to-svg
SHELL = /bin/bash

all:
	npm install
	gulp build

install:
	if [ ! -f $(MODPATH) ]; then mkdir -p $(MODPATH); fi
	tar cpf - .npmignore bin dist lib node_modules package.json | ( cd $(MODPATH) && tar xpvf - )

package:
	fakeroot debian/rules binary

clean:
	rm -rf lib node_modules
	git checkout dist/gerber-to-svg.js
	git checkout dist/gerber-to-svg.min.js
	fakeroot debian/rules clean

runtest:
	node_modules/.bin/gulp test

test: runtest

everything: clean all test package

packagepublish:
	packagepattern=$$(echo gerber-to-svg_$$(head -1 debian/changelog | grep -oE '[0-9\.-]{5,}')_*.deb) && echo $$packagepattern && \
	pushd .. && packagefilename=$$(ls $$packagepattern) && popd && \
	scp -P 24300 ../$$packagefilename  jenkins@jenkins:deb && \
	ssh -p 24300 jenkins@jenkins go/bin/aptly repo add -force-replace=true mfrepository deb/$$packagefilename

packagesync:
	ssh jenkins@jenkins go/bin/aptly publish update  -force-overwrite=true trusty s3:mfrepository:.

release: packagepublish packagesync
