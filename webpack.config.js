module.exports = {
      // webpack options
      // webpackMiddleware takes a Compiler object as first parameter
      // which is returned by webpack(...) without callback.
    entry: {
      dashboard: __dirname + '/scripts/dashboard.jsx',
      tasks: __dirname + '/scripts/tasks.jsx'
    },
      output: {
          path: __dirname + '/public',
          filename: '[name].bundle.js',
          // no real path is required, just pass "/"
          // but it will work with other paths too.
      },
      resolve: {
        extensions: ['', '.js', '.jsx']
      },
      module: {
        loaders: [
              { test: /\.jsx$/, loader: "jsx" }
        ]
      }
};