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

  var _extra = extraInputs.additional()

  var regexes = {
    colspan: {
      find: new RegExp('(<td)[^>]*(colspan=.[123])[^>]*>(.*?)</td>', 'igm'),
      replace: '<tp $2">$3</tp>'
    },
    TD: {
      find: new RegExp('(<tr[^>]*>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>)', 'igm'),
      replace: '$1 headers="a1"$2 headers="a2"$3 headers="a3"$4'
    },
    TH: {
      find: new RegExp('(<tr[^>]*>\\s*?<th)[^>]*(>.*?</th>\\s*?<th)[^>]*(>.*?</th>\\s*?<th)[^>]*(>.*?</th>)', 'igm'),
      replace: '$1 id="a1"$2 id="a2"$3 id="a3"$4'
    },
    TD1: {
      find: new RegExp('(<tr[^>]*>\\s*?<td)[^>]*(>\\s*?.*?\\s*?</td>)', 'igm'),
      replace: '$1 headers="a1"$2'
    },
    TD2: {
      find: new RegExp('(<tr[^>]*>\\s*?<td[^>]*>\\s*?.*?\\s*?</td>\\s*?<td)[^>]*(>\\s*?.*?\\s*?</td>)', 'igm'),
      replace: '$1 headers="a2"$2'
    },
    TD3: {
      find: new RegExp('(<tr[^>]*>\\s*?<td[^>]*>\\s*?.*?\\s*?</td>\\s*?<td[^>]*>\\s*?.*?\\s*?</td>\\s*?<td)[^>]*(>\\s*?.*?\\s*?</td>)', 'igm'),
      replace: '$1 headers="a3"$2'
    },
    TH1: {
      find: new RegExp('(<tr[^>]*>\\s*?<th)[^>]*(>\\s*?.*?\\s*?</th>)', 'igm'),
      replace: '$1 id="a1"$2'
    },
    TH2: {
      find: new RegExp('(<tr[^>]*>\\s*?<th[^>]*>\\s*?.*?\\s*?</th>\\s*?<th)[^>]*(>\\s*?.*?\\s*?</th>)', 'igm'),
      replace: '$1 id="a2"$2'
    },
    TH3: {
      find: new RegExp('(<tr[^>]*>\\s*?<th[^>]*>\\s*?.*?\\s*?</th>\\s*?<th[^>]*>\\s*?.*?\\s*?</th>\\s*?<th)[^>]*(>\\s*?.*?\\s*?</th>)', 'igm'),
      replace: '$1 id="a3"$2'
    },
    checkIncPre: {
      find: new RegExp('(inc|pre)\\s+', 'igm'),
      replace: '$1: '
    },
    addFourthCol: {
      find: new RegExp('(<(t[dh])[^">]*?\\s+(?:id|headers)=")a3("[^>]*?>)\\s*(?:<p>\\s*?)?(.*?)\\s*(?:</p>\\s*?)?(<\\/\\2>)', 'igm'),
      replace: '$1a3$3$4$5$1a4$3$4$5'
    },
    stripMainUnitAndLeavePnI: {
      find: new RegExp('(<td headers="a4">).*?(?:(pre[:.].*?)\\)?(</td>)|(inc[:.].*?)\\)?(</td>)|(</td>))', 'igm'),
      replace: '$1$2$3$4$5$6'
    },
    fixPcolon: {
      find: new RegExp(';(\\s*(?=inc:|pre:).*?)<', 'igm'),
      replace: ',$1<'
    },
    fixcommaor: {
      find: new RegExp(',(\\s*?or)', 'igm'),
      replace: '$1'
    },
    fixPtoI: {
      find: new RegExp(', (inc)[^a-z]', 'igm'),
      replace: ';$1:'
    },
    fixIdot: {
      find: new RegExp('(inc)\\.', 'igm'),
      replace: '$1:'
    },
    changePreToP: {
      find: new RegExp('(<td[^>]*headers="a4"[^>]*>)\\s*pre:\\s*([^<;]*)(?:(;)\\s*([^<]*))?(</td>)', 'igm'),
      replace: '$1$2 (P)$3 $4$5'
    },
    keepOnlyUnitInColThree: {
      find: new RegExp('(<td[^">]headers="a3"[^>]*>)(.*?)(?=\\(pre|\\(inc|</td>)(?:\\(pre.*?|\\(inc.*?)?</td>', 'igm'),
      replace: '$1$2</td>'
    },
    changeIncToI: {
      find: new RegExp('inc:\\s*([^<;]*)(?:(;)\\s*([^<]*))?(</td>)', 'igm'),
      replace: '<br>$1 (I)$2'
    },
    fixI: {
      find: new RegExp('(<br>\\s*?.*?\\s*?);(\\s*?.*?\\s*?\\(I\\))', 'igm'),
      replace: '$1,$2'
    },
    additionalFixI: {
      find: new RegExp('(<td headers="a4">\\s*?)<br>', 'igm'),
      replace: '$1'
    },
    addNil: {
      find: new RegExp('(<td headers="a4">)\\s*(</td>)', 'igm'),
      replace: '$1Nil$2'
    },
    fourthColTitle: {
      find: new RegExp('(<th id="a4">).*?(</th>)', 'igm'),
      replace: '$1Prerequisites (P)<br>Incompatible Units (I)$2'
    },
    // Not sure if the broken third col is still required
    // brokenThirdCol: {
    //   find: new RegExp('(<td headers=")a3(">)\\s*(<p>(.|\\s*)+?)\\s*(</td>)', 'igm'),
    //   replace:
    // },
    RemoveAndAddLinks: {
      // find: new RegExp('<a[^>]*>([a-z]{4}[0-9]{3})</a>', 'igm'),
      find: new RegExp('(?:<a[^>]*>\\s*?)?([A-Z]{4}[0-9]{3})(?:</a>)?', 'gm'),
      replace: '<a class="js-remote-modal" href="./?a=2317124?unit=$1&amp;SQ_DESIGN_NAME=modal">$1</a>'
    },
    ClickHere: {
      find: new RegExp('<a[^>]*>(Click here for Unit Descriptions)</a>', 'igm'),
      replace: '<a href="./?a=2317111">$1</a>'
    },
    colspan2: {
      find: new RegExp('(<tp)([^>]*)colspan=.[123]([^>]*>.*?)(</tp>)', 'igm'),
      replace: '<td$2headers="a1" colspan="4$3</td>'
    },
    preinfo: {
      find: new RegExp('<p>\\s*?pre.*?\\s*?</p>', 'igm'),
      replace: ''
    }
  }

  if (_extra === 'ACPP') {
    var acppchange = new RegExp('(?:<a[^>]*>\\s*?)?(Admission.*?Policy)(?:</a>)?', 'igm')
    output = input.replace(acppchange, '<a href="./?a=2315733">$1</a>')
    return output
  } else if (_extra === 'SUO') {
    output = removeAll(input)
    var doReplace = ['colspan', 'TD', 'TH', 'checkIncPre', 'checkpre', 'addFourthCol', 'stripMainUnitAndLeavePnI', 'fixPcolon', 'fixcommaor', 'fixPtoI', 'fixIdot', 'changePreToP', 'keepOnlyUnitInColThree', 'changeIncToI', 'fixI', 'additionalFixI', 'addNil', 'fourthColTitle', 'RemoveAndAddLinks', 'ClickHere', 'colspan2', 'preinfo']
    var key = '';
    for (var a = 0; a < doReplace.length; a += 1) {
      key = doReplace[a]
      output = output.replace(regexes[key].find, regexes[key].replace)
    }
    return output
  } else if (_extra === 'RWS') {
    output = removeAll(input)
    return output
  } else if (_extra === 'SU'){
  var _su = new RegExp('(<a[^>]*>\\s*?)?([A-Z]{4}[0-9]{3})(</a>)?', 'gm')
    output = removeAll(input)
    output = output.replace(_su, '<a class="js-remote-modal" href="./?a=2317124?unit=$2&amp;SQ_DESIGN_NAME=modal">$2</a>')
    return output
  }
  else if (_extra === 'RAA'){
    //var _raa = new RegExp('(<[^/a][a-z]*[0-9]*)[^>]*(>)', 'igm')
    var _raa = new RegExp('(<[^/a][a-z]*[0-9]*)(( colspan="4")|[^>]*)(>)', 'igm')
    var _raaP = new RegExp('(<td>)<p>', 'igm')
    var _raaP2 = new RegExp('</p>(</td>)', 'igm')
    var _raat = new RegExp('<tbody>', 'igm')
    var _raat2 = new RegExp('(<table)[^>]*(>)', 'igm')
    var _raatb = new RegExp('(<tbody)[^>]*(>)\\s*?<tr[^>]*>', 'igm')
    var TDA = new RegExp('(<tr[^>]*>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>)', 'igm')
    var THA = new RegExp('(<tr class="nowrap"[^>]*>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>)', 'igm')
    var addlinks = new RegExp('(?:<a[^>]*>\\s*?)?([a-z]{4}[0-9]{3})(?:</a>)?', 'igm')
    var clickherelink = new RegExp('(<[^>]*>\\s*?Schedule.*?Offerings\\s*?<[^>]*>)(\\s*?<[^>]*>Click.*?Descriptions<[^>]*>|\\s*?<[^>]*><[^>]*>Click.*?Descriptions<[^>]*><[^>]*>)?', 'igm')
    var colspan = new RegExp('(<td)[^>]*(colspan=.[1234])[^>]*>(.*?)</td>', 'igm')
    var colspan2 = new RegExp('(<tp)([^>]*)colspan=.[1234]([^>]*>.*?)(</tp>)', 'igm')

    output = removeAll(input)
    output = output.replace(colspan, '<tp $2">$3</tp>')
    output = output.replace(_raa, '$1$3$4')
    output = output.replace(_raaP, '$1')
    output = output.replace(_raaP2, '$1')
    output = output.replace(_raat, '')
    output = output.replace(_raat2, '$1 class="table table-bordered table-hover table-striped"$2<tbody>')
    output = output.replace(_raatb, '$1$2<tr class="noWrap">')
    output = output.replace(TDA, '$1 headers="a1"$2 headers="a2"$3 headers="a3"$4 headers="a4"$5')
    output = output.replace(THA, '$1th id="a1"$2th$3th id="a2"$4th$5th id="a3"$6th$7th id="a4"$8th$9')
    output = output.replace(addNil, '$1Nil$2')
    output = output.replace(addlinks, '<a class="js-remote-modal" href="./?a=2317124?unit=$1&amp;SQ_DESIGN_NAME=modal">$1</a>')
    output = output.replace(clickherelink, '$1<p><a href="./?a=2317111">Click here for Unit Descriptions</a></p>')
    output = output.replace(preinfo, '')
    output = output.replace(colspan2, '<td$2headers="a1" colspan="4$3</td>')
    return output
  }
  else if (_extra === 'CHUD'){
    var _raa = new RegExp('(<[^>]*>\\s*?Schedule.*?Offerings\\s*?<[^>]*>)(\\s*?<[^>]*>Click.*?Descriptions<[^>]*>|\\s*?<[^>]*><[^>]*>Click.*?Descriptions<[^>]*><[^>]*>)?', 'igm')
    output = input.replace(_raa, '$1<p><a href="./?a=2317111">Click here for Unit Descriptions</a></p>')
    return output
  }
  else if (_extra === 'SCM'){
    var SCMAL = new RegExp('(<a[^>]*>\\s*?)?([A-Z]{4}[0-9]{3})(</a>)?', 'gm')
    var SCMHB = new RegExp('<a[^>]*>(handbook)(</a>)', 'igm')
    output = removeAll(input)
    output = output.replace(SCMAL, '<a class="js-remote-modal" href="./?a=2317609?unit=$2&amp;SQ_DESIGN_NAME=modal">$2</a>')
    output = output.replace(SCMHB, '<a href="./?a=2315651">$1$2')
    return output
  }
  else if (_extra === 'U&C'){
    var TABLE = new RegExp('(<table)[^>]*(>)', 'gm')
    var TBODY = new RegExp('(<table[^>]*>)(.*?)(<\/table>)', 'gm')
    var COL = new RegExp('(<col[^>]*>)', 'igm')
    var TD = new RegExp('(<TD)[^>]*(>)', 'igm')
    var TH = new RegExp('(<table[^>]*>\\s*?<tr>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>)', 'igm')
    output = removeAll(input)
    output = output.replace(TABLE, '$1 data-tablesaw-mode="stack"class="tablesaw-stack"$2')
    output = output.replace(COL, '')
    output = output.replace(TD, '$1$2')
    output = output.replace(TH, '$1th$2th$3th$4th$5th$6th$7th$8th$9th$10th$11th$12th$13')
    output = output.replace(TH, '$1<tbody>$2</tbody>$3')
    return output
  }
  else if (_extra === 'CAD'){
    var TABLE = new RegExp('(<table)[^>]*(>)', 'gm')
    var TBODY = new RegExp('(<table[^>]*>)(.*?)(<\/table>)', 'gm')
    var COL = new RegExp('(<col[^>]*>)', 'igm')
    var TD = new RegExp('(<TD)[^>]*(>)', 'igm')
    var TH = new RegExp('(<TD)[^>]*(>)', 'igm')
    output = removeAll(input)
    output = output.replace(TABLE, '$1$2')
    output = output.replace(COL, '')
    output = output.replace(TD, '$1$2')
    output = output.replace(TH, '$1th$2th$3th$4th$5th$6th$7th$8th$9th$10th$11th$12th$13')
    output = output.replace(TH, '$1th$2th$3th$4th$5th$6th$7th$8th$9th$10th$11th$12th$13')
    //output = output.replace(TH, '$1<tbody>$2</tbody>$3')
    return output
  }
  else if (_extra === 'CT'){
    output = removeAll(input)
    output = stripTables(output)
    return output
  }
  else if (_extra === 'EC'){

    var one = new RegExp('(<table)[^>]*(>)', 'igm')
    var two = new RegExp('(<td).*?(?:( rowspan="[0-9]")[^>]*(>)|( colspan="[0-9]")[^>]*(>)|(>))', 'igm')
    var three = new RegExp('<p>', 'igm')
    var four = new RegExp('<strong>', 'igm')
    var five = new RegExp('<\/strong>', 'igm')
    var six = new RegExp('<\/p>', 'gm')
    var seven = new RegExp('<a[^>]*>', 'gm')
    var eight = new RegExp('<\/a>', 'igm')
    var nine = new RegExp('(<t)d( colspan="[0-9]"| rowspan="[0-9]")(>)(.*?)(<\/t)d(>)', 'igm')
    var ten = new RegExp('(<tr>\\s*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?</tr>)', 'igm')

    output = removeAll(input)
    output = output.replace(one, '$1 class="table table-bordered table-hover table-striped"$2')
    output = output.replace(two, '$1$2$3$4$5$6')
    output = output.replace(three, '')
    output = output.replace(four, '')
    output = output.replace(five, '')
    output = output.replace(six, '')
    output = output.replace(seven, '')
    output = output.replace(eight, '')
    output = output.replace(nine, '$1h$2$3$4$5h$6')
    output = output.replace(ten, '$1 headers="1"$2 headers="2"$3 headers="3"$4 headers="4"$5 headers="5"$6 headers="6"$7 headers="7"$8 headers="8"$9 headers="9"$10 headers="10"$11')
    return output
  }


}




