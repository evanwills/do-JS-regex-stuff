
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

var DoStuff = function (url, debugMode) {
  var URL = null
  var action = ''
  var actionName = ''
  var actionFunction = null
  var navOpen = false
  var registry = {}
  // var customFields = document.getElementById('some-action')
  var subTitle = document.getElementById('sub-title')
  var docTitle = document.getElementById('doc-title')
  var someAction = document.getElementById('some-action')
  var inputTextarea = document.getElementById('input')
  var noAction = document.getElementById('no-action')
  var menuShowHide = document.getElementById('nav-show-hide')
  var navWrap = document.getElementById('main-nav')
  var nav = document.getElementById('menu-items')
  var mask = document.getElementById('nav-show-hide__mask')
  var submit = document.getElementById('submit')
  // var inputTypes = {
  //   'text': null,
  //   'number': null,
  //   'textarea': null,
  //   'radio': null,
  //   'select': null,
  //   'checkbox': null
  // }
  /**
   * @var extraInputs [array] An array of objects where the key is the "name" attribute
   *      for an input field and the value is a function that returns
   *      the value for that input field
   */
  var extraInputs = []

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

    // TODO: work out how to sort the registry so it's always in
    // alphabetical order (by name, not action)
    registry[config.action] = config
  }

  function getExtraInputs () {
    var a = 0
    var output = {}
    var key = ''
    for (a; a < extraInputs.length; a += 1) {
      key = extraInputs[a].name
      output[key] = extraInputs[a].getValue()
    }
    return output
  }

  function initialiseAction (_action) {
    // var customFields = null

    if (typeof _action !== 'string') {
      throw new Error('DoStuff.initialiseAction() expects only parameter "_action" to be a string. ' + typeof _action + ' given.')
    }
    if (typeof registry[_action] === 'undefined') {
      throw new Error('DoStuff.initialiseAction() expects only parameter "_action" to be a string that matches a key in the registry of actions. ' + typeof _action + ' given.')
    }

    docTitle.innerHTML = 'Do JS Regex Stuff &ndash; ' + registry[_action].name
    subTitle.className = ''
    subTitle.innerHTML = 'blah blah ' + registry[_action].name
    actionFunction = registry[_action].func

    someAction.className = ''
    noAction.className = 'hide'
  }

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
        history.pushState({ id: _action }, registry[_action].name, URL.protocol + '//' + URL.host + URL.pathname + '?action=' + _action)
        submit.onclick = doMagic()
      }
    }
  }

  function addToNav (_action) {
    var li = null
    var a = null
    var linkText = null
    // var desc = null

    // if (typeof registry[_action] !== 'undefined') {

    a = document.createElement('a')
    a.setAttribute('href', URL.protocol + '//' + URL.host + URL.pathname + '?action=' + _action)
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
  function hideBurger () {
    menuShowHide.className = 'btn btn-burger'
    navWrap.className = 'main-nav'
    mask.className = 'mask'
    navOpen = false
  }
  function showBurger () {
    navWrap.className = 'main-nav main-nav--show'
    menuShowHide.className = 'btn btn-burger btn-burger--open'
    mask.className = 'mask mask--show'
    navOpen = true
  }

  function bergerShowHide (e) {
    if (navOpen === true) {
      hideBurger()
    } else {
      showBurger()
    }
  }

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

  this.render = function () {
    menuShowHide.onclick = bergerShowHide
    mask.onclick = bergerShowHide

    if (typeof action === 'string' && action !== '') {
      subTitle.className = ''
      subTitle.innerHTML = registry[action].name

      submit.onclick = doMagic()
    }
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
      var extraInputs = {}

      if (actionFunction !== null) {
        extraInputs = getExtraInputs()
        input = inputTextarea.value
        output = input
        try {
          output = actionFunction(output, extraInputs)
        } catch (e) {
          console.error('Action "' + actionName + '" failed due to error: "' + e + '"')
        }

        if (output !== input) {
          inputTextarea.value = output
        } else {
          msg = document.getElementById('action-message')
          msg.innerHTML = 'Action "' + actionName + '" had no effect on <em>Text to be modified</em>.'
        }
      }
    }
  }

  URL = getURLobject(url)

  if (typeof URL.searchParams['action'] !== 'undefined') {
    action = URL.searchParams['action']
  }
}

var doStuff = new DoStuff(window.location)
