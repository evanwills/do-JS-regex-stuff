/* jslint browser: true */
/* global doStuff, makeHumanReadableAttr */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction

/**
 * action-functions.js contains all the possible actions available to
 * "Do JS regex stuff"
 *
 * Each action has two parts:
 * 1. A function declaration which is the business part. This function
 *    gets called when the user clicks "Modify input"
 * 2. Passing a "Registration" object to doStuff.register() which
 *    provides all the configuration "Do JS regex stuff" needs to
 *    make the action work.
 *
 * __NOTE:__ If you are have created an action and want to keep it but
 * don't need it at the moment, add the property 'ignore' with a value
 * of TRUE to remove it from the list of actions.
 */

// ====================================================================
// START: Sample code

/**
 * exposeChickens() finds all the vowels in a string and converts them
 * to what a chicken might say if it could speak English.
 *
 * created by: Evan Wills
 * created: 2019-03-22
 *
 * @param {string} input user supplied content
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function exposeChickens (input, extraInputs, GETvars) {
  var _unsure = (extraInputs.mood('unsure')) ? ' I think' : ''
  var _angry = extraInputs.mood('angry')
  var _boc = 'BOC! BOC!!'
  var _chicken = 'chicken'
  var _excited = extraInputs.mood('excited')
  // We retrieve the value of _gender by calling the function that
  // matches the ID (or name) of the input field
  var _gender = extraInputs.gender()
  var output = ''
  var _spring = ''
  // We do the same for _year
  var _year = extraInputs.year()

  // Test the gender of the chicken
  if (_gender === 'male') {
    _chicken = 'rooster'
    _boc = 'COCK-A-DOODLE-DO'
  } else if (_gender === 'female') {
    _chicken = 'hen'
  } else if (_gender === 'other') {
    _chicken += ' first don\'t try to pigeon hole me'
  }

  // Test the Year (as defined by the user)
  if (_year >= 2018) {
    _spring = ' spring'
  } else if (_year < 2016) {
    _spring = 'n old'
    _chicken += '. Please don\'t boil me and make me into soup.'
  }

  if (_excited === true) {
    _boc += ' BOC-OCK!!! '
    output = ' [[' + _boc + _unsure + ' ' + _boc + _boc + 'I am a ' + _boc + _boc + _boc + _spring + ' ' + _boc + _boc + _boc + _boc + _chicken + ' ' + _boc + _boc + _boc + _boc + _boc + '!!]] '
  } else {
    output = ' [[' + _boc + '!!' + _unsure + ' I am a' + _spring + ' ' + _chicken + ']] '
  }

  if (_angry === true) {
    output = output.toUpperCase()
  }

  if (typeof GETvars.backwards === 'boolean' && GETvars.backwards === true) {
    output = output.split('').reverse().join('')
  }

  // Do the replacement and return the updated string
  return input.replace(/[aeiou]+/ig, output)
}

doStuff.register({
  action: 'doChicken',
  description: 'Change all vowels into chickens',
  docURL: 'docs/expose-chickens.html',
  // docURL: 'https://courses.acu.edu.au/do-js-regex-stuff/docs/expose-chickens',
  extraInputs: [
    {
      id: 'year',
      label: 'Year chicken was hatched',
      type: 'number',
      min: 2013,
      max: 2019,
      step: 1,
      default: 2019
    },
    {
      id: 'gender',
      label: 'Gender of chicken',
      type: 'radio',
      options: [
        { value: 'male', label: 'Male (rooster)' },
        { value: 'female', label: 'Female (hen)', default: true },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'mood',
      label: 'Mood of the chicken',
      type: 'checkbox',
      options: [
        { value: 'unsure', label: 'Chicken is confused about its identity' },
        { value: 'angry', label: 'Chicken woke up on the wrong side of its purch', default: true },
        { value: 'excited', label: 'Chicken is super excited', default: true }
      ]
    }
  ],
  func: exposeChickens,
  ignore: false,
  name: 'Expose the chickens'
})

//  END:  Sample code
// ====================================================================
// START: heading to accordion

function makeAccordion (input, extraInputs, GETvars) {
  var heading = extraInputs.heading()
  var multi = extraInputs.multiCollpase('multi')
  var parent = extraInputs.parent()
  // var content = ''
  // var tmp = ''
  var regexDLwrapper = new RegExp('<dl[^>]*>\\s*([\\s\\S]*?)\\s*</dl>', 'ig')
  var regexHead = new RegExp('\\s*<h' + heading + '[^>]*>\\s*([\\s\\S]*?)\\s*</h' + heading + '>\\s*([\\s\\S]*?)\\s*(?=<h' + heading + '[^>]*>|$)', 'ig')
  var regexDL = new RegExp('\\s*<dt[^>]*>\\s*([\\s\\S]*?)\\s*</dt>\\s*<dd[^>]*>([\\s\\S]*?)\\s*</dd>', 'ig')
  var expand = true
  // var clean = new RegExp('(?:<div[^>]*>\\s*){2}<h2[^>]*>\\s*<a[^>]*>\\s*([\\s\\S]*?)\\s*<span[^>]*>[\\s\\S]*?</div>\\s*<div class="panel-body">\\s*([\\s\\S]*?)(?:\\s*</div>){3}', 'ig')
  var expandMode = extraInputs.expandMode()
  var defaultExpand = false

  if (expandMode === 'closeAll') {
    expand = false
    defaultExpand = false
  } else if (expandMode === 'openAll') {
    expand = true
    defaultExpand = true
  }

  /**
   * getExpanded() returns an object with the expanded attributes and
   * for both open button and panel body.
   *
   * @returns {object}
   */
  function getExpanded () {
    var __output = {
      expanded: '',
      in: ''
    }

    if (expand === true) {
      __output.expanded = ' aria-expanded="true"'
      __output.in = ' in'
      expand = defaultExpand
    }
    return __output
  }

  /**
   * wrapAccordion() wraps all the accordion items in the accordion
   * wrapper (with apporpriate attributes set)
   *
   * @param {string} input whole accordion block to be wrapped in HTML for a accordion (panel) group
   *
   * @returns {string} Full bootstrap compliant accordion
   */
  function wrapAccordion (input) {
    var __output = ''
    var _multi = (multi) ? ' aria-multiselectable="true"' : ''

    __output = '\n<div class="panel-group" id="' + parent + '" role="tablist"' + _multi + '>\n'
    __output += input
    __output += '</div>'

    return __output
  }

  /**
   * makeAccordFunc() returns a string of HTML code with appropriate
   * markup for bootstrap accordion blocks
   *
   * NOTE: this doesn't include makup for the 'panel-group' wrapper.
   *       the 'panel-group' wrapper must be applied after all the
   *       accordion blocks are generated.
   *
   * @param {string} match All the characters matched by the regular expression
   * @param {string} headingTxt Heading text for the accordion block
   * @param {string} accodionBody Body of the accordion block
   * @param {number} offset number where abouts in the whole string the match started
   * @param {string} whole the original string the match was found in
   *
   * @returns {string} marked up accordion block
   */
  function makeAccordFunc (match, headingTxt, accordionBody, offset, whole) {
    var __output = ''
    var _id = makeHumanReadableAttr(headingTxt)
    var _expanded = getExpanded()

    __output += '\t<div class="panel panel-default">\n'
    __output += '\t\t<div class="panel-heading" role="tab" id="head-' + _id + '">\t\n'
    __output += '\t\t\t<h' + heading + ' class="panel-title">\n'
    __output += '\t\t\t\t<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + _id + '" ' + _expanded.expanded + ' aria-controls="' + _id + '">\n'
    __output += '\t\t\t\t\t' + headingTxt + '\n'
    __output += '\t\t\t\t</a>\n'
    __output += '\t\t\t</h4>\n'
    __output += '\t\t</div>\n'
    __output += '\t\t<div id="' + _id + '" class="panel-collapse collapse ' + _expanded.in + '" role="tabpanel" aria-labelledby="head-' + _id + '">\n'
    __output += '\t\t\t<div class="panel-body">\n'
    __output += accordionBody
    __output += '\n\t\t\t</div>\n'
    __output += '\t\t</div>\n'
    __output += '\t</div>\n'

    return __output
  }

  /**
   * headingFunc() finds all the headings at a specific level and
   * wrap them and their following content in a bootstrap accordion
   * block
   *
   * @param {string} _input HTML markup for text with headings.
   *
   * @returns {string} marked up accordion block
   */
  function headingFunc (_input) {
    return wrapAccordion(_input.replace(regexHead, makeAccordFunc))
  }

  /**
   * dlFunc() finds all the "definition titles" and
   * "definition descriptions" a definiton list and wrap them in a
   * bootstrap accordion block
   *
   * @param {string} _input HTML markup for text with headings.
   *
   * @returns {string} marked up accordion block
   */
  function dlFunc (_input) {
    var __output = _input.replace(regexDLwrapper, '$1')
    return wrapAccordion(__output.replace(regexDL, makeAccordFunc))
  }

  switch (extraInputs.mode()) {
    case 'headings':
      console.log('regexHead', regexHead)
      console.log('regexHead.test(input)', regexHead.test(input))
      return headingFunc(input)
      // return ''
      // break

    case 'dl':
      return dlFunc(input)
      // break

    case 'clean':
      return ''
      // break
  }
}