doStuff.register({
  action: 'CIM Scripts',
  description: '<p>Select an option from the list below</p>',
  func: completeUpdate,
  extraInputs: [
    {
      id: 'additional',
      label: 'What changes do you want to make',
      type: 'select',
      options: [
        { value: 'vdefault', label: 'Select an option', default: true },
        { value: 'SUO', label: 'Add 4th column to Schedule of Unit Offerings'},
    { value: 'ACPP', label: 'Admission to Coursework Programs Policy link' },
    { value: 'CHUD', label: 'Click here for Unit Descriptions link'},
        { value: 'RAA', label: 'Remove bad code from WORD'},
    { value: 'RWS', label: 'Remove White Space'},
    { value: 'SCM', label: 'Sample Course Map'},
    { value: 'SU', label: 'Unit Description links'},
    { value: 'CT', label: 'Clean Tables'},
    { value: 'CAD', label: 'Class Allocation Dates'},
    { value: 'EC', label: 'Extended Calendar'},
    { value: 'U&C', label: 'Units and Costs'}
      ]
    },
  ],
  ignore: false,
  name: 'CIM Scripts'
}

)

//  END:  Convert Schedule of Unit Offerings to 2020



$("#additional").change(function(){
  var vSelection = $('#additional').find(":selected").val();
  console.log(vSelection)

  if (vSelection === "SUO"){
    $("#no-action").html("<p>Only use this option when the Schedule of Unit Offerings has 3 columns.<br>\
  Copy the source code from Squiz and paste into the Text to be modified box below. Then click on Modify Input<br>\
  Copy the code into dreamweaver to make sure that the contents are accurate, then paste back into squiz</p>\
  <ul>\
  <li>This option will:</li>\
    <ul>\
    <li>Update all unit links to 2020.</li>\
    <li>Update the click here for unit descriptions link.</li>\
    <li>Remove text regarding prerequisite/incompatibles which sits under the Schedule of Unit Offerings title.</li>\
    <li>Add a fourth column for the prerequisites/incompatibles and moves them from the third column to the fourth column.</li>\
    <li>Provide ID/Headers for each of the cells for accessibility</li>\
    </ul>\
  </ul>");
  }
  else if (vSelection === "SU"){
    $("#no-action").html("<p>Use this option to add links to units that have been added to existing Schedule of Unit Offerings tables</p>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Add links to all Unit Codes that aren't already linked within the Schedule of Unit Offerings</li>\
      </ul>\
    </ul>");
  }
    else if (vSelection === "U&C"){
    $("#no-action").html("<p>Use this option to format the Units and Costs</p>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Apply appropriate formatting to the Units and Costs table</li>\
      </ul>\
    </ul>");
  }
  else if (vSelection === "RWS"){
    $("#no-action").html("<p>Use this option to remove all whitespace in your HTML code before pasting back into the CMS</p>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Remove all whitespace in the code</li>\
      </ul>\
    </ul>");
  }
  else if (vSelection === "ACPP"){
    $("#no-action").html("<p>Use this option to amend or create a link for the Admission to Coursework Programs Policy</p>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Amend or create a link to the Admission to Coursework Programs Policy text in the Admission Requirements</li>\
      </ul>\
    </ul>");
  }
  else if (vSelection === "RAA"){
    $("#no-action").html("<p>To use this script, copy the entire Schedule of Unit Offerings, including the heading and paste into dreamweaver.<br>\
    Then copy the source code from dreamweaver into the Text to be modified box below. Then click on Modify Input<br>\
    You can then copy the code back into dreamweaver to check the content and make additional amendments where necessary</p>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Remove all attributes associated with HTML tags that come from copying content from WORD to Dreamweaver</li>\
      <li>Link all units to their description</li>\
      <li>Add a link for Click here for Unit Descriptions</li>\
      <li>Provide the table its class elements</li>\
      <li>Provide ID/Headers for each of the cells for accessibility</li>\
      <li>Remove prerequisite information below the Schedule of Unit Offerings heading if it exists</li>\
      <li>Add Nil to blank cells in column 4</li>\
      <li>Remove all whiteSpace</li>\
      </ul>\
    </ul>");
  }
  else if (vSelection === "CHUD"){
    $("#no-action").html("<p>Use this option to amend or create a link for the Click here for Unit Descriptions</p>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Amend or create a link for Click here for Unit Descriptions under the heading Schedule of Unit Offerings</li>\
      </ul>\
    </ul>");
  }
  else if (vSelection === "SCM"){
    $("#no-action").html("<p>Use this option to update the links in the Sample Course Maps</p>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Amend or create links to all Unit Codes within the Sample Course Maps table</li>\
      </ul>\
    </ul>");
  }
  else if (vSelection === "CAD"){
    $("#no-action").html("<p>Use this option to clean the table for Class Allocation Dates</p>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Remove widths, alignments and anything else not needed for the table</li>\
      </ul>\
    </ul>");
  }
  else if (vSelection === "CT"){
    $("#no-action").html("<p>Use this option to strip tables of styles</p>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Remove widths, alignments and anything else not needed for the table</li>\
      </ul>\
    </ul>");
  }
  else if (vSelection === "EC"){
    $("#no-action").html("<p>Use this option to format the Extended Calendar</p>\
    <h3>THIS IS A WORK IN PROGRESS</h3>\
    <ul>\
    <li>This option will:</li>\
      <ul>\
      <li>Remove widths, alignments and anything else not needed for the table</li>\
      <li>Format the table to the necessary style</li>\
      </ul>\
    </ul>");
  }
  else if (vSelection === "vdefault"){
    $("#no-action").html("<p>Select an option from the list below</p>");
  };
});

