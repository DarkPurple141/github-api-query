
// NB You need to use your own GPG key for the tests to work

const api = require('../index')
const assert = require('assert')
const API_URL = "https://api.github.com"
const GPG_KEY =  "INSERT YOUR GPG KEY" //require('../key.gpg') // //

describe("# github-api", function() {
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
    /* tests require GPG KEY
    it("getFile", function(done) {
      let instance = new api({
         token: GPG_KEY,
         username: "DarkPurple141",
         repo: "teaching"
      })

      let p = instance.get('about.md')
      assert(p instanceof Promise)
      p.then(file => {
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
    */
})

describe("# valid-api-errors", function() {
   it ("No token provided", () => {
      try {
         let a = new api()
      } catch (e) {
         assert(e.message == "Need to provide basic auth credentials!"+
         " A username and pw is req'd if no auth token provided.")
      }
   })

   it ("No pw provided, but username is", () => {
      try {
         let a = new api({username: "Jeff"})
      } catch (e) {
         assert(e.message == "Need to provide basic auth credentials!"+
         " A username and pw is req'd if no auth token provided.")
      }
   })

   it ("No username provided, but pw is", () => {
      try {
         let a = new api({pw: "secret"})
      } catch (e) {
         assert(e.message == "Need to provide basic auth credentials!"+
         " A username and pw is req'd if no auth token provided.")
      }
   })

   describe("No file provided errors", () => {
      let a = new api({username: "jeff", pw: "secret"})
      it ("Try to get()", () => {
         try {
            a.get()
         } catch (e) {
            assert(e.message == "Function requires file argument.")
         }
      })

      it ("Try to getUrl()", () => {
         try {
            a.getUrl()
         } catch (e) {
            assert(e.message == "Function requires file argument.")
         }
      })

      it ("Try to getContents()", () => {
         try {
            a.getContents()
         } catch (e) {
            assert(e.message == "Function requires file argument.")
         }
      })
   })
   it ("Try to get() without a repo provided", () => {
      let a = new api({username: "jeff", pw: "secret"})
      try {
         a.get('fake.md')
      } catch (e) {
         assert(e.message == "Function must take a repo and username in options object" +
             " if object not initialised with one or both.")
      }
   })

})
