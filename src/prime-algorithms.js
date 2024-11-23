// prime-algorithms.js
class PrimeTest {
  // Ferma testi
  static fermatTest(n, k = 5) {
    if (n <= 1 || n === 4) return { isPrime: false, method: "Fermat" };
    if (n <= 3) return { isPrime: true, method: "Fermat" };

    for (let i = 0; i < k; i++) {
      // Tasodifiy son tanlash
      let a = 2 + Math.floor(Math.random() * (n - 4));

      // Ferma kichik teoremasi: a^(n-1) ≡ 1 (mod n)
      if (this.modularPow(a, n - 1, n) !== 1) {
        return { isPrime: false, method: "Fermat" };
      }
    }
    return {
      isPrime: true,
      method: "Fermat",
      confidence: (1 - Math.pow(2, -k)) * 100,
    };
  }

  // Solovay-Strassen testi
  static solovayStrassenTest(n, k = 5) {
    if (n <= 1 || n === 4)
      return { isPrime: false, method: "Solovay-Strassen" };
    if (n <= 3) return { isPrime: true, method: "Solovay-Strassen" };
    if (n % 2 === 0) return { isPrime: false, method: "Solovay-Strassen" };

    for (let i = 0; i < k; i++) {
      let a = 2 + Math.floor(Math.random() * (n - 4));
      let x = this.modularPow(a, (n - 1) / 2, n);
      let jacobianSymbol = this.calculateJacobian(a, n);

      if (x === 0 || (x !== jacobianSymbol && x !== n + jacobianSymbol)) {
        return { isPrime: false, method: "Solovay-Strassen" };
      }
    }
    return {
      isPrime: true,
      method: "Solovay-Strassen",
      confidence: (1 - Math.pow(2, -k)) * 100,
    };
  }

  // Miller-Rabin testi
  static millerRabinTest(n, k = 5) {
    if (n <= 1 || n === 4) return { isPrime: false, method: "Miller-Rabin" };
    if (n <= 3) return { isPrime: true, method: "Miller-Rabin" };
    if (n % 2 === 0) return { isPrime: false, method: "Miller-Rabin" };

    let d = n - 1;
    let s = 0;
    while (d % 2 === 0) {
      d = Math.floor(d / 2);
      s++;
    }

    for (let i = 0; i < k; i++) {
      if (!this.millerRabinSingleTest(n, d, s)) {
        return { isPrime: false, method: "Miller-Rabin" };
      }
    }
    return {
      isPrime: true,
      method: "Miller-Rabin",
      confidence: (1 - Math.pow(4, -k)) * 100,
    };
  }

  // AKS algoritmi (soddalashtirilgan versiya)
  static aksTest(n) {
    if (n <= 1) return { isPrime: false, method: "AKS" };
    if (n <= 3) return { isPrime: true, method: "AKS" };
    if (n % 2 === 0) return { isPrime: false, method: "AKS" };

    // Oddiy bo'luvchilar tekshiruvi
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) {
        return { isPrime: false, method: "AKS" };
      }
    }

    return {
      isPrime: true,
      method: "AKS",
      confidence: 100, // AKS deterministic algoritm
    };
  }

  // Yordamchi funksiyalar
  static modularPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      exponent = Math.floor(exponent / 2);
      base = (base * base) % modulus;
    }
    return result;
  }

  static calculateJacobian(a, n) {
    if (a === 0) return 0;
    let ans = 1;
    if (a < 0) {
      a = -a;
      if (n % 4 === 3) ans = -ans;
    }
    while (a !== 0) {
      while (a % 2 === 0) {
        a /= 2;
        if (n % 8 === 3 || n % 8 === 5) ans = -ans;
      }
      [a, n] = [n, a];
      if (a % 4 === 3 && n % 4 === 3) ans = -ans;
      a %= n;
    }
    return ans;
  }

  static millerRabinSingleTest(n, d, s) {
    let a = 2 + Math.floor(Math.random() * (n - 4));
    let x = this.modularPow(a, d, n);

    if (x === 1 || x === n - 1) return true;

    for (let r = 1; r < s; r++) {
      x = (x * x) % n;
      if (x === 1) return false;
      if (x === n - 1) return true;
    }
    return false;
  }
}

module.exports = PrimeTest;
