import Vue from 'vue'
import PXFormsBundler from 'src/components/PXFormsBundler'

function getRenderedComponent () {
  const Ctor = Vue.extend(PXFormsBundler)
  return new Ctor({}).$mount()
}

describe('PXFormsBundler', () => {
  var sandbox
  var server

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    server = sandbox.useFakeServer()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('pulls template directories and checks login on mount', (done) => {
    var pxFormsBundler = getRenderedComponent()
    expect(server.requests.length).to.equal(2)
    expect(server.requests[0].url).to.equal('/rest/api/1.0/currentUser')
    expect(server.requests[1].url).to.equal('http://sir-lp-bamboo01.sircon.com/bamboo-tools/pso-helper.php?method=getSubscriberList')
    server.requests[0].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        'name': 'bthiede', 'fullName': 'Brendon Thiede', 'email': 'bthiede@vertafore.com'
      })
    )
    server.requests[1].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        result: {
          subscribers: ['folder1', 'folder2']
        }
      })
    )

    pxFormsBundler.$nextTick(() => {
      var folderOptions = pxFormsBundler.$el.querySelectorAll('#templateDirectories option')
      expect(folderOptions.length).to.equal(3)
      expect(folderOptions[1].textContent).to.equal('folder1')
      expect(folderOptions[2].textContent).to.equal('folder2')
      expect(pxFormsBundler.$data.messages.length).to.equal(0)
      done()
    })
  })

  it('handles user not logged in and close message', (done) => {
    var pxFormsBundler = getRenderedComponent()
    expect(server.requests.length).to.equal(2)
    expect(server.requests[0].url).to.equal('/rest/api/1.0/currentUser')
    expect(server.requests[1].url).to.equal('http://sir-lp-bamboo01.sircon.com/bamboo-tools/pso-helper.php?method=getSubscriberList')
    server.requests[0].respond(
      401,
      {'Content-Type': 'application/json'},
      'blah blah not logged in'
    )
    server.requests[1].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        result: {
          subscribers: ['folder1', 'folder2']
        }
      })
    )
    pxFormsBundler.$nextTick(() => {
      var errorMessages = pxFormsBundler.$data.messages
      expect(errorMessages.length).to.equal(1)
      expect(errorMessages[0].header).to.equal('Error')
      expect(errorMessages[0].style).to.equal('panel-danger')
      expect(errorMessages[0].body).to.equal('You are not logged in to Bamboo.  Use the below link to login:')
      expect(errorMessages[0].link).to.equal('/userlogin!default.action?os_destination=%2Fbamboo-tools%2Fsmokestatus')
      pxFormsBundler.$el.querySelector('a.close[data-index="0"]').click()
      pxFormsBundler.$nextTick(() => {
        errorMessages = pxFormsBundler.$data.messages
        expect(errorMessages.length).to.equal(0)
        done()
      })
    })
  })

  it('handles directory list pull failure', (done) => {
    var pxFormsBundler = getRenderedComponent()
    expect(server.requests.length).to.equal(2)
    expect(server.requests[0].url).to.equal('/rest/api/1.0/currentUser')
    expect(server.requests[1].url).to.equal('http://sir-lp-bamboo01.sircon.com/bamboo-tools/pso-helper.php?method=getSubscriberList')
    server.requests[0].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        'name': 'bthiede', 'fullName': 'Brendon Thiede', 'email': 'bthiede@vertafore.com'
      })
    )
    server.requests[1].respond(
      500,
      {'Content-Type': 'application/json'},
      'ruh roh'
    )
    pxFormsBundler.$nextTick(() => {
      var errorMessages = pxFormsBundler.$data.messages
      expect(errorMessages.length).to.equal(1)
      expect(errorMessages[0].header).to.equal('Error')
      expect(errorMessages[0].style).to.equal('panel-danger')
      expect(errorMessages[0].body).to.equal('ruh roh')
      expect(errorMessages[0].link).to.equal(undefined)
      done()
    })
  })

  it('shows a preview and starts a build', (done) => {
    var pxFormsBundler = getRenderedComponent()
    expect(server.requests.length).to.equal(2)
    expect(server.requests[0].url).to.equal('/rest/api/1.0/currentUser')
    expect(server.requests[1].url).to.equal('http://sir-lp-bamboo01.sircon.com/bamboo-tools/pso-helper.php?method=getSubscriberList')
    server.requests[0].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        'name': 'bthiede', 'fullName': 'Brendon Thiede', 'email': 'bthiede@vertafore.com'
      })
    )
    server.requests[1].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        result: {
          subscribers: ['folder1', 'folder2']
        }
      })
    )
    pxFormsBundler.$nextTick(() => {
      pxFormsBundler.$data.selectedDirectory = 'folder2'
      pxFormsBundler.$el.querySelector('#show-preview').click()
      expect(server.requests.length).to.equal(3)
      expect(server.requests[2].url).to.equal('http://sir-lp-bamboo01.sircon.com/bamboo-tools/pso-helper.php?method=getPreview&templateDirectory=folder2')
      server.requests[2].respond(
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify({
          result: {
            preview: ['templates', '`-- subscriber17964', '    `-- pdf', '        `-- Agent_Amendments.pdf', '', '2 directories, 1 file']
          }
        })
      )
      pxFormsBundler.$nextTick(() => {
        expect(pxFormsBundler.$el.querySelector('#preview pre').textContent).to.contain('2 directories, 1 file')
        pxFormsBundler.$el.querySelector('#execute-build-plan').click()
        expect(server.requests.length).to.equal(4)
        expect(server.requests[3].method).to.equal('POST')
        expect(server.requests[3].url).to.equal('/rest/api/1.0/queue/PSO-PXFORMS?bamboo.template.directory=folder2')
        server.requests[3].respond(
          200,
          {'Content-Type': 'application/json'},
          JSON.stringify({
            buildResultKey: 'DERP-9000'
          })
        )
        pxFormsBundler.$nextTick(() => {
          var messages = pxFormsBundler.$data.messages
          expect(messages.length).to.equal(1)
          expect(messages[0].header).to.equal('Success')
          expect(messages[0].style).to.equal('panel-success')
          expect(messages[0].body).to.equal('Bamboo build successfully initiated:')
          expect(messages[0].link).to.equal('http://bamboo.sircon.com/browse/DERP-9000')
          done()
        })
      })
    })
  })

  it('reports a preview error', (done) => {
    var pxFormsBundler = getRenderedComponent()
    expect(server.requests.length).to.equal(2)
    expect(server.requests[0].url).to.equal('/rest/api/1.0/currentUser')
    expect(server.requests[1].url).to.equal('http://sir-lp-bamboo01.sircon.com/bamboo-tools/pso-helper.php?method=getSubscriberList')
    server.requests[0].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        'name': 'bthiede', 'fullName': 'Brendon Thiede', 'email': 'bthiede@vertafore.com'
      })
    )
    server.requests[1].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        result: {
          subscribers: ['folder1', 'folder2']
        }
      })
    )
    pxFormsBundler.$nextTick(() => {
      pxFormsBundler.$data.selectedDirectory = 'folder2'
      pxFormsBundler.$el.querySelector('#show-preview').click()
      expect(server.requests.length).to.equal(3)
      expect(server.requests[2].url).to.equal('http://sir-lp-bamboo01.sircon.com/bamboo-tools/pso-helper.php?method=getPreview&templateDirectory=folder2')
      server.requests[2].respond(
        500,
        {'Content-Type': 'application/json'},
        'errorrrrzzzz'
      )
      pxFormsBundler.$nextTick(() => {
        var errorMessages = pxFormsBundler.$data.messages
        expect(errorMessages.length).to.equal(1)
        expect(errorMessages[0].header).to.equal('Error')
        expect(errorMessages[0].style).to.equal('panel-danger')
        expect(errorMessages[0].body).to.equal('errorrrrzzzz')
        expect(errorMessages[0].link).to.equal(undefined)
        done()
      })
    })
  })

  it('handles error initiating build', (done) => {
    var pxFormsBundler = getRenderedComponent()
    expect(server.requests.length).to.equal(2)
    expect(server.requests[0].url).to.equal('/rest/api/1.0/currentUser')
    expect(server.requests[1].url).to.equal('http://sir-lp-bamboo01.sircon.com/bamboo-tools/pso-helper.php?method=getSubscriberList')
    server.requests[0].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        'name': 'bthiede', 'fullName': 'Brendon Thiede', 'email': 'bthiede@vertafore.com'
      })
    )
    server.requests[1].respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify({
        result: {
          subscribers: ['folder1', 'folder2']
        }
      })
    )
    pxFormsBundler.$nextTick(() => {
      pxFormsBundler.$data.selectedDirectory = 'folder2'
      pxFormsBundler.$nextTick(() => {
        pxFormsBundler.$el.querySelector('#execute-build-plan').click()
        server.requests[2].respond(
          500,
          {'Content-Type': 'application/json'},
          'crap!'
        )
        pxFormsBundler.$nextTick(() => {
          var messages = pxFormsBundler.$data.messages
          expect(messages.length).to.equal(1)
          expect(messages[0].header).to.equal('Error')
          expect(messages[0].style).to.equal('panel-danger')
          expect(messages[0].body).to.equal('crap!')
          expect(messages[0].link).to.equal(undefined)
          done()
        })
      })
    })
  })
})
