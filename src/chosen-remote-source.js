/*
 * chosen-remote-source
 * @version v0.9.0
 * @link http://github.com/westonganger/chosen-remote-source
 * @license MIT
 */

(function($){

  var event_namespace = '.chosen-remote-source';

  var defaults = {
    delay: 250,
    event: 'input',
    method: 'GET',
    label_field: 'label',
    value_field: 'value',
    search_param: 'q',
    selected_param: 'selected',
  };

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
  // END CHOSEN PATCH

  // HELPER METHODS
  var isFunction = function(x){
    return Object.prototype.toString.call(x) == '[object Function]';
  }

  var debounce = function(delay, func){
    var timeout;

    return function() {
      var context = this, args = arguments;

      var later = function() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);

      timeout = setTimeout(later, delay);
    };
  };

  var callback = function(){
    var chosen_search_input = $(this);

    var search_text = chosen_search_input.val();

    var chosen_container = chosen_search_input.closest(".chosen-container");

    var opts = chosen_container.data('chosen-remote-source-opts');

    var select = chosen_container.prev("select");

    var selected_values = select.val();

    var selected_options_html = "";

    if(typeof selected_values === "string"){
      // SINGLE SELECT
      selected_values = [selected_values];
    }

    for(var i=0; i < selected_values.length; i++){
      var el = select.find("option[value='"+selected_values[i]+"']")[0]; 

      if(!el){
        // OPTIONS WITHOUT VALUE ATTRIBUTE
        el = select.find("option:not([value]):contains("+selected_values[i]+")")[0]; 
      }

      selected_options_html += el.outerHTML; 
    };

    var data = {};
    data[opts.search_param] = search_text;
    data[opts.selected_param] = select.val();

    $.ajax({
      url: opts.url,
      dataType: 'json',
      data: data,
      type: opts.method,
    }).done(function(data){
      var options_html = "";

      for(var i=0; i < data.length; i++){
        options_html += "<option value='"+data[i][opts.value_field]+"'>" + data[i][opts.label_field] + "</option>";
      }

      if(selected_options_html){
        options_html += selected_options_html;
      }

      select.html(options_html).val(selected_values).trigger('chosen:updated');
    });
  };

  // MAIN FUNCTION
  $.fn.chosenRemoteSource = function(user_opts){
    // OPTIONS ERROR HANDLING
    if(!user_opts.url){
      console.error('Error: url must be defined');
      return false;
    }

    // OPTIONS HANDLING
    if(user_opts.event){
      events_array = user_opts.event.split(' ');

      var events_str = '';

      for(var i=0; i < events_array.length; i++){
        if(i !== 0){
          events_str += " ";
        }

        events_str += (events_array[i] + event_namespace)
      }

      user_opts.event = null;
    }else{
      var events_str = 'input' + event_namespace;
    }

    // GET CHOSEN CONTAINER ELEMENTS
    var chosen_elements = [];

    this.each(function(i, item){
      var chosen_data = $(item).data('chosen');
      if(chosen_data){
        chosen_elements.push(chosen_data.container);
      }
    });

    // BUILD AND ASSIGN OPTIONS TO DOM NODE
    var opts = {};
    opts.url = user_opts.url || defaults.url;
    opts.method = user_opts.method || defaults.method;
    opts.label_field = user_opts.label_field || defaults.label_field;
    opts.value_field = user_opts.value_field || defaults.value_field;
    opts.search_param = user_opts.search_param || defaults.search_param;
    opts.selected_param = user_opts.selected_param || defaults.selected_param;

    // CREATE DEBOUNCED CALLBACK
    var delay = user_opts.delay || defaults.delay;
    var debouncedCallback = debounce(delay, callback)

    // ASSIGN TO DOM
    for(var i=0; i < chosen_elements.length; i++){
      chosen_elements[i].data('chosen-remote-source-opts', opts);
      chosen_elements[i].off(event_namespace);
      chosen_elements[i].on(events_str, 'input.chosen-search-input', debouncedCallback);
    }

    return this;
  };

}(window.jQuery || window.Zepto || window.$));
