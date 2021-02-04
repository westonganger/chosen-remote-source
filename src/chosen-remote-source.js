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
    label_field: 'label',
    value_field: 'value',
    search_param: 'q', // TODO
    selected_param: 'selected', // TODO
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

    var select = chosen_search_input.closest(".chosen-container").prev("select");

    var opts = select.data('chosen-remote-source-opts');

    var selected = select.val();

    if(select[0].hasAttribute('multiple')){
      for(var i=0; i < selected.length; i++){
        selected_opts += select.find("option[value="+selected[i]+"]")[0].outerHTML; 
      };
    }else if(selected){
      selected_opts += select.find("option[value="+selected+"]")[0].outerHTML; 
    }

    $.ajax({
      url: opts.url,
      dataType: 'json',
      data: {q: search_text, selected: selected},
      type: 'GET',
    }).done(function(data){
      var opts = "";

      for(var i=0; i < data.length; i++){
        opts += "<option value='"+data[i][opts.value_field]+"'>" + data[i][opts.label_field] + "</option>";
      }

      if(selected_opts){
        opts += selected_opts;
      }

      select.html(opts).val(selected).trigger('chosen:updated');
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
      events = event.split(' ');

      var events_str = '';

      for(var i=0; i < events.length; i++){
        if(i !== 0){
          events += " ";
        }

        events += (events[i] + event_namespace)
      }

      user_opts.event = null;
    }else{
      var events_str = 'input' + event_namespace;
    }

    // TODO - THIS GETS SELECTS, WE NEED .chosen-container
    var elements = this.filter(function(i, item){
      return $(item).data('chosen');
    });


    // BUILD AND ASSIGN OPTIONS TO DOM NODE
    var opts = {};
    opts.url = user_opts.url || default_options.url;
    opts.label_field = user_opts.label_field || default_options.label_field;
    opts.value_field = user_opts.value_field || default_options.value_field;

    elements.data('chosen-remote-source-opts', opts);

    // CREATE DEBOUNCED CALLBACK
    var delay = user_opts.delay || defaults.delay;
    var debouncedCallback = debounce(delay, callback)

    // ASSIGN TO DOM EVENT
    elements.off(event_namespace);
    elements.on(events_str, 'input.chosen-search-input', debouncedCallback);

    return this;
  };

}(window.jQuery || window.Zepto || window.$));
