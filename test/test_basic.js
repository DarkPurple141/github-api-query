
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

    it("getUrl", function() {
        let instance = new api({token: GPG_KEY})
        instance.repo = "fake"
        instance.user = "jeff"
        assert(instance.getUrl('readme.md') === API_URL+'/repos/jeff/fake/contents/readme.md')
    })

    describe("* Requests", function(done) {
      let instance = new api({
         token: GPG_KEY,
         username: "DarkPurple141",
         repo: "teaching"
      })

      this.timeout(10000)

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

      it("getContents", function(done) {

        let p = instance.getContents('about.md')
        assert(p instanceof Promise)
        p.then(file => assert(file))
        .then(() => {
           done()
        })
      })

      it("getFileContents", function(done) {

        let p = instance.getFileContents('about.md')
        assert(p instanceof Promise)
        p.then(file => assert(file))
        .then(() => {
           done()
        })
      })

      it("getRepo (no param)", function(done) {

        let p = instance.getRepo()
        assert(p instanceof Promise)
        p.then(file => assert(file instanceof Object))
        .then(() => {
           done()
        })
      })

      it("getRepo (single param)", function(done) {

        let p = instance.getRepo('teaching')
        assert(p instanceof Promise)
        p.then(file => assert(file instanceof Object))
        .then(() => {
           done()
        })
      })

      it("getRepo (two params)", function(done) {

        let p = instance.getRepo('LeonBot', 'zainafzal08')
        assert(p instanceof Promise)
        p.then(file => assert(file instanceof Object))
        .then(() => {
           done()
        })
      })

      it("listRepos", function(done) {

        let p = instance.listRepos()
        assert(p instanceof Promise)
        p.then(repos => assert(repos instanceof Array))
        .then(() => {
           done()
        })
      })
    })
})

describe("# valid-api-errors", function() {

   it ("No username and pw provided", () => {
      try {
         let a = new api({pw: "secret"})
      } catch (e) {
         assert(e.message == "As of version 2.0, instance creation fails without some sort of authentication token/creds provided.")
      }
   })

   describe("* No file provided errors", () => {
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

   it ("Try to getRepo() with a bad path provided", () => {
      let a = new api({token: GPG_KEY, username: "jeff", pw: "secret"})
      a.getRepo('fake.md', 'fake')
      .catch(err => {
         assert(err)
      })
   })

   it ("Try to listRepos() for a bad username", () => {
      let a = new api({username: "jeff", pw: "secret"})
      a.listRepos()
      .catch(err => {
         assert(err)
      })
   })

})
