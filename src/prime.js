!(function (e, n) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd
    ? define([], n)
    : "object" == typeof exports
    ? (exports.primalityTest = n())
    : (e.primalityTest = n());
})(this, () =>
  (() => {
    "use strict";
    var e = {
        d: (n, t) => {
          for (var r in t)
            e.o(t, r) &&
              !e.o(n, r) &&
              Object.defineProperty(n, r, { enumerable: !0, get: t[r] });
        },
        o: (e, n) => Object.prototype.hasOwnProperty.call(e, n),
        r: (e) => {
          "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(e, "__esModule", { value: !0 });
        },
      },
      n = {};
    e.r(n), e.d(n, { primalityTest: () => w });
    const t = 0n,
      r = 1n;
    function i(e) {
      return e.toString(2).length;
    }
    function o(e) {
      let n = "";
      for (; n.length < e; ) n += Math.random().toString(2).substring(2, 50);
      return n.substring(0, e);
    }
    const l = 0n,
      s = 1n;
    function u(e) {
      if (!(e & s)) throw new Error("base must be odd");
      const n = i(e),
        t = BigInt(n),
        o = s << t,
        l = (function (e, n) {
          let t = r;
          for (let i = 0; i < e; i++) t & r && (t += n), (t >>= r);
          return t;
        })(n, e);
      return {
        base: e,
        shift: t,
        r: o,
        rInv: l,
        baseInv: o - (((l * o - s) / e) % o),
      };
    }
    function f(e, n) {
      return (e << n.shift) % n.base;
    }
    function a(e, n) {
      return (e * n.rInv) % n.base;
    }
    function b(e, n) {
      return c(e, e, n);
    }
    function c(e, n, t) {
      if (e === l || n === l) return l;
      const r = t.r - s;
      let i = e * n;
      let o = (i - (((i & r) * t.baseInv) & r) * t.base) >> t.shift;
      return o >= t.base ? (o -= t.base) : o < l && (o += t.base), o;
    }
    function d(e, n, t) {
      const r = BigInt(i(n));
      let o = f(s, t);
      for (let i = l, u = e; i < r; ++i, u = b(u, t))
        n & (s << i) && (o = c(o, u, t));
      return o;
    }
    const p = 0n,
      m = 1n,
      y = 2n,
      g = 4n,
      v = -1n;
    class PrimalityResult {
      constructor({
        n: e,
        probablePrime: n,
        witness: t = null,
        divisor: r = null,
      }) {
        (this.n = e),
          (this.probablePrime = n),
          (this.witness = t),
          (this.divisor = r);
      }
    }
    function h(e, n) {
      if (e === n) return e;
      if (e === p) return n;
      if (n === p) return e;
      let t = p;
      for (; !((e & m) | (n & m)); ) t++, (e >>= m), (n >>= m);
      for (; e !== n && n > m; ) {
        for (; !(e & m); ) e >>= m;
        for (; !(n & m); ) n >>= m;
        if (n > e) [e, n] = [n, e];
        else if (e === n) break;
        e -= n;
      }
      return n << t;
    }
    function w(e, { numRounds: n, bases: l, findDivisor: s = !0 } = {}) {
      return new Promise((c, w) => {
        try {
          "bigint" != typeof e && (e = BigInt(e));
          const w = e < p ? v : m;
          if ((w === v && (e = -e), e < y))
            return void c(
              new PrimalityResult({
                n: w * e,
                probablePrime: !1,
                witness: null,
                divisor: null,
              })
            );
          if (e < g)
            return void c(
              new PrimalityResult({
                n: w * e,
                probablePrime: !0,
                witness: null,
                divisor: null,
              })
            );
          if (!(e & m))
            return void c(
              new PrimalityResult({
                n: w * e,
                probablePrime: !1,
                witness: null,
                divisor: y,
              })
            );
          const I = i(e),
            j = e - m,
            R = (function (e) {
              if (e === t) return t;
              let n = t;
              for (;;) {
                if (e & (r << n)) return n;
                n++;
              }
            })(j),
            S = j >> R,
            T = u(e),
            k = f(m, T),
            B = f(j, T),
            O = (function (e, n) {
              if (null == e) return null;
              if (Array.isArray(e))
                return e.map((e) => {
                  if (
                    ("bigint" != typeof e && (e = BigInt(e)),
                    !(e >= y && e < n))
                  )
                    throw new RangeError(
                      `invalid base (must be in the range [2, n-2]): ${e}`
                    );
                  return e;
                });
              throw new TypeError("invalid bases option (must be an array)");
            })(l, j);
          null != O
            ? (n = O.length)
            : (null == n || n < 1) &&
              (n =
                (P = I) > 1e3
                  ? 2
                  : P > 500
                  ? 3
                  : P > 250
                  ? 4
                  : P > 150
                  ? 5
                  : 6);
          let x = !0,
            E = null,
            M = null,
            A = 0;
          e: for (let t = 0; t < n; t++) {
            let n;
            if (null != O) (n = O[A]), A++;
            else
              do {
                n = BigInt("0b" + o(I));
              } while (!(n >= y && n < j));
            if (s) {
              const t = h(e, n);
              if (t !== m) {
                (x = !1), (E = n), (M = t);
                break;
              }
            }
            let t,
              r,
              i = d(f(n, T), S, T);
            if (i !== k && i !== B) {
              for (t = p; t < R; t++) {
                if (((r = b(i, T)), r === k)) {
                  (x = !1),
                    (E = n),
                    s && ((M = h(a(i, T) - m, e)), M === m && (M = null));
                  break e;
                }
                if (r === B) break;
                i = r;
              }
              if (t === R) {
                (x = !1),
                  (E = n),
                  s && ((M = h(a(i, T) - m, e)), M === m && (M = null));
                break;
              }
            }
          }
          c(
            new PrimalityResult({
              n: w * e,
              probablePrime: x,
              witness: E,
              divisor: M,
            })
          );
        } catch (e) {
          w(e);
        }
        var P;
      });
    }
    return n;
  })()
);