doStuff.register({
  action: 'heading2accordion',
  description: 'Convert content to an accordion using specific headings as the separator for the accordion',
  extraInputs: [
    {
      id: 'mode',
      label: 'Convert mode',
      options: [
        {
          value: 'headings',
          label: 'Use headings as block delimiters',
          default: true
        },
        {
          value: 'dl',
          label: 'Use definition list <DT>/<DD> as block delimiters'
        // },
        // {
        //   // not yet implemented
        //   value: 'clean',
        //   label: 'Make ID\'s (and anchors) based on headings'
        }
      ],
      type: 'radio'
    },
    {
      description: 'If "Convert mode" is "Use headings as block delimiters" content is matched based on the level of the heading specified here and also the heading level within the output HTML. If "Convert mode" is "Use definition list <DT>/<DD> as block delimiters" then this is only used to define the heading level within the output HTML.',
      id: 'heading',
      label: 'Heading level',
      options: [
        { value: 1, label: 'h1' },
        { value: 2, label: 'H2', default: true },
        { value: 3, label: 'H3' },
        { value: 4, label: 'H4' }
      ],
      type: 'select'
    },
    {
      default: 'accordion',
      id: 'parent',
      label: 'ID for accordion wrapper',
      pattern: '^[a-zA-Z_][a-zA-Z0-9_\\-]+$',
      type: 'text'
    },
    {
      id: 'multiCollpase',
      label: 'Multi Collapse',
      options: [
        {
          default: true,
          label: 'Allow multiple accordion blocks open at the same time.',
          value: 'multi'
        }
      ],
      type: 'checkbox'
    },
    {
      id: 'expandMode',
      label: 'Expand mode',
      options: [
        {
          default: true,
          label: 'No blocks open by default',
          value: 'closeAll'
        },
        {
          label: 'Open first block only',
          value: 'openFirst'
        },
        {
          label: 'Open ALL blocks by default',
          value: 'openAll'
        }
      ],
      type: 'radio'
    }
  ],
  func: makeAccordion,
  // ignore: true,
  name: 'Convert content to Bootstrap accordion blocks'
})

