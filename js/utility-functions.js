/* jslint browser: true */
/* global XMLHttpRequest */
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
function getURLobject (url) {
  var urlParts
  var i = 0
  var output = {
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
  var key = ''
  var tmp = ''
  var reg
  var _url = ''

  if (typeof url === 'string') {
    _url = url
  } else if (typeof url.href === 'string') {
    _url = url.href
  }

  function cleanGET (input) {
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
function invalidString (prop, input, notEmpty) {
  var tmp = ''

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
function invalidStrNum (prop, input) {
  var tmp = ''

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
function invalidNum (prop, input) {
  var tmp = ''

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
function invalidArray (prop, input) {
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
function invalidBool (prop, input) {
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
function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

/**
 * Test whether a variable is iterable
 *
 * @param {mixed} value to be tested
 *
 * @return {boolean} True if input is an array or iterable object
 */
function isIterable (input) {
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
function makeAttributeSafe (_attr) {
  var _output = ''
  var _isValid = new RegExp('^[a-z_-]', 'i')
  var _clean = new RegExp('[^a-z0-9_\\-]+', 'ig')

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
function makeHumanReadableAttr (_attr) {
  var _clean = new RegExp('[^a-z0-9_\\-]+([a-z]?)', 'ig')
  var _isValid = new RegExp('^[a-z_-]', 'i')
  var _output = ''

  if (typeof _attr !== 'string') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be a non-empty string. ' + typeof _attr + ' given.')
  }

  _output = _attr.replace(_clean, function (match, p1) { return (typeof p1 !== 'undefined') ? p1.toUpperCase() : '' })

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
 * @param {string} flags       RegExp flags to be passed for all
 *                             regexes (default is `ig`)
 *
 * @returns {string} Updated string
 */
function multiRegexReplace (input, findReplace, flags) {
  if (typeof input !== 'string') {
    console.error('multiRegexReplace() expects first parameter "input" to be a string. ' + typeof input + ' given.')
  }
  if (!Array.isArray(findReplace) && !isIterable(findReplace)) {
    console.error('multiRegexReplace() expects parameter second "findReplace" to be an array. ' + typeof findReplace + ' given.')
  }
  let _output = input

  const _flags = (typeof flags !== 'string') ? 'ig' : flags
  try {
    const _tmp = new RegExp('^.', _flags)
  } catch (e) {
    console.error('multiRegexReplace() expects third paremeter "flags" to be a string containing valid RegExp flags')
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

    try {
      _regex = new RegExp(pair.find, _flags)
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
 * @param {object} config
 * @param {string} url
 * @returns {function}
 */
const getRemoteActionFunc = (config, url) => {
  // set up remote action
  const userFields = []
  const xhr = XMLHttpRequest()
  /**
   * Callback function to be passed to
   * @param {string} input
   * @param {string} output
   */
  const xhrChange = (input, output) => () => {
    if (this.status >= 200 && this.status < 300) {
      // What do when the request is successful
      console.log('success!', this)
      let tmp = {}
      try {
        tmp = JSON.parse(this.response)
      } catch (e) {
        console.error(config.action + ' returned an invalid response', e)
        tmp = { output: input }
      }
      output = tmp.input
    } else {
      // What do when the request fails
      console.log('The request failed!')
    }

    // Code that should run regardless of the request status
    // console.log('This always runs...');
  }

  for (let a = 0; a < config.extraInputs.length; a += 1) {
    userFields.push(config.extraInputs[a].id)
  }

  // ----------------------------------------
  // start remote func

  return (input, _extraInputs, GETvars) => {
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
    console.log('post:', post)

    xhr.onreadystatechange = xhrChange(input, output)

    xhr.open('post', url + config.action)
    xhr.send(JSON.stringify(post))

    wrapper.className = 'input-wrapper not-waiting'
    setTimeout(() => {
      wrapper.className = 'input-wrapper'
    }, 300)

    return output
  }
  // END remote func
  // ----------------------------------------
}
