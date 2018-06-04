
const api = require('../index')
const assert = require('assert')
const API_URL = "https://api.github.com"
const GPG_KEY = process.env['GPG_KEY'] || require('../key.gpg')


describe("# github-api", function() {
    it("compiles", function() {
        assert(api)
    })

    it("class instanciation v1", function() {
        let instance = new api({token: GPG_KEY})
        assert(instance)
    })

    it("class instanciation v2", function() {
        let instance = new api({username: "jeff", pw: "secret"})
        assert(instance)
    })

    it("class instanciation v3", function() {
        let instance = new api({repo: "proj"})
        assert(instance)
    })

    it("class instanciation v4", function() {
        let instance = new api()
        assert(instance)
    })

    it("getUrl", function() {
        let instance = new api({token: GPG_KEY})
        instance.repo = "fake"
        instance.user = "jeff"
        assert(instance.getUrl('readme.md') === API_URL+'/repos/jeff/fake/contents/readme.md')
    })

    describe("Requests", function(done) {
      let instance = new api({
         token: GPG_KEY,
         username: "DarkPurple141",
         repo: "teaching"
      })

      this.timeout(5000)

      /* tests require GPG KEY */
      it("getFile", function(done) {

        let p = instance.get('about.md')
        assert(p instanceof Promise)
        p.then(fileObject => {
           assert(fileObject instanceof Object)
           return fileObject.content
        })
        .then(file => {
           assert(instance.decode(file))
        })
        .then(() => {
           done()
        })
      })

      it("getDirectory", function(done) {

        let p = instance.get('_labs')
        assert(p instanceof Promise)
        p.then(dir => {
           assert(dir instanceof Array)
        })
        .then(() => {
           done()
        })
      })

      it("getFileContents", function(done) {

        let p = instance.getContents('about.md')
        assert(p instanceof Promise)
        p.then(file => assert(file))
        .then(() => {
           done()
        })
      })
    })
})

describe("# valid-api-errors", function() {

   it ("No username provided, but pw is", () => {
      try {
         let a = new api({pw: "secret"})
      } catch (e) {
         assert(e.message == "Need to provide basic auth credentials!"+
         " A username and pw is req'd if no OAUTH token provided.")
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
