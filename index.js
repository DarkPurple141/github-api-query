
module.exports = (() => {

   const axios   = require('axios')
   const atob    = require('atob')
   const API_URL = 'https://api.github.com'

   function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
       }).join(''));
    }

   /**
    * @throws Error if function missing req'd argument
    */
   function missingParameter() {
      throw new Error("Function requires file argument.")
   }

   class API {
      constructor({ token = null, username = "", pw = "", repo = undefined} = {}) {
         this._username   = username
         this._repository = repo

         //if (!repo) throw Error("You need to provide a repo!")
         if (token) {
            this._http = axios.create({
               headers: {
                  'Authorization': `token ${token}`
               }
            })
         } else if (username && pw) {

            this._http = axios.create({
               auth: {
                  username: username,
                  password: pw
               },
               withCredentials: true
            })
         } else {
            // defaults to no configuration
            throw new Error("As of version 2.0, instance creation fails without "+
                          "some sort of authentication token/creds provided.")
         }
      }
      /**
       * Getter for axios instance
       * @returns axios instance
       */
      get axios() {
         return this._http
      }

      /**
       * Set repository for requests
       * @param repo must be set at instanciation or before a request
       */
      set repo(repo) {
         this._repository = repo
      }

      /**
       * Set username for requests
       * @param user must be set at instanciation or before a request
       */
      set user(user) {
         this._username = user
      }

      /**
       * @returns the current url formed for the request. Mainly called internally.
       * Exposed for debugging.
       */
      getUrl(file = missingParameter(), { username = "", repository = undefined} = {}) {
         let user = username || this._username
         let repo = repository || this._repository

         if (!(user && repo)) {
            throw new Error("Function must take a repo and username in options object" +
             " if object not initialised with one or both.")
         }

         return `${API_URL}/repos/${user}/${repo}/contents/${file}`
      }

      /**
         @param file the file path being requested
      */
      getContents(file) {
         console.warn("getContents() is deprecated, please use getFileContents()")
         return this.getFileContents(file)
      }

      /**
         ** future api
         @param file the file path being requested
      */
      getFileContents(file = missingParameter()) {
         return this.get(file)
            .then(data => this.decode(data.content))
            .catch(err => {
               throw err
            })
      }

      /**
         no params req'd as it will return user's own repos
         @returns A Promise with an array of data
      */
      listRepos() {
         return this.axios.get(`${API_URL}'/repositories`)
                  .then(response => response.data)
      }

      /**
         If no owner provided use self
         else use full url
      */
      getRepo(repo = missingParameter(), owner = null) {
         if (!owner)
            owner = this._username
         return this.axios.get(`${API_URL}'/repos/${owner}/${this._repository}`)
                  .then(response => response.data)
      }

      /**
       * Takes a @param file and queries the github api
       * @returns Promise -- with the response data
       * @throws missingParameter Error if no file provided
       * @throws err if Promise fails
       */
      get(file = missingParameter()) {
         let url = this.getUrl(file)

         return this.axios.get(url)
            .then(response => response.data)
            .catch(err => {
               throw err
            })
      }
      /**
       * Decode unicode provided by github
       */
      decode(file) {
         return b64DecodeUnicode(file)
      }

   }

   return API

})()
