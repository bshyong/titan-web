let projectContext = require.context('./app', true, /^((?!__tests__).)*.jsx?$/)
let projectModuleIds = projectContext.keys().map(module =>
  String(projectContext.resolve(module)))

beforeEach(() => {
  // Remove our modules from the require cache before each test case.
  projectModuleIds.forEach(id => delete require.cache[id])
})


let context = require.context('./app', true, /-test\.js$/)

context.keys().forEach(context)
