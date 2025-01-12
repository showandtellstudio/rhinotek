const $ = function(el){
  if (el){
    return (el[0] == '#') ? document.querySelector(el) : document.querySelector('#'+el);
  }
};
const $$ = function $$(el, parent) {
  var nodes = (parent || document).querySelectorAll(el);
  return Array.prototype.slice.call(nodes, 0);
};
Element.prototype.addEvent = addEventListener;
Element.prototype.removeEvent = removeEventListener;
Element.prototype.fireEvent = function(e){
  this.dispatchEvent(new Event(e));
};
Window.prototype.addEvent = addEventListener;
Window.prototype.removeEvent = removeEventListener;
Window.prototype.fireEvent = function(e){
  this.dispatchEvent(new Event(e));
};
Function.prototype.delay = function(time){
  setTimeout(this, time);
};
Element.prototype.show = function(){
  this.setStyle('display', null);
  return this;
};
Array.prototype.show = function(){
  this.setStyle('display', null);
  return this;
};
Element.prototype.hide = function(){
  this.setStyle('display', 'none');
  return this;
};
Array.prototype.hide = function(){
  this.setStyle('display', 'none');
  return this;
};
Element.prototype.getElement = function(el){
  var els = $$(el, this);
  return (els[0]) ? els[0] : null;
};
Element.prototype.getElements = function(el){
  return $$(el, this);
};
Element.prototype.addClass = function(cls){
  var cl = cls.split(' ');
  for (let i=0; i<cl.length; i++) {
    this.classList.add(cl[i]);
  };
  return this;
};
Array.prototype.addClass = function(cls){
  var cl = cls.split(' ');
  this.forEach(function(el){
    for (let i=0; i<cl.length; i++) {
      el.classList.add(cl[i]);
    };
  });
  return this;
};
Element.prototype.removeClass = function(cls){
  var cl = cls.split(' ');
  for (let i=0; i<cl.length; i++) {
    this.classList.remove(cl[i]);
  };
  return this;
};
Array.prototype.removeClass = function(cls){
  var cl = cls.split(' ');
  this.forEach(function(el){
    for (let i=0; i<cl.length; i++) {
      el.classList.remove(cl[i]);
    };
  });
  return this;
};
Element.prototype.toggleClass = function(cl){ this.classList.toggle(cl); };
Element.prototype.hasClass = function(cl){ return this.classList.contains(cl); };
Element.prototype.set = function(attr, value){
  if (value == null || (value.length <= 0)){
    this.removeAttribute(attr);
  } else {
    switch(attr){
      case 'html':
        this.innerHTML = value;
        break;
      case 'value':
        this.value = value;
        break;
      case 'checked':
        this.checked = value;
        break;
      default:
        this.setAttribute(attr, value);
        break;
    };
  };
  return this;
};
Array.prototype.set = function(attr, value){
  this.forEach(function(el){
    el.set(attr, value);
  });
  return this;
};
Element.prototype.get = function(attr, value){
  switch(attr){
    case 'html':
      return this.innerHTML;
      break;
    case 'value':
      return this.value;
      break;
    case 'checked':
      return this.checked;
      break;
    default:
      let val = this.getAttribute(attr, value);
      switch(val){
        case '':
          return new String('');
          break;
        default:
          return val;
      }
      return val;
  };
};
Element.prototype.setStyle = function(property, value){
  property = camelCase(property);
  this.style[property] = value;
  if (value == '' || value == null){
    this.style[property] = null;
  };
  return this;
};
Array.prototype.setStyle = function(property, value){
  property = camelCase(property);
  this.forEach(function(el){
    el.style[property] = value;
    if (value == '' || value == null){
      el.style[property] = null;
    };
  });
  return this;
};
Element.prototype.getStyle = function(property){
  property = camelCase(property);
  if (this.style[property]){
    return this.style[property];
  };
  return false;
};
Element.prototype.inject = function(el, where){
  Inserters[where || 'bottom'](this, el);
	return this;
};
Element.prototype.dispose = function(){
  return (this.parentNode) ? this.parentNode.removeChild(this) : this.remove();
};
Element.prototype.empty = function(){
  while(this.firstElementChild){
    this.firstElementChild.remove();
  }
};
Element.prototype.store = function(property, value){
  var storage = local.get(local.getUIDHTML(this));
  storage[property] = value;
  return this;
};
Element.prototype.retrieve = function(property){
  var storage = local.get(local.getUIDHTML(this)), prop = storage[property];
	return prop != null ? prop : null;
};
Element.prototype.eliminate = function(property){
  var storage = local.get(local.getUIDHTML(this));
  delete storage[property];
  return this;
};