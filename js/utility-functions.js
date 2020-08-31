/* jslint browser: true */
/* global XMLHttpRequest fetch */
/**
 * polyfil for new URL() call (but with better GET and hash parsing)
 * (see: https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
 *
 * convert a URL string into a URL object
 * @param {string} url url to be parsed
 * @returns {URL} url object, identical to new URL() call
 *                (except the hash can be before or after
 *                 the GET string)
 */
const getURLobject = (url) => {
  let urlParts
  let i = 0
  const output = {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    password: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
    searchParams: {},
    searchParamsRaw: {},
    username: ''
  }
  let key = ''
  let tmp = ''
  let reg
  let _url = ''

  if (typeof url === 'string') {
    _url = url
  } else if (typeof url.href === 'string') {
    _url = url.href
  }

  const cleanGET = (input) => {
    var _output = decodeURI(input)

    if (_output.toLowerCase() === 'true') {
      _output = true
    } else if (_output.toLowerCase() === 'false') {
      _output = false
    } else if (isNaN(_output) === false) {
      _output = (_output * 1)
    }
    return _output
  }

  if (typeof _url === 'string' && _url[0] !== '#') {
    //
    reg = new RegExp('((https?:|file:/)?//([^/#?]+))(:[0-9]+)?(/[^?#]+)(?:(?:(\\?)([^#]+)|(#)([^?]+))(?:(#)([^?]+)|(\\?)([^#]+))?)?', 'i')

    urlParts = reg.exec(_url)

    if (urlParts.length >= 3) {
      output.origin = urlParts[1]
      output.protocol = urlParts[2]
      output.href = url
      output.hostname = urlParts[3]
      output.host = urlParts[3]
      if (typeof urlParts[4] !== 'undefined') {
        output.port = urlParts[4]
      }
      output.pathname = urlParts[5]
      if (typeof urlParts[6] !== 'undefined') {
        output.search = urlParts[7]
      } else if (typeof urlParts[12] !== 'undefined') {
        output.search = urlParts[13]
      }

      if (typeof urlParts[8] !== 'undefined') {
        output.hash = '#' + urlParts[9]
      } else if (typeof urlParts[10] !== 'undefined') {
        output.hash = '#' + urlParts[11]
      }

      if (output.search !== '') {
        tmp = output.search.split('&')

        for (i = 0; i < tmp.length; i += 1) {
          tmp[i] = tmp[i].split('=')
          key = tmp[i][0]
          output.searchParams[key] = cleanGET(tmp[i][1])
          output.searchParamsRaw[key] = tmp[i][1]
        }

        output.search = '?' + output.search
      }

      if (output.protocol === '' && typeof window !== 'undefined' && typeof window.location !== 'undefined' && typeof window.location.protocol !== 'undefined') {
        output.protocol = window.location.protocol
      }
    }
  }

  return output
}
// ======================================================
// START: validation functions

/**
 * Test whether an object contains a given property and the value
 * of that property is a string
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is a string then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting erros).
 */
