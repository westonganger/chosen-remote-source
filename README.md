# chosen-remote-source
<a href="https://badge.fury.io/js/chosen-remote-source" target="_blank"><img height="21" style='border:0px;height:21px;' border='0' src="https://badge.fury.io/js/chosen-remote-source.svg" alt="NPM Version"></a>
<a href='https://www.npmjs.org/package/chosen-remote-source' target='_blank'><img height='21' style='border:0px;height:21px;' src='https://img.shields.io/npm/dt/chosen-remote-source.svg?label=NPM+Downloads' border='0' alt='NPM Downloads' /></a>

Provides remote data source support for [`chosen-js`](https://github.com/harvesthq/chosen) selects.

To make this library future proof we try not to change or add hardly any code to original chosen-js code.

# Install

#### Yarn or NPM
```
yarn add chosen-remote-source

npm install chosen-remote-source
```

# Usage
```javascript
$('.chosen-remote-source').chosenRemoteSource({
  url: "/my-path",
  delay: 250,
  event: 'input',
  label_field: 'label',
  value_field: 'value',
  search_param: 'q', // TODO
  selected_param: 'selected', // TODO
});
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

# Credits

Created by [Weston Ganger](https://westonganger.com) - [@westonganger](https://github.com/westonganger)
