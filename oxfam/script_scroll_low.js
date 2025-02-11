/* Re-use of this code on stories not produced by Harpoon Productions is not permitted */
function r(n, t) {
  for (var i = 0; i < t.length; i++) {
    var r = t[i];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(n, r.key, r);
  }
}
function Jt(n, t, i) {
  t && r(n.prototype, t),
    i && r(n, i),
    Object.defineProperty(n, "prototype", { writable: !1 });
}
/*!
 * Splide.js
 * Version  : 4.1.4
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
var n, t;
(n = this),
  (t = function () {
    "use strict";
    var v = "(prefers-reduced-motion: reduce)",
      G = 4,
      rn = 5,
      r = {
        CREATED: 1,
        MOUNTED: 2,
        IDLE: 3,
        MOVING: G,
        SCROLLING: rn,
        DRAGGING: 6,
        DESTROYED: 7,
      };
    function D(n) {
      n.length = 0;
    }
    function o(n, t, i) {
      return Array.prototype.slice.call(n, t, i);
    }
    function R(n) {
      return n.bind.apply(n, [null].concat(o(arguments, 1)));
    }
    function on() {}
    var p = setTimeout;
    function h(n) {
      return requestAnimationFrame(n);
    }
    function u(n, t) {
      return typeof t === n;
    }
    function un(n) {
      return !c(n) && u("object", n);
    }
    var e = Array.isArray,
      x = R(u, "function"),
      C = R(u, "string"),
      en = R(u, "undefined");
    function c(n) {
      return null === n;
    }
    function m(n) {
      try {
        return n instanceof (n.ownerDocument.defaultView || window).HTMLElement;
      } catch (n) {
        return !1;
      }
    }
    function y(n) {
      return e(n) ? n : [n];
    }
    function g(n, t) {
      y(n).forEach(t);
    }
    function b(n, t) {
      return -1 < n.indexOf(t);
    }
    function k(n, t) {
      return n.push.apply(n, y(t)), n;
    }
    function A(t, n, i) {
      t &&
        g(n, function (n) {
          n && t.classList[i ? "add" : "remove"](n);
        });
    }
    function M(n, t) {
      A(n, C(t) ? t.split(" ") : t, !0);
    }
    function L(n, t) {
      g(t, n.appendChild.bind(n));
    }
    function O(n, i) {
      g(n, function (n) {
        var t = (i || n).parentNode;
        t && t.insertBefore(n, i);
      });
    }
    function cn(n, t) {
      return m(n) && (n.msMatchesSelector || n.matches).call(n, t);
    }
    function S(n, t) {
      n = n ? o(n.children) : [];
      return t
        ? n.filter(function (n) {
            return cn(n, t);
          })
        : n;
    }
    function fn(n, t) {
      return t ? S(n, t)[0] : n.firstElementChild;
    }
    var E = Object.keys;
    function w(t, i, n) {
      t &&
        (n ? E(t).reverse() : E(t)).forEach(function (n) {
          "__proto__" !== n && i(t[n], n);
        });
    }
    function an(r) {
      return (
        o(arguments, 1).forEach(function (i) {
          w(i, function (n, t) {
            r[t] = i[t];
          });
        }),
        r
      );
    }
    function d(i) {
      return (
        o(arguments, 1).forEach(function (n) {
          w(n, function (n, t) {
            e(n)
              ? (i[t] = n.slice())
              : un(n)
              ? (i[t] = d({}, un(i[t]) ? i[t] : {}, n))
              : (i[t] = n);
          });
        }),
        i
      );
    }
    function sn(t, n) {
      g(n || E(t), function (n) {
        delete t[n];
      });
    }
    function P(n, i) {
      g(n, function (t) {
        g(i, function (n) {
          t && t.removeAttribute(n);
        });
      });
    }
    function I(i, t, r) {
      un(t)
        ? w(t, function (n, t) {
            I(i, t, n);
          })
        : g(i, function (n) {
            c(r) || "" === r ? P(n, t) : n.setAttribute(t, String(r));
          });
    }
    function j(n, t, i) {
      n = document.createElement(n);
      return t && (C(t) ? M : I)(n, t), i && L(i, n), n;
    }
    function _(n, t, i) {
      if (en(i)) return getComputedStyle(n)[t];
      c(i) || (n.style[t] = "" + i);
    }
    function ln(n, t) {
      _(n, "display", t);
    }
    function dn(n) {
      (n.setActive && n.setActive()) || n.focus({ preventScroll: !0 });
    }
    function z(n, t) {
      return n.getAttribute(t);
    }
    function vn(n, t) {
      return n && n.classList.contains(t);
    }
    function N(n) {
      return n.getBoundingClientRect();
    }
    function T(n) {
      g(n, function (n) {
        n && n.parentNode && n.parentNode.removeChild(n);
      });
    }
    function hn(n) {
      return fn(new DOMParser().parseFromString(n, "text/html").body);
    }
    function F(n, t) {
      n.preventDefault(),
        t && (n.stopPropagation(), n.stopImmediatePropagation());
    }
    function pn(n, t) {
      return n && n.querySelector(t);
    }
    function gn(n, t) {
      return t ? o(n.querySelectorAll(t)) : [];
    }
    function X(n, t) {
      A(n, t, !1);
    }
    function mn(n) {
      return n.timeStamp;
    }
    function W(n) {
      return C(n) ? n : n ? n + "px" : "";
    }
    var yn = "splide",
      f = "data-" + yn;
    function bn(n, t) {
      if (!n) throw new Error("[" + yn + "] " + (t || ""));
    }
    var Y = Math.min,
      wn = Math.max,
      xn = Math.floor,
      kn = Math.ceil,
      U = Math.abs;
    function Sn(n, t, i) {
      return U(n - t) < i;
    }
    function En(n, t, i, r) {
      var o = Y(t, i),
        t = wn(t, i);
      return r ? o < n && n < t : o <= n && n <= t;
    }
    function q(n, t, i) {
      var r = Y(t, i),
        t = wn(t, i);
      return Y(wn(r, n), t);
    }
    function Ln(n) {
      return (0 < n) - (n < 0);
    }
    function On(t, n) {
      return (
        g(n, function (n) {
          t = t.replace("%s", "" + n);
        }),
        t
      );
    }
    function An(n) {
      return n < 10 ? "0" + n : "" + n;
    }
    var _n = {};
    function zn() {
      var c = [];
      function i(n, i, r) {
        g(n, function (t) {
          t &&
            g(i, function (n) {
              n.split(" ").forEach(function (n) {
                n = n.split(".");
                r(t, n[0], n[1]);
              });
            });
        });
      }
      return {
        bind: function (n, t, u, e) {
          i(n, t, function (n, t, i) {
            var r = "addEventListener" in n,
              o = r
                ? n.removeEventListener.bind(n, t, u, e)
                : n.removeListener.bind(n, u);
            r ? n.addEventListener(t, u, e) : n.addListener(u),
              c.push([n, t, i, u, o]);
          });
        },
        unbind: function (n, t, o) {
          i(n, t, function (t, i, r) {
            c = c.filter(function (n) {
              return (
                !!(
                  n[0] !== t ||
                  n[1] !== i ||
                  n[2] !== r ||
                  (o && n[3] !== o)
                ) || (n[4](), !1)
              );
            });
          });
        },
        dispatch: function (n, t, i) {
          var r;
          return (
            "function" == typeof CustomEvent
              ? (r = new CustomEvent(t, { bubbles: !0, detail: i }))
              : (r = document.createEvent("CustomEvent")).initCustomEvent(
                  t,
                  !0,
                  !1,
                  i
                ),
            n.dispatchEvent(r),
            r
          );
        },
        destroy: function () {
          c.forEach(function (n) {
            n[4]();
          }),
            D(c);
        },
      };
    }
    var B = "mounted",
      H = "move",
      Dn = "moved",
      Mn = "click",
      Pn = "active",
      In = "inactive",
      Rn = "visible",
      Cn = "hidden",
      J = "refresh",
      K = "updated",
      jn = "resize",
      Nn = "resized",
      Tn = "scroll",
      V = "scrolled",
      a = "destroy",
      Gn = "navigation:mounted",
      Fn = "autoplay:play",
      Xn = "autoplay:pause",
      Wn = "lazyload:loaded",
      Yn = "sk",
      Un = "sh";
    function Q(n) {
      var i = n ? n.event.bus : document.createDocumentFragment(),
        r = zn();
      return (
        n && n.event.on(a, r.destroy),
        an(r, {
          bus: i,
          on: function (n, t) {
            r.bind(i, y(n).join(" "), function (n) {
              t.apply(t, e(n.detail) ? n.detail : []);
            });
          },
          off: R(r.unbind, i),
          emit: function (n) {
            r.dispatch(i, n, o(arguments, 1));
          },
        })
      );
    }
    function qn(t, n, i, r) {
      var o,
        u,
        e = Date.now,
        c = 0,
        f = !0,
        a = 0;
      function s() {
        if (!f) {
          if (
            ((c = t ? Y((e() - o) / t, 1) : 1),
            i && i(c),
            1 <= c && (n(), (o = e()), r && ++a >= r))
          )
            return l();
          u = h(s);
        }
      }
      function l() {
        f = !0;
      }
      function d() {
        u && cancelAnimationFrame(u), (f = !(u = c = 0));
      }
      return {
        start: function (n) {
          n || d(), (o = e() - (n ? c * t : 0)), (f = !1), (u = h(s));
        },
        rewind: function () {
          (o = e()), (c = 0), i && i(c);
        },
        pause: l,
        cancel: d,
        set: function (n) {
          t = n;
        },
        isPaused: function () {
          return f;
        },
      };
    }
    function s(n) {
      var t = n;
      return {
        set: function (n) {
          t = n;
        },
        is: function (n) {
          return b(y(n), t);
        },
      };
    }
    var n = "Arrow",
      Bn = n + "Left",
      Hn = n + "Right",
      t = n + "Up",
      n = n + "Down",
      Jn = "ttb",
      l = {
        width: ["height"],
        left: ["top", "right"],
        right: ["bottom", "left"],
        x: ["y"],
        X: ["Y"],
        Y: ["X"],
        ArrowLeft: [t, Hn],
        ArrowRight: [n, Bn],
      };
    var Z = "role",
      $ = "tabindex",
      i = "aria-",
      Kn = i + "controls",
      Vn = i + "current",
      Qn = i + "selected",
      nn = i + "label",
      Zn = i + "labelledby",
      $n = i + "hidden",
      nt = i + "orientation",
      tt = i + "roledescription",
      it = i + "live",
      rt = i + "busy",
      ot = i + "atomic",
      ut = [Z, $, "disabled", Kn, Vn, nn, Zn, $n, nt, tt],
      i = yn + "__",
      et = yn,
      ct = i + "track",
      ft = i + "list",
      at = i + "slide",
      st = at + "--clone",
      lt = at + "__container",
      dt = i + "arrows",
      vt = i + "arrow",
      ht = vt + "--prev",
      pt = vt + "--next",
      gt = i + "pagination",
      mt = gt + "__page",
      yt = i + "progress" + "__bar",
      bt = i + "toggle",
      wt = i + "sr",
      tn = "is-active",
      xt = "is-prev",
      kt = "is-next",
      St = "is-visible",
      Et = "is-loading",
      Lt = "is-focus-in",
      Ot = "is-overflow",
      At = [tn, St, xt, kt, Et, Lt, Ot];
    var _t = "touchstart mousedown",
      zt = "touchmove mousemove",
      Dt = "touchend touchcancel mouseup click";
    var Mt = "slide",
      Pt = "loop",
      It = "fade";
    function Rt(o, r, t, u) {
      var e,
        n = Q(o),
        i = n.on,
        c = n.emit,
        f = n.bind,
        a = o.Components,
        s = o.root,
        l = o.options,
        d = l.isNavigation,
        v = l.updateOnMove,
        h = l.i18n,
        p = l.pagination,
        g = l.slideFocus,
        m = a.Direction.resolve,
        y = z(u, "style"),
        b = z(u, nn),
        w = -1 < t,
        x = fn(u, "." + lt);
      function k() {
        var n = o.splides
          .map(function (n) {
            n = n.splide.Components.Slides.getAt(r);
            return n ? n.slide.id : "";
          })
          .join(" ");
        I(u, nn, On(h.slideX, (w ? t : r) + 1)),
          I(u, Kn, n),
          I(u, Z, g ? "button" : ""),
          g && P(u, tt);
      }
      function S() {
        e || E();
      }
      function E() {
        var n, t, i;
        e ||
          ((n = o.index),
          (i = L()) !== vn(u, tn) &&
            (A(u, tn, i), I(u, Vn, (d && i) || ""), c(i ? Pn : In, O)),
          (i = (function () {
            if (o.is(It)) return L();
            var n = N(a.Elements.track),
              t = N(u),
              i = m("left", !0),
              r = m("right", !0);
            return xn(n[i]) <= kn(t[i]) && xn(t[r]) <= kn(n[r]);
          })()),
          (t = !i && (!L() || w)),
          o.state.is([G, rn]) || I(u, $n, t || ""),
          I(gn(u, l.focusableNodes || ""), $, t ? -1 : ""),
          g && I(u, $, t ? -1 : 0),
          i !== vn(u, St) && (A(u, St, i), c(i ? Rn : Cn, O)),
          i ||
            document.activeElement !== u ||
            ((t = a.Slides.getAt(o.index)) && dn(t.slide)),
          A(u, xt, r === n - 1),
          A(u, kt, r === n + 1));
      }
      function L() {
        var n = o.index;
        return n === r || (l.cloneStatus && n === t);
      }
      var O = {
        index: r,
        slideIndex: t,
        slide: u,
        container: x,
        isClone: w,
        mount: function () {
          w ||
            ((u.id = s.id + "-slide" + An(r + 1)),
            I(u, Z, p ? "tabpanel" : "group"),
            I(u, tt, h.slide),
            I(u, nn, b || On(h.slideLabel, [r + 1, o.length]))),
            f(u, "click", R(c, Mn, O)),
            f(u, "keydown", R(c, Yn, O)),
            i([Dn, Un, V], E),
            i(Gn, k),
            v && i(H, S);
        },
        destroy: function () {
          (e = !0),
            n.destroy(),
            X(u, At),
            P(u, ut),
            I(u, "style", y),
            I(u, nn, b || "");
        },
        update: E,
        style: function (n, t, i) {
          _((i && x) || u, n, t);
        },
        isWithin: function (n, t) {
          return (
            (n = U(n - r)),
            (n = w || (!l.rewind && !o.is(Pt)) ? n : Y(n, o.length - n)) <= t
          );
        },
      };
      return O;
    }
    var Ct = f + "-interval";
    var jt = { passive: !1, capture: !0 };
    var Nt = { Spacebar: " ", Right: Hn, Left: Bn, Up: t, Down: n };
    function Tt(n) {
      return (n = C(n) ? n : n.key), Nt[n] || n;
    }
    var Gt = "keydown";
    var Ft = f + "-lazy",
      Xt = Ft + "-srcset",
      Wt = "[" + Ft + "], [" + Xt + "]";
    var Yt = [" ", "Enter"];
    var Ut = Object.freeze({
        __proto__: null,
        Media: function (r, n, o) {
          var u = r.state,
            t = o.breakpoints || {},
            e = o.reducedMotion || {},
            i = zn(),
            c = [];
          function f(n) {
            n && i.destroy();
          }
          function a(n, t) {
            t = matchMedia(t);
            i.bind(t, "change", s), c.push([n, t]);
          }
          function s() {
            var n = u.is(7),
              t = o.direction,
              i = c.reduce(function (n, t) {
                return d(n, t[1].matches ? t[0] : {});
              }, {});
            sn(o),
              l(i),
              o.destroy
                ? r.destroy("completely" === o.destroy)
                : n
                ? (f(!0), r.mount())
                : t !== o.direction && r.refresh();
          }
          function l(n, t, i) {
            d(o, n),
              t && d(Object.getPrototypeOf(o), n),
              (!i && u.is(1)) || r.emit(K, o);
          }
          return {
            setup: function () {
              var i = "min" === o.mediaQuery;
              E(t)
                .sort(function (n, t) {
                  return i ? +n - +t : +t - +n;
                })
                .forEach(function (n) {
                  a(t[n], "(" + (i ? "min" : "max") + "-width:" + n + "px)");
                }),
                a(e, v),
                s();
            },
            destroy: f,
            reduce: function (n) {
              matchMedia(v).matches && (n ? d(o, e) : sn(o, E(e)));
            },
            set: l,
          };
        },
        Direction: function (n, t, o) {
          return {
            resolve: function (n, t, i) {
              var r =
                "rtl" !== (i = i || o.direction) || t ? (i === Jn ? 0 : -1) : 1;
              return (
                (l[n] && l[n][r]) ||
                n.replace(/width|left|right/i, function (n, t) {
                  n = l[n.toLowerCase()][r] || n;
                  return 0 < t ? n.charAt(0).toUpperCase() + n.slice(1) : n;
                })
              );
            },
            orient: function (n) {
              return n * ("rtl" === o.direction ? 1 : -1);
            },
          };
        },
        Elements: function (n, t, i) {
          var r,
            o,
            u,
            e = Q(n),
            c = e.on,
            f = e.bind,
            a = n.root,
            s = i.i18n,
            l = {},
            d = [],
            v = [],
            h = [];
          function p() {
            (r = y("." + ct)),
              (o = fn(r, "." + ft)),
              bn(r && o, "A track/list element is missing."),
              k(d, S(o, "." + at + ":not(." + st + ")")),
              w(
                {
                  arrows: dt,
                  pagination: gt,
                  prev: ht,
                  next: pt,
                  bar: yt,
                  toggle: bt,
                },
                function (n, t) {
                  l[t] = y("." + n);
                }
              ),
              an(l, { root: a, track: r, list: o, slides: d });
            var n =
                a.id ||
                (function (n) {
                  return "" + n + An((_n[n] = (_n[n] || 0) + 1));
                })(yn),
              t = i.role;
            (a.id = n),
              (r.id = r.id || n + "-track"),
              (o.id = o.id || n + "-list"),
              !z(a, Z) && "SECTION" !== a.tagName && t && I(a, Z, t),
              I(a, tt, s.carousel),
              I(o, Z, "presentation"),
              m();
          }
          function g(n) {
            var t = ut.concat("style");
            D(d), X(a, v), X(r, h), P([r, o], t), P(a, n ? t : ["style", tt]);
          }
          function m() {
            X(a, v),
              X(r, h),
              (v = b(et)),
              (h = b(ct)),
              M(a, v),
              M(r, h),
              I(a, nn, i.label),
              I(a, Zn, i.labelledby);
          }
          function y(n) {
            n = pn(a, n);
            return n &&
              (function (n, t) {
                if (x(n.closest)) return n.closest(t);
                for (var i = n; i && 1 === i.nodeType && !cn(i, t); )
                  i = i.parentElement;
                return i;
              })(n, "." + et) === a
              ? n
              : void 0;
          }
          function b(n) {
            return [
              n + "--" + i.type,
              n + "--" + i.direction,
              i.drag && n + "--draggable",
              i.isNavigation && n + "--nav",
              n === et && tn,
            ];
          }
          return an(l, {
            setup: p,
            mount: function () {
              c(J, g),
                c(J, p),
                c(K, m),
                f(
                  document,
                  _t + " keydown",
                  function (n) {
                    u = "keydown" === n.type;
                  },
                  { capture: !0 }
                ),
                f(a, "focusin", function () {
                  A(a, Lt, !!u);
                });
            },
            destroy: g,
          });
        },
        Slides: function (r, o, u) {
          var n = Q(r),
            t = n.on,
            e = n.emit,
            c = n.bind,
            f = (n = o.Elements).slides,
            a = n.list,
            s = [];
          function i() {
            f.forEach(function (n, t) {
              d(n, t, -1);
            });
          }
          function l() {
            h(function (n) {
              n.destroy();
            }),
              D(s);
          }
          function d(n, t, i) {
            t = Rt(r, t, i, n);
            t.mount(),
              s.push(t),
              s.sort(function (n, t) {
                return n.index - t.index;
              });
          }
          function v(n) {
            return n
              ? p(function (n) {
                  return !n.isClone;
                })
              : s;
          }
          function h(n, t) {
            v(t).forEach(n);
          }
          function p(t) {
            return s.filter(
              x(t)
                ? t
                : function (n) {
                    return C(t) ? cn(n.slide, t) : b(y(t), n.index);
                  }
            );
          }
          return {
            mount: function () {
              i(), t(J, l), t(J, i);
            },
            destroy: l,
            update: function () {
              h(function (n) {
                n.update();
              });
            },
            register: d,
            get: v,
            getIn: function (n) {
              var t = o.Controller,
                i = t.toIndex(n),
                r = t.hasFocus() ? 1 : u.perPage;
              return p(function (n) {
                return En(n.index, i, i + r - 1);
              });
            },
            getAt: function (n) {
              return p(n)[0];
            },
            add: function (n, o) {
              g(n, function (n) {
                var t, i, r;
                m((n = C(n) ? hn(n) : n)) &&
                  ((t = f[o]) ? O(n, t) : L(a, n),
                  M(n, u.classes.slide),
                  (t = n),
                  (i = R(e, jn)),
                  (t = gn(t, "img")),
                  (r = t.length)
                    ? t.forEach(function (n) {
                        c(n, "load error", function () {
                          --r || i();
                        });
                      })
                    : i());
              }),
                e(J);
            },
            remove: function (n) {
              T(
                p(n).map(function (n) {
                  return n.slide;
                })
              ),
                e(J);
            },
            forEach: h,
            filter: p,
            style: function (t, i, r) {
              h(function (n) {
                n.style(t, i, r);
              });
            },
            getLength: function (n) {
              return (n ? f : s).length;
            },
            isEnough: function () {
              return s.length > u.perPage;
            },
          };
        },
        Layout: function (t, n, i) {
          var r,
            o,
            u,
            e = (a = Q(t)).on,
            c = a.bind,
            f = a.emit,
            a = n.Slides,
            s = n.Direction.resolve,
            l = (n = n.Elements).root,
            d = n.track,
            v = n.list,
            h = a.getAt,
            p = a.style;
          function g() {
            (r = i.direction === Jn),
              _(l, "maxWidth", W(i.width)),
              _(d, s("paddingLeft"), y(!1)),
              _(d, s("paddingRight"), y(!0)),
              m(!0);
          }
          function m(n) {
            var t = N(l);
            (!n && o.width === t.width && o.height === t.height) ||
              (_(
                d,
                "height",
                (function () {
                  var n = "";
                  r &&
                    (bn((n = b()), "height or heightRatio is missing."),
                    (n = "calc(" + n + " - " + y(!1) + " - " + y(!0) + ")"));
                  return n;
                })()
              ),
              p(s("marginRight"), W(i.gap)),
              p(
                "width",
                i.autoWidth ? null : W(i.fixedWidth) || (r ? "" : w())
              ),
              p(
                "height",
                W(i.fixedHeight) || (r ? (i.autoHeight ? null : w()) : b()),
                !0
              ),
              (o = t),
              f(Nn),
              u !== (u = O()) && (A(l, Ot, u), f("overflow", u)));
          }
          function y(n) {
            var t = i.padding,
              n = s(n ? "right" : "left");
            return (t && W(t[n] || (un(t) ? 0 : t))) || "0px";
          }
          function b() {
            return W(i.height || N(v).width * i.heightRatio);
          }
          function w() {
            var n = W(i.gap);
            return (
              "calc((100%" +
              (n && " + " + n) +
              ")/" +
              (i.perPage || 1) +
              (n && " - " + n) +
              ")"
            );
          }
          function x() {
            return N(v)[s("width")];
          }
          function k(n, t) {
            n = h(n || 0);
            return n ? N(n.slide)[s("width")] + (t ? 0 : L()) : 0;
          }
          function S(n, t) {
            var i,
              n = h(n);
            return n
              ? ((n = N(n.slide)[s("right")]),
                (i = N(v)[s("left")]),
                U(n - i) + (t ? 0 : L()))
              : 0;
          }
          function E(n) {
            return S(t.length - 1) - S(0) + k(0, n);
          }
          function L() {
            var n = h(0);
            return (n && parseFloat(_(n.slide, s("marginRight")))) || 0;
          }
          function O() {
            return t.is(It) || E(!0) > x();
          }
          return {
            mount: function () {
              var n, t, i;
              g(),
                c(
                  window,
                  "resize load",
                  ((n = R(f, jn)),
                  (i = qn(t || 0, n, null, 1)),
                  function () {
                    i.isPaused() && i.start();
                  })
                ),
                e([K, J], g),
                e(jn, m);
            },
            resize: m,
            listSize: x,
            slideSize: k,
            sliderSize: E,
            totalSize: S,
            getPadding: function (n) {
              return (
                parseFloat(_(d, s("padding" + (n ? "Right" : "Left")))) || 0
              );
            },
            isOverflow: O,
          };
        },
        Clones: function (c, i, f) {
          var t,
            r = Q(c),
            n = r.on,
            a = i.Elements,
            s = i.Slides,
            o = i.Direction.resolve,
            l = [];
          function u() {
            if ((n(J, d), n([K, jn], v), (t = h()))) {
              var o = t,
                u = s.get().slice(),
                e = u.length;
              if (e) {
                for (; u.length < o; ) k(u, u);
                k(u.slice(-o), u.slice(0, o)).forEach(function (n, t) {
                  var i = t < o,
                    r = (function (n, t) {
                      n = n.cloneNode(!0);
                      return (
                        M(n, f.classes.clone),
                        (n.id = c.root.id + "-clone" + An(t + 1)),
                        n
                      );
                    })(n.slide, t);
                  i ? O(r, u[0].slide) : L(a.list, r),
                    k(l, r),
                    s.register(r, t - o + (i ? 0 : e), n.index);
                });
              }
              i.Layout.resize(!0);
            }
          }
          function d() {
            e(), u();
          }
          function e() {
            T(l), D(l), r.destroy();
          }
          function v() {
            var n = h();
            t !== n && (t < n || !n) && r.emit(J);
          }
          function h() {
            var n,
              t = f.clones;
            return (
              c.is(Pt)
                ? en(t) &&
                  (t =
                    ((n = f[o("fixedWidth")] && i.Layout.slideSize(0)) &&
                      kn(N(a.track)[o("width")] / n)) ||
                    (f[o("autoWidth")] && c.length) ||
                    2 * f.perPage)
                : (t = 0),
              t
            );
          }
          return { mount: u, destroy: e };
        },
        Move: function (r, c, o) {
          var e,
            n = Q(r),
            t = n.on,
            f = n.emit,
            a = r.state.set,
            u = (n = c.Layout).slideSize,
            i = n.getPadding,
            s = n.totalSize,
            l = n.listSize,
            d = n.sliderSize,
            v = (n = c.Direction).resolve,
            h = n.orient,
            p = (n = c.Elements).list,
            g = n.track;
          function m() {
            c.Controller.isBusy() ||
              (c.Scroll.cancel(), y(r.index), c.Slides.update());
          }
          function y(n) {
            b(S(n, !0));
          }
          function b(n, t) {
            r.is(It) ||
              ((t = t
                ? n
                : (function (n) {
                    {
                      var t, i;
                      r.is(Pt) &&
                        ((t = k(n)),
                        (i = t > c.Controller.getEnd()),
                        (t < 0 || i) && (n = w(n, i)));
                    }
                    return n;
                  })(n)),
              _(p, "transform", "translate" + v("X") + "(" + t + "px)"),
              n !== t && f(Un));
          }
          function w(n, t) {
            var i = n - L(t),
              r = d();
            return (n -= h(r * (kn(U(i) / r) || 1)) * (t ? 1 : -1));
          }
          function x() {
            b(E(), !0), e.cancel();
          }
          function k(n) {
            for (
              var t = c.Slides.get(), i = 0, r = 1 / 0, o = 0;
              o < t.length;
              o++
            ) {
              var u = t[o].index,
                e = U(S(u, !0) - n);
              if (!(e <= r)) break;
              (r = e), (i = u);
            }
            return i;
          }
          function S(n, t) {
            var i = h(
              s(n - 1) -
                ((n = n),
                "center" === (i = o.focus)
                  ? (l() - u(n, !0)) / 2
                  : +i * u(n) || 0)
            );
            return t
              ? ((n = i),
                (n = o.trimSpace && r.is(Mt) ? q(n, 0, h(d(!0) - l())) : n))
              : i;
          }
          function E() {
            var n = v("left");
            return N(p)[n] - N(g)[n] + h(i(!1));
          }
          function L(n) {
            return S(n ? c.Controller.getEnd() : 0, !!o.trimSpace);
          }
          return {
            mount: function () {
              (e = c.Transition), t([B, Nn, K, J], m);
            },
            move: function (n, t, i, r) {
              var o, u;
              n !== t &&
                ((o = i < n),
                (u = h(w(E(), o))),
                o ? 0 <= u : u <= p[v("scrollWidth")] - N(g)[v("width")]) &&
                (x(), b(w(E(), i < n), !0)),
                a(G),
                f(H, t, i, n),
                e.start(t, function () {
                  a(3), f(Dn, t, i, n), r && r();
                });
            },
            jump: y,
            translate: b,
            shift: w,
            cancel: x,
            toIndex: k,
            toPosition: S,
            getPosition: E,
            getLimit: L,
            exceededLimit: function (n, t) {
              t = en(t) ? E() : t;
              var i = !0 !== n && h(t) < h(L(!1)),
                n = !1 !== n && h(t) > h(L(!0));
              return i || n;
            },
            reposition: m,
          };
        },
        Controller: function (o, u, e) {
          var c,
            f,
            a,
            s,
            n = Q(o),
            t = n.on,
            i = n.emit,
            l = u.Move,
            d = l.getPosition,
            r = l.getLimit,
            v = l.toPosition,
            h = (n = u.Slides).isEnough,
            p = n.getLength,
            g = e.omitEnd,
            m = o.is(Pt),
            y = o.is(Mt),
            b = R(L, !1),
            w = R(L, !0),
            x = e.start || 0,
            k = x;
          function S() {
            (f = p(!0)), (a = e.perMove), (s = e.perPage), (c = _());
            var n = q(x, 0, g ? c : f - 1);
            n !== x && ((x = n), l.reposition());
          }
          function E() {
            c !== _() && i("ei");
          }
          function L(n, t) {
            var i = a || (P() ? 1 : s),
              i = O(x + i * (n ? -1 : 1), x, !(a || P()));
            return -1 === i && y && !Sn(d(), r(!n), 1)
              ? n
                ? 0
                : c
              : t
              ? i
              : A(i);
          }
          function O(n, t, i) {
            var r;
            return (
              h() || P()
                ? ((r = (function (n) {
                    if (y && "move" === e.trimSpace && n !== x)
                      for (
                        var t = d();
                        t === v(n, !0) && En(n, 0, o.length - 1, !e.rewind);

                      )
                        n < x ? --n : ++n;
                    return n;
                  })(n)) !== n && ((t = n), (n = r), (i = !1)),
                  n < 0 || c < n
                    ? (n =
                        a || (!En(0, n, t, !0) && !En(c, t, n, !0))
                          ? m
                            ? i
                              ? n < 0
                                ? -(f % s || s)
                                : f
                              : n
                            : e.rewind
                            ? n < 0
                              ? c
                              : 0
                            : -1
                          : z(D(n)))
                    : i && n !== t && (n = z(D(t) + (n < t ? -1 : 1))))
                : (n = -1),
              n
            );
          }
          function A(n) {
            return m ? (n + f) % f || 0 : n;
          }
          function _() {
            for (var n = f - (P() || (m && a) ? 1 : s); g && 0 < n--; )
              if (v(f - 1, !0) !== v(n, !0)) {
                n++;
                break;
              }
            return q(n, 0, f - 1);
          }
          function z(n) {
            return q(P() ? n : s * n, 0, c);
          }
          function D(n) {
            return P() ? Y(n, c) : xn((c <= n ? f - 1 : n) / s);
          }
          function M(n) {
            n !== x && ((k = x), (x = n));
          }
          function P() {
            return !en(e.focus) || e.isNavigation;
          }
          function I() {
            return o.state.is([G, rn]) && !!e.waitForTransition;
          }
          return {
            mount: function () {
              S(), t([K, J, "ei"], S), t(Nn, E);
            },
            go: function (n, t, i) {
              var r;
              I() ||
                (-1 <
                  (r = A(
                    (n = (function (n) {
                      var t = x;
                      {
                        var i, r;
                        C(n)
                          ? ((r = n.match(/([+\-<>])(\d+)?/) || []),
                            (i = r[1]),
                            (r = r[2]),
                            "+" === i || "-" === i
                              ? (t = O(x + +("" + i + (+r || 1)), x))
                              : ">" === i
                              ? (t = r ? z(+r) : b(!0))
                              : "<" === i && (t = w(!0)))
                          : (t = m ? n : q(n, 0, c));
                      }
                      return t;
                    })(n))
                  )) &&
                  (t || r !== x) &&
                  (M(r), l.move(n, r, k, i)));
            },
            scroll: function (n, t, i, r) {
              u.Scroll.scroll(n, t, i, function () {
                var n = A(l.toIndex(d()));
                M(g ? Y(n, c) : n), r && r();
              });
            },
            getNext: b,
            getPrev: w,
            getAdjacent: L,
            getEnd: _,
            setIndex: M,
            getIndex: function (n) {
              return n ? k : x;
            },
            toIndex: z,
            toPage: D,
            toDest: function (n) {
              return (n = l.toIndex(n)), y ? q(n, 0, c) : n;
            },
            hasFocus: P,
            isBusy: I,
          };
        },
        Arrows: function (o, n, t) {
          var i,
            r,
            u = Q(o),
            e = u.on,
            c = u.bind,
            f = u.emit,
            a = t.classes,
            s = t.i18n,
            l = n.Elements,
            d = n.Controller,
            v = l.arrows,
            h = l.track,
            p = v,
            g = l.prev,
            m = l.next,
            y = {};
          function b() {
            var n = t.arrows;
            !n ||
              (g && m) ||
              ((p = v || j("div", a.arrows)),
              (g = S(!0)),
              (m = S(!1)),
              (i = !0),
              L(p, [g, m]),
              v || O(p, h)),
              g &&
                m &&
                (an(y, { prev: g, next: m }),
                ln(p, n ? "" : "none"),
                M(p, (r = dt + "--" + t.direction)),
                n &&
                  (e([B, Dn, J, V, "ei"], E),
                  c(m, "click", R(k, ">")),
                  c(g, "click", R(k, "<")),
                  E(),
                  I([g, m], Kn, h.id),
                  f("arrows:mounted", g, m))),
              e(K, w);
          }
          function w() {
            x(), b();
          }
          function x() {
            u.destroy(),
              X(p, r),
              i ? (T(v ? [g, m] : p), (g = m = null)) : P([g, m], ut);
          }
          function k(n) {
            d.go(n, !0);
          }
          function S(n) {
            return hn(
              '<button class="' +
                a.arrow +
                " " +
                (n ? a.prev : a.next) +
                '" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="' +
                (t.arrowPath ||
                  "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z") +
                '" />'
            );
          }
          function E() {
            var n, t, i, r;
            g &&
              m &&
              ((r = o.index),
              (n = d.getPrev()),
              (t = d.getNext()),
              (i = -1 < n && r < n ? s.last : s.prev),
              (r = -1 < t && t < r ? s.first : s.next),
              (g.disabled = n < 0),
              (m.disabled = t < 0),
              I(g, nn, i),
              I(m, nn, r),
              f("arrows:updated", g, m, n, t));
          }
          return { arrows: y, mount: b, destroy: x, update: E };
        },
        Autoplay: function (n, t, i) {
          var r,
            o,
            u = Q(n),
            e = u.on,
            c = u.bind,
            f = u.emit,
            a = qn(i.interval, n.go.bind(n, ">"), function (n) {
              var t = l.bar;
              t && _(t, "width", 100 * n + "%"), f("autoplay:playing", n);
            }),
            s = a.isPaused,
            l = t.Elements,
            d = (u = t.Elements).root,
            v = u.toggle,
            h = i.autoplay,
            p = "pause" === h;
          function g() {
            s() &&
              t.Slides.isEnough() &&
              (a.start(!i.resetProgress), (o = r = p = !1), b(), f(Fn));
          }
          function m(n) {
            (p = !!(n = void 0 === n ? !0 : n)), b(), s() || (a.pause(), f(Xn));
          }
          function y() {
            p || (r || o ? m(!1) : g());
          }
          function b() {
            v && (A(v, tn, !p), I(v, nn, i.i18n[p ? "play" : "pause"]));
          }
          function w(n) {
            n = t.Slides.getAt(n);
            a.set((n && +z(n.slide, Ct)) || i.interval);
          }
          return {
            mount: function () {
              h &&
                (i.pauseOnHover &&
                  c(d, "mouseenter mouseleave", function (n) {
                    (r = "mouseenter" === n.type), y();
                  }),
                i.pauseOnFocus &&
                  c(d, "focusin focusout", function (n) {
                    (o = "focusin" === n.type), y();
                  }),
                v &&
                  c(v, "click", function () {
                    p ? g() : m(!0);
                  }),
                e([H, Tn, J], a.rewind),
                e(H, w),
                v && I(v, Kn, l.track.id),
                p || g(),
                b());
            },
            destroy: a.cancel,
            play: g,
            pause: m,
            isPaused: s,
          };
        },
        Cover: function (n, t, i) {
          var r = Q(n).on;
          function o(i) {
            t.Slides.forEach(function (n) {
              var t = fn(n.container || n.slide, "img");
              t && t.src && u(i, t, n);
            });
          }
          function u(n, t, i) {
            i.style(
              "background",
              n ? 'center/cover no-repeat url("' + t.src + '")' : "",
              !0
            ),
              ln(t, n ? "none" : "");
          }
          return {
            mount: function () {
              i.cover && (r(Wn, R(u, !0)), r([B, K, J], R(o, !0)));
            },
            destroy: R(o, !1),
          };
        },
        Scroll: function (n, c, u) {
          var f,
            a,
            t = Q(n),
            i = t.on,
            s = t.emit,
            l = n.state.set,
            d = c.Move,
            v = d.getPosition,
            e = d.getLimit,
            h = d.exceededLimit,
            p = d.translate,
            g = n.is(Mt),
            m = 1;
          function y(n, t, i, r, o) {
            var u,
              e = v(),
              i =
                (x(),
                !i ||
                  (g && h()) ||
                  ((i = c.Layout.sliderSize()),
                  (u = Ln(n) * i * xn(U(n) / i) || 0),
                  (n = d.toPosition(c.Controller.toDest(n % i)) + u)),
                Sn(e, n, 1));
            (m = 1),
              (t = i ? 0 : t || wn(U(n - e) / 1.5, 800)),
              (a = r),
              (f = qn(t, b, R(w, e, n, o), 1)),
              l(rn),
              s(Tn),
              f.start();
          }
          function b() {
            l(3), a && a(), s(V);
          }
          function w(n, t, i, r) {
            var o = v(),
              r =
                (n +
                  (t - n) *
                    ((t = r),
                    (n = u.easingFunc) ? n(t) : 1 - Math.pow(1 - t, 4)) -
                  o) *
                m;
            p(o + r),
              g &&
                !i &&
                h() &&
                ((m *= 0.6), U(r) < 10 && y(e(h(!0)), 600, !1, a, !0));
          }
          function x() {
            f && f.cancel();
          }
          function r() {
            f && !f.isPaused() && (x(), b());
          }
          return {
            mount: function () {
              i(H, x), i([K, J], r);
            },
            destroy: x,
            scroll: y,
            cancel: r,
          };
        },
        Drag: function (e, o, c) {
          var f,
            t,
            u,
            a,
            s,
            l,
            d,
            v,
            n = Q(e),
            i = n.on,
            h = n.emit,
            p = n.bind,
            g = n.unbind,
            m = e.state,
            y = o.Move,
            b = o.Scroll,
            w = o.Controller,
            x = o.Elements.track,
            k = o.Media.reduce,
            r = (n = o.Direction).resolve,
            S = n.orient,
            E = y.getPosition,
            L = y.exceededLimit,
            O = !1;
          function j() {
            var n = c.drag;
            C(!n), (a = "free" === n);
          }
          function N(n) {
            var t, i, r;
            (l = !1),
              d ||
                ((t = R(n)),
                (i = n.target),
                (r = c.noDrag),
                cn(i, "." + mt + ", ." + vt) ||
                  (r && cn(i, r)) ||
                  (!t && n.button) ||
                  (w.isBusy()
                    ? F(n, !0)
                    : ((v = t ? x : window),
                      (s = m.is([G, rn])),
                      (u = null),
                      p(v, zt, A, jt),
                      p(v, Dt, _, jt),
                      y.cancel(),
                      b.cancel(),
                      z(n))));
          }
          function A(n) {
            var t, i, r, o, u;
            m.is(6) || (m.set(6), h("drag")),
              n.cancelable &&
                (s
                  ? (y.translate(f + D(n) / (O && e.is(Mt) ? 5 : 1)),
                    (u = 200 < M(n)),
                    (t = O !== (O = L())),
                    (u || t) && z(n),
                    (l = !0),
                    h("dragging"),
                    F(n))
                  : U(D((u = n))) > U(D(u, !0)) &&
                    ((t = n),
                    (i = c.dragMinThreshold),
                    (r = un(i)),
                    (o = (r && i.mouse) || 0),
                    (r = (r ? i.touch : +i) || 10),
                    (s = U(D(t)) > (R(t) ? r : o)),
                    F(n)));
          }
          function _(n) {
            var t, i, r;
            m.is(6) && (m.set(3), h("dragged")),
              s &&
                ((i = (function (n) {
                  return (
                    E() +
                    Ln(n) *
                      Y(
                        U(n) * (c.flickPower || 600),
                        a ? 1 / 0 : o.Layout.listSize() * (c.flickMaxPages || 1)
                      )
                  );
                })(
                  (t = (function (n) {
                    if (e.is(Pt) || !O) {
                      var t = M(n);
                      if (t && t < 200) return D(n) / t;
                    }
                    return 0;
                  })((t = n)))
                )),
                (r = c.rewind && c.rewindByDrag),
                k(!1),
                a
                  ? w.scroll(i, 0, c.snap)
                  : e.is(It)
                  ? w.go(S(Ln(t)) < 0 ? (r ? "<" : "-") : r ? ">" : "+")
                  : e.is(Mt) && O && r
                  ? w.go(L(!0) ? ">" : "<")
                  : w.go(w.toDest(i), !0),
                k(!0),
                F(n)),
              g(v, zt, A),
              g(v, Dt, _),
              (s = !1);
          }
          function T(n) {
            !d && l && F(n, !0);
          }
          function z(n) {
            (u = t), (t = n), (f = E());
          }
          function D(n, t) {
            return I(n, t) - I(P(n), t);
          }
          function M(n) {
            return mn(n) - mn(P(n));
          }
          function P(n) {
            return (t === n && u) || t;
          }
          function I(n, t) {
            return (R(n) ? n.changedTouches[0] : n)["page" + r(t ? "Y" : "X")];
          }
          function R(n) {
            return "undefined" != typeof TouchEvent && n instanceof TouchEvent;
          }
          function C(n) {
            d = n;
          }
          return {
            mount: function () {
              p(x, zt, on, jt),
                p(x, Dt, on, jt),
                p(x, _t, N, jt),
                p(x, "click", T, { capture: !0 }),
                p(x, "dragstart", F),
                i([B, K], j);
            },
            disable: C,
            isDragging: function () {
              return s;
            },
          };
        },
        Keyboard: function (t, n, i) {
          var r,
            o,
            u = Q(t),
            e = u.on,
            c = u.bind,
            f = u.unbind,
            a = t.root,
            s = n.Direction.resolve;
          function l() {
            var n = i.keyboard;
            n && ((r = "global" === n ? window : a), c(r, Gt, h));
          }
          function d() {
            f(r, Gt);
          }
          function v() {
            var n = o;
            (o = !0),
              p(function () {
                o = n;
              });
          }
          function h(n) {
            o || ((n = Tt(n)) === s(Bn) ? t.go("<") : n === s(Hn) && t.go(">"));
          }
          return {
            mount: function () {
              l(), e(K, d), e(K, l), e(H, v);
            },
            destroy: d,
            disable: function (n) {
              o = n;
            },
          };
        },
        LazyLoad: function (i, n, o) {
          var t = Q(i),
            r = t.on,
            u = t.off,
            e = t.bind,
            c = t.emit,
            f = "sequential" === o.lazyLoad,
            a = [Dn, V],
            s = [];
          function l() {
            D(s),
              n.Slides.forEach(function (r) {
                gn(r.slide, Wt).forEach(function (n) {
                  var t = z(n, Ft),
                    i = z(n, Xt);
                  (t === n.src && i === n.srcset) ||
                    ((t = o.classes.spinner),
                    (t = fn((i = n.parentElement), "." + t) || j("span", t, i)),
                    s.push([n, r, t]),
                    n.src || ln(n, "none"));
                });
              }),
              (f ? p : (u(a), r(a, d), d))();
          }
          function d() {
            (s = s.filter(function (n) {
              var t = o.perPage * ((o.preloadPages || 1) + 1) - 1;
              return !n[1].isWithin(i.index, t) || v(n);
            })).length || u(a);
          }
          function v(n) {
            var t = n[0];
            M(n[1].slide, Et),
              e(t, "load error", R(h, n)),
              I(t, "src", z(t, Ft)),
              I(t, "srcset", z(t, Xt)),
              P(t, Ft),
              P(t, Xt);
          }
          function h(n, t) {
            var i = n[0],
              r = n[1];
            X(r.slide, Et),
              "error" !== t.type && (T(n[2]), ln(i, ""), c(Wn, i, r), c(jn)),
              f && p();
          }
          function p() {
            s.length && v(s.shift());
          }
          return {
            mount: function () {
              o.lazyLoad && (l(), r(J, l));
            },
            destroy: R(D, s),
            check: d,
          };
        },
        Pagination: function (l, n, d) {
          var v,
            h,
            t = Q(l),
            p = t.on,
            g = t.emit,
            m = t.bind,
            y = n.Slides,
            b = n.Elements,
            w = n.Controller,
            x = w.hasFocus,
            r = w.getIndex,
            e = w.go,
            c = n.Direction.resolve,
            k = b.pagination,
            S = [];
          function E() {
            v && (T(k ? o(v.children) : v), X(v, h), D(S), (v = null)),
              t.destroy();
          }
          function L(n) {
            e(">" + n, !0);
          }
          function O(n, t) {
            var i = S.length,
              r = Tt(t),
              o = A(),
              u = -1,
              o =
                (r === c(Hn, !1, o)
                  ? (u = ++n % i)
                  : r === c(Bn, !1, o)
                  ? (u = (--n + i) % i)
                  : "Home" === r
                  ? (u = 0)
                  : "End" === r && (u = i - 1),
                S[u]);
            o && (dn(o.button), e(">" + u), F(t, !0));
          }
          function A() {
            return d.paginationDirection || d.direction;
          }
          function _(n) {
            return S[w.toPage(n)];
          }
          function z() {
            var n,
              t = _(r(!0)),
              i = _(r());
            t && (X((n = t.button), tn), P(n, Qn), I(n, $, -1)),
              i && (M((n = i.button), tn), I(n, Qn, !0), I(n, $, "")),
              g("pagination:updated", { list: v, items: S }, t, i);
          }
          return {
            items: S,
            mount: function n() {
              E(), p([K, J, "ei"], n);
              var t = d.pagination;
              if ((k && ln(k, t ? "" : "none"), t)) {
                p([H, Tn, V], z);
                var t = l.length,
                  i = d.classes,
                  r = d.i18n,
                  o = d.perPage,
                  u = x() ? w.getEnd() + 1 : kn(t / o);
                M(
                  (v = k || j("ul", i.pagination, b.track.parentElement)),
                  (h = gt + "--" + A())
                ),
                  I(v, Z, "tablist"),
                  I(v, nn, r.select),
                  I(v, nt, A() === Jn ? "vertical" : "");
                for (var e = 0; e < u; e++) {
                  var c = j("li", null, v),
                    f = j("button", { class: i.page, type: "button" }, c),
                    a = y.getIn(e).map(function (n) {
                      return n.slide.id;
                    }),
                    s = !x() && 1 < o ? r.pageX : r.slideX;
                  m(f, "click", R(L, e)),
                    d.paginationKeyboard && m(f, "keydown", R(O, e)),
                    I(c, Z, "presentation"),
                    I(f, Z, "tab"),
                    I(f, Kn, a.join(" ")),
                    I(f, nn, On(s, e + 1)),
                    I(f, $, -1),
                    S.push({ li: c, button: f, page: e });
                }
                z(), g("pagination:mounted", { list: v, items: S }, _(l.index));
              }
            },
            destroy: E,
            getAt: _,
            update: z,
          };
        },
        Sync: function (i, n, t) {
          var r = t.isNavigation,
            o = t.slideFocus,
            u = [];
          function e() {
            var n, t;
            i.splides.forEach(function (n) {
              n.isParent || (f(i, n.splide), f(n.splide, i));
            }),
              r &&
                ((n = Q(i)),
                (t = n.on)(Mn, s),
                t(Yn, l),
                t([B, K], a),
                u.push(n),
                n.emit(Gn, i.splides));
          }
          function c() {
            u.forEach(function (n) {
              n.destroy();
            }),
              D(u);
          }
          function f(n, r) {
            n = Q(n);
            n.on(H, function (n, t, i) {
              r.go(r.is(Pt) ? i : n);
            }),
              u.push(n);
          }
          function a() {
            I(n.Elements.list, nt, t.direction === Jn ? "vertical" : "");
          }
          function s(n) {
            i.go(n.index);
          }
          function l(n, t) {
            b(Yt, Tt(t)) && (s(n), F(t));
          }
          return {
            setup: R(n.Media.set, { slideFocus: en(o) ? r : o }, !0),
            mount: e,
            destroy: c,
            remount: function () {
              c(), e();
            },
          };
        },
        Wheel: function (e, c, f) {
          var n = Q(e).bind,
            a = 0;
          function t(n) {
            var t, i, r, o, u;
            n.cancelable &&
              ((t = (u = n.deltaY) < 0),
              (i = mn(n)),
              (r = f.wheelMinThreshold || 0),
              (o = f.wheelSleep || 0),
              U(u) > r && o < i - a && (e.go(t ? "<" : ">"), (a = i)),
              (u = t),
              (f.releaseWheel &&
                !e.state.is(G) &&
                -1 === c.Controller.getAdjacent(u)) ||
                F(n));
          }
          return {
            mount: function () {
              f.wheel && n(c.Elements.track, "wheel", t, jt);
            },
          };
        },
        Live: function (n, t, i) {
          var r = Q(n).on,
            o = t.Elements.track,
            u = i.live && !i.isNavigation,
            e = j("span", wt),
            c = qn(90, R(f, !1));
          function f(n) {
            I(o, rt, n), n ? (L(o, e), c.start()) : (T(e), c.cancel());
          }
          function a(n) {
            u && I(o, it, n ? "off" : "polite");
          }
          return {
            mount: function () {
              u &&
                (a(!t.Autoplay.isPaused()),
                I(o, ot, !0),
                (e.textContent = "…"),
                r(Fn, R(a, !0)),
                r(Xn, R(a, !1)),
                r([Dn, V], R(f, !0)));
            },
            disable: a,
            destroy: function () {
              P(o, [it, ot, rt]), T(e);
            },
          };
        },
      }),
      qt = {
        type: "slide",
        role: "region",
        speed: 400,
        perPage: 1,
        cloneStatus: !0,
        arrows: !0,
        pagination: !0,
        paginationKeyboard: !0,
        interval: 5e3,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        resetProgress: !0,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        drag: !0,
        direction: "ltr",
        trimSpace: !0,
        focusableNodes: "a, button, textarea, input, select, iframe",
        live: !0,
        classes: {
          slide: at,
          clone: st,
          arrows: dt,
          arrow: vt,
          prev: ht,
          next: pt,
          pagination: gt,
          page: mt,
          spinner: i + "spinner",
        },
        i18n: {
          prev: "Previous slide",
          next: "Next slide",
          first: "Go to first slide",
          last: "Go to last slide",
          slideX: "Go to slide %s",
          pageX: "Go to page %s",
          play: "Start autoplay",
          pause: "Pause autoplay",
          carousel: "carousel",
          slide: "slide",
          select: "Select a slide to show",
          slideLabel: "%s of %s",
        },
        reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
      };
    function Bt(n, t, i) {
      var r = t.Slides;
      function o() {
        r.forEach(function (n) {
          n.style("transform", "translateX(-" + 100 * n.index + "%)");
        });
      }
      return {
        mount: function () {
          Q(n).on([B, J], o);
        },
        start: function (n, t) {
          r.style("transition", "opacity " + i.speed + "ms " + i.easing), p(t);
        },
        cancel: on,
      };
    }
    function Ht(u, n, e) {
      var c,
        f = n.Move,
        a = n.Controller,
        s = n.Scroll,
        t = n.Elements.list,
        l = R(_, t, "transition");
      function i() {
        l(""), s.cancel();
      }
      return {
        mount: function () {
          Q(u).bind(t, "transitionend", function (n) {
            n.target === t && c && (i(), c());
          });
        },
        start: function (n, t) {
          var i = f.toPosition(n, !0),
            r = f.getPosition(),
            o = (function (n) {
              var t = e.rewindSpeed;
              if (u.is(Mt) && t) {
                var i = a.getIndex(!0),
                  r = a.getEnd();
                if ((0 === i && r <= n) || (r <= i && 0 === n)) return t;
              }
              return e.speed;
            })(n);
          1 <= U(i - r) && 1 <= o
            ? e.useScroll
              ? s.scroll(i, o, !1, t)
              : (l("transform " + o + "ms " + e.easing),
                f.translate(i, !0),
                (c = t))
            : (f.jump(n), t());
        },
        cancel: i,
      };
    }
    t = (function () {
      function i(n, t) {
        (this.event = Q()),
          (this.Components = {}),
          (this.state = s(1)),
          (this.splides = []),
          (this.n = {}),
          (this.t = {});
        n = C(n) ? pn(document, n) : n;
        bn(n, n + " is invalid."),
          (t = d(
            { label: z((this.root = n), nn) || "", labelledby: z(n, Zn) || "" },
            qt,
            i.defaults,
            t || {}
          ));
        try {
          d(t, JSON.parse(z(n, f)));
        } catch (n) {
          bn(!1, "Invalid JSON");
        }
        this.n = Object.create(d({}, t));
      }
      var n = i.prototype;
      return (
        (n.mount = function (n, t) {
          var i = this,
            r = this.state,
            o = this.Components;
          return (
            bn(r.is([1, 7]), "Already mounted!"),
            r.set(1),
            (this.i = o),
            (this.r = t || this.r || (this.is(It) ? Bt : Ht)),
            (this.t = n || this.t),
            w(an({}, Ut, this.t, { Transition: this.r }), function (n, t) {
              n = n(i, o, i.n);
              (o[t] = n).setup && n.setup();
            }),
            w(o, function (n) {
              n.mount && n.mount();
            }),
            this.emit(B),
            M(this.root, "is-initialized"),
            r.set(3),
            this.emit("ready"),
            this
          );
        }),
        (n.sync = function (n) {
          return (
            this.splides.push({ splide: n }),
            n.splides.push({ splide: this, isParent: !0 }),
            this.state.is(3) &&
              (this.i.Sync.remount(), n.Components.Sync.remount()),
            this
          );
        }),
        (n.go = function (n) {
          return this.i.Controller.go(n), this;
        }),
        (n.on = function (n, t) {
          return this.event.on(n, t), this;
        }),
        (n.off = function (n) {
          return this.event.off(n), this;
        }),
        (n.emit = function (n) {
          var t;
          return (
            (t = this.event).emit.apply(t, [n].concat(o(arguments, 1))), this
          );
        }),
        (n.add = function (n, t) {
          return this.i.Slides.add(n, t), this;
        }),
        (n.remove = function (n) {
          return this.i.Slides.remove(n), this;
        }),
        (n.is = function (n) {
          return this.n.type === n;
        }),
        (n.refresh = function () {
          return this.emit(J), this;
        }),
        (n.destroy = function (t) {
          void 0 === t && (t = !0);
          var n = this.event,
            i = this.state;
          return (
            i.is(1)
              ? Q(this).on("ready", this.destroy.bind(this, t))
              : (w(
                  this.i,
                  function (n) {
                    n.destroy && n.destroy(t);
                  },
                  !0
                ),
                n.emit(a),
                n.destroy(),
                t && D(this.splides),
                i.set(7)),
            this
          );
        }),
        Jt(i, [
          {
            key: "options",
            get: function () {
              return this.n;
            },
            set: function (n) {
              this.i.Media.set(n, !0, !0);
            },
          },
          {
            key: "length",
            get: function () {
              return this.i.Slides.getLength(!0);
            },
          },
          {
            key: "index",
            get: function () {
              return this.i.Controller.getIndex();
            },
          },
        ]),
        i
      );
    })();
    return (t.defaults = {}), (t.STATES = r), t;
  }),
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((n = "undefined" != typeof globalThis ? globalThis : n || self).Splide =
        t());

!(function (e) {
  "function" == typeof define && define.amd
    ? define(e)
    : "object" == typeof exports
    ? (module.exports = e())
    : e();
})(function () {
  var a = "undefined" != typeof window ? window : this,
    e = (a.Glider = function (e, t) {
      var o = this;
      if (e._glider) return e._glider;
      if (
        ((o.ele = e),
        o.ele.classList.add("glider"),
        ((o.ele._glider = o).opt = Object.assign(
          {},
          {
            slidesToScroll: 1,
            slidesToShow: 1,
            resizeLock: !0,
            duration: 0.5,
            easing: function (e, t, o, i, r) {
              return i * (t /= r) * t + o;
            },
          },
          t
        )),
        (o.animate_id = o.page = o.slide = 0),
        (o.arrows = {}),
        (o._opt = o.opt),
        o.opt.skipTrack)
      )
        o.track = o.ele.children[0];
      else
        for (
          o.track = document.createElement("div"), o.ele.appendChild(o.track);
          1 !== o.ele.children.length;

        )
          o.track.appendChild(o.ele.children[0]);
      o.track.classList.add("glider-track"),
        o.init(),
        (o.resize = o.init.bind(o, !0)),
        o.event(o.ele, "add", { scroll: o.updateControls.bind(o) }),
        o.event(a, "add", { resize: o.resize });
    }),
    t = e.prototype;
  return (
    (t.init = function (e, t) {
      var o,
        i = this,
        r = 0,
        s = 0,
        l =
          ((i.slides = i.track.children),
          [].forEach.call(i.slides, function (e, t) {
            e.classList.add("glider-slide"), e.setAttribute("data-gslide", t);
          }),
          (i.containerWidth = i.ele.clientWidth),
          i.settingsBreakpoint());
      (t = t || l),
        ("auto" !== i.opt.slidesToShow && void 0 === i.opt._autoSlide) ||
          ((o = i.containerWidth / i.opt.itemWidth),
          (i.opt._autoSlide = i.opt.slidesToShow =
            i.opt.exactWidth ? o : Math.max(1, Math.floor(o)))),
        "auto" === i.opt.slidesToScroll &&
          (i.opt.slidesToScroll = Math.floor(i.opt.slidesToShow)),
        (i.itemWidth = i.opt.exactWidth
          ? i.opt.itemWidth
          : i.containerWidth / i.opt.slidesToShow),
        [].forEach.call(i.slides, function (e) {
          (e.style.height = "auto"),
            (e.style.width = i.itemWidth + "px"),
            (r += i.itemWidth),
            (s = Math.max(e.offsetHeight, s));
        }),
        (i.track.style.width = r + "px"),
        (i.trackWidth = r),
        (i.isDrag = !1),
        (i.preventClick = !1),
        (i.move = !1),
        i.opt.resizeLock && i.scrollTo(i.slide * i.itemWidth, 0),
        (l || t) && (i.bindArrows(), i.buildDots(), i.bindDrag()),
        i.updateControls(),
        i.emit(e ? "refresh" : "loaded");
    }),
    (t.bindDrag = function () {
      function e() {
        (t.mouseDown = void 0),
          t.ele.classList.remove("drag"),
          t.isDrag && (t.preventClick = !0),
          (t.isDrag = !1);
      }
      var t = this;
      t.mouse = t.mouse || t.handleMouse.bind(t);
      function o() {
        t.move = !0;
      }
      var i = {
        mouseup: e,
        mouseleave: e,
        mousedown: function (e) {
          e.preventDefault(),
            e.stopPropagation(),
            (t.mouseDown = e.clientX),
            t.ele.classList.add("drag"),
            (t.move = !1),
            setTimeout(o, 300);
        },
        touchstart: function (e) {
          t.ele.classList.add("drag"), (t.move = !1), setTimeout(o, 300);
        },
        mousemove: t.mouse,
        click: function (e) {
          t.preventClick && t.move && (e.preventDefault(), e.stopPropagation()),
            (t.preventClick = !1),
            (t.move = !1);
        },
      };
      t.ele.classList.toggle("draggable", !0 === t.opt.draggable),
        t.event(t.ele, "remove", i),
        t.opt.draggable && t.event(t.ele, "add", i);
    }),
    (t.buildDots = function () {
      var e = this;
      if (e.opt.dots) {
        if (
          ("string" == typeof e.opt.dots
            ? (e.dots = document.querySelector(e.opt.dots))
            : (e.dots = e.opt.dots),
          e.dots)
        ) {
          (e.dots.innerHTML = ""),
            e.dots.setAttribute("role", "tablist"),
            e.dots.classList.add("glider-dots");
          for (
            var t = 0;
            t < Math.ceil(e.slides.length / e.opt.slidesToShow);
            ++t
          ) {
            var o = document.createElement("button");
            (o.dataset.index = t),
              o.setAttribute("aria-label", "Page " + (t + 1)),
              o.setAttribute("role", "tab"),
              (o.className = "glider-dot " + (t ? "" : "active")),
              e.event(o, "add", { click: e.scrollItem.bind(e, t, !0) }),
              e.dots.appendChild(o);
          }
        }
      } else e.dots && (e.dots.innerHTML = "");
    }),
    (t.bindArrows = function () {
      var o = this;
      o.opt.arrows
        ? ["prev", "next"].forEach(function (e) {
            var t = o.opt.arrows[e];
            (t = t && ("string" == typeof t ? document.querySelector(t) : t)) &&
              ((t._func = t._func || o.scrollItem.bind(o, e)),
              o.event(t, "remove", { click: t._func }),
              o.event(t, "add", { click: t._func }),
              (o.arrows[e] = t));
          })
        : Object.keys(o.arrows).forEach(function (e) {
            e = o.arrows[e];
            o.event(e, "remove", { click: e._func });
          });
    }),
    (t.updateControls = function (e) {
      var n = this,
        t =
          (e && !n.opt.scrollPropagate && e.stopPropagation(),
          n.containerWidth >= n.trackWidth),
        a =
          (n.opt.rewind ||
            (n.arrows.prev &&
              (n.arrows.prev.classList.toggle(
                "disabled",
                n.ele.scrollLeft <= 0 || t
              ),
              n.arrows.prev.setAttribute(
                "aria-disabled",
                n.arrows.prev.classList.contains("disabled")
              )),
            n.arrows.next &&
              (n.arrows.next.classList.toggle(
                "disabled",
                Math.ceil(n.ele.scrollLeft + n.containerWidth) >=
                  Math.floor(n.trackWidth) || t
              ),
              n.arrows.next.setAttribute(
                "aria-disabled",
                n.arrows.next.classList.contains("disabled")
              ))),
          (n.slide = Math.round(n.ele.scrollLeft / n.itemWidth)),
          (n.page = Math.round(n.ele.scrollLeft / n.containerWidth)),
          n.slide + Math.floor(Math.floor(n.opt.slidesToShow) / 2)),
        d = Math.floor(n.opt.slidesToShow) % 2 ? 0 : a + 1;
      1 === Math.floor(n.opt.slidesToShow) && (d = 0),
        n.ele.scrollLeft + n.containerWidth >= Math.floor(n.trackWidth) &&
          (n.page = n.dots ? n.dots.children.length - 1 : 0),
        [].forEach.call(n.slides, function (e, t) {
          var o = e.classList,
            e = o.contains("visible"),
            i = n.ele.scrollLeft,
            r = n.ele.scrollLeft + n.containerWidth,
            s = n.itemWidth * t,
            l = s + n.itemWidth,
            s =
              ([].forEach.call(o, function (e) {
                /^left|right/.test(e) && o.remove(e);
              }),
              o.toggle("active", n.slide === t),
              a === t || (d && d === t)
                ? o.add("center")
                : (o.remove("center"),
                  o.add(
                    [
                      t < a ? "left" : "right",
                      Math.abs(t - ((!(t < a) && d) || a)),
                    ].join("-")
                  )),
              Math.ceil(s) >= Math.floor(i) && Math.floor(l) <= Math.ceil(r));
          o.toggle("visible", s),
            s !== e &&
              n.emit("slide-" + (s ? "visible" : "hidden"), { slide: t });
        }),
        n.dots &&
          [].forEach.call(n.dots.children, function (e, t) {
            e.classList.toggle("active", n.page === t);
          }),
        e &&
          n.opt.scrollLock &&
          (clearTimeout(n.scrollLock),
          (n.scrollLock = setTimeout(function () {
            clearTimeout(n.scrollLock),
              0.02 < Math.abs(n.ele.scrollLeft / n.itemWidth - n.slide) &&
                (n.mouseDown ||
                  (n.trackWidth > n.containerWidth + n.ele.scrollLeft &&
                    n.scrollItem(n.getCurrentSlide())));
          }, n.opt.scrollLockDelay || 250)));
    }),
    (t.getCurrentSlide = function () {
      return this.round(this.ele.scrollLeft / this.itemWidth);
    }),
    (t.scrollItem = function (e, t, o) {
      o && o.preventDefault();
      var i,
        r = this,
        s = e,
        o = (++r.animate_id, r.slide),
        l =
          !0 === t
            ? (e = Math.round((e * r.containerWidth) / r.itemWidth)) *
              r.itemWidth
            : ("string" == typeof e &&
                ((l = "prev" === e),
                (e =
                  r.opt.slidesToScroll % 1 || r.opt.slidesToShow % 1
                    ? r.getCurrentSlide()
                    : r.slide),
                l ? (e -= r.opt.slidesToScroll) : (e += r.opt.slidesToScroll),
                r.opt.rewind &&
                  ((i = r.ele.scrollLeft),
                  (e =
                    l && !i
                      ? r.slides.length
                      : !l && i + r.containerWidth >= Math.floor(r.trackWidth)
                      ? 0
                      : e))),
              (e = Math.max(Math.min(e, r.slides.length), 0)),
              (r.slide = e),
              r.itemWidth * e);
      return (
        r.emit("scroll-item", { prevSlide: o, slide: e }),
        r.scrollTo(
          l,
          r.opt.duration * Math.abs(r.ele.scrollLeft - l),
          function () {
            r.updateControls(),
              r.emit("animated", {
                value: s,
                type: "string" == typeof s ? "arrow" : t ? "dot" : "slide",
              });
          }
        ),
        !1
      );
    }),
    (t.settingsBreakpoint = function () {
      var e = this,
        t = e._opt.responsive;
      if (t) {
        t.sort(function (e, t) {
          return t.breakpoint - e.breakpoint;
        });
        for (var o = 0; o < t.length; ++o) {
          var i = t[o];
          if (a.innerWidth >= i.breakpoint)
            return (
              e.breakpoint !== i.breakpoint &&
              ((e.opt = Object.assign({}, e._opt, i.settings)),
              (e.breakpoint = i.breakpoint),
              !0)
            );
        }
      }
      var r = 0 !== e.breakpoint;
      return (e.opt = Object.assign({}, e._opt)), (e.breakpoint = 0), r;
    }),
    (t.scrollTo = function (t, o, i) {
      var r = this,
        s = new Date().getTime(),
        l = r.animate_id,
        n = function () {
          var e = new Date().getTime() - s;
          (r.ele.scrollLeft =
            r.ele.scrollLeft +
            (t - r.ele.scrollLeft) * r.opt.easing(0, e, 0, 1, o)),
            e < o && l === r.animate_id
              ? a.requestAnimationFrame(n)
              : ((r.ele.scrollLeft = t), i && i.call(r));
        };
      a.requestAnimationFrame(n);
    }),
    (t.removeItem = function (e) {
      var t = this;
      t.slides.length &&
        (t.track.removeChild(t.slides[e]), t.refresh(!0), t.emit("remove"));
    }),
    (t.addItem = function (e) {
      this.track.appendChild(e), this.refresh(!0), this.emit("add");
    }),
    (t.handleMouse = function (e) {
      var t = this;
      t.mouseDown &&
        ((t.isDrag = !0),
        (t.ele.scrollLeft +=
          (t.mouseDown - e.clientX) * (t.opt.dragVelocity || 3.3)),
        (t.mouseDown = e.clientX));
    }),
    (t.round = function (e) {
      var t = 1 / (this.opt.slidesToScroll % 1 || 1);
      return Math.round(e * t) / t;
    }),
    (t.refresh = function (e) {
      this.init(!0, e);
    }),
    (t.setOption = function (t, e) {
      var o = this;
      o.breakpoint && !e
        ? o._opt.responsive.forEach(function (e) {
            e.breakpoint === o.breakpoint &&
              (e.settings = Object.assign({}, e.settings, t));
          })
        : (o._opt = Object.assign({}, o._opt, t)),
        (o.breakpoint = 0),
        o.settingsBreakpoint();
    }),
    (t.destroy = function () {
      function e(t) {
        t.removeAttribute("style"),
          [].forEach.call(t.classList, function (e) {
            /^glider/.test(e) && t.classList.remove(e);
          });
      }
      var t = this,
        o = t.ele.cloneNode(!0);
      t.opt.skipTrack || (o.children[0].outerHTML = o.children[0].innerHTML),
        e(o),
        [].forEach.call(o.getElementsByTagName("*"), e),
        t.ele.parentNode.replaceChild(o, t.ele),
        t.event(a, "remove", { resize: t.resize }),
        t.emit("destroy");
    }),
    (t.emit = function (e, t) {
      e = new a.CustomEvent("glider-" + e, {
        bubbles: !this.opt.eventPropagate,
        detail: t,
      });
      this.ele.dispatchEvent(e);
    }),
    (t.event = function (e, t, o) {
      var i = e[t + "EventListener"].bind(e);
      Object.keys(o).forEach(function (e) {
        i(e, o[e]);
      });
    }),
    e
  );
});
(function () {
  let currentPageIndex = null;
  var logoUrl =
    "https://edition-logos.s3.eu-west-2.amazonaws.com/oxfam%20_logo_only.png";
  var logoUrlInner =
    "https://edition-logos.s3.eu-west-2.amazonaws.com/oxfam_wide.png";

  function extractLinks() {
    const links = [];
    const currentUrl = window.location.href;

    function dfs(node) {
      if (node.tagName === "A") {
        const href = node.getAttribute("href");
        const label = node.textContent.trim();
        let isCurrent;

        if (/preview\.shorthand\.com/.test(currentUrl)) {
          isCurrent = href === currentUrl;
        } else if (
          window.location.href.split("/").length === 5 &&
          href === "index.html"
        ) {
          isCurrent = true;
        } else {
          const page = window.location.href.split("/")[4];
          const hrefTest = "../../" + page + "/index.html";
          isCurrent = href === hrefTest;
        }

        if (!isCurrent) {
          const pathname = window.location.pathname;
          const clean = pathname.replace("/issue-32", "");
          const check = new RegExp(clean, "gi");
          isCurrent = clean !== "/index.html" && check.test(href);
        }

        links.push({
          href,
          label,
          current: isCurrent,
        });
      }

      Array.from(node.children).forEach((child) => dfs(child));
    }

    const rootUl = document.querySelector(
      ".Project-HeaderContainer .Layout.Navigation__itemList.Theme-Navigation-ItemList"
    );
    dfs(rootUl);

    return links.map((link, i) => {
      if (link.current) {
        console.log("current link is", link.href);
        currentPageIndex = i < links.length - 1 ? i : 0;
      }
      if (i !== 0) return link;
      return {
        href: link.href,
        label: link.label,
        current: link.current,
      };
    });
  }

  function fetchSrcset(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const imageElement = doc.querySelector(
          ".Theme-TitleSection .Theme-BackgroundMedia .Theme-Item-InstantImage source"
        );
        const srcset = imageElement
          ? imageElement.getAttribute("srcset")
          : null;
        return srcset;
      })
      .catch((error) => {
        console.error("Error fetching srcset:", error);
        return null;
      });
  }

  function createImageElement(srcset) {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("image_div");

    const img = new Image();
    img.srcset = srcset;

    img.onload = () => {
      imgDiv.style.opacity = "1";
    };

    imgDiv.appendChild(img);
    return imgDiv;
  }

  function createButtonWithImage(text, url, isPrevious, hide) {
    const buttonContainer = document.createElement("a");
    const button = document.createElement("div");
    const arrow = document.createElement("div");

    buttonContainer.classList.add("button_container");

    if (isPrevious) {
      buttonContainer.classList.add("prev");
      buttonContainer.setAttribute("tabindex", "1");
      if (!hide)
        buttonContainer.setAttribute("aria-label", "Link To Previous Story");

      if (url) {
        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;
        const minSwipeDistance = 75; // Minimum pixels to be considered a swipe
        const maxVerticalDistance = 100; // Maximum vertical distance to still consider it a horizontal swipe

        document.body.addEventListener("touchstart", (e) => {
          touchstartX = e.changedTouches[0].screenX;
          touchstartY = e.changedTouches[0].screenY;
        });

        document.body.addEventListener("touchend", (e) => {
          touchendX = e.changedTouches[0].screenX;
          touchendY = e.changedTouches[0].screenY;
          let horizontalDistance = touchendX - touchstartX;
          let verticalDistance = Math.abs(touchendY - touchstartY); // Absolute value to handle both up and down swipes

          if (
            !e.target.closest(".Theme-RelatedStories") &&
            horizontalDistance > minSwipeDistance &&
            verticalDistance < maxVerticalDistance
          ) {
            window.location.href = url; // Navigate if swipe is valid and predominantly horizontal
          }
          // Always reset the touch coordinates to start fresh for the next swipe
          touchstartX = 0;
          touchstartY = 0;
          touchendX = 0;
          touchendY = 0;
        });
      }
    } else {
      buttonContainer.classList.add("next");
      buttonContainer.setAttribute("tabindex", "2");
      if (!hide)
        buttonContainer.setAttribute("aria-label", "Link To Next Story");

      if (url) {
        let touchstartX = 0;
        let touchstartY = 0;
        let touchendX = 0;
        let touchendY = 0;
        const minSwipeDistance = 75; // Minimum pixels to be considered a swipe
        const maxVerticalDistance = 100; // Maximum vertical distance to still consider it a horizontal swipe

        document.body.addEventListener("touchstart", (e) => {
          touchstartX = e.changedTouches[0].screenX;
          touchstartY = e.changedTouches[0].screenY;
        });

        document.body.addEventListener("touchend", (e) => {
          touchendX = e.changedTouches[0].screenX;
          touchendY = e.changedTouches[0].screenY;
          let horizontalDistance = touchstartX - touchendX;
          let verticalDistance = Math.abs(touchendY - touchstartY); // Absolute value to handle both up and down swipes

          if (
            !e.target.closest(".Theme-RelatedStories") &&
            horizontalDistance > minSwipeDistance &&
            verticalDistance < maxVerticalDistance
          ) {
            window.location.href = url; // Navigate if swipe is valid and predominantly horizontal
          }
          // Always reset the touch coordinates to start fresh for the next swipe
          touchstartX = 0;
          touchstartY = 0;
          touchendX = 0;
          touchendY = 0;
        });
      }
    }

    if (hide) {
      buttonContainer.classList.add("hide");
      buttonContainer.setAttribute("tabindex", "-1");
    }
    button.classList.add("button");
    arrow.classList.add("arrow");
    arrow.innerHTML = isPrevious ? "&#8592;" : "&#8594;";
    button.textContent =
      text &&
      text.replace(/\b(\w)(\w*)/g, function (_, firstLetter, restOfString) {
        return firstLetter.toUpperCase() + restOfString.toLowerCase();
      });

    buttonContainer.appendChild(button);
    buttonContainer.appendChild(arrow);

    if (url) buttonContainer.setAttribute("href", url);

    if (url) {
      fetchSrcset(url).then((srcset) => {
        if (srcset) {
          const imgDiv = createImageElement(srcset);
          buttonContainer.appendChild(imgDiv);
        }
      });
    }

    return buttonContainer;
  }

  function renderCustomNavigation(links) {
    console.log("completed list", links);
    const currentIndex = links.findIndex((link) => link.current);
    document.body.classList.add("custom-nav-hidden");

    const navContainer = document.createElement("div");
    navContainer.classList.add("nav_container");

    const prevUrl = currentIndex > 0 ? links[currentIndex - 1].href : null;
    const prevText = currentIndex > 0 ? links[currentIndex - 1].label : null;
    // const prevText = currentIndex > 0 ? "Previous" : null;

    const prevButton = createButtonWithImage(
      prevText,
      prevUrl,
      true,
      currentIndex <= 0
    );
    navContainer.appendChild(prevButton);

    const middleLogoContainer = document.createElement("div");
    const middleLogo = document.createElement("img");
    const contentsLabel = document.createElement("p");
    contentsLabel.classList.add("contents-label");
    contentsLabel.innerText = "Contents";
    middleLogo.setAttribute("src", logoUrl);
    middleLogo.classList.add("edition-logo");
    middleLogoContainer.classList.add("button_container");
    middleLogoContainer.classList.add("contents");
    middleLogoContainer.appendChild(middleLogo);
    middleLogoContainer.appendChild(contentsLabel);
    navContainer.appendChild(middleLogoContainer);
    middleLogoContainer.addEventListener("click", () => {
      document.body.classList.add("show-custom-mini-nav");
      const miniNavCurrentLink = document.querySelector(
        ".show-custom-mini-nav .current-link"
      );
      if (miniNavCurrentLink) {
        miniNavCurrentLink.scrollIntoView({
          block: "start",
        });
      }

      document.body.classList.remove("scroll-up");
    });

    const nextUrl =
      currentIndex < links.length - 1 ? links[currentIndex + 1].href : null;
    const nextText =
      currentIndex < links.length - 1 ? links[currentIndex + 1].label : null;
    // const nextText = currentIndex < links.length - 1 ? "Next" : null;
    const nextButton = createButtonWithImage(
      nextText,
      nextUrl,
      false,
      currentIndex === links.length - 1
    );
    navContainer.appendChild(nextButton);

    document.body.appendChild(navContainer);

    // Add custom nav box
    const customMiniNavContainer = document.createElement("div");
    customMiniNavContainer.classList.add("custom-min-nav-container");

    // top logo
    const innerLogoAnchor = document.createElement("a");
    innerLogoAnchor.setAttribute("href", links[0].href);
    const innerLogoContainer = document.createElement("div");
    const innerLogo = document.createElement("img");
    innerLogo.setAttribute("src", logoUrlInner);
    innerLogo.classList.add("edition-logo-inner");
    innerLogoContainer.classList.add("inner-logo-container");
    innerLogoContainer.appendChild(innerLogo);
    innerLogoAnchor.appendChild(innerLogoContainer);
    customMiniNavContainer.appendChild(innerLogoAnchor);

    customMiniNavContainer.addEventListener("click", () => {
      document.body.classList.remove("scroll-up");
    });

    document.body.appendChild(customMiniNavContainer);

    document.body.addEventListener("click", function (event) {
      function hasClassInParents(element, className) {
        while (element) {
          if (element.classList && element.classList.contains(className)) {
            return true;
          }
          element = element.parentElement;
        }
        return false;
      }

      // Check if the clicked element or its parents have the specified classes
      const isCustomNavContainer = hasClassInParents(
        event.target,
        "custom-min-nav-container"
      );
      const isButtonContainer = hasClassInParents(
        event.target,
        "button_container"
      );

      // If the clicked element is not part of custom nav container or button container, remove the class
      if (
        !isCustomNavContainer &&
        !isButtonContainer &&
        !event.target.closest(".Theme-RelatedStories")
      ) {
        document.body.classList.remove("show-custom-mini-nav");
        document.body.classList.remove("tab_container");
        document.body.classList.remove("tab_options");
      }
    });
  }

  function startPollingExtractLinks() {
    let poller = setInterval(() => {
      const links = extractLinks();

      if (links.length > 0) {
        clearInterval(poller);
        renderCustomNavigation(links);
      }
    }, 500); // Poll every 1000 milliseconds (1 second)

    setTimeout(() => {
      clearInterval(poller); // Stop polling after 30 seconds
    }, 30000); // 30 seconds timeout
  }

  startPollingExtractLinks();

  let lastScrollTop = 0;
  window.addEventListener(
    "scroll",
    () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop) {
        if (currentScrollTop > 150) {
          document.body.classList.add("custom-nav-hidden");
          document.body.classList.remove("show-custom-mini-nav");
          document.body.classList.remove("tab_container");
          document.body.classList.remove("tab_options");
        }
      } else {
        document.body.classList.remove("custom-nav-hidden");
        document.body.classList.add("scroll-up");
      }

      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    },
    false
  );

  document.addEventListener("DOMContentLoaded", () => {
    const maxAttempts = 50;
    let attempts = 0;

    const pollForElement = () => {
      const list = document.querySelectorAll(
        ".Theme-RelatedStoriesSection ul[data-related-stories-list='true']"
      );
      if (
        (list && list.length && currentPageIndex !== null) ||
        attempts >= maxAttempts
      ) {
        console.log("polling", attempts, list);
        clearInterval(pollingInterval);
        if (list && list.length) {
          //list.forEach(function (list) {
          initializeCarousel(list[list.length - 1]);
          // });
        }
      }

      attempts++;
    };

    const initializeCarousel = (list) => {
      const clonedSlides = list.cloneNode(true);
      const parent = list.parentNode;
      initializeCarousel2(parent, clonedSlides);

      const slides = list.querySelectorAll("li");
      slides.forEach(function (slide) {
        slide.classList.add("splide__slide");
      });

      const splideContainer = document.createElement("div");
      splideContainer.classList.add("splide");

      const track = document.createElement("div");
      track.classList.add("splide__track");

      list.classList.add("splide__list");

      parent.insertBefore(splideContainer, list);
      splideContainer.appendChild(track);
      track.appendChild(list);

      console.log("Current Page Index", currentPageIndex);

      new Splide(splideContainer, {
        type: "loop",
        perPage: 1,
        perMove: 1,
        gap: "1rem",
        pagination: true,
        arrows: true,
        start: currentPageIndex,
      }).mount();
    };

    const initializeCarousel2 = (parent, list) => {
      const gliderContain = document.createElement("div");
      gliderContain.classList.add("glider-contain");

      // Move the 'list' inside 'glider-contain'
      list.classList.add("glider");
      gliderContain.appendChild(list);
      parent.appendChild(gliderContain);

      // Create navigation buttons
      const prevArrow = document.createElement("button");
      prevArrow.setAttribute("aria-label", "Previous");
      prevArrow.classList.add("glider-prev");
      prevArrow.textContent = "«";

      const nextArrow = document.createElement("button");
      nextArrow.setAttribute("aria-label", "Next");
      nextArrow.classList.add("glider-next");
      nextArrow.textContent = "»";

      // Create the dots container
      const dots = document.createElement("div");
      dots.classList.add("dots");
      dots.setAttribute("role", "tablist");

      // Append arrows and dots to the 'glider-contain' container
      gliderContain.appendChild(prevArrow);
      gliderContain.appendChild(nextArrow);
      gliderContain.appendChild(dots);

      const links = list.querySelectorAll("li a");
      links.forEach((element, i) => element.setAttribute("tabindex", i + 4));

      // Initialize Glider.js on the list
      new Glider(list, {
        slidesToShow: "auto",
        type: "carousel",
        slidesToScroll: 1, // Move one slide at a time
        itemWidth: 250,
        draggable: true, // Allow dragging/swiping
        arrows: {
          prev: prevArrow,
          next: nextArrow,
        },
        dots: dots,
        scrollLock: true, // Lock to a slide even if the swipe was not forceful
        scrollLockDelay: 150, // Slightly increase the delay to ensure scroll lock calculates correctly
        startAt: currentPageIndex,
        gap: 92,
        dragVelocity: 1, // Adjust velocity to control swipe sensitivity, might need fine-tuning
        duration: 0.5, // Reduce the animation duration to make transitions quicker
      });

      function checkDotsVisibility() {
        const dotsContainer = document.querySelector(".glider-dots");
        if (dotsContainer) {
          dotsContainer.style.display =
            dotsContainer.children.length <= 1 ? "none" : "";
        }
      }

      // Debouncer function
      function debounce(func, wait, immediate) {
        let timeout;
        return function () {
          const context = this,
            args = arguments;
          const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          const callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      }

      // Wrapped checkDotsVisibility in a debouncer
      const debouncedCheckDotsVisibility = debounce(checkDotsVisibility, 250);

      // Event listener for window resize
      window.addEventListener("resize", debouncedCheckDotsVisibility);

      // Initial check
      checkDotsVisibility();
    };

    const pollingInterval = setInterval(pollForElement, 200);
  });

  (function () {
    function startPollingCarousel() {
      let poller = setInterval(() => {
        const relatedStoryCarousel = document.querySelectorAll(
          '.Theme-RelatedStoriesSection ul[data-related-stories-list="true"]'
        );

        const navContainer = document.querySelector(
          ".custom-min-nav-container"
        );

        if (
          relatedStoryCarousel &&
          relatedStoryCarousel.length &&
          navContainer
        ) {
          clearInterval(poller);
          const relatedStoryCarousel2 = document.querySelectorAll(
            ".Theme-RelatedStoriesSection"
          );

          navContainer.appendChild(
            relatedStoryCarousel2[relatedStoryCarousel2.length - 1]
          );
        }
      }, 250);

      setTimeout(() => {
        clearInterval(poller);
      }, 10000);
    }

    startPollingCarousel();

    // Accessibility

    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        // Introduce a delay to allow focus to update
        setTimeout(() => {
          console.log(
            "Tabbed",
            document.activeElement,
            document.activeElement.closest(".custom-min-nav-container")
          );
          // Check if the currently focused element is within '.custom-min-nav-container'
          if (document.activeElement.closest(".custom-min-nav-container")) {
            document.body.classList.add("tab_options");
            document.body.classList.remove("tab_container");
          }
          // Check if the currently focused element has the class 'button_container'
          else if (
            document.activeElement.classList.contains("button_container")
          ) {
            document.body.classList.add("tab_container");
            document.body.classList.remove("tab_options");
          }
          // If the focused element doesn't meet the above conditions
          else {
            document.body.classList.remove("tab_container", "tab_options");
          }
        }, 0); // A delay of 0 milliseconds effectively waits until the browser can process the focus shift
      }
    });
  })();
})();
