# How "Do JS regex stuff" works

So you have some dodgy text and you'd like to clean it up? Well you've come to the right place.

In the _[js/action-functions.js](js/action-functions.js)_ file you need to write a function that does all the stuff you need for one action.

Then you need to register that function so the app knows what to do.

## The function

There are a few things you need to know about the function:

1. The function must have a unique name (so you don't override someone else's work).
2. It must accept three parameters:
   1. __`input`__: {string} text from the main "Text to be modified" textarea
   2. __`extraInputs`__: {object} list of key/value pairs where the key is the contents of the `name` attribute of the field and the value is a function that can be called to retrieve the value of that field
        (see below for more info on extra fields that you can define when you register the function)
   3. __`GETvars`__: {object} list of all supplied GET variables from URL
3. It must return a string (to be used as the replacement contents for the "Text to be modified" textarea
4. It must be a pure function (i.e. it must not make changes to variables that are not defined within the function)

## Registering the function

After you've defined the function, you need to register it by calling doStuff.register(), which accepts an object with the following keys:

1. __`function`__: {function} _[required]_ The function (the name of the function, not quoted)
2. __`action`__: {string} _[required]_ The GET '`action`' value that tells the script that this is the right function to use
3. __`name`__: {string} _[required]_ Used as the sub-title when the action is selected also used as the link text for the action in the menu.
4. `description`: {string} _[optional (but recommended)]_ short paragraph decribing the purpose of the function.
5. `docURL`: {string} _[optional]_ URL for documentation page (must be HTTPS). Used in a popup to give detailed information about the action. Including the expected input what will be changed and the expected output why this needs to be done
6. `extraInputs`: {array} _[option]_ list of objects for extra inputs needed for the find/replace
    Extra inputs have the following keys:
   1. __`id`__: {string} _[required]_
      used to identify the input (also used as the key when the '`extraInputs`' are passed to the function
   2. __`label`__: {string} _[required]_
        text to describe the field (or group of checkboxes/radio buttons)
   3. `type`: {string} _[optional]_
        text (default), textarea, number, radio, checkbox, select
        (if type is invalid, an error will be shown in the console)
   4. `default`: {string, number} _[optional]_
        the default value for the input
   5. `options`: {array} [required for radio, checkbox, select]
        list of option objects (option objects must have both __`value`__ & __`label`__ keys. It can also have a boolean `default` property to specify that the given option should be checked/selected by default)
   6. `placeholder`: {string} _[optional]_
        Text displayed within the text or number field
        (only used for text & number inputs)
   7. `pattern`: {string} _[optional]_
        regular expression to validate the contents of the text/number field
        (only used for text & number inputs)
   8. `description`: {string} _[optional]_
        Information about what this field is used for. (Displayed below the input field input)
   9. `min`: {number} _[optional]_ (number fields only)
        Minumum value the number field can contain
   10. `max`: {number} _[optional]_ (number fields only)
        Maximum value the number field can contain
   11. `step`: {number} _[optional]_ (number fields only)
        The amount to increment the field's value up and down when using the arrow keys or number scroller
7. `rawGET`: by default GET variables are "URL decoded" and converted to appropriate types. By specifying `rawGET` as `TRUE` the action function receives the _raw_ (all strings) GET variables.
      

## Using the values from extra input fields

Say you have a action function with three _extra input_ fields. One for year with the ID `year` and another for gender and a group of checkboxes for mood. You can get the value of `year` by calling `extraInputs.year()` and the value of gender by calling `extraInputs.gender()`. You can get the value for each type of mood by calling the mood function, passing the value of that mood as the only parameter  e.g.

``` javascript
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
    output = ' [[' + _boc + _unsure + ' ' + _boc + _boc
    output += 'I am a ' + _boc + _boc + _boc
    output += _spring + ' ' + _boc + _boc + _boc + _boc
    output += _chicken + ' ' + _boc + _boc + _boc + _boc + _boc + '!!]] '
  } else {
    output = ' [[' + _boc + '!!' + _unsure + ' I am a' + _spring + ' ' + _chicken + ']] '
  }

  if (_angry === true) {
    output = output.toUpperCase()
  }

  // Do the replacement and return the updated string
  return input.replace(/[aeiou]+/ig, output)
}

doStuff.register({
  action: 'doChicken',
  name: 'Expose the chickens',
  func: exposeChickens,
  extraInputs: [
    {
      id: 'year',
      label: 'Year chicken was born',
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
        { 'value': 'male', label: 'Male (rooster)' },
        { 'value': 'female', label: 'Female (hen)', default: true },
        { 'value': 'other', label: 'Other' }
      ]
    },
    {
      id: 'mood',
      label: 'Mood of the chicken',
      type: 'checkbox',
      options: [
        { 'value': 'unsure', label: 'Chicken is confused about its identity' },
        { 'value': 'angry', label: 'Chicken woke up on the wrong side of its purch', default: true },
        { 'value': 'excited', label: 'Chicken is super excited', default: true }
      ]
    }
  ],
  description: 'Change all vowels into chickens'
})
```

### Checkbox fields

All input types have the same way of accessing their values except checkboxes. __do-JS-regex-stuff__ is set up to allow for multiple checkbox inputs for a single "field" but checkboxes are unique and each needs a unique ID, so you access whether a checkbox is checked or not by passing the value to the function.

__NOTE:__ Checkbox values are always boolean (`TRUE` or `FALSE`)

In the above code sampe we have "_Mood of the chicken_" group of checkboxes identified by `mood`. To get whether a given mood is checked we pass value for that mood to the `mood` function. e.g.

``` javascript
  var _unsure = (extraInputs.mood('unsure')) ? ' I think' : ''
  var _angry = extraInputs.mood('angry')
  var _excited = extraInputs.mood('excited')
```


## Using GET variables from the URL

URL GET variables are used in two ways in __do-JS-regex-stuff__:
1. GET variables are used to preset "_extra input_" fields
2. GET variables are also available within an action function

### Pre-Processing GET variables

Where possible, the value of GET variables are converted to their appropriate javascript variable types. e.g.
*  `'true'` will be converted to boolean `TRUE` (case _insensitive_)
*  `'false'` will be converted to boolean `FALSE` (case _insensitive_)
*  `'2019'` will be converted to number `2019`

GET variables are also URL decoded. (But JSON objects are not parsed)

### Presetting _extra input_ fields

For text type fields, if the field's ID matches a GET variable, then the value of the GET variable is used as the default value for that field.

For checkbox, radio & select fields, if the field's `name` matches a get variable and the field's (or option's) value matches the value of the GET variable then that field/option will be checked/selected

### Using GET variables within action function

It's probably a bad idea to use GET variables within you action function because it hides functionality from the user which they may or may not need to change.

However, there are times when that's exactly what you want.

Action functions get the GET variables passed an object via the third parameter when the function is called.

As an action function author, you need to test whether the GET variable exists before you use it. Otherwise, an error will be thrown and your function won't work.

__NOTE:__ If the pre-processed GET variables don't work in your usecase, you can include the `rawGET` property in your registration object. This means that when the GET variables are passed to the action function you get the raw version of the variables.
