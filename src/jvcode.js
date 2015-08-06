/* License: https://github.com/Angivare/jvcode/blob/master/LICENSE */

var JVCode = (function() {

  function Markup(s, a, b, block, raw) {
    this.s = s
    this.a = a
    this.b = b
    this.block = block ? true : false
    this.raw = raw ? true : false
  }

  var markup = [
    new Markup('p', '', '', true),
    new Markup('br', '', '\n'),
    new Markup('.pre-jv', '', '', true),
    new Markup('.code-jv', '<code>', '</code>'),
    new Markup('strong', "'''", "'''"),
    new Markup('em', "''", "''"),
    new Markup('u', '<u>', '</u>'),
    new Markup('s', '<s>', '</s>'),
    new Markup('ol', '<ol>', '</ol>', true, true),
    new Markup('ul', '<ul>', '</ul>', true, true),
    new Markup('li', '<li>', '</li>', false, true),
    new Markup('.bloc-spoil-jv', '', '', true),
    new Markup('.contenu-spoil', '<spoil>', '</spoil>'),
    new Markup('.blockquote-jv', '<q>', '</q>', true, true),
  ]

  function what(e) {
    for(var i = 0; i < markup.length; i++)
      if(e.is(markup[i].s))
        return markup[i]
    return null
  }

  function he(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
      return '&#'+i.charCodeAt(0)+';'
    })
  }

  function trim(str) {
    return str.replace(/^(\r\n|\r|\n)+|(\r\n|\r|\n)+$/g, '')
  }

  function processText(str) {
    return he(trim(str))
  }

  function moon_walk(e, selector, f) {
    //post-order depth-first traversal
    var c = e.children()
    c.each(function() {
      moon_walk($(this), selector, f)
      if($(this).is(selector)) f(this)
    })
  }

  function prefix(e, str, firstline_space) {
    var l = $.trim(e.innerHTML).split('\n'),
        r = ''

    for(var i = 0; i < l.length; i++) {
      r += str
      if(!i && firstline_space) r += ' '
      r += l[i] + '\n'
    }

    e.outerHTML = r ? r.slice(0, -1) : r
  }

  var parser = {
    wrap: function(m, el, next) {
      var a = m.a, b = m.b
      if(!m.raw) {
        a = he(a)
        b = he(b)
      }
      if(m.block) {
        if(next && next.nodeType == 1) {
          var next_markup = what($(next))
          if(next_markup && next_markup.block)
            b += '\n\n'
        } else if(next && next.nodeType == 3) {
          if(!$(next.parentNode).is('p'))
            b += '\n\n'
        }
      }
      return a + this.process(el) + b
    },

    preProcess: function(base) {
      base.find('img.img-stickers').each(function() {
        var src = $(this).attr('src').split('/'),
            id  = src.pop(),
            grp = src.pop()
        this.outerHTML = '[[sticker:' + grp + '/' + id + ']]'
      })
      base.find('img').each(function() {
        this.outerHTML = $(this).attr('data-code')
      })
      base.find('a').each(function() {
        this.outerHTML = $(this).attr('href')
      })
    },

    process: function(base) {
      var c = base.childNodes,
          lvl_ret = ''
      for(var i = 0; i < c.length; i++) {
        var ret = ''

        var next = null
        for(var j = i+1; j < c.length; j++)
          if((c[j].nodeType == 1)
          || (c[j].nodeType == 3 && processText(c[j].nodeValue))
          ) {
            next = c[j]
            break
          }

        //text node
        if(c[i].nodeType == 3) {
          ret += processText(c[i].nodeValue)

          if(ret && next && !$(c[i].parentNode).is('p')) {
            var next_markup = what($(next))
            if(next_markup && next_markup.block)
              ret += '\n\n'
          }
        }

        //element node
        var m = what($(c[i]))
        if(m) ret += this.wrap(m, c[i], next)

        //exception: list elements separation
        if($(c[i]).is('li') && next && $(next).is('li'))
          ret += '\n'

        //node was ignored: keep parsing children
        if(!ret)
          ret = this.process(c[i])

        lvl_ret += ret
      }

      return lvl_ret
    },

    postProcess: function(base) {
      base = $('<div>' + base + '</div>')

      moon_walk(base, 'q, li', function(e) {
        if($(e).is('q')) 
          prefix(e, he('> '))
        else if($(e).is('li')) {
          var p = e.parentNode,
              s = $(p).is('ol') ? '#' : '*'
          prefix(e, s, true)
        }
      })

      moon_walk(base, 'ol, ul', function(e) {
        e.outerHTML = e.innerHTML
      })

      return base.html()
    },
  }

  return {
    toJVCode: function(str) {
      el = $('<div>' + str + '</div>')
      parser.preProcess(el)
      return $('<div>').html(parser.postProcess(parser.process(el[0]))).text()
    }
  }
}())
