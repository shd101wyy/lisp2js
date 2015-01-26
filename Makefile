# make lisp.lisp file in test_src folder
all:
	./lisp src/lisp.lisp src/lisp_test.js
	rm src/lisp.js
	touch src/lisp.js
	cat src/list.js >> src/lisp.js
	cat src/lisp_test.js >> src/lisp.js
	echo "Done compile. src/lisp.js generated"
