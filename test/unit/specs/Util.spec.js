import Util from 'src/services/Util'

describe('Util', () => {
  describe('processError', () => {
    it('creates error response', () => {
      var error = Util.processError({response: 'fake response'}, 'fake data')
      expect(error.errorMessage).to.equal('An error was encountered while retrieving fake data')
    })

    it('uses callback', () => {
      var callback = sinon.spy()
      Util.processError({}, '', callback)
      expect(callback.called)
    })
  })

  describe('getJSON', () => {
    var sandbox
    var server
    var success
    var failure

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      server = sandbox.useFakeServer()
      success = sandbox.spy()
      failure = sandbox.spy()
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('handles success', () => {
      Util.getJSON('http://blah.com', success, failure)
      server.requests[0].respond(
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify({'msg': 'all good'})
      )
      expect(success).to.have.been.calledWith({msg: 'all good'})
    })

    it('handles general error', () => {
      Util.getJSON('http://blah.com', success, failure)
      server.requests[0].respond(
        999,
        {'Content-Type': 'application/json'},
        null
      )
      expect(failure).to.have.been.calledWith('There was an unknown error loading http://blah.com', 999, 'http://blah.com')
    })

    it('handles not found error', () => {
      Util.getJSON('http://blah.com', success, failure)
      server.requests[0].respond(
        404,
        {'Content-Type': 'application/json'},
        JSON.stringify({'msg': 'bad news'})
      )
      expect(failure).to.have.been.calledWith('The URL http://blah.com could not be reached', 404)
    })

    it('handles not authorized error', () => {
      Util.getJSON('http://blah.com', success, failure)
      server.requests[0].respond(
        401,
        {'Content-Type': 'application/json'},
        JSON.stringify({'msg': 'bad news'})
      )
      expect(failure).to.have.been.calledWith('Not authorized to access http://blah.com', 401)
    })
  })

  describe('postJSON', () => {
    var sandbox
    var server
    var success
    var failure

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      server = sandbox.useFakeServer()
      success = sandbox.spy()
      failure = sandbox.spy()
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('handles success', () => {
      Util.postJSON('http://blah.com', success, failure, {foo: 'bar'})
      expect(server.requests[0].requestBody).to.eql({foo: 'bar'})
      server.requests[0].respond(
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify({'msg': 'all good'})
      )
      expect(success).to.have.been.calledWith({msg: 'all good'})
    })
  })
})
