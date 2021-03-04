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
// START: DOM creation functions

/**
 * getLabel() returns a field's label DOMelement (for semantic and
 * accessible form fields)
 *
 * @param {object} config all the metadata required to create a
 *             label element. Object requires "id" & "label"
 *             properties
 * @param {boolean} groupLabel If the label is for a group of input
 *             fields the the returned node will be a <DIV> instead
 *             of a label
 * @returns {DOMelement} HTML Label element used for simple
 *             description of form field
 */
const getLabel = (config, groupLabel) => {
  const tmp = invalidString('label', config)
  let _node = null
  let _element = 'label'
  let _text = null

  if (tmp !== false) {
    throw new Error('All extra input fields must have a label property. ' + config.id + ' does not have a valid label')
  }

  _text = document.createTextNode(config.label)

  if (typeof groupLabel === 'boolean' && groupLabel === true) {
    _element = 'div'
  } else {
    groupLabel = false
  }

  _node = document.createElement(_element)
  _node.className = 'custom-fields--label'
  _node.setAttribute('id', 'group-' + config.id)

  if (groupLabel === false) {
    // only relavent for single input fields
    // (not radio or checkbox)
    _node.setAttribute('for', config.id)
  }

  _node.appendChild(_text)

  return _node
}

/**
 * getDescription() returns a span DOMelement containing a longer
 * description of the purpose of a form fieldd (for semantic and
 * accessible form fields)
 *
 * @param {object} config all the metadata required to create a
 *             textarea element
 * @returns {DOMelement} HTML span element
 */
const getDescription = (config) => {
  // Assumption here is that description was already tested for
  // before this function was called
  const _node = document.createElement('span')
  const _text = document.createTextNode(config.description)

  _node.setAttribute('id', config.action + 'Desc')
  _node.className = 'input-description'
  _node.appendChild(_text)

  return _node
}

/**
 * setTextInputAttributes() returns an form field DOM element
 *
 * @param {string} nodeType type of input to be created
 * @param {object} config all the metadata required to create a
 *             textarea element
 * @param {object} url    URL object containing all the metadata of
 *             the request URI (including GET variables)
 *
 * @returns {object} Object with two properties:
 *          * "node" - A DOM node containing a sematically correct
 *                     text type field and
 *          * "getter" - A function used by the developer to get
 *                     the current value of the radio field
 */
const setTextInputAttributes = (nodeType, config, url) => {
  const textTypes = ['text', 'textarea', 'number', 'email']
  let _node = null

  if (textTypes.indexOf(nodeType) === -1) {
    throw new Error('DoStuff.setTextInputAttributes() expects first parameter "noteType" to be a string matching the name of a valid HTML text type input field')
  }
  if (nodeType === 'textarea') {
    _node = document.createElement('textarea')
  } else {
    _node = document.createElement('input')
    _node.setAttribute('type', nodeType)
  }

  _node.setAttribute('id', config.id)
  _node.setAttribute('name', config.id)

  if (!invalidString('placeholder', config)) {
    _node.setAttribute('placeholder', config.placeholder)
  }
  if (!invalidString('pattern', config)) {
    _node.setAttribute('pattern', config.pattern)
  }
  if (!invalidNum('size', config)) {
    _node.setAttribute('size', config.pattern)
  }
  if (!invalidNum('maxlength', config)) {
    _node.setAttribute('maxlength', config.pattern)
  }

  // Try and preset the default value for the text type field
  if (!invalidString(config.id, url.searchParams, false)) {
    _node.value = url.searchParams[config.id]
  } else {
    if (!invalidStrNum('default', config)) {
      _node.value = config.default
    }
  }

  return { node: _node, getter: function () { return _node.value } }
}

/**
 * getTextarea() returns a textarea DOMelement
 *
 * @param {object} config all the metadata required to create a
 *             textarea element
 * @param {object} url    URL object containing all the metadata of
 *             the request URI (including GET variables)
 *
 * @returns {object} Object with two properties:
 *          * "node" - A DOM node containing a sematically correct
 *                     text area field and
 *          * "getter" - A function used by the developer to get
 *                     the current value of the radio field
 */
