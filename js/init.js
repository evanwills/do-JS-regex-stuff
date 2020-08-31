/* jslint browser: true */
/* global history, invalidString, getURLobject, invalidStrNum, invalidNum, invalidArray, isFunction, makeAttributeSafe, getRemoteActionFunc, XMLHttpRequest, remote */
// other global functions: makeHumanReadableAttr
// include utility-functions.js

/**
 * Constructor for Do
 * @param {string}  url    document.location string for the URL of
 *                         the page
 * @param {boolean} remote Whether or not to allow remote actions
 *                         from this source
 */
function DoStuff (url, _remote) {
  /**
   * @var {string} action what the "app" is app is doing at the moment
   *
   * It's used to identify the function to be used to modify the input
   */
  let action = ''

  /**
   * @var {function} actionFunction the function to be called when
   *               modifying the input
   */
  let actionFunction = null

  /**
   * @var {array} actionGroups list of action groups user has access to
   */
  let actionGroups = []

  /**
   * @var {string} actionGroupsGet comma separated list of action
   *            groups the user has access to (to be appended to the URL's GET string)
   */
  let actionGroupsGet = ''

  /**
   * @var {string} actionInputLabel the label text for the textarea
   *             where the text that is to be modified by the "app"
   *             is put by the user and where the modified output of
   *             the action is also put once the action has been run
   */
  let actionInputLabel = 'Text to be modified'

  /**
   * @var {string} actionName Human friendly name of the action
   */
  let actionName = ''

  /**
   * @var {boolean} allowRemote Whether or not to allow remote
   *              requests
   */
  let allowRemote = false

  /**
   * @var {array} allLinks array of navigation link DOM elements
   */
  const allLinks = []

  /**
   * @var {string} baseURL used as the main part of the URL for all
   *             links
   */
  let baseURL = ''

  /**
   * @var {DOMelement} customFields the un-ordered list element
   */
  const customFields = document.getElementById('custom-fields')

  /**
   * @var {DOMelement} debugField textarea field used to output the
   *             results of the action function.
   *
   * Useful when you're creating a new action and you want to use
   * the same input over and over again.
   */
  let debugField = null

  /**
   * @var {string} debugGet string to be appended to the URL of all
   *             links when in debug mode it adds a GET letiable to
   *             the URL
   */
  let debugGet = ''

  /**
   * @var {boolean} debugMode whether the script is in "Debug Mode"
   */
  let debugMode = false

  /**
   * @var {DOMelement} debugSwitch button toggling between debug and
   *             non-debug modes
   */
  let debugSwitch = null

  /**
   * @var {DOMelement} debugWrapper Element that wraps the debug
   *             output field
   */
  let debugWrapper = null

  /**
   * @var {DOMelement} docTitle the Title element in the page header
   */
  const docsURL = 'docs/How_Do-JS-regex-stuff_works.html'
  // let docsURL = 'https://courses.acu.edu.au/do-js-regex-stuff/docs/help'

  /**
   * @var {DOMelement} docTitle the Title element in the page header
   */
  const docTitle = document.getElementById('doc-title')

  /**
   * @var {array} extraInputs [array] An array of objects where the
   *      key is the "name" attribute for an input field and the
   *      value is a function that returns the value for that input
   *      field
   */
  const extraInputs = {}

  /**
   * @var {object} GET list of URL GET variables
   */
  let GET = {}

  /**
   * @var {string} getPart GET variable part of URL
   */
  let getPart = ''

  /**
   * @var {DOMelement} helpBtn the help button that links to
   *             documentation about an action
   */
  const helpBtn = document.getElementById('help')

  /**
   * @var {DOMelement} inputTextarea the textarea element where the
   *             text that is to be modified by the "app" is put by
   *             the user and where the modified output of the action
   *             is also put once the action has been run
   */
  const inputTextarea = document.getElementById('input')

  /**
   * @var {DOMelement} inputLabel the label element for the textarea
   *             where the text that is to be modified by the "app"
   *             is put by the user and where the modified output of
   *             the action is also put once the action has been run
   */
  const inputLabel = document.getElementById('inputLabel')

  /**
   * @var {string} inputLabelText Default text used to label the main
   *             input textarea
   */
  let inputLabelText = 'Text to be modified'

  /**
   * @var {DOMelement} inputWrapper The wrapper for the main input text area
   */
  const inputWrapper = document.getElementById('input-wrapper')

  /**
   * @var {DOMelement} mask a button element stretched across the
   *             whole visible window area that when clicked on
   *             closes the navingation (berger) menu
   */
  const mask = document.getElementById('nav-show-hide__mask')

  /**
   * @var {DOMelement} menuShowHide the button used for showing and
   *             hiding the navigation menue
   */
  const menuShowHide = document.getElementById('nav-show-hide')

  /**
   * @var {boolean} modalOpen whether or not the modal is currently open
   */
  let modalOpen = false

  /**
   * @var {DOMelement} modalBlock the the block in which modal content is
   *             inserted when the help button is clicked
   */
  const modalBlock = document.getElementById('modal')

  /**
   * @var {DOMelement} modalMask the clickable background
   */
  const modalMask = document.getElementById('modal-show-hide__mask')

  /**
   * @var {DOMelement} nav the unordered list use to house all the
   *             action links
   */
  const nav = document.getElementById('menu-items')

  /**
   * @var {DOMelement} navWrap the wrapping element for the
   *             navigation (Berger) Menu
   */
  const navWrap = document.getElementById('main-nav')

  /**
   * @var {boolean} navOpen whether or not the nav (burger menu) is
   *              open or closed
   */
  let navOpen = false

  /**
   * @var {DOMelement} noAction where the message explaining what is
   *             happeing when no action has been selected and also
   *             the place to put the action description if one has
   *             been set.
   */
  const noAction = document.getElementById('no-action')

  /**
   * @var {string} the name of an action set to NOT be ignored
   */
  let noIgnore = ''

  /**
   * @var {object} registry list of objects where the key is the
   *             action name and the value is all the metadata for
   *             the action plus the action function
   */
  const registry = {}

  /**
   * @var {string} URL for XHR requests
   */
  let remoteURL = ''

  // const customFields = document.getElementById('some-action')

  /**
   * @var {DOMelement} someAction the main form element where all
   *             the cool stuff happens
   */
  const someAction = document.getElementById('some-action')

  /**
   * @var {DOMelement} subTitle the page's main H2 element
   *
   * Used to set house the action's name in the main page content
   */
  const subTitle = document.getElementById('sub-title')

  /**
   * @var {DOMelement} submit the submit button used to trigger an
   *             action to modify the user's input
   */
  const submit = document.getElementById('submit')

  /**
   * @var object URL contains all the parts of a URL, making it easy
   *             to use varios parts just as individual parts.
   *
   * In this case it's used to create the base URL used for all links
   * plus provide easy access to GET variables.
   */
  let URL = null

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
  const updateRegistry = (config) => {
    let tmp = false

    tmp = invalidString('group', config, false)

    if (tmp === false) {
      tmp = config.group.trim().toLowerCase()
      if (tmp !== '' && !validGroupName(tmp)) {
        throw new Error('Action group name must be a string between 2 and 50 characters long, must start with at least two alphabetical characters and can contain only alpha numeric characters and hyphens. "' + tmp + '" does not meet these requirements')
      }

      if (actionGroups.indexOf(tmp) === -1) {
        // This action is not in one of the groups the user has access
        // to. Ignore it
        return false
      }
    }

    tmp = invalidString('action', config)
    if (tmp !== false) {
      throw new Error('a "action" property that is a non-empty string. ' + tmp + ' given.')
    }

    if (typeof config.ignore === 'boolean' && config.ignore === true) {
      // This action has been set to IGNORE
      if (noIgnore !== config.action) {
        // The user has not overridden the IGNORE directive via the URL
        return false
      }
    }

    tmp = invalidString('name', config)
    if (tmp !== false) {
      throw new Error('a "name" property that is a non-empty string. ' + tmp + ' given.')
    }

    config.remote = (typeof config.remote === 'boolean' && config.remote === true)

    if (config.remote === false) {
      if (typeof config.func === 'undefined' || !isFunction(config.func)) {
        throw new Error('a "func" property that is a plain javascript function. ' + tmp + ' given.')
      }
    } else {
      if (allowRemote === false) {
        console.warn('All remote actions are blocked from this host')
        return false
      } else if (baseURL.substring(0, 4) !== 'http') {
        console.warn('URL (' + baseURL + ') does not point to a remote origin and is likely to be blocked by the browser.')
      }
    }

    config.inputLabel = (typeof config.inputLabel !== 'string' || config.inputLabel.trim() === '') ? inputLabelText : config.inputLabel

    config.action = config.action.toLowerCase()

    config.rawGET = (typeof config.rawGET === 'boolean') ? config.rawGET : false

    // TODO: work out how to sort the registry so it's always in
    // alphabetical order (by name, not action)
    registry[config.action] = config

    return true
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
  const initialiseAction = (_action) => {
    let a = 0
    let _docsURL = ''
    const request = new XMLHttpRequest()

    if (typeof _action !== 'string') {
      throw new Error('DoStuff.initialiseAction() expects only parameter "_action" to be a string. ' + typeof _action + ' given.')
    }
    if (typeof registry[_action] === 'undefined') {
      throw new Error('DoStuff.initialiseAction() expects only parameter "_action" to be a string that matches a key in the registry of actions. ' + typeof _action + ' given.')
    }
    action = _action
    console.log('registry[' + _action + ']:', registry[_action])

    docTitle.innerHTML = 'Do JS Regex Stuff &ndash; ' + registry[_action].name
    subTitle.className = ''
    subTitle.innerHTML = registry[_action].name

    if (typeof registry[_action].remote !== 'boolean' || registry[_action].remote === false) {
      actionFunction = registry[_action].func
    } else {
      actionFunction = getRemoteActionFunc(registry[_action], remoteURL)
    }
    someAction.className = ''
    actionInputLabel = registry[_action].inputLabel
    inputLabel.innerHTML = actionInputLabel

    if (typeof registry[_action].description === 'string' && registry[_action].description !== '') {
      noAction.innerHTML = registry[_action].description
      noAction.className = 'description'
    } else {
      noAction.className = 'hide'
    }

    GET = (registry[_action].rawGET === false) ? URL.searchParams : URL.searchParamsRaw

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

    for (a = 0; a < allLinks.length; a += 1) {
      if (allLinks[a].id === 'action--' + _action) {
        allLinks[a].className = 'active-action'
      } else {
        allLinks[a].className = undefined
      }
    }

    _docsURL = (!invalidStrNum('docURL', registry[_action])) ? registry[_action].docURL : docsURL
    helpBtn.setAttribute('href', _docsURL)

    // Preload documentation
    request.open('GET', _docsURL, true)
    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        modalBlock.innerHTML = this.response
      } else {
        modalBlock.innerHTML = 'Sorry we couldn\'t get content from "' + _docsURL
      }
    }
    request.onerror = function () {
      // There was a connection error of some sort
    }
    request.send()
  }

  /**
   * addToNav() adds links to navigation (burger) menu
   * @param {string} _action identifier of action for which a link
   *                 is to be created
   * @returns {void}
   */
  const addToNav = (_action) => {
    let li = null
    let a = null
    let linkText = null
    // let desc = null

    a = document.createElement('a')
    a.setAttribute('href', baseURL + _action + debugGet)
    a.setAttribute('id', 'action--' + _action)

    linkText = document.createTextNode(registry[_action].name)
    if (typeof registry[_action].description === 'string') {
      a.setAttribute('title', registry[_action].description)
    }
    a.setAttribute('data-title', registry[_action].name)
    a.appendChild(linkText)
    a.onclick = getNavClickHandler(_action)
    allLinks.push(a)
    li = document.createElement('li')
    li.appendChild(a)

    return li
  }

  //  END:
  // ======================================================
  // START: extra field generators

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
   *
   * @returns {object} Object with two properties:
   *          * "node" - A DOM node containing a sematically correct
   *                     text type field and
   *          * "getter" - A function used by the developer to get
   *                     the current value of the radio field
   */
  const setTextInputAttributes = (nodeType, config) => {
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
    if (!invalidString(config.id, URL.searchParams, false)) {
      _node.value = URL.searchParams[config.id]
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
   *
   * @returns {object} Object with two properties:
   *          * "node" - A DOM node containing a sematically correct
   *                     text area field and
   *          * "getter" - A function used by the developer to get
   *                     the current value of the radio field
   */
  const getTextarea = (config) => {
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
  const getText = (inputType, config) => {
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
  const getNumber = (config) => {
    const _node = setTextInputAttributes('number', config)

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
   *
   * @returns {object} object with two properties:
   *          * "node" - a DOM node containing a sematically correct
   *                     radio or checkbox input field and
   *          * "getter" - a function used by the developer to get
   *                     the current value of the radio field
   */
  const getSelect = (config) => {
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

      if (typeof URL.searchParams[config.id] === 'string') {
        _isDefault = (URL.searchParams[config.id] === config.options[a].value)
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
   *
   * @returns {object} object with two properties:
   *          * "wrapper" - a DOM node containing a sematically
   *                     correct radio or checkbox input field and
   *          * "field" - a DOM node representing the actual input
   *                     field
   */
  const getGroupableInput = (config) => {
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

    if (typeof URL.searchParams[_name] === 'string') {
      _isDefault = (URL.searchParams[_name] === config.value)
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
   *
   * @returns {object} object with two properties:
   *          * "node" - a DOM node containing a sematically correct
   *                     group of radio input fields and
   *          * "getter" - a function used by the developer to get
   *                     the current value of the radio field
   */
  const getRadio = (config) => {
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
      })

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
   *
   * @returns {object} object with two properties:
   *          * "node" - a DOM node containing a sematically correct
   *                     group of checkbox input fields and
   *          * "getter" - a function used by the developer to get
   *                     the current value of the radio field
   */
  const getCheckbox = (config) => {
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
  const getSingleExtraInput = (config) => {
    const _node = document.createElement('li')
    const _inputWrap = document.createElement('div')
    let _input = null
    let _desc = null
    let _default = true

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
    _inputWrap.appendChild(_input.node)
    if (_desc !== null) {
      _inputWrap.appendChild(getDescription(config))
    }
    _node.appendChild(_inputWrap)

    extraInputs[config.id] = _input.getter

    return _node
  }

  //  END: extra field generators
  // ======================================================
  // START: helper functions used in by callback functions

  /**
   * hideBurger() click handler for when burger is open and user
   * clicks on a close button
   */
  const hideBurger = () => {
    menuShowHide.className = 'btn btn-burger'
    navWrap.className = 'main-nav'
    mask.className = 'mask mask--hide'
    navOpen = false
  }

  /**
   * showBurger() click handler for when burger is closed and user
   * clicks on the burger button
   */
  const showBurger = () => {
    navWrap.className = 'main-nav main-nav--show'
    menuShowHide.className = 'btn btn-burger btn-burger--open'
    mask.className = 'mask mask--show'
    navOpen = true
  }

  /**
   * renderOutput() renders the results returned by the current
   * action function to the appropriate field based on whether the
   * app is in Debug Mode or not.
   *
   * @param {string} input string to be applied as output of the app
   *
   * @returns {void}
   */
  let renderOutput = (_input) => {
    inputTextarea.value = _input

    // the following automatically gives focus to the output textarea
    inputTextarea.focus()
    // then selects the whole contents of the textares for (manual)
    // copying by the user
    inputTextarea.setSelectionRange(0, _input.length)
  }

  /**
   * activateDebugMode() creates the HTML for debug mode plus shows
   * and hides the debug part of the user Interface
   */
  const activateDebugMode = () => {
    let label = null

    if (debugMode === true && action !== '') {
      if (debugField === null) {
        debugField = document.createElement('textarea')
        debugField.setAttribute('id', 'output')
        debugField.setAttribute('readonly', 'readonly')

        debugWrapper = document.createElement('p')
        debugWrapper.setAttribute('id', 'output-wrap')

        label = document.createElement('label')
        label.appendChild(document.createTextNode('Modified text'))
        label.className = 'block'
        label.setAttribute('for', 'output')

        debugWrapper.appendChild(label)
        debugWrapper.appendChild(debugField)

        inputWrapper.appendChild(debugWrapper)
      }

      debugWrapper.className = 'main-input'
      inputWrapper.className = 'input-wrapper debug-mode'

      renderOutput = (_input) => {
        debugField.value = _input
      }
      debugGet = '&debug=true'
    } else {
      if (debugWrapper !== null) {
        inputWrapper.className = 'input-wrapper'
        debugWrapper.className = 'main-input hide'
      }

      renderOutput = (_input) => {
        inputTextarea.value = _input
      }
      debugGet = ''
    }
    if (typeof registry[action] !== 'undefined') {
      history.pushState({ id: action }, registry[action].name, baseURL + action + debugGet)
    } else {
      history.pushState({ id: action }, 'debug', baseURL + action + debugGet)
    }
  }

  //  END:  general private methods
  // ======================================================
  // START: Callback functions

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
  const getNavClickHandler = (_action) => {
    return (e) => {
      let success = true
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

  /**
   * doMagic() returns a callback function with all of the variables
   * of this scope bound into the function
   *
   * @returns {function} onclick callback function used by the
   *             "Modify input" button
   */
  const doMagic = () => {
    return async (e) => {
      e.preventDefault()

      let output = ''
      let msg = null
      let input = ''
      // const extraInputs = {}

      if (actionFunction !== null) {
        // extraInputs = getExtraInputs()
        input = inputTextarea.value
        output = input

        try {
          output = await actionFunction(output, extraInputs, GET)
        } catch (e) {
          console.error('Action "' + actionName + '" failed due to error: "' + e + '"')
        }

        if (output !== input) {
          renderOutput(output)
        } else {
          msg = document.getElementById('action-message')
          msg.innerHTML = 'Action "' + actionName + '" had no effect on <em>' + actionInputLabel + '</em>.'
        }
      }
    }
  }

  /**
   * toggleDebug() callback function used as on click handler for
   * "Debug mode" button
   */
  const toggleDebug = () => {
    if (debugMode === false) {
      debugSwitch.innerHTML = 'Disable Debug mode'
      debugSwitch.className = 'btn btn-debug btn-debug--on'
      debugMode = true
    } else {
      debugSwitch.innerHTML = 'Turn on Debug mode'
      debugSwitch.className = 'btn btn-debug btn-debug--off'
      debugMode = false
    }
    activateDebugMode()
    hideBurger()
  }

  /**
   * bergerShowHide() click handler applied directly to buttons to
   * open/close the burger menue
   *
   * @param {Event} e the click event that triggered this callback
   */
  const bergerShowHide = (e) => {
    if (navOpen === true) {
      hideBurger()
    } else {
      showBurger()
    }
  }

  const resetDoStuff = (e) => {
    e.preventDefault()
    renderOutput('')
    initialiseAction(action)
  }

  const toggleModal = (e) => {
    e.preventDefault()

    if (modalOpen === true) {
      modalBlock.className = 'modal modal--hide'
      modalMask.className = 'mask modal-mask modal-mask--hide'
      modalOpen = false
    } else {
      modalBlock.className = 'modal modal--show'
      modalMask.className = 'mask modal-mask modal-mask--show'
      modalOpen = true
    }
  }

  /**
   * Test whether a group name is valid or not.
   *
   * @param {string} groupName Name of action group
   *
   * @returns {boolean} True if group name is valid
   */
  const validGroupName = (groupName) => {
    const _regex = new RegExp('^[a-z]{2}[0-9a-z-]{0,48}$')
    return _regex.test(groupName.trim().toLowerCase())
  }

  /**
   * Add a new group name to the list of groups the user wants
   * access to
   *
   * @param {array}  actionGroupList list of already registered
   *                                 groups
   * @param {string} groupName       New group name to be added to
   *                                 registry
   *
   * @returns {array}
   */
  const addToGroup = (actionGroupList, groupName) => {
    const tmpGroup = groupName.trim().toLowerCase()
    if (validGroupName(tmpGroup) && actionGroupList.indexOf(tmpGroup) === -1) {
      actionGroupList.push(tmpGroup)
    }
    return actionGroupList
  }

  //  END:  callback functions
  // ======================================================
  // START: public methods

  /**
   * DoStuff.register() registers an action, making it available for
   * use and creating a link in the navigation.
   *
   * @param {object} config all the metadata for a given action.
   *             Object has three required properties:
   *             1. 'action' - Identifier for the action
   *                           (used in the URL)
   *             2. 'name' - Human readable name of the action
   *                           (used in the heading and link)
   *             3. 'function' - function that does the actual work
   *                           of the action
   *                           (used when "Modify input" is clicked)
   *
   * @returns {void}
   */
  this.register = function (config) {
    let registerOk = false
    try {
      registerOk = updateRegistry(config)
    } catch (error) {
      console.error('DoStuff.register() expects config to contain ' + error)
      return false
    }

    if (registerOk) {
      // need to sort out making this alphabetical
      // but this'll do for the moment
      nav.appendChild(addToNav(config.action))

      if (config.action === action) {
        initialiseAction(action)
      }
    }
  }

  /**
   * render() does all the last minute stuff to make this app work
   */
  this.render = function () {
    const li = document.createElement('li')
    const resetBtn = document.getElementById('reset')
    menuShowHide.onclick = bergerShowHide
    mask.onclick = bergerShowHide

    if (typeof action === 'string' && action !== '') {
      subTitle.className = ''
      subTitle.innerHTML = registry[action].name

      submit.onclick = doMagic()
    }

    debugSwitch = document.createElement('button')
    if (debugMode === true) {
      activateDebugMode()
      debugSwitch.appendChild(document.createTextNode('Disable Debug mode'))
      debugSwitch.className = 'btn btn-debug btn-debug--on'
    } else {
      debugSwitch.appendChild(document.createTextNode('Turn on Debug mode'))
      debugSwitch.className = 'btn btn-debug btn-debug--off'
    }
    debugSwitch.onclick = toggleDebug
    li.appendChild(debugSwitch)
    nav.appendChild(li)

    resetBtn.onclick = resetDoStuff
    helpBtn.onclick = toggleModal
    modalMask.onclick = toggleModal
  }

  //  END:  public methods
  // ======================================================
  // START: proceedural part of code (constructor stuff)

  URL = getURLobject(url)

  if (typeof URL.searchParams.action === 'string') {
    action = URL.searchParams.action.toLowerCase()
  }

  if (typeof URL.searchParams.debug !== 'undefined') {
    debugMode = (URL.searchParams.debug === true || URL.searchParams.debug === 1)

    if (debugMode === true) {
      debugGet = '&debug=true'
    }
  }

  console.log('typeof actionGroups:', typeof actionGroups)
  console.log('actionGroups:', actionGroups)
  if (typeof URL.searchParams.group !== 'undefined') {
    actionGroups = addToGroup(actionGroups, URL.searchParams.group)
  }

  if (typeof URL.searchParams.groups !== 'undefined' && URL.searchParams.groups !== '') {
    const groupsList = URL.searchParams.groups.split(',')

    for (let a = 0; a < groupsList.length; a += 1) {
      actionGroups = addToGroup(actionGroups, groupsList[a])
    }
  }

  if (actionGroups.length > 0) {
    actionGroupsGet = 'groups='
    let sep = ''
    for (let a = 0; a < actionGroups.length; a += 1) {
      actionGroupsGet += sep + actionGroups[a]
      sep = ','
    }
    actionGroupsGet += '&'
  }

  allowRemote = (typeof _remote !== 'boolean') ? true : _remote

  noIgnore = (typeof URL.searchParams.noIgnore !== 'undefined') ? URL.searchParams.noIgnore : ''
  baseURL = URL.protocol + '//' + URL.host + URL.pathname
  getPart = '?' + actionGroupsGet + 'action='
  remoteURL = baseURL + 'json.php' + getPart
  baseURL += getPart

  //  END:  proceedural part of code (constructor stuff)
  // ======================================================
}

const tmpRemote = (typeof remote !== 'boolean' || remote === true)

/**
 * @var doStuff global object to allow functions to be registered
 *              (and to do all the stuff required to make this work)
 */
const doStuff = new DoStuff(window.location, tmpRemote)
