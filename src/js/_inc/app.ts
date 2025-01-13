class LazyLoadImages {
  constructor(elements) {
    var instance = this;
    var imgs = elements || $$('img[data-src], source[data-srcset]');
    var timages = [];
    imgs.forEach(function(img){
      if (!img.hasClass(instance.LISTEN_CLASS()) && !img.hasClass(instance.HANDLED_CLASS())){
        img.addClass(instance.LISTEN_CLASS());
        timages.push(img);
      }
    });
    if (timages.length <= 0){
      return;
    };
    const images = timages;
    const config = {
      rootMargin: '50px 0px',
      threshold: 0.01
    };
    if (!this.SUPPORTS_INTERSECTION_OBSERVER()) {
      this._loadImagesImmediately(images);
      return;
    };
    this._count = images.length;
    this._onIntersection = this._onIntersection.bind(this);
    this._observer = new IntersectionObserver(this._onIntersection, config);
    images.forEach(function(image){
      instance._observer.observe(image);
    });
  };
  SUPPORTS_INTERSECTION_OBSERVER(){
    return ('IntersectionObserver' in window);
  };
  LISTEN_CLASS(){
    return 'lz';
  };
  HANDLED_CLASS(){
    return 'lzh';
  };
  _disconnect(){
    if (!this._observer) {
      return;
    };
    this._observer.disconnect();
    delete this;
  };
  _onIntersection(entries){
    var instance = this;
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        instance._count--;
        instance._observer.unobserve(entry.target);
        instance._preloadImage(entry.target);
      };
    });
    if (this._count > 0) {
      return;
    };
    this._disconnect();
  };
  _preloadImage(img){
    img.removeClass(this.LISTEN_CLASS()).addClass(this.HANDLED_CLASS());
    if (img.get('data-src')){
      img.set('src', img.get('data-src'));
      img.set('data-src', '');
    };
    if (img.get('data-srcset')){
      img.set('srcset', img.get('data-srcset'));
      img.set('data-srcset', '');
    };
    img.addEvent('load', function(e){
      this.fireEvent('loaded');
    });
  };
  _loadImagesImmediately(images){
    var instance = this;
    if (images.length > 0){
      images.forEach(function(image){
        instance._preloadImage(image);
      });
    };
  };
};
class LazyLoadElement {
  constructor(element, callback) {
    if ((!element) || (element.hasClass(this.LISTEN_CLASS())) || (element.hasClass(this.HANDLED_CLASS()))){
      return;
    };
    if (typeof(callback) !== 'function'){
      return;
    };
    this._callback = callback;
    const config = {
      rootMargin: '50px 0px',
      threshold: 0.01
    };
    if (!this.SUPPORTS_INTERSECTION_OBSERVER()) {
      this._callback();
      return;
    };
    this._onIntersection = this._onIntersection.bind(this);
    this._observer = new IntersectionObserver(this._onIntersection, config);
    this._observer.observe(element);
  };
  SUPPORTS_INTERSECTION_OBSERVER(){
    return ('IntersectionObserver' in window);
  };
  LISTEN_CLASS(){
    return 'lz';
  };
  HANDLED_CLASS(){
    return 'lz-h';
  };
  _onIntersection(entry){
    if(entry[0].isIntersecting){
      var obj = entry[0].target;
      obj.removeClass(this.LISTEN_CLASS()).addClass(this.HANDLED_CLASS());
      this._callback(obj);
      this._observer.unobserve(obj);
      this._observer.disconnect();
      delete this;
    };
  };
};
class Sortage {
  constructor(elements) {
    this.elements = elements;
    this.setDefaultOrder();
  };
  setDefaultOrder(){
    this.currentOrder = this.elements.map(function(el, index){
      return index;
    });
  };
  rearrangeDOM(newOrder){
    newOrder = newOrder || this.currentOrder;
    var parent = this.elements[0].getParent();
    var rearranged = [];
    newOrder.each(function(index){
      rearranged.push(this.elements[index].inject(parent));
    }, this);
    this.elements = $$(rearranged);
    this.setDefaultOrder();
    return this;
  };
};
class Request {
  constructor(url, opts){
    this.url = url || '';
    this.options = {
      method: 'post',
      cache: false,
      data: {},
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      timeout: 0,
      onRequest: function(e){},
      onFailed: function(e){},
      onProgress: function(e){},
      onSuccess: function(e){},
    };
    for (const option in opts){
      this.options[option] = opts[option];
    };
    this.headers = this.options.headers;
    this.initialize();
    this.request = new XMLHttpRequest();
    if (this.options.timeout > 0){
      this.request.timeout = this.options.timeout;
    }
  };
  initialize(){};
  send(){
    let data = new URLSearchParams(this.options.data).toString();
    let url = this.url;
    if (this.options.method.toLowerCase() == 'get'){
      let xmlurl = document.createElement('a');
      xmlurl.href = this.url;
      if (!this.options.cache){
        let date = new Date().getTime();
        data += (data.length > 0) ? ('&'+date) : date;
      }
      url += (xmlurl.search) ? ('&'+data) : ('?'+data);
      xmlurl.dispose();
    }
    this.request.open(this.options.method, url, true);
    for (let [header, value] of Object.entries(this.headers)){
      this.request.setRequestHeader(header, value);
    }
    let self = this;
    this.request.onloadstart = self.options.onRequest;
    this.request.onerror = self.options.onFailed;
    this.request.ontimeout = self.options.onFailed;
    this.request.onprogress = self.options.onProgress;
    this.request.onload = function(e){
      if (this.status >= 200 && this.status < 400) {
        self.success(this);
      } else {
        self.options.onFailed(e);
      }
    }
    this.request.send(data);
  };
  success(e){
    this.options.onSuccess(e.response, e);
  };
};
class RequestJSON extends Request {
  initialize(){
    this.headers['Accept'] = 'application/json';
    this.headers['X-Request'] = 'JSON';
  };
  success(e){
    try {
      let data = JSON.parse(e.response);
      this.options.onSuccess(data);
    } catch (e) {
      this.options.onFailed(e);
    }
  };
}
class FormValidator {
  constructor(form, opts){
    this.options = {
      validateClass: 'validation-failed',
      flagParent: true,
      showErrorMessages: true,
      onFormValidate: function(passed, event){ 
      },
    };
    for (const option in opts){
      this.options[option] = opts[option];
    };
    this.form = form;
    this.applyRules();
    this.rules = [];
    this.timeout = null;
    form.store('validate', this);
  };
  initialize(){
    this.validateOnEntry();
    this.validateOnSubmit();
  };
  add(rule, func){
    this.rules[rule] = func;
  };
  remove(rule){
    if (this.rules[rule]){
      delete this.rules[rule];
    }
  };
  doValidate(){
    let error = false;
    let fields = this.form.getElements('input[data-validators], select[data-validators], textarea[data-validators]');
    let self = this;
    fields.forEach(function(field){
      let results = self.validate(field);
      if (!results[0]){
        error = true;
        self.showError(field, results[1]);
      } else {
        self.hideError(field);
      }
    });
    this.options.onFormValidate(!error, this.form);
    return error;
  }
  validateOnSubmit(){
    let self = this;
    this.submitEvent = function(e){
      let error = self.doValidate();
      if (error){
        e.preventDefault();
      };
    };
    this.form.addEventListener('submit', this.submitEvent);
  };
  validateOnEntry(){
    let self = this;
    let fields = this.form.getElements('input[data-validators], select[data-validators], textarea[data-validators]');
    fields.forEach(function(field){
      field.addEventListener('change', self.validateEvent);
      field.addEventListener('blur', self.validateEvent);
    });
  };
  addField(field, rule){
    field.set('data-validators', rule);
    field.addEventListener('change', this.validateEvent);
    field.addEventListener('blur', this.validateEvent);
  };
  removeField(field){
    field.set('data-validators', null);
    field.removeEventListener('change', this.validateEvent);
    field.removeEventListener('blur', this.validateEvent);
    this.hideError(field);
  };
  validateEvent(event){
    clearTimeout(this.timeout);
    let ev = this;
    let self = ev.form.retrieve('validate');
    this.timeout = setTimeout(function(){
      let results = self.validate(ev);
      if (!results[0]){
        self.showError(ev, results[1]);
      } else {
        self.hideError(ev);
      };
    }, 1);
  };
  showError(field, message){
    let parent = field.parentNode;
    while(parent.tagName != 'DIV'){
      parent = parent.parentNode;
    }
    field.addClass(this.options.validateClass);
    if (this.options.flagParent){
      parent.addClass(this.options.validateClass);
    };
    if (this.options.showErrorMessages){
      let advice = parent.getElement('.validation-advice');
      if (advice){
        advice.set('html', message);
        if (field.get('id')){
          advice.set('id', 'advice-'+field.get('id'));
        }
      } else {
        var span = Create('span').addClass('validation-advice').set('html', message).inject(parent, 'bottom');
        if (field.get('id')){
          span.set('id', 'advice-'+field.get('id'));
        }
      }
    }
  };
  hideError(field){
    let parent = field.parentNode;
    while(parent.tagName != 'DIV'){
      parent = parent.parentNode;
    }
    field.removeClass(this.options.validateClass);
    if (this.options.flagParent){
      parent.removeClass(this.options.validateClass);
    };
    let advice = parent.getElement('.validation-advice');
    if (advice){
      advice.dispose();
    }
  };
  validateField(field){
    if (field){
      let results = this.validate(field);
      if (!results[0]){
        this.showError(field, results[1]);
      } else {
        this.hideError(field);
      };
    }
  }
  validate(field){
    let error = [true];
    if (field.tagName){
      let self = this;
      let rules = field.get('data-validators').split(' ');
      rules.forEach(function(rule){
        if (error[0]){
          let props = rule.split(':');
          switch(props[0]){
            case 'required':
              if (self._validators['IsEmpty'].test(field)){
                error = [false, self._validators['IsEmpty'].errorMsg];
                return;
              };
              break;
            case 'validate-email':
            case 'validate-integer':
            case 'validate-numeric':
            case 'validate-digits':
            case 'validate-alpha':
            case 'validate-alphanum':
            case 'validate-date':
            case 'validate-url':
              if (!self._validators['IsEmpty'].test(field)){
                if (!self._validators[camelCase(rule)].test(field)){
                  error = [false, (field.get('data-error')) ? field.get('data-error') : self._validators[camelCase(rule)].errorMsg];
                  return;
                }
              };
              break;
            case 'validate-required-check':
            case 'validate-one-required':
              if (!self._validators[camelCase(rule)].test(field)){
                error = [false, self._validators[camelCase(rule)].errorMsg];
                return;
              };
              break;
            case 'validate-match':
              if (!self._validators['IsEmpty'].test(field)){
                if (!self._validators[camelCase(props[0])].test(field, props)){
                  error = [false, self._validators[camelCase(props[0])].errorMsg(props)];
                  return;
                }
              };
              break;
            case 'length':
            case 'minLength':
            case 'maxLength':
            case 'min':
              if (!self._validators['IsEmpty'].test(field)){
                if (!self._validators[props[0]].test(field, props)){
                  error = [false, self._validators[props[0]].errorMsg(props)];
                  return;
                }
              };
              break;
            default:
              if (self.rules[props[0]]){
                if (!self.rules[props[0]].test(field, props)){
                  error = [false, (typeof self.rules[props[0]].errorMsg == 'string') ? self.rules[props[0]].errorMsg : self.rules[props[0]].errorMsg(props, field)];
                  return;
                }
              }
              break;
          }
        }
      });
    }
    return error;
  };
  applyRules(){
    this._validators = {
      IsEmpty: {
        errorMsg: 'This field is required',
        test: function(element){
          if (element.type == 'select-one' || element.type == 'select'){
            return !(element.selectedIndex >= 0 && element.options[element.selectedIndex].value != '');
          } else {
            return ((element.get('value') == null) || (element.get('value').length == 0));
          }
        }
      },
      validateEmail: {
        errorMsg: 'Please enter a valid email address',
        test: function(element){
          return (/^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]\.?){0,63}[a-z0-9!#$%&'*+\/=?^_`{|}~-]@(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\])$/i).test(element.get('value'));
        }
      },
      validateUrl: {
        errorMsg: 'Please enter a valid URL',
        test: function(element){
          return (/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(element.get('value'));
        }
      },
      validateInteger: {
        errorMsg: 'Please enter a valid integer',
        test: function(element){
          return (/^(-?[1-9]\d*|0)$/).test(element.get('value'));
        }
      },
      validateNumeric: {
        errorMsg: 'Please enter a valid number',
        test: function(element){
          return (/^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/).test(element.get('value'));
        }
      },
      validateDigits: {
        errorMsg: 'Please enter a valid digit',
        test: function(element){
          return (/^[\d() .:\-\+#]+$/.test(element.get('value')));
        }
      },
      validateAlpha: {
        errorMsg: 'Please enter only alpha characters',
        test: function(element){
          return (/^[a-zA-Z]+$/).test(element.get('value'));
        }
      },
      validateAlphanum: {
        errorMsg: 'Please enter only alphanumeric',
        test: function(element){
          return !(/\W/).test(element.get('value'));
        }
      },
      validateDate: {
        errorMsg: 'Please enter a valid date',
        test: function(element){
          let dateformat = element.get('data-format') ?? 'DD/MM/YYYY';
          try {
            let format = JSON.parse(dateformat);
            var dateObj = dayjs(element.get('value'), format, true);
          } catch(e) {
            var dateObj = dayjs(element.get('value'), dateformat, true);
          }
          if (dateObj.isValid()){
            return true;
          } else {
            return false;
          }
        }
      },
      validateMatch: {
        errorMsg: function(props){
          return 'This field needs to match the '+(props[1] || '')+' field';
        },
        test: function(element, props){
          let matchfield = element.form.getElement('[name="'+(props[1] || '')+'"]');
          if (matchfield){
            return (element.get('value') == matchfield.get('value'));
          };
          return false;
        }
      },
      validateRequiredCheck: {
        errorMsg: 'This field is required',
        test: function(element){
          return (element.get('checked'));
        }
      },
      validateOneRequired: {
        errorMsg: 'This field is required',
        test: function(element){
          let checked = false;
          let parent = element.parentNode;
          while(parent.tagName != 'DIV'){
            parent = parent.parentNode;
          }
          parent.getElements('input').forEach(function(input){
            if (input.get('checked')){
              checked = true;
            }
          });
          return checked;
        }
      },
      length: {
        errorMsg: function(props){
          return 'Please enter '+(props[1] || 0)+' characters';
        },
        test: function(element, props){
          return (element.get('value').length == props[1] || element.get('value').length == 0);
        }
      },
      minLength: {
        errorMsg: function(props){
          return 'Please enter at least '+(props[1] || 0)+' characters';
        },
        test: function(element, props){
          return (element.get('value').trim().length >= (props[1] || 0));
        }
      },
      maxLength: {
        errorMsg: function(props){
          return 'Please enter a maximum of '+(props[1] || 0)+' characters';
        },
        test: function(element, props){
          return (element.get('value').trim().length <= (props[1] || 10000));
        }
      },
      min: {
        errorMsg: function(props){
          return 'Please enter a minimum value of '+(props[1] || 0);
        },
        test: function(element, props){
          return (parseInt(element.get('value')) >= (props[1] || 0));
        }
      }
    };
  }
};
(function(window,document){
  window.local = {};
  local.storage = {};
  local.uidx = 1;
  local.getUIDHTML = function(node){
    return node.uniqueNumber || (node.uniqueNumber = this.uidx++);
  };
  local.get = function(uid){
    return (local.storage[uid] || (local.storage[uid] = {}));
  };
  document.addEventListener('DOMContentLoaded', function(event) {    
    window.fireEvent('domready');
  });
  /*window.addEventListener('hashchange', function(event){
    let hash = document.location.hash.substr(2);
    if ($(hash)){
      scroll({
        top: $(hash).offsetTop
      });
    };
  });*/
  window.Asset = {
    javascript: function(source, properties){
      if (!properties){ properties = {}; };
      var script = Create('script', {
        src: source,
        type: 'text/javascript'
      }),
      doc = properties.document || document,
      load = properties.onload || properties.onLoad;
      ['onload', 'onLoad', 'document'].forEach(function(prop){
        delete properties[prop];
      });
      if (load){
        script.addEventListener('load', load);
      };
      for (const property in properties){
        script.set(property, properties[property]);
      };
      return script.inject(doc.head);
    },
    css: function(source, properties){
      if (!properties){ properties = {}; };
      var link = Create('link', {
        href: source,
        type: 'text/css',
        rel: 'stylesheet',
        media: 'screen'
      }),
      doc = properties.document || document,
      load = properties.onload || properties.onLoad;
      ['onload', 'onLoad', 'document'].forEach(function(prop){
        delete properties[prop];
      });
      link.addEventListener('error', function(e){ /* mozilla fix */
        if (e.target.sheet){
          this.fireEvent('load');
        }
      });
      if (load){
        link.addEventListener('load', load);
      };
      for (const property in properties){
        link.set(property, properties[property]);
      };
      return link.inject(doc.head);
    },
    preload: function(source, properties){
      if (!properties){ properties = {}; };
      var link = Create('link', {
        href: source,
        rel: 'preload',
        as: (properties.style) ? properties.style : 'style'
      }),
      doc = properties.document || document,
      load = properties.onload || properties.onLoad;
      ['onload', 'onLoad', 'document'].forEach(function(prop){
        delete properties[prop];
      });
      if (load){
        link.addEventListener('load', load);
      };
      for (const property in properties){
        link.set(property, properties[property]);
      };
      return link.inject(doc.head);
    },
    image: function(source, properties){
      if (!properties){ properties = {}; };
      var image = Create('img', {
        src: source
      });
      return image;
    }
  };
  window.Create = function(tag, props){
    var el = document.createElement(tag);
    for (const property in props){
      el.set(property, props[property]);
    };
    return el;
  };
  window.camelCase = function(property){
    const regExp = /[-_]\w/ig;
    return property.replace(regExp,(match) => {
      return match[1].toUpperCase();
    });
  };
  window.Inserters = {
    before: function(context, element){
      var parent = element.parentNode;
      if (parent) parent.insertBefore(context, element);
    },
    after: function(context, element){
      var parent = element.parentNode;
      if (parent) parent.insertBefore(context, element.nextSibling);
    },
    bottom: function(context, element){
      element.appendChild(context);
    },
    top: function(context, element){
      element.insertBefore(context, element.firstChild);
    }
  };
  window.LazyLoadImages = LazyLoadImages;
  window.LazyLoadElement = LazyLoadElement;
  window.Sortage = Sortage;
  window.Request = Request;
  window.RequestJSON = RequestJSON;
  window.FormValidator = FormValidator;
})(window,document);