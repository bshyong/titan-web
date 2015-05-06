export default (n, singular, plural: singular) => {
  return `${n} ${(n === 1) ? singular : plural}`
}
