# chosen-ajax-options
<a href="https://badge.fury.io/js/chosen-ajax-options" target="_blank"><img height="21" style='border:0px;height:21px;' border='0' src="https://badge.fury.io/js/chosen-ajax-options.svg" alt="NPM Version"></a>
<a href='https://www.npmjs.org/package/chosen-ajax-options' target='_blank'><img height='21' style='border:0px;height:21px;' src='https://img.shields.io/npm/dt/chosen-ajax-options.svg?label=NPM+Downloads' border='0' alt='NPM Downloads' /></a>

Provides remote data source support for [`chosen-js`](https://github.com/harvesthq/chosen) selects.

To make this library future proof we try not to change or add hardly any code to original chosen-js code.

# Install

#### Yarn or NPM
```
yarn add chosen-ajax-options

npm install chosen-ajax-options
```

# Usage
```javascript
<select data-chosen-remote-url="/path/to/url.json">
  <option></option>
</select>
```

Now upon entering text the remote URL will be used to create an AJAX query to update the select options.

The ajax request will send the following parameters:

- `q` - The search text
- `selected` - The selected value(s)

The plugins expects that your URL will return an array of objects with the `value` and `label` attributes:

```
[
  {
    value: "1",
    label: "Foo",
  },

  {
    value: "2",
    label: "Bar",
  },
  
  /* ... */
]
```

The default delay is 250ms, you can change this by setting the `delay` option:

```javascript
ChosenAjaxOptions.delay = 250;
```

# Credits

Created by [Weston Ganger](https://westonganger.com) - [@westonganger](https://github.com/westonganger)
