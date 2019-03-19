# How "Do JS regex stuff" works

So you have some dodgy text and you'd like to clean it up? Well you've come to the right place.

In the _[do-JS-regex-stuff.js](js/do-JS-regex-stuff.js)_ file you need to write a function that does all the stuff you need for one action.

Then you need to register that function so the app knows what to do.

## The function

There are a few things you need to know about the function:

1. The function must have a unique name (so you don't override someone else's work).
2. It must accept two parameters:
   1. __`input`__: {string} text from the main "Text to be modified" textarea
   2. __`extraInputs`__: {object} list of key/value pairs where the key is the contents of the `name` attribute of the field
        (extra fields that you can define when you register the function)
3. It must return a string (to be used as the replacement contents for the "Text to be modified" textarea
4. It must be a pure function (i.e. it must not make changes to variables that are not defined within the function)

## Registering the function

After you've defined the function, you need to register it, using the doStuff.register() function that accepts an object with the following keys:

1. __`function`__: {function} The function (the name of the function, not quoted)
2. __`action`__: {string} The GET '`action`' value that tells the script that this is the right function to use
3. __`name`__: {string} Used as the sub-title when the action is selected also used as the link text for the action in the menu.
4. __`docsURL`__: {string} [optional] URL for documentation page (must be HTTPS:)
5. __`extraInputs`__: {array} [option] list of objects for extra inputs needed for the find/replace
    Extra inputs have the following keys:
   1. __`name`__: {string}
      used to identify the input (also used as the key when the '`extraInputs`' are passed to the function
   2. __`label`__: {string}
        text to describe the field (or group of checkboxes/radio buttons)
   3. `type`: {string} [optional] (text by default)
        text, textarea, number, radio, checkbox, select
   4. `default`: {string, number} [optional]
        the default value for the input
   5. `options`: {array} [required for radio, checkbox, select]
        list of option objects (option object must have both __`value`__ & __`label`__ keys)
   6. `placeholder`: {string} [optional]
        Text displayed within the text or number field
        (only used for text & number inputs)
   7. `pattern`: {string} [optional]
        regular expression to validate the contents of the text/number field
        (only used for text & number inputs)