//  END:  heading to accordion
// ====================================================================
// START: Convert Schedule of Unit Offerings to 2020

// Jon with no idea haha
function completeUpdate (input, extraInputs, GETvars) {
  var output = ''
  // var content = ''
  // var tmp = ''
  var addFourthCol = new RegExp('(<(t[dh])[^">]*?\\s+(?:id|headers)=")a3("[^>]*?>)(.*)(<\\/\\2>)', 'igm')

  var stripMainUnitAndLeavePnI = new RegExp('(<td[^">]*?\\s+headers="a4"[^>]*?>)(?:.*?\\((.*?)\\).*?|.*?)(</td>)', 'igm')

  var changePreToP = new RegExp('(<td[^>]*headers="a4"[^>]*>)\\s*pre:\\s*([^<;]*)(?:(;)\\s*([^<]*))?(</td>)', 'igm')

  var keepOnlyUnitInColThree = new RegExp('(<td[^">]*?\\s+headers="a3"[^>]*?>).*?(.*?)\\(.*?\\).*?(</td>)', 'igm')

  var changeIncToI = new RegExp('inc:\\s*([^<;]*)(?:(;)\\s*([^<]*))?(</td>)', 'igm')

  var addNil = new RegExp('(<td headers="a4">)(</td>)', 'igm')

  var fourthColTitle = new RegExp('(<th id="a4">).*?(</th>)', 'igm')

  var brokenThirdCol = new RegExp('(<td headers=")a3(">)<p>((.|\\s*)+?)(</td>)', 'igm')

  output = input.replace(addFourthCol, '$1a3$3$4$5\n$1a4$3$4$5')
  output = output.replace(stripMainUnitAndLeavePnI, '$1$2$3')
  output = output.replace(changePreToP, '$1$2 (P)$3 $4$5')
  output = output.replace(keepOnlyUnitInColThree, '$1$2$3')
  output = output.replace(changeIncToI, '<br>$1 (I)$2')
  output = output.replace(addNil, '$1Nil$2')
  output = output.replace(fourthColTitle, '$1Prerequisites (P)<br>Incompatible Units (I)$2')
  output = output.replace(brokenThirdCol, '$1a3$2$3$5\n$1a4$2$3$5')
  return output
}

