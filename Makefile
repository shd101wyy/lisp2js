# You dont need to use this Makefile
# =======================================
# make lisp.lisp file in src folder
all:
	closure-compiler lisp.js --js_output_file lisp.min.js
	#./lisp src/list.lisp src/list_es6.js
	#./lisp src/lisp.lisp src/lisp_test_es6.js
	## ====================================================
	## because now es6 is not supports, compile es6 to es5
	#6to5 src/list_es6.js -o src/list.js
	#6to5 src/lisp_test_es6.js -o src/lisp_test.js
	## ====================================================
	#rm src/lisp.js
	#touch src/lisp.js
	#cat src/list.js >> src/lisp.js
	#cat src/lisp_test.js >> src/lisp.js
	#echo "Done compile. src/lisp.js generated"

publish:
	closure-compiler lisp.js --js_output_file lisp.min.js
	npm publish