const getTextarea = (config, url) => {
  return setTextInputAttributes('textarea', config, url)
}

/**
 * getText() returns a text input DOMelement
 *
 * @param {string} inputType The type of text input field
 * @param {object} config All the metadata required to create a
 *             textarea element
 * @param {object} url    URL object containing all the metadata of
 *             the request URI (including GET variables)
 *
 * @returns {object} Object with two properties:
 *          * "node" - A DOM node containing a sematically correct
 *                     text input field and
 *          * "getter" - A function used by the developer to get
 *                     the current value of the radio field
 */
const getText = (inputType, config, url) => {
  return setTextInputAttributes(inputType, config, url)
}

/**
 * getNumber() returns a numbers input DOMelement
 *
 * @param {object} config all the metadata required to create a
 *             textarea element
 * @param {object} url    URL object containing all the metadata of
 *             the request URI (including GET variables)
 *
 * @returns {object} object with two properties:
 *          * "node" - a DOM node containing a sematically correct
 *                     number input field and
 *          * "getter" - a function used by the developer to get
 *                     the current value of the radio field
 */
const getNumber = (config, url) => {
  const _node = setTextInputAttributes('number', config, url)

  if (!invalidNum('min', config)) {
    _node.node.setAttribute('min', config.min * 1)
  }
  if (!invalidNum('max', config)) {
    _node.node.setAttribute('max', config.max * 1)
  }
  if (!invalidNum('step', config)) {
    _node.node.setAttribute('step', config.step * 1)
  }
  return _node
}

/**
 * getSelectOption() returns a single select option to be appended
 * to a select field
 *
 * @param {object} config all the metadata required to create a
 *             textarea element
 *
 * @returns {object} object with two properties:
 *          * "node" - a DOM node containing a sematically correct
 *                     radio or checkbox input field and
 *          * "getter" - a function used by the developer to get
 *                     the current value of the radio field
 */
const getSelectOption = (_value, _label, _default) => {
  const _node = document.createElement('option')
  const _text = document.createTextNode(_label)

  // assumption is that parameters have already been validated
  // by calling function

  _node.value = _value
  _node.appendChild(_text)

  if (typeof _default === 'boolean' && _default === true) {
    _node.setAttribute('selected', 'selected')
  }

  return _node
}

/**
 * getSelect() returns a full select field with all specified
 * options
 *
 * @param {object} config all the metadata required to create
 *             a textarea element
 * @param {object} url    URL object containing all the metadata of
 *             the request URI (including GET variables)
 *
 * @returns {object} object with two properties:
 *          * "node" - a DOM node containing a sematically correct
 *                     radio or checkbox input field and
 *          * "getter" - a function used by the developer to get
 *                     the current value of the radio field
 */
const getSelect = (config, url) => {
  const _node = document.createElement('select')
  let _isDefault = false
  let a = 0
  let tmp = false

  _node.setAttribute('id', config.id)
  _node.setAttribute('name', config.id)

  tmp = invalidArray('options', config)
  if (tmp !== false) {
    throw new Error('getSelect() expects config to contain an options property that is a non-empty array. ' + tmp + ' given')
  }

  for (a = 0; a < config.options.length; a += 1) {
    tmp = invalidStrNum('value', config.options[a])
    if (tmp !== false) {
      throw new Error('getSelect() expects option ' + a + ' to have a value that is either a string or a nubmer. ' + tmp + ' given.')
    }
    tmp = invalidString('label', config.options[a])
    if (tmp !== false) {
      throw new Error('getSelect() expects option ' + a + ' to have a label that is a string. ' + tmp + ' given.')
    }

    if (typeof url.searchParams[config.id] === 'string') {
      _isDefault = (url.searchParams[config.id] === config.options[a].value)
    } else {
      _isDefault = (typeof config.options[a].default === 'boolean') ? config.options[a].default : false
    }

    _node.appendChild(getSelectOption(config.options[a].value, config.options[a].label, _isDefault))
  }
  return { node: _node, getter: function () { return _node.value } }
}

