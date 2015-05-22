// This should be extracted into readraptor itself

class ReadRaptor {
  getArticle(articleId, callback) {
    this.get(`/articles/${articleId}`, callback)
  }

  get(url, callback) {
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

  baseUrl() {
    return RR_URL
  }
}

export default new ReadRaptor()
