const projectContext = require.context('./app', true, /^((?!__tests__).)*.jsx?$/)
const projectModuleIds = projectContext.keys().map(function resolveModule(module) {
  return String(projectContext.resolve(module))
})

beforeEach(function beforeHook() {
  // Remove our modules from the require cache before each test case.
  return projectModuleIds.forEach(function deleteId(id) { delete require.cache[id] })
})

const context = require.context('./app', true, /-test\.js$/)

context.keys().forEach(context)