const invalidString = (prop, input, notEmpty) => {
  let tmp = ''

  if (typeof prop !== 'string') {
    throw new Error('invalidString() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidString() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  notEmpty = (typeof notEmpty === 'boolean') ? notEmpty : true
  if (tmp !== 'string') {
    return tmp
  } else if (notEmpty === true && input[prop].trim() === '') {
    return 'empty string'
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is either a string or a number
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is a string or number then
 *                         it is NOT invalid. Otherwise the value's
 *                         data type returned (so it can be used when
 *                         reporting errors).
 */
const invalidStrNum = (prop, input) => {
  let tmp = ''

  if (typeof prop !== 'string') {
    throw new Error('invalidStrNum() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidStrNum() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  if (tmp !== 'string' && tmp !== 'number') {
    return tmp
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is a number
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is a number then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
const invalidNum = (prop, input) => {
  let tmp = ''

  if (typeof prop !== 'string') {
    throw new Error('invalidNum() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidNum() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  if (tmp === 'undefined') {
    return tmp
  } else if (isNaN(input[prop])) {
    return tmp + ' (is not a number)'
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is an array
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is an array then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
const invalidArray = (prop, input) => {
  if (typeof prop !== 'string') {
    throw new Error('invalidArray() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidArray() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }
  if (!Array.isArray(input[prop])) {
    return typeof input[prop] + ' (not Array)'
  } else if (input[prop].length === 0) {
    return 'empty array'
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is a boolean
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is a boolean then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
const invalidBool = (prop, input) => {
  if (typeof prop !== 'string') {
    throw new Error('invalidArray() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidArray() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  return (typeof input[prop] !== 'boolean') ? typeof input[prop] : false
}

/**
 * Check whether something is a Function
 *
 * @param {mixed} functionToCheck function
 *
 * @returns {boolean} TRUE if the input is a Function
 */
const isFunction = (functionToCheck) => {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

/**
 * Test whether a variable is iterable
 *
 * @param {mixed} value to be tested
 *
 * @return {boolean} True if input is an array or iterable object
 */
const isIterable = (input) => {
  // checks for null and undefined
  if (input == null) {
    return false
  }
  return typeof input[Symbol.iterator] === 'function'
}

//  END: validation functions
// ======================================================

/**
 * makeAttributeSafe() makes a string safe to be used as an ID or
 * class name
 *
 * @param {string} _attr A string to be made safe to use as a HTML
 *             class name or ID
 *
 * @returns {string} class name or ID safe string
 */
const makeAttributeSafe = (_attr) => {
  const _isValid = new RegExp('^[a-z_-]', 'i')
  const _clean = new RegExp('[^a-z0-9_\\-]+', 'ig')
  let _output = ''

  if (typeof _attr !== 'string') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be a non-empty string. ' + typeof _attr + ' given.')
  }

  _output = _attr.replace(_clean, '')

  if (_output === '') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be string that can be used as an HTML class name or ID. "' + _attr + '" cannot be used. After cleaning, it became an empty string.')
  }

  if (!_isValid.test(_output)) {
    _output = '_' + _output
  }
  return _output
}

/**
 * makeHumanReadableAttr() makes a string safe to be used as an ID or
 * class name
 *
 * @param {string} _attr A string to be made safe to use as a HTML
 *             class name or ID
 *
 * @returns {string} class name or ID safe string
 */
const makeHumanReadableAttr = (_attr) => {
  const _clean = new RegExp('[^a-z0-9_\\-]+([a-z]?)', 'ig')
  const _isValid = new RegExp('^[a-z_-]', 'i')
  let _output = ''

  if (typeof _attr !== 'string') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be a non-empty string. ' + typeof _attr + ' given.')
  }

  _output = _attr.replace(_clean, (match, p1) => {
    return (typeof p1 !== 'undefined') ? p1.toUpperCase() : ''
  })

  if (_output === '') {
    throw new Error('makeHumanReadableAttr() expects only parameter "_attr" to be string that can be used as an HTML class name or ID. "' + _attr + '" cannot be used. After cleaning, it became an empty string.')
  }

  if (!_isValid.test(_output)) {
    _output = '_' + _output
  }
  return _output
}

/**
 * Run multiple regular expressions sequentially on a single string
 *
 * @param {string} input       The string which all the regexs are to
 *                             be applied
 * @param {array}  findReplace List of Find/Replace pairs where the
 *                             find property will be converted into
 *                             a RegExp object
 *                             findReplace object:
 *                             ```javascript
 *                             {
 *                               find:    (required)
 *                                        [regular expression string]
 *                               replace: (required)
 *                                        [replacement string]
 *                               flags:   (optional)
 *                                        [Override flags for this regex]
 *                             }
 *                             ```
 * @param {string} flags       RegExp flags to be passed for all
 *                             regexes (default is `ig`)
 *
 * @returns {string} Updated string
 */
const multiRegexReplace = (input, findReplace, flags) => {
  if (typeof input !== 'string') {
    console.error('multiRegexReplace() expects first parameter "input" to be a string. ' + typeof input + ' given.')
  }
  if (!Array.isArray(findReplace) && !isIterable(findReplace)) {
    console.error('multiRegexReplace() expects parameter second "findReplace" to be an array. ' + typeof findReplace + ' given.')
  }
  let _output = input

  const getValidFlags = (_flag) => {
    return _flags.replace(/[^gimsuy]+/g, '')
  }

  const _flags = (typeof flags === 'string') ? getValidFlags(flags) : 'ig'
  if (flags !== _flags) {
    console.warn('multiRegexReplace() expects third parameter "flags" to contain ')
  }

  let a = 0
  for (const pair in findReplace) {
    // console.group('findreplace[' + a + ']')
    // console.log('findreplace[' + a + ']:', pair)

    if (typeof pair.find !== 'string' || (typeof pair.replace !== 'string' && !isFunction(pair.replace))) {
      console.group('findreplace[' + a + ']')
      console.log('pair:', pair)
      console.error('multiRegexReplace() expects pair to be a valid find/replace object. It is missing either a "find" or "replace" property')
      console.groupEnd()
    }

    let _regex = null

    // use override flags if available
    const tmpFlags = (typeof pair.flags === 'string') ? getValidFlags(pair.flags) : _flags

    try {
      _regex = new RegExp(pair.find, tmpFlags)
    } catch (e) {
      console.error('multiRegexReplace() expects findReplace[' + a + '].find to contain a valid regular expression. It had the following error: "' + e.message + '"')
    }

    // console.log('_regex:', _regex)
    // console.log('findreplace[' + a + '].replace:', pair.replace)
    // console.log('_regex.test(_output):', _regex.test(_output))
    // console.log('_regex.match(_output):', _regex.match(_output))
    // console.groupEnd()

    _output = _output.replace(_regex, pair.replace)
    a += 1
  }

  return _output
}

/**
 *
 * @param {string} url      URL for
 * @param {object} postData
 *
 * @returns {Promise}
 */
const callRemoteAction = async (url, postData) => {
  const makePost = (data) => {
    const keys = Object.keys(data)
    let output = ''
    let sep = ''
    let hasInput = false
    for (let a = 0; a < keys.length; a += 1) {
      const key = keys[a]
      if (key !== 'input') {
        output += sep + key + '=' + encodeURI(data[key])
        sep = '&'
      } else {
        hasInput = true
      }
    }
    if (hasInput) {
      output += sep + 'input=' + encodeURI(data.input)
    }
    return output
  }

  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      // 'Content-Type': 'application/json'
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    // body data type must match "Content-Type" header
    // body: 'data=' + JSON.stringify(postData)
    body: makePost(postData)
  })
  return response.json() // parses JSON response into native JavaScript objects
}

/**
 * Generate an action function for a remote action
 *
 * @param {object} config Action config
 * @param {string} url    URL for XHR call
 *
 * @returns {function}
 */
const getRemoteActionFunc = (config, url) => {
  // set up remote action
  const userFields = []

  for (let a = 0; a < config.extraInputs.length; a += 1) {
    userFields.push(config.extraInputs[a].id)
  }

  console.log('config:', config)
  console.log('url:', url + config.action)

  // ----------------------------------------
  // start remote func

  return async (input, _extraInputs, GETvars) => {
    const post = {
      input: input
    }
    const wrapper = document.getElementById('input-wrapper')
    const GETvarKeys = Object.keys(GETvars)
    let output = input

    wrapper.className = 'input-wrapper not-waiting'
    wrapper.className = 'input-wrapper waiting'

    for (let a = 0; a < GETvarKeys.length; a += 1) {
      post[GETvarKeys[a]] = GETvars[GETvarKeys[a]]
    }

    for (let a = 0; a < userFields.length; a += 1) {
      post[userFields[a]] = _extraInputs[userFields[a]]()
    }

    console.log('output:', output)
    console.log('url:', url + config.action)

    await callRemoteAction(url + config.action, post).then((data) => {
      console.log('data:', data)
      console.log('this:', this)
      output = data.output

      wrapper.className = 'input-wrapper not-waiting'
      setTimeout(() => {
        wrapper.className = 'input-wrapper'
      }, 300)
    })

    console.log('output:', output)

    return output
  }

  // END remote func
  // ----------------------------------------
}
