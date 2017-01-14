import BambooStatusService from 'src/services/BambooStatusService'
import MockBambooResponse from '../../data/MockBambooResponse.json'

describe('BambooStatusService', () => {
  describe('getNormalizedName', () => {
    it('removes all text prior to last hyphen', () => {
      expect(BambooStatusService.getNormalizedName('Hello - World')).to.equal('World')
      expect(BambooStatusService.getNormalizedName('Hello - everyone - around - the - World')).to.equal('World')
      expect(BambooStatusService.getNormalizedName('Hello World')).to.equal('Hello World')
    })
  })

  describe('getCodeFromName', () => {
    it('replaces spaces with hyphens', () => {
      expect(BambooStatusService.getCodeFromName('hello   world')).to.equal('hello-world')
      expect(BambooStatusService.getCodeFromName('hello-world')).to.equal('hello-world')
      expect(BambooStatusService.getCodeFromName('hello world')).to.equal('hello-world')
    })
  })

  describe('compareApps', () => {
    it('sorts alphabetically by app name', () => {
      var apps = [
        {
          'overall': {code: 'px', 'label': 'Producer Express', state: 'Successful'},
          'preprod_env': {code: 'px-preprod_env', state: 'Successful', link: 'http://blah.com/preprod/px'},
          'prod_env': {code: 'px-prod_env', state: 'unknown'}
        },
        {
          'overall': {code: 'cx', 'label': 'Compliance Express', state: 'Successful'},
          'preprod_env': {code: 'cx-preprod_env', state: 'Successful', link: 'http://blah.com/preprod/cx'},
          'prod_env': {code: 'cx-prod_env', state: 'unknown', link: 'http://blah.com/prod/cx'}
        },
        {
          'overall': {code: 'pm', 'label': 'Producer Manager', state: 'Successful'},
          'preprod_env': {code: 'pm-preprod_env', state: 'Failed', link: 'http://blah.com/preprod/pm'}
        }
      ]
      apps.sort(BambooStatusService.compareApps)
      expect(apps[0].overall.label).to.equal('Compliance Express')
      expect(apps[1].overall.label).to.equal('Producer Express')
      expect(apps[2].overall.label).to.equal('Producer Manager')
    })
  })

  describe('compareEnvs', () => {
    it('sorts based on specified order', () => {
      var columns = ['sq', 'prod', 'mdc', 'overall']
      columns.sort(BambooStatusService.compareEnvs)
      expect(columns[0]).to.equal('overall')
      expect(columns[1]).to.equal('sq')
      expect(columns[2]).to.equal('mdc')
      expect(columns[3]).to.equal('prod')
    })
    it('defaults to alphabetical order for unknown values', () => {
      var columns = ['herp', 'derp', 'zerp', 'overall']
      columns.sort(BambooStatusService.compareEnvs)
      expect(columns[0]).to.equal('overall')
      expect(columns[1]).to.equal('derp')
      expect(columns[2]).to.equal('herp')
      expect(columns[3]).to.equal('zerp')
    })
  })

  describe('processEnvPlans', () => {
    it('returns correct plans', () => {
      var service = new BambooStatusService()
      service.processEnvPlans(MockBambooResponse['SST'].results)
      expect(service.response.results.length).to.equal(0)
      expect(service.response.columns.length).to.equal(4)
      expect(service.response.columns).to.have.same.members(['overall', 'qa', 'preprod', 'prod'])
      expect(service.response.envs.overall.label).to.equal('')
      expect(service.response.envs.overall.code).to.equal('overall')
      expect(service.response.envs.overall.link).to.equal(undefined)
      expect(service.response.envs.overall.state).to.equal(undefined)
      expect(service.response.envs.preprod.label).to.equal('PreProd')
      expect(service.response.envs.preprod.code).to.equal('preprod')
      expect(service.response.envs.preprod.link).to.equal('/browse/SST-SSTPPE-1960')
      expect(service.response.envs.preprod.state).to.equal('Successful')
    })
  })

  describe('processEnvJobs', () => {
    var service

    beforeEach(function () {
      service = new BambooStatusService()
      service.processEnvJobs(MockBambooResponse['SST-SSTPPE-1960'])
    })

    it('creates results', () => {
      expect(service.response.results.length).to.equal(6)
      expect(service.response.columns.length).to.equal(0)
      expect(service.response.results[0].overall.code).to.equal('agencyedge')
      expect(service.response.results[0].overall.label).to.equal('AgencyEDGE')
      expect(service.response.results[0].overall.state).to.equal('Successful')
      expect(service.response.results[0].preprod.code).to.equal('preprod-agencyedge')
      expect(service.response.results[0].preprod.state).to.equal('Successful')
      expect(service.response.results[0].preprod.link).to.equal('/browse/SST-SSTPPE-JOB1-1960')
    })

    it('updates results', () => {
      service.processEnvJobs(MockBambooResponse['SST-SSTPE-1995'])
      expect(service.response.results.length).to.equal(6)
      expect(service.response.columns.length).to.equal(0)
      expect(service.response.results[0].overall.code).to.equal('agencyedge')
      expect(service.response.results[0].overall.label).to.equal('AgencyEDGE')
      expect(service.response.results[0].overall.state).to.equal('Failed')
      expect(service.response.results[0].preprod.code).to.equal('preprod-agencyedge')
      expect(service.response.results[0].preprod.state).to.equal('Successful')
      expect(service.response.results[0].preprod.link).to.equal('/browse/SST-SSTPPE-JOB1-1960')
      expect(service.response.results[0].prod.code).to.equal('prod-agencyedge')
      expect(service.response.results[0].prod.state).to.equal('Failed')
      expect(service.response.results[0].prod.link).to.equal('/browse/SST-SSTPE-JOB1-1995')
    })

    it('publishes results only when done', () => {
      service.planCount = 2
      var callback = sinon.spy()
      service.processEnvJobs(MockBambooResponse['SST-SSTPE-1995'], callback)
      expect(service.planCount).to.equal(1)
      expect(callback.notCalled)
      expect(service.response.results.length).to.equal(6)
      expect(service.response.state).to.equal(undefined)
      service.processEnvJobs(MockBambooResponse['SST-SSTQAE-1925'], callback)
      expect(service.planCount).to.equal(0)
      expect(service.response.results.length).to.equal(7)
      expect(service.response.state).to.equal('ready')
      expect(callback.called)
      expect(service.response.results[0].overall.label).to.equal('AgencyEDGE')
      expect(service.response.results[1].overall.label).to.equal('Compliance Express')
      expect(service.response.results[2].overall.label).to.equal('Portal')
      expect(service.response.results[3].overall.label).to.equal('Producer Express')
      expect(service.response.results[4].overall.label).to.equal('Producer Manager')
      expect(service.response.results[5].overall.label).to.equal('Pulse')
      expect(service.response.results[6].overall.label).to.equal('Sircon for States')
    })
  })

  describe('getBambooStatuses', () => {
    var service
    var sandbox
    beforeEach(function () {
      service = new BambooStatusService()
      sandbox = sinon.sandbox.create()
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('makes http request', () => {
      var callback = sandbox.spy()
      var server = sandbox.useFakeServer()

      service.getBambooStatuses(callback, 'SST')

      var dataKeys = ['SST', 'SST-SSTPPE-1960', 'SST-SSTPE-1995', 'SST-SSTQAE-1925']
      for (var i = 0; i < 4; i++) {
        server.requests[i].respond(
          200,
          {'Content-Type': 'application/json'},
          JSON.stringify(MockBambooResponse[dataKeys[i]])
        )
      }
      expect(server.requests.length).to.equal(4)

      expect(service.response.columns).to.have.same.members(['overall', 'qa', 'preprod', 'prod'])
      expect(service.response.envs.overall).to.deep.equal({label: '', code: 'overall'})
      expect(service.response.envs.preprod).to.deep.equal({
        code: 'preprod',
        label: 'PreProd',
        link: '/browse/SST-SSTPPE-1960',
        state: 'Successful'
      })
      expect(service.response.results[0].overall).to.deep.equal({
        code: 'agencyedge',
        label: 'AgencyEDGE',
        state: 'Failed'
      })
      expect(service.response.results[0].preprod).to.deep.equal({
        code: 'preprod-agencyedge',
        state: 'Successful',
        link: '/browse/SST-SSTPPE-JOB1-1960'
      })
      expect(callback.called)
    })

    it('handles failure', () => {
      var callback = sandbox.spy()
      var server = sandbox.useFakeServer()

      service.getBambooStatuses(callback, 'SST')

      server.requests[0].respond(
        400,
        {'Content-Type': 'application/json'},
        JSON.stringify('{blah: \'blarg\'}')
      )
      expect(server.requests.length).to.equal(1)

      expect(service.response.columns.length).to.equal(0)
      expect(service.response.results.length).to.equal(0)
      expect(service.response.envs).to.deep.equal({})
      expect(callback.calledWith({
        state: 'error',
        errorMessage: 'An error was encountered while retrieving SST',
        errorResponse: {blah: 'blarg'}
      }))
    })
  })
})
