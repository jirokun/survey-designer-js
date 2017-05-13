# packaging for Github docs
rm -fr docs/js/* && \
  NODE_ENV=production webpack && \
  cp -f node_modules/jquery/dist/jquery.min.js node_modules/tinymce/tinymce.min.js docs/js/ && \
  cp dist/*.bundle.js dist/default.css docs/js/ && \