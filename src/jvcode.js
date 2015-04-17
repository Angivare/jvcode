/* License: https://github.com/Angivare/jvcode/blob/master/LICENSE */

function JVCode(s, a, b, block, raw) {
  this.s = s
  this.a = a
  this.b = b
  this.block = block ? true : false
  this.raw = raw ? true : false
}

var JVCode = {

  markup: [
    new JVCode('p', '', '', true),
    new JVCode('br', '', '\n'),
    new JVCode('.pre-jv > .code-jv', '<code>', '</code>', true),
    new JVCode('.code-jv', '<code>', '</code>'),
    new JVCode('strong', "'''", "'''"),
    new JVCode('em', "''", "''"),
    new JVCode('u', '<u>', '</u>'),
    new JVCode('s', '<s>', '</s>'),
    new JVCode('ol', '<ol>', '</ol>', true, true),
    new JVCode('ul', '<ul>', '</ul>', true, true),
    new JVCode('li', '<li>', '</li>', false, true),
    new JVCode('.contenu-spoil', '<spoil>', '</spoil>', true),
    new JVCode('.blockquote-jv', '<q>', '</q>', true, true),
  ],

  what: function(e) {
    for(var i = 0; i < JVCode.markup.length; i++)
      if(e.is(JVCode.markup[i].s))
        return JVCode.markup[i]
    return null
  },

  he: function(s) {
    return s.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
      return '&#'+i.charCodeAt(0)+';'
    })
  },

  moon_walk: function(e, s, f) {
    var c = e.children()
    c.each(function() {
      JVCode.moon_walk($(this), s, f)
      if($(this).is(s)) f(this)
    })
  },

  prefix: function(e, s, f_s) {
    var l = $.trim(e.innerHTML).split('\n'),
        r = ''

    for(var i = 0; i < l.length; i++) {
      r += s
      if(!i && f_s) r += ' '
      r += l[i] + '\n'
    }

    e.outerHTML = r ? r.slice(0, -1) : r
  },

  wrap: function(m) {
    var a = m.a, b = m.b
    if(!m.raw) {
      a = JVCode.he(a)
      b = JVCode.he(b)
    }
    if(m.block) {
      if(this.next && this.next.nodeType == 1) {
        var next = JVCode.what($(this.next))
        if(next)
          b = next.block ? b + '\n\n' : b
      }
    }
    this.r += a + this.process(this.e) + b
  },

  trim: function(s) {
    return s.replace(/^(\r\n|\r|\n)+|(\r\n|\r|\n)+$/g, '')
  },

  processText: function(s)  {
    return JVCode.he(JVCode.trim(s.replace(/[ \t]+/g, ' ')))
  },

  preProcess: function(base) {
    base.find('img').each(function() {
      this.outerHTML = $(this).attr('data-code')
    })
    base.find('a').each(function() {
      this.outerHTML = $(this).attr('href')
    })
  },

  process: function(base) {
    var c = base.childNodes,
        ret = ''
    for(var i = 0; i < c.length; i++) {
      this.e = c[i], this.r = ''

      this.prev = null
      for(var j = i-1; j >= 0; j--)
        if(c[j].nodeType == 1) {
          this.prev = c[j]
          break
        }

      this.next = null
      for(var j = i+1; j < c.length; j++)
        if(c[j].nodeType == 1) {
          this.next = c[j]
          break
        }

      var prev = this.prev, next = this.next

      //text node
      if(this.e.nodeType == 3) {
        this.r += JVCode.processText(this.e.nodeValue)

        //exception: orphan text node fix
        if(this.r && this.next && $(this.next).is('ol, ul'))
          this.r += '\n'
      }

      //element node
      var m = JVCode.what($(this.e))
      if(m) this.wrap(m)

      //exception: list elements separation
      if($(c[i]).is('li') && next && $(next).is('li')) 
        this.r += '\n'

      //node was ignored: keep parsing children
      if(!this.r)
        this.r = this.process(this.e)

      ret += this.r
    }

    return ret
  },

  postProcess: function(base) {
    base = $('<div>' + base + '</div>')

    JVCode.moon_walk(base, 'q, li', function(e) {
      console.log(e)
      if($(e).is('q')) 
        JVCode.prefix(e, JVCode.he('> '))
      else if($(e).is('li')) {
        var p = e.parentNode,
            s = $(p).is('ol') ? '#' : '*'
        JVCode.prefix(e, s, true)
      }
    })

    JVCode.moon_walk(base, 'ol, ul', function(e) {
      e.outerHTML = e.innerHTML
    })

    return base.html()
  },

}

function toJVCode(str) {
  el = $('<div>' + str + '</div>')
  JVCode.preProcess(el)
  return $('<div>').html(JVCode.postProcess(JVCode.process(el[0]))).text()
}
