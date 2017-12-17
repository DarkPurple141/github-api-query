simple-github-api
====

[![Build Status](https://travis-ci.org/DarkPurple141/github-api-query.svg?branch=master)](https://travis-ci.org/DarkPurple141/github-api-query)

This is a simple wrapper for the
[GitHub API](https://developer.github.com/v3/) to ease requesting files,
 directory information from a repository.

### Basic Usage:
```node
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

Full docs coming soon!

```js
const API = require('simple-github-api')

// constructor info coming soon or read the src

let instance = new API()

// returns the underlying axios instance
// which you can configure as you so desire
// More on axios here https://github.com/axios/axios
let axios = instance.axios

// returns the fully formed api url
let url = instance.getUrl('some/path')

// changes/updates the owner for the request to "differentUser"
instance.user = "differentUser"

// changes/updates the repo for the request to "differentRepo"
instance.repo = "differentRepo"
```

## Credits
Project built leaning heavily on the simplicity of the axios api.

## License
MIT
