import 'virtual:windi.css'
import ScrollReveal from 'scrollreveal'
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import SimpleParallax from "simple-parallax-js/vanilla";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
window.dayjs = dayjs;

import '/src/js/_inc/app.ts'
import 'normalize.css'
import '/src/css/_inc/app.css'
import '/src/css/rhinotek.scss'

(function(window,document){
  const loadEvent = {
    total: 0,
    num: 0
  }
  window.addEvent('domready', function(){
    initSite();
  });
  window.initSite = function(){
    
    setTimeout(function(){
      document.documentElement.addClass('init');
    }, 1);
    $$('a[target="_blank"], a.external').set('target', '_blank').set('rel', 'noopener noreferrer');
    $$('a[data-email]').forEach(function(el){
      el.set('href','mailto:' + el.get('data-email').replace('|','@').replace('/',''));
    });
    
    let hash = document.location.hash.substr(2);
    if ($(hash)){
      window.scrollTo(0, ($(hash).getBoundingClientRect().top+window.scrollY)-$('bar').offsetHeight+1);
    };
    
    /*let backtop = new Create('div', {
      id: 'backtop'
    }).addClass('sticky').set('html', '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2.014 11.998c0 5.517 4.48 9.997 9.998 9.997s9.997-4.48 9.997-9.997c0-5.518-4.479-9.998-9.997-9.998s-9.998 4.48-9.998 9.998zm6.211-1.524s1.505-1.501 3.259-3.254c.146-.147.338-.22.53-.22s.384.073.53.22c1.754 1.752 3.258 3.254 3.258 3.254.145.145.217.335.217.526 0 .192-.074.384-.221.53-.292.293-.766.295-1.057.004l-1.977-1.977v6.693c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-6.693l-1.979 1.978c-.289.289-.761.287-1.054-.006-.147-.147-.221-.339-.222-.53 0-.191.071-.38.216-.525z" fill-rule="nonzero" fill="currentColor" /></svg>').inject($('footer'), 'top');
    backtop.addEvent('click', function(e){
      if (this.hasClass('bt')){
        window.scrollTo(0,0);
      }
    });
    doScroll();
    window.addEvent('scroll', doScroll);
    window.addEvent('resize', doScroll);*/
    doScroll();
    window.addEvent('scroll', doScroll);
    window.addEvent('resize', doScroll);
    
    $$('form[data-validate]').forEach(function(obj){
      if (!obj.retrieve('validate')){
        let validator = new FormValidator(obj, {
          onFormValidate: function(passed, form){
            form.store('data-validation', passed);
            let method = obj.get('method') || 'get';
            if ((passed) && (method.toLowerCase() == 'post')){
              Create('input', {
                type: 'hidden',
                name: 'nospam',
                value: 1
              }).inject(form);
            }
          }
        });
        validator.initialize();
      }
    });
    
    doNav();
    doCounters();
    
    let accordion = $$('[data-accordion] .toggle');
    if (accordion.length > 0){
      accordion.forEach(function(toggle){
        toggle.addEvent('click', function(){
          if (this.parentNode.hasClass('active')){
            this.parentNode.parentNode.getElements('[data-item]').removeClass('active');
          } else {
            this.parentNode.parentNode.getElements('[data-item]').removeClass('active');
            let active = this.parentNode;
            active.addClass('active');
          }
        });
      });
      doHeight();
      window.addEvent('load', doHeight);
      window.addEvent('resize', doHeight);
    }
    
    ScrollReveal().reveal('[data-sr]', {
      delay: 50,
      duration: 1200,
      origin: 'bottom',
      scale: 0.8,
      mobile: false,
      beforeReveal: function (el){
      },
      afterReveal: function(el){
        el.set('data-sr', null);
        ScrollReveal().clean(el);
      }
    });
    
    new SimpleParallax($('header').getElement('img'), {
      delay: 0,
      orientation: 'up',
      scale: 1.5,
      overflow: false,
      customWrapper: '.paralax'
    });
    
    new SimpleParallax($('break').getElement('img'), {
      delay: 0,
      orientation: 'down',
      scale: 1.1,
      overflow: false,
      customWrapper: '.paralax'
    });
    
    let splide = new Splide($('hsplide'), {
      type: 'loop',
      focus: 0,
      arrows: true,
      pagination: false,
      autoplay: true,
      interval: 5000
    });
    splide.mount();
    
  }
  let doCounters = function(){
    var cc = [];
    let counters = $$('[data-counters]');
    if (counters.length > 0){
      counters.forEach(function(obj, j){
        obj.set('data-num', j);
        let cobjs = obj.getElements('[data-counter]');
        cobjs.forEach(function(cobj, i){
          let val = parseInt(cobj.get('html'));
          if (val > 0){
            cobj.set('data-count', val);
            cobj.set('html', 0);
          }
        });
        new LazyLoadElement(obj, function(){
          let cobjs = obj.getElements('[data-count]');
          if (cobjs.length > 0){
            let num = obj.get('data-num');
            cc[num] = setInterval(function(){
              let complete = 0;
              cobjs.forEach(function(cobj){
                let val = parseFloat(cobj.retrieve('val') ?? 0);
                if (val < cobj.get('data-count')){
                  val = (val+(cobj.get('data-count')/300));
                  cobj.store('val', val);
                  cobj.set('html', (val > cobj.get('data-count')) ? cobj.get('data-count') : Math.ceil(val));
                } else {
                  complete++;
                } 
                if (complete == cobjs.length){
                  clearInterval(cc[obj.get('data-num')]);
                }       
              });
            });
          }
        });
      });
    }
  }
  let doNav = function(){
    if ($('nav-toggle')){
      $('nav-toggle').addEventListener('click', function(e){
        $('wrapper').toggleClass('mactive');
        if ($('wrapper').hasClass('mactive')){
          $('nav-toggle').getElement('.hamburger').addClass('is-active');
        } else {
          $('nav-toggle').getElement('.hamburger').removeClass('is-active');
        }
      });
    };
  }
  let doHeight = function(){
    let elements = $$('div[data-height]');
    elements.forEach(function(obj){
      obj.parentNode.setStyle('maxHeight', obj.offsetHeight+'px');
    });
  }
  let doScroll = function(){
    $('bar').removeClass('fix');
    let scrollY = window.scrollY;
    let rect = $('bar').getElement('.bar').getBoundingClientRect();
    if (rect.top <= 0){
      $('bar').addClass('fix');
    }
  }
})(window,document);