/**
 * getGroupableInput() builds either checkbox or radio input fields
 *
 * @param {object} config object containing metadata required for
 *             building a radio or checkbox field
 * @param {object} url    URL object containing all the metadata of
 *             the request URI (including GET variables)
 *
 * @returns {object} object with two properties:
 *          * "wrapper" - a DOM node containing a sematically
 *                     correct radio or checkbox input field and
 *          * "field" - a DOM node representing the actual input
 *                     field
 */
const getGroupableInput = (config, url) => {
  const _wrapper = document.createElement('label')
  const _input = document.createElement('input')
  const _labelText = document.createTextNode(config.label)
  let _id = config.id
  let _name = config.id
  let _isDefault = false

  // assumtion is that config properties have already been
  // validated by the calling function

  try {
    _id = makeAttributeSafe(config.id + '__' + config.value)
  } catch (e) {
    console.warn('could not convert "' + config.label + '" to an ID')
  }

  _input.setAttribute('type', config.type)

  if (config.type === 'checkbox') {
    _name = _id
  }

  _input.setAttribute('name', _name)
  _input.setAttribute('id', _id)
  _input.setAttribute('value', config.value)

  if (typeof url.searchParams[_name] === 'string') {
    _isDefault = (url.searchParams[_name] === config.value)
  } else {
    _isDefault = config.default
  }

  if (_isDefault === true) {
    _input.setAttribute('checked', 'checked')
  }

  _wrapper.className = 'wrap-label'
  _wrapper.appendChild(_input)
  _wrapper.appendChild(_labelText)

  return { wrapper: _wrapper, field: _input }
}

/**
 * getRadio() returns a semantically correct input group containing
 *            a (developer defined) number of radio input fields
 *            which all share the same "name" attribute
 *
 * @param {object} config object containing metadata required for
 *             building a group of radio fields
 * @param {object} url    URL object containing all the metadata of
 *             the request URI (including GET variables)
 *
 * @returns {object} object with two properties:
 *          * "node" - a DOM node containing a sematically correct
 *                     group of radio input fields and
 *          * "getter" - a function used by the developer to get
 *                     the current value of the radio field
 */
const getRadio = (config, url) => {
  const _wrapper = document.createElement('p')
  const _fields = []
  let _tmp = null
  let a = 0
  let _count = 0
  let _getterFunc = null
  let tmp = false

  for (a = 0; a < config.options.length; a += 1) {
    tmp = invalidString('label', config.options[a])
    if (tmp !== false) {
      throw new Error('getRadio() expects option ' + a + ' to have a "label" property that is a non-empty string. ' + tmp + ' given.')
    }
    tmp = invalidStrNum('value', config.options[a])
    if (tmp !== false) {
      throw new Error('getRadio() expects option ' + a + ' to have a "value" property that is a either a string or a number. ' + tmp + ' given.')
    }

    _tmp = getGroupableInput({
      id: config.id,
      type: 'radio',
      label: config.options[a].label,
      value: config.options[a].value,
      default: (typeof config.options[a].default === 'boolean' && config.options[a].default === true)
    }, url)

    _wrapper.appendChild(_tmp.wrapper)
    _fields.push(_tmp.field)
  }
  _count = _fields.length

  _getterFunc = function () {
    for (let i = 0; i < _count; i += 1) {
      if (_fields[i].checked) {
        return _fields[i].value
      }
    }
    return false
  }

  return { node: _wrapper, getter: _getterFunc }
}

/**
 * getCheckbox() returns a semantically correct input group
 *            containing a (developer defined) number of checkbox
 *            input fields
 *
 * @param {object} config object containing metadata required for
 *             building a group of checkbox fields
 * @param {object} url    URL object containing all the metadata of
 *             the request URI (including GET variables)
 *
 * @returns {object} object with two properties:
 *          * "node" - a DOM node containing a sematically correct
 *                     group of checkbox input fields and
 *          * "getter" - a function used by the developer to get
 *                     the current value of the radio field
 */
