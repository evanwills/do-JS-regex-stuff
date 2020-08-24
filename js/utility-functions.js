
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
  } else if (notEmpty === true && input[prop].replace(/^\s+|\s+$/g, '') === '') {
    return 'empty string'
  } else {
    return false
  }
}

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

function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
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
 *                             regexes
 *
 * @returns {string} Updated string
 */
function regexReplaceAll (input, findReplace, flags) {
  if (typeof input !== 'string') {
    console.error('regexReplaceAll() expects first parameter "input" to be a string. ' + typeof input + ' given.')
  }
  if (!Array.isArray(findReplace)) {
    console.error('regexReplaceAll() expects parameter second "findReplace" to be an array. ' + typeof findReplace + ' given.')
  }
  let _output = input

  const _flags = (typeof flags !== 'string') ? 'ig' : flags
  try {
    const _tmp = new RegExp('^.', _flags)
  } catch (e) {
    console.error('regexReplaceAll() expects third paremeter "flags" to be a string containing valid RegExp flags')
  }

  for (let a = 0; a < findReplace.length; a += 1) {
    if (typeof findReplace[a].find !== 'string' || (typeof findReplace[a].replace !== 'string' && !isFunction(findReplace[a].replace))) {
      console.group('findReplace[' + a + ']')
      console.log('findReplace[' + a + ']:', findReplace[a])
      console.error('regexReplaceAll() expects findReplace[' + a + '] to be a valid find/replace object. It is missing either a "find" or "replace" property')
      console.groupEnd()
    }
    let _regex = null
    try {
      _regex = new RegExp(findReplace[a].find, _flags)
    } catch (e) {
      console.error('regexReplaceAll() expects findReplace[' + a + '].find to contain a valid regular expression. It had the following error: "' + e.message + '"')
    }
    _output = _output.replace(_regex, findReplace[a].replace)
  }

  return _output
}
