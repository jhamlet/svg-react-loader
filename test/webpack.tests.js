var context = require.context('./integration', true, /\.js$/);
context.keys().forEach(context);
