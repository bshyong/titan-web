import marked from 'marked'

marked.setOptions({
  renderer: new marked.Renderer(),
  breaks: true,
})

export default marked
