

const atob = require('atob')

module.exports = (atob) => {

   const axios   = require('axios')
   const API_URL = 'https://api.github.com'

   /**
    * @throws Error if function missing req'd argument
    */
   function missingParameter() {
      throw new Error("Function requires file argument.")
   }

   // GPG key a7fa1abea2528e504424720ba23c04c7e2173ddf

   class API {
      constructor({ token = null, username = "", pw = "", repo = undefined} = {}) {
         this._username = username
         this._repository = repo

         //if (!repo) throw Error("You need to provide a repo!")
         if (token) {
            this._http = axios.create({
               headers: {
                  'Authorization': `token ${token}`
               }
            })
         } else {
            if (!username || !pw)
               throw new Error("Need to provide basic auth credentials!" +
                " A username and pw is req'd if no auth token provided.")
            this._http = axios.create({
               auth: {
                  username: username,
                  password: pw
               }
            })
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
       * Expoxed for debugging.
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

      getContents(file = missingParameter()) {
         return this.get(file)
            .then(data => {
               return atob(data.content)
            })
            .catch(err => {
               throw err
            })
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
            .then(response => {
               return response.data
            })
            .catch(err => {
               throw err
            })
      }

   }

   return API

}