$('.custom-fields--label').css('width', '18rem');

// ====================================================================
// START: Jon's Remove White Space

 function removeAll (input) {
  var output = ''
  // var content = ''
  // var tmp = ''
  var removenbsp = new RegExp('(?:&nbsp;|\\s)+', 'igm')
  // var removeSpaces = new RegExp('\\s{2,}', 'igm')

  var addnbdsp = new RegExp('<(t[dh])([^>]*)>\\s*</\\1>', 'igm')

  output = input.replace(removenbsp, ' ')
  // output = output.replace(removeSpaces, ' ')
  output = output.replace(addnbdsp, '<$1$2>&nbsp;</$1>')
  return output
}

//  END:  Jon's Remove White Space
// ====================================================================

// ====================================================================
// START: Jon's Table Stripping

 function stripTables (input) {
  var output = ''
  // var content = ''
  // var tmp = ''
 var removeTable = new RegExp('(<table)[^>]*(>)', 'igm')
  // var removeSpaces = new RegExp('\\s{2,}', 'igm')

  var removeStyle = new RegExp('(<t[dhr])[^>]*(>)', 'igm')

output = removeAll(input)
  output = output.replace(removeTable, '$1$2')
  // output = output.replace(removeSpaces, ' ')
  output = output.replace(removeStyle, '$1$2')
  return output
}