const getCheckbox = (config, url) => {
  const _wrapper = document.createElement('p')
  const _fields = {}
  let _tmp = null
  let _count = 0
  let _getterFunc = null
  let _tmpCBID = ''
  let a = 0
  let tmp = false

  for (a = 0; a < config.options.length; a += 1) {
    tmp = invalidString('label', config.options[a])
    if (tmp !== false) {
      throw new Error('getCheckbox() expects option ' + a + ' to have a "label" property that is a non-empty string. ' + tmp + ' given.')
    }
    tmp = invalidStrNum('value', config.options[a])
    if (tmp !== false) {
      throw new Error('getCheckbox() expects option ' + a + ' to have a "value" property that is a either a string or a number. ' + tmp + ' given.')
    }
    _tmp = getGroupableInput({
      id: config.id,
      type: 'checkbox',
      label: config.options[a].label,
      value: config.options[a].value,
      default: (typeof config.options[a].default === 'boolean' && config.options[a].default === true)
    }, url)

    _wrapper.appendChild(_tmp.wrapper)
    _tmpCBID = config.options[a].value
    _fields[_tmpCBID] = _tmp.field
  }
  _count = a

  if (_count === 1) {
    _getterFunc = (box) => {
      return _fields[_tmpCBID].checked
    }
  } else {
    _getterFunc = (box) => {
      if (typeof box !== 'string') {
        throw new Error('getter Function for "' + config.label + '" requires only parameter "box" to be a string that matches the value of a checkbox in the "' + config.id + '" group. ' + typeof box + ' given.')
      } else if (typeof _fields[box] === 'undefined') {
        throw new Error('Could not find checkbox matching "' + box + '" in "' + config.id + '" group.')
      }

      return _fields[box].checked
    }
  }

  return { node: _wrapper, getter: _getterFunc }
}

//  END:  DOM creation functions
// ======================================================
// START: validation functions


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
  return (typeof input[Symbol.iterator] === 'function' || typeof input.propertyIsEnumerable === 'function')
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

  const getValidFlags = (regExpFlag) => {
    return regExpFlag.replace(/[^gimsuy]+/g, '')
  }

  const _flags = (typeof flags === 'string') ? getValidFlags(flags) : 'ig'
  if (flags !== _flags) {
    // console.lob
    console.warn('multiRegexReplace() expects third parameter "flags" to contain valid JavaScript flags ("i", "g", "m", "s", "u", "y") supplied global flags ("' + flags + '") contained invalid characters')
  }

  // let b = 0
  for (const a in findReplace) {
    const pair = findReplace[a]

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
      console.group('findreplace[' + a + ']')
      console.log('pair:', pair)
      console.log('pair.find:', pair.find)
      console.log('tmpFlags:', tmpFlags)
      console.log('_regex:', _regex)
      console.error('multiRegexReplace() expects findReplace[' + a + '].find to contain a valid regular expression. It had the following error: "' + e.message + '"')
      console.groupEnd()
    }
    // console.group('findreplace[' + a + ']')
    // console.log('pair:', pair)
    // console.log('pair.find:', pair.find)
    // console.log('pair.replace:', pair.replace)
    // console.log('tmpFlags:', tmpFlags)
    // console.log('_regex:', _regex)
    // console.log('BEFORE:', _output)
    // console.log('AFTER:', _output.replace(_regex, pair.replace))
    // console.groupEnd()

    _output = _output.replace(_regex, pair.replace)
    // b += 1
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

    await callRemoteAction(url + config.action, post).then((data) => {
      output = data.output

      wrapper.className = 'input-wrapper not-waiting'
      setTimeout(() => {
        wrapper.className = 'input-wrapper'
      }, 300)
    })

    return output
  }

  // END remote func
  // ----------------------------------------
}
