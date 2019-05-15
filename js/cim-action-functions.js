/* jslint browser: true */
/* global doStuff */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction, makeHumanReadableAttr

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

function removeWhiteSpace (input, extraInputs, GETvars) {
  var output = ''
  // var content = ''
  // var tmp = ''
  var removenbsp = new RegExp('(?:\\&nbsp;|\\s)+', 'igm')
  // var removeSpaces = new RegExp('\\s{2,}', 'igm')

  var addnbdsp = new RegExp('<(t[dh])([^>]*)>\\s*</\\1>', 'igm')

  output = input.replace(removenbsp, ' ')
  // output = output.replace(removeSpaces, ' ')
  output = output.replace(addnbdsp, '<$1$2>&nbsp;</$1>')
  return output
}

doStuff.register({
  action: 'removeWhiteSpace',
  description: 'Remove all whitespace from HTML Code',
  func: removeWhiteSpace,
  ignore: false,
  name: 'Jon\'s Remove White Space'
})

//  END:  Jon's Remove White Space
// ====================================================================