//  END:  Jon's Table Stripping
// ====================================================================
// START: Fix handbook (and Course Browser) unit modal links

function fixUnitMOdalLinks (input, extraInputs, GETvars) {
  var _regex = new RegExp('(<a href=")https?://www\\.acu\\.edu\\.au/units/(20[12][0-9])/units_20[12][0-9]/(?:unit_display\\?unit=)?([a-z0-9]+)"(?: (?:class|target)="[^"]*")*(?=>[a-z0-9]+</a>)', 'ig')

  /**
   * Callback function used for updating modal link URLs
   *
   * @param {string} match
   * @param {string} aHref
   * @param {string} year
   * @param {string} unitID
   *
   * @returns {string} new URL to use for modal link
   */
  function _makeIDlinks (match, aHref, year, unitID) {
    var _output = aHref
    var _id = ''
    var _join = '?'
    var years = {
      2020: 2317124,
      2019: 1423077,
      2018: 1256438,
      2017: 948634,
      2016: 741667,
      2015: 626141,
      2014: 552347,
      2013: 364844,
      2012: 331660
    }

    if (typeof years[year] !== 'undefined') {
      if (year > 2015) {
        _id = './?a=' + years[year] + '?unit='
        _join = '&'
      } else {
        _id = 'https://units.acu.edu.au/' + year + '/units_' + year + '/'
      }
    }

    _output += _id + unitID + _join + 'SQ_DESIGN_NAME=modal" class="js-remote-modal"'

    return _output
  }

  return input.replace(_regex, _makeIDlinks)
}

doStuff.register({
  action: 'fixUnitMOdalLinks',
  description: 'Fix handbook (and Course Browser) unit modal links',
  func: fixUnitMOdalLinks,
  ignore: false,
  name: 'Fix unit modal links'
})

// START: Fix handbook (and Course Browser) unit modal links
// ====================================================================
