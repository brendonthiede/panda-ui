export default class Util {
  static sendRequest (url, success, failure, method, payload) {
    // method should be GET, POST, PUT, or DELETE
    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
    var xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
        success(JSON.parse(xhr.responseText))
      }
    }
    xhr.onloadend = function () {
      if (xhr.status < 200 || xhr.status >= 400) {
        var msg = xhr.responseText || xhr.response || 'There was an unknown error loading ' + url
        if (xhr.status === 404) {
          msg = 'The URL ' + url + ' could not be reached'
        } else if (xhr.status === 401) {
          msg = 'Not authorized to access ' + url
        }
        failure(msg, xhr.status, url)
      }
    }
    xhr.send(payload || null)
  }

  static getJSON (url, success, failure) {
    Util.sendRequest(url, success, failure, 'GET')
  }

  static postJSON (url, success, failure, payload) {
    Util.sendRequest(url, success, failure, 'POST', payload)
  }

  static processError (response, contextMessage, callBack) {
    var error = {
      state: 'error',
      errorMessage: 'An error was encountered while retrieving ' + contextMessage,
      errorResponse: response
    }
    if (callBack) {
      callBack(error)
    }
    return error
  }
}