doStuff.register({
  action: 'Schedule of Unit Offerings',
  description: 'Convert Schedule of Unit Offerings to 2020',
  func: completeUpdate,
  ignore: false,
  name: 'Convert Schedule of Unit Offerings to 2020'
})

//  END:  Convert Schedule of Unit Offerings to 2020
// ====================================================================
// START: Jon's Remove White Space

function removeAll (input, extraInputs, GETvars) {
  var output = ''
  // var content = ''
  // var tmp = ''
  var removenbsp = new RegExp('&nbsp;', 'igm')

  var removeSpaces = new RegExp('\\s{2,}', 'igm')

  var addnbdsp = new RegExp('<td([^>]*)> </td>', 'igm')

  output = input.replace(removenbsp, ' ')
  output = output.replace(removeSpaces, ' ')
  output = output.replace(addnbdsp, '<td$1>&nbsp;</td>')
  return output
}

doStuff.register({
  action: 'Jons Remove White Space',
  description: 'Remove all whitespace from HTML Code',
  func: removeAll,
  ignore: false,
  name: 'Remove all whitespace from HTML Code'
})

//  END:  Jon's Remove White Space
// ====================================================================
// START: CEG course advice HTML

function CEGcourseAdvice (input, extraInputs, GETvars) {
  var output = ''
  var campuses = [
    { name: 'Adelaide', abbr: 'adel' },
    { name: 'Ballarat', abbr: 'ball' },
    { name: 'Blacktown', abbr: 'btown' },
    { name: 'Brisbane', abbr: 'bris' },
    { name: 'Canberra', abbr: 'canb' },
    { name: 'North Sydney', abbr: 'nsyd' },
    { name: 'Rome', abbr: 'rome' },
    { name: 'Strathfield', abbr: 'strath' }
  ]
  var a = 0

  function tmplP (label, keyword, campusAbbr) {
    var outputP = ''

    outputP += '\n<p class="CEG-ca-links">\n'
    outputP += '\t<strong class="CEG-ca-label">' + label + ':</strong>\n\t'
    outputP += '%begin_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1^preg_match:1377261%'
    outputP += '<a href="tel:%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%" class="CEG-ca-email">\n'
    outputP += '%else_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%'
    outputP += '<a href="mailto:%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%?subject=Course advice for \'%asset_name%\'" class="CEG-ca-email">\n'
    outputP += '%end_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%'
    outputP += '\n\t\t%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_1%\n'
    outputP += '\t</a>'
    outputP += '%begin_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%<br />\n\t'
    outputP += '%begin_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2^preg_match:1377261%'
    outputP += '<a href="tel:%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2^trim%" class="CEG-ca-email">'
    outputP += '%else_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%'
    outputP += '<a href="mailto:%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2^trim%?subject=Professional experience advice for \'%asset_name%\'" class="CEG-ca-email">'
    outputP += '%end_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%'
    outputP += '\n\t\t%asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%\n'
    outputP += '\t</a>'
    outputP += '%end_asset_metadata___CEG-course-advice__' + campusAbbr + '__' + keyword + '_2%\n'
    outputP += '</p>\n'

    return outputP
  }

  for (a = 0; a < campuses.length; a += 1) {
    output += '\n\n<!-- start: CEG-course-advice__' + campuses[a]['abbr'] + '__course-admin_1 -->\n'
    output += '%begin_asset_metadata___CEG-course-advice__' + campuses[a]['abbr'] + '__course-admin_1%\n'
    output += '<h4 class="overline-head--small">' + campuses[a]['name'] + ' campus</h4>\n'
    output += tmplP('Course administrator', 'course-admin', campuses[a]['abbr'])
    output += '\n\n<!-- start: CEG-course-advice__' + campuses[a]['abbr'] + '__prof-exp-advisor_1 -->\n'
    output += '%begin_asset_metadata___CEG-course-advice__' + campuses[a]['abbr'] + '__prof-exp-advisor_1%'
    output += tmplP('Professional Experience Advice', 'prof-exp-advisor', campuses[a]['abbr'])
    output += '%end_asset_metadata___CEG-course-advice__' + campuses[a]['abbr'] + '__prof-exp-advisor_1%\n'
    output += '<!--  end:  CEG-course-advice__' + campuses[a]['abbr'] + '__prof-exp-advisor_1 -->\n'
    output += '%end_asset_metadata___CEG-course-advice__' + campuses[a]['abbr'] + '__course-admin_1%\n'
    output += '<!--  end:  CEG-course-advice__' + campuses[a]['abbr'] + '__course-admin_1 -->\n\n'
  }

  return output
}

