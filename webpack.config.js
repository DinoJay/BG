module.exports = {
    entry: {
      dashboard: __dirname + '/scripts/dashboard.jsx',
      tasks: __dirname + '/scripts/tasks.jsx',
      route: __dirname + '/scripts/route.jsx'
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
