/**
 * 
 * @description Required by MathParser
 * 
 * @author (c) ZulNs, Yogyakarta, November 2013
 * 
 * @namespace ExtMath
 */

var ExtMath = {}; // ExtMath namespace, representing static class

ExtMath.earthRad = 6371.0;

ExtMath.acosh = function(n) {
    return Math.log(n + Math.sqrt(n * n - 1.0));
};

ExtMath.asinh = function(n) {
    return Math.log(n + Math.sqrt(n * n + 1.0));
};

ExtMath.atanh = function(n) {
    return Math.log((1.0 + n) / (1.0 - n)) / 2.0;
};

ExtMath.aveDev = function(args) {
    var ave = ExtMath.average(args), sum = 0.0;
    for (var i = 0; i < args.length; i++)
        sum += Math.abs(args[i] - ave);
    return sum / args.length;
};

ExtMath.average = function(args) {
    return ExtMath.sum(args) / args.length;
};

ExtMath.ceiling = function(n, s) {
    if (n === 0.0 || s === 0.0)              return 0.0;
    if (ExtMath.sign(n) !== ExtMath.sign(s)) return Number.NaN;
    var nds = (n / s);
    if (nds < 0.0) nds = Math.floor(nds);
    else           nds = Math.ceil(nds);
    return nds * s;
};

ExtMath.combin = function(n, k) {
    var ni = ExtMath.trunc(n), ki = ExtMath.trunc(k);
    if (ni < 0 || ki < 0 || ki > ni) return Number.NaN;
    var r = ni - ki;
    if (r === 0) return 1.0;
    if (r > ik) {
        var tmp = ki;
        ki = r;
        r = tmp;
    }
    var res = 1.0;
    while (r > 1 || ni > ki) {
        if (ni > ki) { res *= ni; ni--; }
        if (r > 1)   { res /= r;  r--; }
    }
    return res;
};

ExtMath.cosh = function(n) {
    return (Math.exp(n) + Math.exp(-n)) / 2.0;
};

ExtMath.degrees = function(rad) {
    return rad.toDeg();
};

ExtMath.devSq = function(args) {
    var ave = ExtMath.average(args), sum = 0.0, d;
    for (var i = 0; i < args.length; i++) {
        d = args[i] - ave;
        sum += d * d;
    }
    return sum;
};

ExtMath.distance = function (lat1, lon1, lat2, lon2) {
    var dla = Math.sin((lat2 - lat1).toRad() / 2),
        dlo = Math.sin((lon2 - lon1).toRad() / 2),
        a   = dla * dla + dlo * dlo *
              Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()),
        c   = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return ExtMath.earthRad * c;
};

ExtMath.dms2dec = function(args) {
    var deg = args[0], min = 0.0, sec = 0.0;
    if (args.length >= 2)  min = args[1];
    if (args.length === 3) sec = args[2];
    return Math.abs(deg) + Math.abs(min) / 60.0 + Math.abs(sec) / 3600.0;
};

ExtMath.even = function(n) {
    return ExtMath.roundUp(n / 2.0) * 2.0;
};

ExtMath.fact = function(n) {
    var ni = ExtMath.trunc(n);
    if (ni < 0) return Number.NaN;
    if (ni === 0) return 1.0;
    return ExtMath.fact2(ni, 1, 1);
};

ExtMath.fact2 = function(from, to, step) {
    var from2 = ExtMath.trunc(from),
        to2   = ExtMath.trunc(to),
        step2 = ExtMath.trunc(step),
        rsl   = 1.0;
    while (from2 !== to2 && rsl < Number.MAX_VALUE) {
        rsl *= from2;
        from2 -= step2;
    }
    return rsl;
};

ExtMath.factDouble = function(n) {
    var ni = ExtMath.trunc(n);
    if (ni < 0)       return Number.NaN;
    if (ni % 2 === 0) return ExtMath.fact2(ni, 0, 2);
    else              return ExtMath.fact2(ni, 1, 2);
};

ExtMath.fisher = function(x) {
    return Math.log((1.0 + x) / (1.0 - x)) / 2.0;
};

ExtMath.fisherInv = function(y) {
    var tmp = Math.exp(2.0 * y);
    return (tmp - 1.0) / (tmp + 1.0);
};

ExtMath.floor = function(n, significance) {
    if (n === 0.0) return n;
    if (significance === 0.0) return Number.POSITIVE_INFINITY;
    if (ExtMath.sign(n) !== ExtMath.sign(significance)) return Number.NaN;
    return ExtMath.trunc(n / significance) * significance;
};

