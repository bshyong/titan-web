// This should be extracted into readraptor itself

let RR_HOST = `${RR_URL}`.replace(/(https?:\/\/)?/,'')

export default class Readraptor {
  constructor(publicKey) {
    this.conn = new WebSocket(`ws://${RR_HOST}/ws/${publicKey}`);

    this.openConn = new Promise(resolve => {
      this.conn.onopen = () => resolve(this.conn)
    })
  }

  subscribe(distinctId) {
    return new Channel(this.openConn, distinctId)
  }

  static getArticle(articleId, callback) {
    this.get(`/articles/${articleId}`, callback)
  }

  static get(url, callback) {
    var request = new XMLHttpRequest()
    var rUrl = this.baseUrl() + url
    request.open('GET', rUrl, true)

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText)
        callback(data)
      } else {
      }
    }
    request.onerror = () => {}

    request.send()
  }

  static baseUrl() {
    return RR_URL
  }
}


class Channel {
  constructor(openConn, distinctId) {
    this.openConn = openConn
    this.distinctId = distinctId

    this.openConn.then(conn => {
      conn.onmessage = this.onMessage.bind(this)

      conn.send(JSON.stringify({'subscribe': distinctId}))
    })
  }

  onMessage(message) {
    if (message.data) {
      let payload = JSON.parse(message.data)
      if (payload.article) {
        this.onArticleCallback && this.onArticleCallback(payload)
      }
    }
  }

  onArticle(callback) {
    this.onArticleCallback = callback
  }
}
