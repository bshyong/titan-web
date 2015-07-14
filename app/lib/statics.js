export default function statics(methods) {
  return target => Object.assign(target, methods)
}
