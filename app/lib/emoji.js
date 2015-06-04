import emoji from 'emoji-named-characters/emoji-characters'

const inverted = Object.keys(emoji).reduce((memo, key) => {
  memo[emoji[key]] = key
  return memo
}, {})

module.exports = {
  emoji: emoji,
  inverted: inverted
}