doStuff.register({
  action: 'CEGcourseAdvice',
  // description: 'Remove all whitespace from HTML Code',
  func: CEGcourseAdvice,
  ignore: true,
  name: 'CEG course advice HTML'
})

//  END:  CEG course advice HTML
// ====================================================================
// START: Syntax highlighting for JS

function jsSyntaxHighlight (input, extraInputs, GETvars) {
  var find = [
    '([a-z0-9_]+(?:\\[(?:\'.*?\'|[a-z0-9_.])\\]|\\.[a-z0-9_]+)*)(?=\\s*\\()', // 0 function name
    '([a-z0-9_]+(?:\\[(?:\'.*?\'|[a-z0-9_.])\\]|\\.[a-z0-9_]+)*)(?=\\s*[,:=+)])', // 1 variable name
    '(^|\\s)(function|var|return|if|else)(?=\\s)', // 2 token
    '(\\s)(?:<em>)?//(.*?)(?:</em>)?(?=[\r\n])', // 3 comment
    '([0-9]+)', // 4 number
    '(true|false)', // 5 boolean
    '(\\s|\\()(\'[^\']*\')(?=\\s|\\)|,)', // 6 string
    '([\\[\\]{}()]+)', // 7 brackets
    '<span class="vName">(<span class="(?:num|bool|str)">.*?</span>|class)</span>' // 8 fix
  ]
  var replace = [
    '<span class="fName">$1</span>', // 0
    '<span class="vName">$1</span>', // 1
    '$1<span class="tkn">$2</span>', // 2
    '$1<span class="comm">//<span class="commTxt">$2</span></span>', // 3
    '<span class="num">$1</span>', // 4
    '<span class="bool">$1</span>', // 5
    '$1<span class="str">$2</span>', // 6
    '<span class="bkt">$1</span>', // 7
    '$1'
  ]
  var output = input
  var tmp = null
  var a = 0

  for (a = 0; a < find.length; a += 1) {
    tmp = new RegExp(find[a], 'ig')
    output = output.replace(tmp, replace[a])
  }
  return output
}

doStuff.register({
  action: 'jsSyntaxHighlight',
  func: jsSyntaxHighlight,
  ignore: false,
  name: 'Syntax highlighting for JS'
})

//  END:  Syntax highlighting for JS
// ====================================================================
