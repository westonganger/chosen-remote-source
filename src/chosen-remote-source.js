/*
 * chosen-remote-source
 * @version v0.9.0
 * @link http://github.com/westonganger/chosen-remote-source
 * @license MIT
 */

// GET CHOSEN PROTOTYPE FOR PATCHING
var el = $('<select></select>');
el.chosen();
var chosen_prototype = Object.getPrototypeOf(el.data('chosen'));

// MONKEY PATCH CHOSEN TO NOT CLEAR THE SELECTED RESULTS UPON SEARCHING WITH
chosen_prototype.show_search_field_default = function() {
  if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
    this.search_field.val(this.default_text);
    return this.search_field.addClass("default");
  } else {
    if(this.default_text === this.search_field.val()){
      this.search_field.val(""); // ORIGINAL LINE, SURROUNDING IF STATEMENT IS CUSTOM
    }

    return this.search_field.removeClass("default");
  }
};

var default_delay = 250;

window.ChosenRemoteSource.delay = default_delay;

// ADD DEBOUNCE METHOD
var debounce = function(func){
  var timeout;

  return function() {
    var context = this, args = arguments;

    var later = function() {
      timeout = null;
      func.apply(context, args);
    };

    clearTimeout(timeout);

    timeout = setTimeout(later, (ChosenRemoteSource.delay || default_delay));
  };
};

// CREATE DEBOUNCED CALLBACK
var debouncedCallback = debounce(function(){
  var chosen_search_input = $(this);

  var search_text = chosen_search_input.val();

  var select = chosen_search_input.closest(".chosen-container").prev("select");

  var selected = select.val();

  if(select[0].hasAttribute('multiple')){
    for(var i=0; i < selected.length; i++){
      selected_opts += select.find("option[value="+selected[i]+"]")[0].outerHTML; 
    };
  }else if(selected){
    selected_opts += select.find("option[value="+selected+"]")[0].outerHTML; 
  }

  $.ajax({
    url: select.data('chosen-remote-url'),
    dataType: 'json',
    data: {q: search_text, selected: selected},
    type: 'GET',
  }).done(function(data){
    var opts = "";

    for(var i=0; i < data.length; i++){
      opts += "<option value='"+data[i].value+"'>" + data[i].label + "</option>";
    }

    if(selected_opts){
      opts += selected_opts;
    }

    select.html(opts).val(selected).trigger('chosen:updated');
  });
});

// BIND INPUT EVENT
$(document).on('input', '.chosen-container input.chosen-search-input', debouncedCallback);