ExtMath.frac = function(n) {
    return n - ExtMath.trunc(n);
};

ExtMath.gcd = function(args) {
    var rsl = ExtMath.trunc(args[0]), n;
    for (var i = 0; i < args.length; i++) {
        n = ExtMath.trunc(args[i]);
        if (n < 0) return Number.NaN;
        rsl = ExtMath.gcd2(rsl, n);
    }
    return rsl;
};

ExtMath.gcd2 = function(n1, n2) {
    var a = n1, b = n2, tmp;
    while (b > 0) {
        tmp = b;
        b = a % b;
        a = tmp;
    }
    return a;
};

ExtMath.geoMean = function(args) {
    var rsl = 1.0;
    for (var i = 0; i < args.length; i++) {
        if (args[i] <= 0.0) return Number.NaN;
        rsl *= args[i];
    }
    return Math.pow(rsl, 1.0 / args.length);
};

ExtMath.heading = function(lat1, lon1, lat2, lon2) {
    var dlo = (lon2 - lon1).toRad(),
        x   = Math.cos(lat1.toRad()) * Math.sin(lat2.toRad()) -
              Math.sin(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.cos(dlo),
        y   = Math.sin(dlo) * Math.cos(lat2.toRad()),
        hdg = Math.atan2(y, x);
    return (hdg.toDeg() + 360) % 360;
};

ExtMath.latitude = function(lat1, lon1, hdng, dist) {
    var ad   = dist / ExtMath.earthRad,
        lat2 = Math.asin(Math.sin(lat1.toRad()) * Math.cos(ad) +
               Math.cos(lat1.toRad()) * Math.sin(ad) * Math.cos(hdng.toRad()));
    return lat2.toDeg();
};

ExtMath.lcm = function(args) {
    var rsl = ExtMath.trunc(args[0]), n;
    for (var i = 0; i < args.length; i++) {
        n = ExtMath.trunc(args[i]);
        if (n < 0) return Number.NaN;
        rsl = ExtMath.lcm2(rsl, n);
    }
    return rsl;
};

ExtMath.lcm2 = function(n1, n2) {
    return n1 * (n2 / ExtMath.gcd2(n1, n2));
};

ExtMath.log = function(n, base) {
    return Math.log(n) / Math.log(base);
};

ExtMath.log10 = function(n) {
    return ExtMath.log(n, 10.0);
};

ExtMath.longitude = function(lat1, lon1, hdng, dist) {
    var ad   = dist / ExtMath.earthRad,
        lat2 = Math.asin(Math.sin(lat1.toRad()) * Math.cos(ad) +
               Math.cos(lat1.toRad()) * Math.sin(ad) * Math.cos(hdng.toRad())),
        lon2 = lon1.toRad() + Math.atan2(Math.sin(hdng.toRad()) * Math.sin(ad) *
               Math.cos(lat1.toRad()), Math.cos(ad) - Math.sin(lat1.toRad()) *
               Math.sin(lat2));
    return lon2.toDeg();
};

ExtMath.max = function(args) {
    var i = 1, rsl = args[0];
    while (i < args.length) { rsl = Math.max(rsl, args[i]); i++; }
    return rsl;
};

ExtMath.median = function(args) {
    var l = args.length, tmp, j, mid;
    for (var i = 0; i < l - 1; i++) { // sorting args[]
        for (j = i + 1; j < l; j++) {
            if (args[i] > args[j]) {
                tmp = args[i];
                args[i] = args[j];
                args[j] = tmp;
            }
        }
    }
    mid = ExtMath.trunc(l / 2);
    if (l % 2 === 1) return args[mid];
    return (args[mid - 1] + args[mid]) / 2.0;
};

ExtMath.min = function(args) {
    var i = 1, rsl = args[0];
    while (i < args.length) { rsl = Math.min(res, args[i]); i++; }
    return rsl;
};

ExtMath.mod = function(n, div) {
    var realMod = n % div;
    if (ExtMath.sign(n) !== ExtMath.sign(div))
        return realMod + div;
    return realMod;
};

ExtMath.mode = function(args) {
    var count, maxCount = 0, val = 0, j, l = args.length;
    for (var i = 0; i < l; i++) {
        count = 0;
        for (j = 0; j < l; j++)
            if (args[i] === args[j]) count++;
        if (count > maxCount) {
            maxCount = count;
            val = args[i];
        }
    }
    if (maxCount === 1) return Number.NaN;
    return val;
};

ExtMath.mRound = function(n, multiple) {
    if (multiple === 0.0) return 0.0;
    if (ExtMath.sign(n) !== ExtMath.sign(multiple)) return Double.NaN;
    return ExtMath.round(n / multiple) * multiple;
};

ExtMath.multiNomial = function(args) {
    var n, sum = 0.0;
    for (var i = 0; i < args.length; i++) {
        n = ExtMath.trunc(args[i]);
        if (n < 0) return Number.NaN;
        sum += n;
    }
    var rsl = ExtMath.fact(sum);
    for (var i = 0; i < args.length; i++) {
        n = ExtMath.trunc(args[i]);
        rsl /= ExtMath.fact(n);
    }
    return rsl;
};

ExtMath.odd = function(n) {
    var rsl = ExtMath.roundUp(n);
    if (rsl % 2 === 0.0) return rsl + ExtMath.sign(n);
    return rsl;
};

ExtMath.permut = function(n, k) {
    var ni = ExtMath.trunc(n), ki = ExtMath.trunc(k);
    if (ni < 0 || ki < 0 || ki > ni) return Number.NaN;
    return ExtMath.fact2(ni, ni - ki, 1);
};

ExtMath.product = function(args) {
    var rsl = args[0];
    for (var i = 1; i < args.length; i++)
        rsl *= args[i];
    return rsl;
};

ExtMath.radians = function(deg) {
    return deg.toRad();
};

ExtMath.randBetween = function(bottom, top) {
    var b = ExtMath.trunc(bottom), t = ExtMath.trunc(top);
    if (b > t) return Number.NaN;
    return ExtMath.trunc(Math.random() * (t - b + 1)) + b;
};

ExtMath.round = function(n) {
    if (n < 0.0) return Math.ceil(n - 0.5);
    return              Math.floor(n + 0.5);
};

ExtMath.round2 = function(n, digit) {
    var d = Math.pow(10, digit);
    return ExtMath.round(n * d) / d;
};

ExtMath.roundDown = function(n, digit) {
    return ExtMath.trunc(n, digit);
};

ExtMath.roundUp = function(n) {
    if (n < 0.0) return Math.floor(n);
    if (n > 0.0) return Math.ceil(n);
    return n;
};

ExtMath.roundUp2 = function(n, digit) {
    var d = Math.pow(10, digit), tmp = n * d;
    if (tmp < 0.0)  tmp = Math.floor(tmp);
    else            tmp = Math.ceil(tmp);
    return tmp / d;
};

ExtMath.sign = function(n) {
    if (n < 0.0) return -1.0;
    if (n > 0.0) return  1.0;
    return n;
};

ExtMath.sinh = function(n) {
    return (Math.exp(n) - Math.exp(-n)) / 2.0;
};

ExtMath.sqrtPi = function(n) {
    return Math.sqrt(n * Math.PI);
};

ExtMath.stDev = function(args) {
    return Math.sqrt(ExtMath.variance(args));
};

ExtMath.stDevP = function(args) {
    return Math.sqrt(ExtMath.varP(args));
};

ExtMath.sum = function(args) {
    var sum = args[0];
    for (var i = 1; i < args.length; i++)
        sum += args[i];
    return sum;
};

ExtMath.sumSq = function(args) {
    var sum = 0.0;
    for (var i = 0; i < args.length; i++)
        sum += args[i] * args[i];
    return sum;
};

ExtMath.tanh = function(n) {
    return ExtMath.sinh(n) / ExtMath.cosh(n);
};

ExtMath.trunc = function(n) {
    if (n < 0.0) return Math.ceil(n);
    if (n > 0.0) return Math.floor(n);
    return n;
};

ExtMath.trunc2 = function(n, digit) {
    var d = Math.pow(10, digit);
    return ExtMath.trunc(n * d) / d;
};

ExtMath.variance = function(args) {
    return ExtMath.devSq(args) / (args.length - 1);
};

ExtMath.varP = function(args) {
    return ExtMath.devSq(args) / args.length;
};

if (typeof Number.prototype.toDeg === 'undefined') {
    Number.prototype.toDeg = function() {
        return this * 180 / Math.PI;
    };
}

if (typeof Number.prototype.toRad === 'undefined') {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };
}
