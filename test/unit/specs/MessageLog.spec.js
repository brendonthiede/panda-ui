import Vue from 'vue'
import MessageLog from 'src/components/MessageLog'

function getRenderedComponent () {
  return new Vue({
    el: '#app',
    template: '<div id="app"><message-log :messages="messages" @messageRemoved="removeMessage" /></div>',
    components: {'message-log': MessageLog},
    data: {
      messages: [
        { header: 'Error', style: 'panel-danger', body: 'Uh oh' },
        { header: 'Error', style: 'panel-danger', body: 'Oh no!' },
        { header: 'Success', style: 'panel-success', body: 'Bout time', link: 'http://blah.com' }
      ]
    },
    methods: {
      removeMessage: function (index) {
        this.messages.splice(index, 1)
      }
    }
  })
}

describe('MessageLog', () => {
  var messageLog

  beforeEach(function () {
    messageLog = getRenderedComponent()
  })

  it('renders correctly', () => {
    expect(messageLog.$el.querySelectorAll('div.panel-danger').length).to.equal(2)
    expect(messageLog.$el.querySelectorAll('div.panel-success').length).to.equal(1)
    expect(messageLog.$el.querySelectorAll('div.panel-success .panel-body p').length).to.equal(2)
    expect(messageLog.$el.querySelector('div.panel-success .panel-body a').href).to.equal('http://blah.com/')
  })

  it('hides closed messages', (done) => {
    messageLog.$el.querySelector('a.close[data-index="1"]').click()
    messageLog.$nextTick(() => {
      expect(messageLog.$el.querySelectorAll('div.panel-danger').length).to.equal(1)
      expect(messageLog.$el.querySelectorAll('div.panel-success').length).to.equal(1)
      done()
    })
  })
})
