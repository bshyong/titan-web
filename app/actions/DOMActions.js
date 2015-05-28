export default {
  click(target = document) {
    let event = new MouseEvent('click', {
      view: window
    })

    target.dispatchEvent(event)
  }
}
