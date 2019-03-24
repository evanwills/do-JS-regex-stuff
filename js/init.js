
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
          output.searchParams[key] = tmp[i][1]
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

/**
 *
 * @param {string} url
 */
var DoStuff = function (url) {
  /**
   * @var {string} action what the "app" is app is doing at the moment
   *
   * It's used to identify the function to be used to modify the input
   */
  var action = ''

  /**
   * @var {function} actionFunction the function to be called when
   *               modifying the input
   */
  var actionFunction = null

  /**
   * @var {string} actionName Human friendly name of the action
   */
  var actionName = ''

  /**
   * @var {string} baseURL used as the main part of the URL for all
   *             links
   */
  var baseURL = ''

  /**
   * @var {DOMelement} customFields the un-ordered list element
   */
  var customFields = document.getElementById('custom-fields')

  /**
   * @var {DOMelement} debugField textarea field used to output the
   *             results of the action function.
   *
   * Useful when you're creating a new action and you want to use
   * the same input over and over again.
   */
  var debugField = null

  /**
   * @var {string} debugGet string to be appended to the URL of all
   *             links when in debug mode it adds a GET variable to
   *             the URL
   */
  var debugGet = ''

  /**
   * @var {boolean} debugMode whether the script is in "Debug Mode"
   */
  var debugMode = false

  /**
   * @var {DOMelement} docTitle the Title element in the page header
   */
  var docTitle = document.getElementById('doc-title')

  /**
   * @var {array} extraInputs [array] An array of objects where the key is the "name" attribute
   *      for an input field and the value is a function that returns
   *      the value for that input field
   */
  var extraInputs = {}

  /**
   * @var {DOMelement} inputTextarea the textarea element where the
   *             text that is to be modified by the "app" is put by
   *             the user and where the modified output of the action
   *             is also put once the action has been run
   */
  var inputTextarea = document.getElementById('input')

  /**
   * @var {DOMelement} inputWrapper The wrapper for the main input text area
   */
  var inputWrapper = document.getElementById('input-wrapper')

  /**
   * @var {DOMelement} mask a button element stretched across the
   *             whole visible window area that when clicked on
   *             closes the navingation (berger) menu
   */
  var mask = document.getElementById('nav-show-hide__mask')

  /**
   * @var {DOMelement} menuShowHide the button used for showing and
   *             hiding the navigation menue
   */
  var menuShowHide = document.getElementById('nav-show-hide')

  /**
   * @var {DOMelement} noAction where the message explaining what is
   *             happeing when no action has been selected and also
   *             the place to put the action description if one has
   *             been set.
   */
  var noAction = document.getElementById('no-action')

  /**
   * @var {DOMelement} nav the unordered list use to house all the
   *             action links
   */
  var nav = document.getElementById('menu-items')

  /**
   var mask = document.getElementById('nav-show-hide__mask')
   * @var {DOMelement} navWrap the wrapping element for the
   *             navigation (Berger) Menu
   */
  var navWrap = document.getElementById('main-nav')

  /**
   * @var {boolean} navOpen whether or not the nav (burger menu) is
   *              open or closed
   */
  var navOpen = false

  /**
   * @var {object} registry list of objects where the key is the
   *             action name and the value is all the metadata for
   *             the action plus the action function
   */
  var registry = {}

  /**
   * @var {DOMelement} renderOuput textarea used to render the output
   *             of an action when in Debug mode
   */
  var renderOutput = null

  // var customFields = document.getElementById('some-action')

  /**
   * @var {DOMelement} someAction the main form element where all
   *             the cool stuff happens
   */
  var someAction = document.getElementById('some-action')

  /**
   * @var {DOMelement} subTitle the page's main H2 element
   *
   * Used to set house the action's name in the main page content
   */
  var subTitle = document.getElementById('sub-title')

  /**
   * @var {DOMelement} submit the submit button used to trigger an
   *             action to modify the user's input
   */
  var submit = document.getElementById('submit')

  /**
   * @var object URL contains all the parts of a URL, making it easy
   *             to use varios parts just as individual parts.
   *
   * In this case it's used to create the base URL used for all links
   * plus provide easy access to GET variables.
   */
  var URL = null

  //  END:  object (private) properties
  // ======================================================
  // START: private functions

  /**
   * updateRegistry adds a new action to the registry of action
   *
   * @param {object} config config object used containing the
   *             action's function and all the metadata needed to
   *             initialise the action if selected
   */
  function updateRegistry (config) {
    if (typeof config.action !== 'string' || config.action === '') {
      throw new Error('a "action" property that is a non-empty string. ' + typeof config.name + ' given.')
    }
    if (typeof config.name !== 'string' || config.name === '') {
      throw new Error('a "name" property that is a non-empty string. ' + typeof config.name + ' given.')
    }
    if (typeof config.func !== 'function') {
      throw new Error('a "func" property that is a plain javascript function. ' + typeof config.name + ' given.')
    }
    config.action = config.action.toLowerCase()

    // TODO: work out how to sort the registry so it's always in
    // alphabetical order (by name, not action)
    registry[config.action] = config
  }

  function makeAttributeSafe (_attr) {
    var _output = ''
    var _valid = new RegExp('^[a-z_-]', 'i')
    var _clean = new RegExp('[^a-z0-9_\\-]+', 'ig')

    if (typeof _attr !== 'string') {
      throw new Error('makeAttributeSafe() expects only parameter "_attr" to be a non-empty string. ' + typeof _attr + ' given.')
    }

    _output = _attr.replace(_clean, 'makeAttributeSafe() expects only parameter "_attr" to be string that can be used as an HTML class name or ID. "' + _attr + '" cannot be used. After cleaning, it became an empty string.')

    if (_output === '') {
      throw new Error('')
    }

    if (!_valid.test(_output)) {
      _output = '_' + _output
    }
    return _output
  }

  /**
   * initialiseAction() does all the work of making an action
   * available to the user once the user has selected that action
   *
   * @param {string} _action name of the action to be initialised
   *            (as listed in the registry)
   *
   * @returns {void}
   */
  function initialiseAction (_action) {
    var a = 0

    if (typeof _action !== 'string') {
      throw new Error('DoStuff.initialiseAction() expects only parameter "_action" to be a string. ' + typeof _action + ' given.')
    }
    if (typeof registry[_action] === 'undefined') {
      throw new Error('DoStuff.initialiseAction() expects only parameter "_action" to be a string that matches a key in the registry of actions. ' + typeof _action + ' given.')
    }

    docTitle.innerHTML = 'Do JS Regex Stuff &ndash; ' + registry[_action].name
    subTitle.className = ''
    subTitle.innerHTML = registry[_action].name
    actionFunction = registry[_action].func
    someAction.className = ''

    if (typeof registry[_action].description === 'string' && registry[_action].description !== '') {
      noAction.innerHTML = registry[_action].description
      noAction.className = 'description'
    } else {
      noAction.className = 'hide'
    }

    customFields.innerHTML = ''
    customFields.className = 'custom-fields hide'

    if (Array.isArray(registry[_action].extraInputs)) {
      for (a = 0; a < registry[_action].extraInputs.length; a += 1) {
        customFields.appendChild(getSingleExtraInput(registry[_action].extraInputs[a]))
      }
      if (a > 0) {
        customFields.className = 'custom-fields'
      }
    }
  }

  /**
   * getNavClickHandler() returns a function to be used as the
   * onClick callaback function when a navigation item is clicked
   *
   * @param {string} _action name of the action to be initialised
   *             (as listed in the registry)
   *
   * @returns {function} calback to be passed to the onclick event
   *             handler
   */
  function getNavClickHandler (_action) {
    return function (e) {
      var success = true
      e.preventDefault()

      try {
        initialiseAction(_action)
      } catch (error) {
        success = false
        console.error(error)
      }

      if (success === true) {
        hideBurger()
        history.pushState({ id: _action }, registry[_action].name, baseURL + _action + debugGet)
        submit.onclick = doMagic()
      }
    }
  }

  // ======================================================
  // START: extra field generators

  /**
   * setTextInputAttributes() returns an form field DOM element
   *
   * @param {string} nodeType type of input to be created
   * @param {object} config all the metadata required to create a
   *             textarea element
   *
   * @returns {object} Object with two properties:
   *          * "node" - A DOM node containing a sematically correct
   *                     text type field and
   *          * "getter" - A function used by the developer to get
   *                     the current value of the radio field
   */
  function setTextInputAttributes (nodeType, config) {
    var textTypes = ['text', 'textarea', 'number', 'email']
    var _node = null

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

    if (typeof config.default === 'string') {
      _node.value = config.default
    }
    if (typeof config.placeholder === 'string' && config.placeholder !== '') {
      _node.setAttribute('placeholder', config.placeholder)
    }
    if (typeof config.pattern === 'string' && config.pattern !== '') {
      _node.setAttribute('pattern', config.pattern)
    }
    if (typeof config.default === 'string' || typeof config.default === 'number') {
      _node.value = config.default
    }

    console.log('_node:', _node)
    return { node: _node, getter: function () { return _node.value } }
  }

  /**
   * getTextarea() returns a textarea DOMelement
   *
   * @param {object} config all the metadata required to create a
   *             textarea element
   *
   * @returns {object} Object with two properties:
   *          * "node" - A DOM node containing a sematically correct
   *                     text area field and
   *          * "getter" - A function used by the developer to get
   *                     the current value of the radio field
   */
  function getTextarea (config) {
    return setTextInputAttributes('textarea', config)
  }

  /**
   * getText() returns a text input DOMelement
   *
   * @param {string} inputType The type of text input field
   * @param {object} config All the metadata required to create a
   *             textarea element
   *
   * @returns {object} Object with two properties:
   *          * "node" - A DOM node containing a sematically correct
   *                     text input field and
   *          * "getter" - A function used by the developer to get
   *                     the current value of the radio field
   */
  function getText (inputType, config) {
    return setTextInputAttributes(inputType, config)
  }

  /**
   * getNumber() returns a numbers input DOMelement
   *
   * @param {object} config all the metadata required to create a
   *             textarea element
   *
   * @returns {object} object with two properties:
   *          * "node" - a DOM node containing a sematically correct
   *                     number input field and
   *          * "getter" - a function used by the developer to get
   *                     the current value of the radio field
   */
  function getNumber (config) {
    var _node = setTextInputAttributes('number', config)

    if (typeof (config.min * 1) === 'number') {
      _node.node.setAttribute('min', config.min * 1)
    }
    if (typeof (config.max * 1) === 'number') {
      _node.node.setAttribute('max', config.max * 1)
    }
    if (typeof (config.step * 1) === 'number') {
      _node.node.setAttribute('step', config.step * 1)
    }
    return _node
  }

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
  function getLabel (config, groupLabel) {
    var _node = null
    var _element = 'label'
    var _text = document.createTextNode(config.label)

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
  function getDescription (config) {
    var _node = document.createElement('span')
    var _text = document.createTextNode(config.description)

    _node.setAttribute('id', config.action + 'Desc')
    _node.className = 'input-description'
    _node.appendChild(_text)

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
  function getSelectOption (_value, _label, _default) {
    var _node = document.createElement('option')
    var _text = document.createTextNode(_label)

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
   *
   * @returns {object} object with two properties:
   *          * "node" - a DOM node containing a sematically correct
   *                     radio or checkbox input field and
   *          * "getter" - a function used by the developer to get
   *                     the current value of the radio field
   */
  function getSelect (config) {
    var _node = document.createElement('select')
    var _isDefault = false
    var a = 0

    _node.setAttribute('id', config.id)
    _node.setAttribute('name', config.id)

    for (a = 0; a < config.options.length; a += 1) {
      _isDefault = (typeof config.options[a].default === 'boolean') ? config.options[a].default : false
      _node.appendChild(getSelectOption(config.options[a].value, config.options[a].label, _isDefault))
    }
    return { node: _node, getter: function () { return _node.value } }
  }

  /**
   * getGroupableInput() builds either checkbox or radio input fields
   *
   * @param {object} config object containing metadata required for
   *             building a radio or checkbox field
   *
   * @returns {object} object with two properties:
   *          * "wrapper" - a DOM node containing a sematically
   *                     correct radio or checkbox input field and
   *          * "field" - a DOM node representing the actual input
   *                     field
   */
  function getGroupableInput (config) {
    var _wrapper = document.createElement('label')
    var _input = document.createElement('input')
    var _label = document.createTextNode(config.label)
    var _id = config.id
    var _name = config.id

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

    if (typeof config.default === 'boolean' && config.default === true) {
      _input.setAttribute('checked', 'checked')
    }

    _wrapper.appendChild(_input)
    _wrapper.appendChild(_label)

    return { wrapper: _wrapper, field: _input }
  }

  /**
   * getRadio() returns a semantically correct input group containing
   *            a (developer defined) number of radio input fields
   *            which all share the same "name" attribute
   *
   * @param {object} config object containing metadata required for
   *             building a group of radio fields
   *
   * @returns {object} object with two properties:
   *          * "node" - a DOM node containing a sematically correct
   *                     group of radio input fields and
   *          * "getter" - a function used by the developer to get
   *                     the current value of the radio field
   */
  function getRadio (config) {
    var _wrapper = document.createElement('p')
    var _tmp = null
    var a = 0
    var _fields = []
    var _count = 0
    var _getterFunc = null

    for (a = 0; a < config.options.length; a += 1) {
      _tmp = getGroupableInput({
        id: config.id,
        type: 'radio',
        label: config.options[a].label,
        value: config.options[a].value,
        defaulg: (typeof config.options[a].default === 'boolean' && config.options[a].default === true)
      })

      _wrapper.appendChild(_tmp.wrapper)
      _fields.push(_tmp.field)
    }
    _count = _fields.length

    _getterFunc = function () {
      var i = 0
      for (i = 0; i < _count; i += 1) {
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
   *
   * @returns {object} object with two properties:
   *          * "node" - a DOM node containing a sematically correct
   *                     group of checkbox input fields and
   *          * "getter" - a function used by the developer to get
   *                     the current value of the radio field
   */
  function getCheckbox (config) {
    var _wrapper = document.createElement('p')
    var _tmp = null
    var a = 0
    var _fields = {}
    var _count = 0
    var _getterFunc = null
    var _tmpCBID = ''

    for (a = 0; a < config.options.length; a += 1) {
      _tmp = getGroupableInput({
        id: config.id,
        type: 'checkbox',
        label: config.options[a].label,
        value: config.options[a].value,
        defaulg: (typeof config.options[a].default === 'boolean' && config.options[a].default === true)
      })

      _wrapper.appendChild(_tmp.wrapper)
      _tmpCBID = config.options[a].value
      _fields[_tmpCBID] = _tmp.field
    }
    _count = a

    if (_count === 1) {
      _getterFunc = function (box) {
        return _fields[_tmpCBID].checked
      }
    } else {
      _getterFunc = function (box) {
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

  /**
   * getSingleExtraInput() returns a full semantically correct
   * accessible form field wrapped in a list item
   *
   * @param {object} config all the metadata required to create
   *             a textarea element
   * @returns {DOMelement} HTML single, semantically correct form
   *             field containing:
   *              * A label
   *              * A field (or group of fields) and
   *              * A field description of the field's purpose (if available)
   */
  function getSingleExtraInput (config) {
    var _node = document.createElement('li')
    var _inputWrap = document.createElement('div')
    var _input = null
    var _desc = null
    var _default = true

    config.id = makeAttributeSafe(config.id)

    switch (config.type) {
      case 'select':
        _input = getSelect(config)
        break

      case 'number':
        _input = getNumber(config)
        break

      case 'textarea':
        _input = getTextarea(config)
        break

      case 'radio':
        _default = false
        if (!Array.isArray(config.options) || config.options.length === 0) {
          throw new Error('Radio button inputs must have an "options" property. No "options" property was defined for "' + config.id + '" ("' + config.label + '").')
        }
        _input = getRadio(config)
        _node.setAttribute('role', 'group')
        _node.setAttribute('aria-labelledby', 'group-' + config.id)
        break

      case 'checkbox':
        _default = false
        if (!Array.isArray(config.options) || config.options.length === 0) {
          throw new Error('Radio button inputs must have an "options" property. No "options" property was defined for "' + config.id + '" ("' + config.label + '").')
        }
        _input = getCheckbox(config)
        _node.setAttribute('role', 'group')
        _node.setAttribute('aria-labelledby', 'group-' + config.id)
        break

      default:
        _input = getText(config.type, config)
    }

    if (typeof config.description === 'string' && config.description !== '') {
      if (_default === true) {
        _input.node.setAttribute('aria-describedby', config.action + 'Desc')
      }
      _desc = getDescription(config)
    }

    _inputWrap.className = 'input-wrap'

    _node.appendChild(getLabel(config, !_default))
    _inputWrap.append(_input.node)
    if (_desc !== null) {
      _inputWrap.appendChild(getDescription(config))
    }
    _node.appendChild(_inputWrap)

    extraInputs[config.id] = _input.getter

    return _node
  }

  //  END: extra field generators
  // ======================================================

  /**
   * addToNav() adds links to navigation (burger) menu
   * @param {string} _action identifier of action for which a link
   *                 is to be created
   * @returns {void}
   */
  function addToNav (_action) {
    var li = null
    var a = null
    var linkText = null
    // var desc = null

    // if (typeof registry[_action] !== 'undefined') {

    a = document.createElement('a')
    a.setAttribute('href', baseURL + _action + debugGet)
    linkText = document.createTextNode(registry[_action].name)
    if (typeof registry[_action].description === 'string') {
      a.setAttribute('title', registry[_action].description)
    }
    a.setAttribute('data-title', registry[_action].name)
    a.appendChild(linkText)
    a.onclick = getNavClickHandler(_action)
    li = document.createElement('li')
    li.appendChild(a)

    // }
    return li
  }

  /**
   * hideBurger() click handler for when burger is open and user
   * clicks on a close button
   */
  function hideBurger () {
    menuShowHide.className = 'btn btn-burger'
    navWrap.className = 'main-nav'
    mask.className = 'mask mask--hide'
    navOpen = false
  }

  /**
   * showBurger() click handler for when burger is closed and user
   * clicks on the burger button
   */
  function showBurger () {
    navWrap.className = 'main-nav main-nav--show'
    menuShowHide.className = 'btn btn-burger btn-burger--open'
    mask.className = 'mask mask--show'
    navOpen = true
  }

  /**
   * bergerShowHide() click handler applied directly to buttons to
   * open/close the burger menue
   *
   * @param {Event} e the click event that triggered this callback
   */
  function bergerShowHide (e) {
    if (navOpen === true) {
      hideBurger()
    } else {
      showBurger()
    }
  }

  renderOutput = function (_input) {
    console.log('inside renderOutput() (in "normal" mode)')
    inputTextarea.value = _input
  }

  /**
   * doMagic() is called when the submit button is clicked.
   */
  function doMagic () {
    return function (e) {
      e.preventDefault()

      var output = ''
      var msg = null
      var input = ''
      // var extraInputs = {}

      if (actionFunction !== null) {
        // extraInputs = getExtraInputs()
        input = inputTextarea.value
        output = input
        try {
          output = actionFunction(output, extraInputs, URL.searchParams)
        } catch (e) {
          console.error('Action "' + actionName + '" failed due to error: "' + e + '"')
        }

        if (output !== input) {
          renderOutput(output)
        } else {
          msg = document.getElementById('action-message')
          msg.innerHTML = 'Action "' + actionName + '" had no effect on <em>Text to be modified</em>.'
        }
      }
    }
  }

  function activateDebugMode () {
    var p = null
    var label = null

    if (debugMode === true && action !== '') {
      debugField = document.createElement('textarea')
      debugField.setAttribute('readonly', 'readonly')
      debugField.setAttribute('id', 'output')

      p = document.createElement('p')
      p.setAttribute('id', 'output-wrap')
      p.className = 'main-input'

      label = document.createElement('label')
      label.appendChild(document.createTextNode('Modified text'))
      label.className = 'block'
      label.setAttribute('for', 'output')

      p.appendChild(label)
      p.appendChild(debugField)

      inputWrapper.appendChild(p)
      inputWrapper.className = 'input-wrapper debug-mode'

      renderOutput = function (_input) {
        debugField.value = _input
      }
    } else {
      inputWrapper.className = 'input-wrapper'
    }
  }

  //  END:  private methods
  // ======================================================
  // START: public methods

  this.register = function (config) {
    try {
      updateRegistry(config)
    } catch (error) {
      console.error('DoStuff.register() expects config to contain ' + error)
      return false
    }

    if (config.action === action) {
      initialiseAction(action)
    }

    // need to sort out making this alphabetical
    // but this'll do for the moment
    nav.appendChild(addToNav(config.action))
  }

  /**
   * render() does all the last minute stuff to make this app work
   */
  this.render = function () {
    menuShowHide.onclick = bergerShowHide
    mask.onclick = bergerShowHide

    if (typeof action === 'string' && action !== '') {
      subTitle.className = ''
      subTitle.innerHTML = registry[action].name

      submit.onclick = doMagic()
    }

    if (debugMode === true) {
      activateDebugMode()
    }
  }

  //  END:  public methods
  // ======================================================
  // START: proceedural part of code (constructor stuff)

  URL = getURLobject(url)

  if (typeof URL.searchParams['action'] !== 'undefined') {
    action = URL.searchParams['action'].toLowerCase()
  }

  if (typeof URL.searchParams['debug'] !== 'undefined') {
    debugMode = (URL.searchParams['debug'].toLowerCase() === 'true' || URL.searchParams['debug'] === '1')

    if (debugMode === true) {
      debugGet = '&debug=true'
    }
  }
  baseURL = URL.protocol + '//' + URL.host + URL.pathname + '?action='

  //  END:  proceedural part of code (constructor stuff)
  // ======================================================
}

/**
 * @var doStuff global object to allow functions to be registered
 *              (and to do all the stuff required to make this work)
 */
var doStuff = new DoStuff(window.location)
