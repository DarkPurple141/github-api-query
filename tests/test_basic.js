
// NB You need to use your own GPG key for the tests to work

const atob = require('atob')
const api = require('../index')(atob)
const assert = require('assert')
const API_URL = "https://api.github.com"
const GPG_KEY = require('../key.gpg') || "INSERT YOUR GPG KEY"

describe("github-api", function() {
    it("compiles", function() {
        assert(api)
    })

    it("class instanciation", function() {
        let instance = new api({token: GPG_KEY})
        assert(instance)
    })

    it("getUrl", function() {
        let instance = new api({token: GPG_KEY})
        instance.repo = "fake"
        instance.user = "jeff"
        assert(instance.getUrl('readme.md') === API_URL+'/repos/jeff/fake/contents/readme.md')
    })

    it("getFile", function(done) {
      let instance = new api({
         token: GPG_KEY,
         username: "DarkPurple141",
         repo: "teaching"
      })

      let p = instance.get('about.md')
      assert(p instanceof Promise)
      p.then(file => {
         assert(file)
         assert(file instanceof Object)
      })
      .then(done, done)
    })

    it("getDirectory", function(done) {
      let instance = new api({
         token: GPG_KEY,
         username: "DarkPurple141",
         repo: "teaching"
      })

      let p = instance.get('_labs')
      assert(p instanceof Promise)
      p.then(dir => {
         assert(dir)
         assert(dir instanceof Array)
      })
      .then(done, done)
    })

    it("getFileContents", function(done) {
      let instance = new api({
         token: GPG_KEY,
         username: "DarkPurple141",
         repo: "teaching"
      })

      let p = instance.getContents('about.md')
      assert(p instanceof Promise)
      p.then(file => {
         assert(file)
      })
      .then(done, done)
    })
})
