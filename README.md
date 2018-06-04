simple-github-api
====

[![npm version](https://img.shields.io/npm/v/simple-github-api.svg?style=flat-square)](https://www.npmjs.org/package/simple-github-api)
[![Build Status](https://travis-ci.org/DarkPurple141/github-api-query.svg?branch=master)](https://travis-ci.org/DarkPurple141/github-api-query)
[![Coverage Status](https://coveralls.io/repos/github/DarkPurple141/github-api-query/badge.svg?branch=master)](https://coveralls.io/github/DarkPurple141/github-api-query?branch=master)

This is a simple wrapper for the
[GitHub API](https://developer.github.com/v3/) to ease requesting files,
 directory information from a repository.

### Basic Usage:
```bash
# To download and install
npm install --save simple-github-api
```

```js
const API = require('simple-github-api')

let instance = new API({
   // https://github.com/blog/1509-personal-api-tokens
   token: "Some valid OAUTH key issued by github",

   // choose your repo, or you can omit this option and set it later
   repo: "myProject",

   // the username/owner of the repo(s)
   username: "markzuckerberg"
})

instance.get('/some/path')
   .then(metafile => {
      // returns a file object or if
      // a directory a list of file objects
      console.log(metafile)
   })
   .catch(err => {
      throw err
   })

// OR

instance.getContents('some/file/path')
   .then(file => {
      // contains actual file
      console.log(file)
   })

```

### API

```js
const API = require('simple-github-api')
```

#### Constructors
The `new` keyword is required to
create an instance of the API
object.

It is recommended to get an `OAUTH`
key issued for your application and
instantiate with that token.

```js
let instance = new API(
   {
      token: "A valid token"
   })
```

The default object however doesn't require any config.
```js
// results in a warning.
// If you do > 60 requests per day
// you will get a 401 error for api requests.
let instance = new API()
```
You can also pass in basic auth credentials, and a repository.

```js
// all valid options you can pass in
options = {
   username: "jeff",
   pw: "secret",
   repo: "sweetProject",

   // token will override basic auth if provided
   token: "OAUTHToken"
}
```
#### Main Features
The basic interface below is unlikely to change, although further features may be added later. For all of the below path is a string.

Interface | Description
--------- | ----------
`.get(path)`         | Returns the fileObject or directory for the relevant file. Takes a string relative path, and requires the `repo` and `user` to be set.
`.getUrl(path)`      | Returns the current url formed for the request. Mainly called internally.
`.getFileContents(path)` | Returns the `file` contents directly, decoded and ready to use.
`.listRepos()`  | List repositories of current user
`.getRepo(repo, user(optional))`  | Provides the repo object for a nominated repository. User defaults to current.
`.decode(encodedFile)`  | Decodes a file object in base64Unicode.



#### Configuration
```js
// sets/update a new repo
instance.repo = "NewRepo"

// sets/update user
instance.user = "newUser"

// returns the underlying axios instance
// which you can configure as you so desire
// More on axios here https://github.com/axios/axios
let axios = instance.axios
```

## Credits
Project built leaning heavily on the simplicity of the axios api.

## License
MIT
