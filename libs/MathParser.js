/**
 *
 * @description Excel Style MathParser
 * @version 2.0
 * 
 * @author (c) ZulNs, Yogyakarta, November 2013
 * 
 * @namespace Parser
 * @requires ExtMath
 */

function Parser() {
    /* PRIVATE MEMBER ********************************************************/
    this.expression = Parser.description;
    this.message = "";
    this.result = 0.0;
    this.isError = false;
    this.displayMode = 0;
    this.domVarList = null;
    this.varList = [];
    this.tokens = [];
    this.rpnTree = [];
}

Parser.description = "Excel Style MathParser v2.0\n" +
                     "\u00A9 ZulNs, Yogyakarta, Nov 2013";

Parser.normalDisplayMode = 0;
Parser.dmsDisplayMode = 1;

Parser.functionList = [
    "ABS",        "ACOS",       "ACOSH",      "ASIN",       "ASINH",   // 0
    "ATAN",       "ATAN2",      "ATANH",      "AVEDEV",     "AVERAGE", // 5
    "CEILING",    "COMBIN",     "COS",        "COSH",       "DEGREES", //10
    "DEVSQ",      "DISTANCE",   "DMS2DEC",    "EVEN",       "EXP",     //15
    "FACT",       "FACTDOUBLE", "FISHER",     "FISHERINV",  "FLOOR",   //20
    "FRAC",       "GCD",        "GEOMEAN",    "HEADING",    "INT",     //25
    "LATITUDE",   "LCM",        "LN",         "LOG",        "LOG10",   //30
    "LONGITUDE",  "MAX",        "MEAN",       "MEDIAN",     "MIN",     //35
    "MOD",        "MODE",       "MROUND",     "MULTINOMIAL","ODD",     //40
    "PERMUT",     "PI",         "POWER",      "PRODUCT",    "RADIANS", //45
    "RAND",       "RANDBETWEEN","ROUND",      "ROUNDDOWN",  "ROUNDUP", //50
    "SIGN",       "SIN",        "SINH",       "SQRT",       "SQRTPI",  //55
    "STDEV",      "STDEVP",     "SUM",        "SUMSQ",      "TAN",     //60
    "TANH",       "TRUNC",      "VAR",        "VARP"                   //65
];

Parser.functionArgsList = [
    0x0001,       0x0001,       0x0001,       0x0001,       0x0001,    // 0
    0x0001,       0x0002,       0x0001,       0xff01,       0xff01,    // 5
    0x0201,       0x0002,       0x0001,       0x0001,       0x0001,    //10
    0xff01,       0x0004,       0x0301,       0x0001,       0x0001,    //15
    0x0001,       0x0001,       0x0001,       0x0001,       0x0201,    //20
    0x0001,       0xff01,       0xff01,       0x0004,       0x0001,    //25
    0x0004,       0xff01,       0x0001,       0x0201,       0x0001,    //30
    0x0004,       0xff01,       0xff01,       0xff01,       0xff01,    //35
    0x0002,       0xff01,       0x0002,       0xff01,       0x0001,    //40
    0x0002,       0x0000,       0x0002,       0xff01,       0x0001,    //45
    0x0000,       0x0002,       0x0201,       0x0002,       0x0201,    //50
    0x0001,       0x0001,       0x0001,       0x0001,       0x0001,    //55
    0xff01,       0xff01,       0xff01,       0xff01,       0x0001,    //60
    0x0001,       0x0201,       0xff01,       0xff01                   //65
];

Parser.dfaStates = [
    [ 13, 13, 12, 12,  3, -1, -1,  8,  9, -1, -1, 15,  0, 16 ],
    [ -2, -2, -2, -2, -2,  4,  5, 10, 11,  6,  7, -2,  1, 16 ],
    [ -2, -2, -2, -2,  3,  4,  5, 10, 11,  6,  7, 15,  2, 16 ],
    [ 13, 13, 12, 12,  3, -2, -2,  8,  9,  6,  7, -2,  3, -3 ],
    [ -2, -2, -2, -2, -2,  4,  5, 10, 11,  6,  7, -2,  4, 16 ],
    [ 13, 13, 12, 12,  3, -2, -2,  8,  9, -2, -2, -2,  5, -3 ],
    [ 13, 13, 12, 12,  3, -2, -2,  8,  9,  6,  7, -2,  6, -3 ],
    [ -2, -2, -2, -2, -2,  4,  5, 10, 11,  6,  7, -2,  7, 16 ],
    [ 13, 13, 12, 12,  3, -2, -2,  8,  9, -2, -2, -2,  8, -3 ],
    [ 13, 13, 12, 12,  3, -2, -2,  8,  9, -2, -2, -2,  9, -3 ],
    [ 13, 13, 12, 12,  3, -2, -2,  8,  9, -2, -2, -2, 10, -3 ],
    [ 13, 13, 12, 12,  3, -2, -2,  8,  9, -2, -2, -2, 11, -3 ],
    [ 12, -2, 12, 12,  3,  4,  5, 10, 11,  6,  7, 15,  2, 16 ],
    [ 13, 13, 14, 13, -2,  4,  5, 10, 11,  6,  7, -2,  1, 16 ],
    [ 13, 13, 14, 13, -2,  4,  5, 14, 14,  6,  7, -2,  1, 16 ],
    [ 13, 13, 12, 12,  3, -2, -2,  8,  9, -2, -2, -2, 15, 16 ]
];
    
/* OTHER CLASS **************************************************************/
    
function Variable(name, value) {
    this.name = name;
    this.value = value;
}

function Function(code) {
    this.code = code;
    this.numArgs = Parser.functionArgsList[code];
}

function Token(object, mark, priority) {
    this.object = object;
    this.mark = mark;
    this.priority = priority;
}

Token.prototype.toString = function(instance) {
    if (this.mark === 'V') return instance.varList[this.object].name;
    if (this.mark === 'F') return Parser.functionList[this.object.code];
    return this.object.toString();
};

/* PUBLIC METHODS ********************************************************/

Parser.prototype.clearVars = function() {
    this.varList.length = 0;
    if (this.domVarList) this.domVarList.options.length = 0;
};

Parser.prototype.eval = function(expression) {
    var exp = expression.trim().toUpperCase();
    var from = 0, mark = 0, stm, ok = false;
    while (mark !== -1) {
        mark = exp.indexOf(";", from);
        if (mark === -1) stm = exp.substring(from, exp.length);
        else stm = exp.substring(from, mark);
        stm = stm.trim();
        if (stm !== "" && stm !== ";") {
            if (stm === "LISTOFFUNCTIONS") {
                this.message = Parser.getFunctionList();
                this.isError = true;
                return false;
            }
            else if (stm === "LISTOFVARIABLES") {
                this.message = Parser.getVarList(this);
                this.isError = true;
                return false;
            }
            else if (stm === "CLEARVARIABLES") {
                this.varList.length = 0;
                if (this.domVarList) this.domVarList.options.length = 0;
            }
            else {
                ok = Parser.evalStatement(this, stm);
                if (!ok) return false;
            }
        }
        from = mark + 1;
        if (from >= exp.length) break;
    }
    if (!ok) {
        this.message = Parser.description;
        this.isError = true;
        this.expression = Parser.description;
        return false;
    }
    return true;
};

Parser.prototype.getResult = function() {
    if (this.displayMode === Parser.dmsDisplayMode)
        return Parser.getDmsString(this);
    return this.result;
};

Parser.prototype.rpnTreeToString = function() {
    var s = "";
    for (var i = 0; i < this.rpnTree.length; i++)
        s += this.rpnTree[i].toString(this);
    return s;
};

Parser.prototype.setDisplayMode = function(mode) {
    this.displayMode = mode;
};

Parser.prototype.setExternalFunctionList = function(domElement) {
    if (!domElement) return;
    var arg;
    for (var i = 0; i < Parser.functionList.length; i++) {
        var opt = document.createElement("option");
        arg = Parser.getFuncArgs(i);
        opt.text  = Parser.functionList[i] + arg;
        opt.value = Parser.functionList[i];
        if (arg === " (  )") opt.value += "()";
        else                 opt.value += "(";
        try {
            domElement.add(opt, null);  // Standard
        }
        catch (err) {
            domElement.add(opt);        // IE only
        }
    }
};

Parser.prototype.setExternalVarList = function(domElement) {
    if (domElement) this.domVarList = domElement;
};

Parser.prototype.tokensToString = function() {
    var s = "";
    for (var i = 0; i < this.tokens.length; i++)
        s += this.tokens[i].toString(this);
    if (s === "") s = "Nothing could be evaluated...";
    return s;
};

Parser.prototype.toString = function() {
    return Parser.description;
};

/* PRIVATE METHODS *******************************************************/

Parser.getVarList = function(instance) {
    var vl = "";
    for (var i = 0; i < instance.varList.length; i++)
        vl += instance.vList[i].name + " = " + instance.varList[i].value +"\n";
    return vl;
};

Parser.getFunctionList = function() {
    var fl = "";
    for (var i = 0; i < Parser.functionList.length; i++) {
        fl += Parser.functionList[i] + Parser.getFuncArgs(i);
    }
    return fl;
};

Parser.getFuncArgs = function(index) {
    var args;
    switch (Parser.functionArgsList[index]) {
        case 0x0001: args = "n"; break;
        case 0x0002: args = "n\u2081, n\u2082"; break;
        case 0x0004: args = "n\u2081, n\u2082, n\u2083, n\u2084"; break;
        case 0x0201: args = "n\u2081, [ n\u2082 ]"; break;
        case 0x0301: args = "n\u2081, [ n\u2082 ], [ n\u2083 ]"; break;
        case 0xff01: args = "n\u2081, [ n\u2082 ], ... , " +
                            "[ n\u2082\u2085\u2085 ]"; break;
        default:     args = "";
    }
    return " ( " + args + " )";
};

Parser.getVarIndex = function(instance, name) {
    for (var i = 0; i < instance.varList.length; i++)
        if (instance.varList[i].name === name) return i;
    instance.varList.push(new Variable(name, 0.0));
    if (instance.domVarList) {
        var opt = document.createElement("option");
        opt.text  = name + " = 0";
        opt.value = name;
        try {
            instance.domVarList.add(opt, null);  // Standard
        }
        catch (err) {
            instance.domVarList.add(opt);        // IE only
        }
    }
    return instance.varList.length - 1;
};

Parser.getFunctCode = function(name) {
    for (var i = 0; i < Parser.functionList.length; i++)
        if (Parser.functionList[i] === name) return i;
    return -1;
};

Parser.getPriority = function(mark, object) {
    switch (mark) {
        case '(':         return 1;
        case 'F':         return 2;
        case 'S':
        case '%':         return 3;
        case 'O':
            switch (object) {
                case '^': return 4;
                case '*':
                case '/': return 5;
                case '+':
                case '-': return 6;
                default:  return 0;
            }
        default:          return 0;
    }
};

Parser.getDmsString = function(instance) {
    var r = Math.abs(instance.result),
        d = Math.floor(r),
        m = Math.floor((r - d) * 60),
        s = ExtMath.round2((r - d - m / 60) * 3600, 2),
        dms = (ExtMath.sign(instance.result) * d).toString();
    dms += "\u00B0 " + m + "\u2032 " + s + "\u2033";
    return dms;
};

Parser.evalStatement = function(instance, statement) {
    var exp = statement.trim();
    if (exp.charAt(exp.length - 1) !== ';') exp += ";";
    if (exp.length === 1) return true;
    Parser.tokenize(instance, exp);
    instance.isError = (instance.message !== "");
    if (instance.isError) return false;
    Parser.check(instance);
    instance.isError = (instance.message !== "");
    if (instance.isError) return false;
    var isAssign = Parser.buildRPN(instance);
    Parser.execute(instance);
    instance.isError = (instance.message !== "");
    if (instance.isError) return false;
    if (isAssign) {
        var idx = instance.tokens[0].object;
        instance.varList[idx].value = instance.result;
        if (instance.domVarList)
            instance.domVarList.options[idx].text =
                instance.varList[idx].name + " = " + instance.result;
    }
    instance.expression = exp.substring(0, exp.length - 1);
    return true;
};

Parser.tokenize = function(instance, expression) {
    instance.tokens.length = 0;
    instance.message = "";
    var isAssign = false;
    var buffer = "";
    var t, num, c, mark, q = 0, q0, fc;
    for (var i = 0; i < expression.length; i++) {
        c = expression.charAt(i);
        q0 = q;
        q = Parser.deltaQ(q, c);
        if (q >= 12 && q <= 14) {    // q  =  F ||  N ||  Ne
            if (q0 < 12 || q0 > 14)  // q0 = !F && !N && !Ne
                buffer = "";
            buffer += c;
            continue;
        }
        if (q0 === 12) {              // q0 = F
            fc = Parser.getFunctCode(buffer);
            if (fc !== -1) {
                t = new Token(new Function(fc), 'F', 0);
                instance.tokens.push(t);
            }
            else {
                if (buffer === "ZULNS") {
                    instance.message = "ZulNs is my author";
                    instance.tokens.length = 0;
                    return;
                }
                t = new Token(new Number(
                        Parser.getVarIndex(instance, buffer)), 'V', 0);
                instance.tokens.push(t);
            }
        }
        if (q0 === 13 || q0 === 14) {  // q0 = N || Ne
            num = new Number(buffer);
            if (isNaN(num)) {
                instance.message = "Invalid number: " + buffer;
                instance.tokens.length = 0;
                return;
            }
            if (!isFinite(num)) {
                // Double.MAX_VALUED = 1.7976931348623157E+308
                // Double.MIN_VALUED = 4.9E-324
                instance.message = "Overflow value: " + buffer;
                instance.tokens.length = 0;
                return;
            }
            t = new Token(num, 'N', 0);
            instance.tokens.push(t);
        }
        if (q === 16) {
            if (instance.tokens.length > 0) {
                if (t.mark === 'F') {
                    instance.message = "Illegal ending: " + buffer;
                    instance.tokens.length = 0;
                    return;
                }
            }
            break;
        }
        if (c === ' ' || c === '\n') continue;
        if (q < 0) {
            if (t) buffer = t.toString(instance);
            switch (q) {
                case -1:
                    instance.message = "Illegal beginning: " + c;
                    break;
                case -2:
                    instance.message = "Illegal sequence: " + buffer + " " + c;
                    break;
                case -3:
                    instance.message = "Illegal ending: " + buffer;
                    break;
                case -4:
                    instance.message = "Unrecognized symbol: " + c;
            }
            instance.tokens.length = 0;
            return;
        }
        if (t) {
            if (t.mark === 'F') {
                if (q >= 4 && q <= 7 || q === 10 || q === 11) {
                    instance.message = "Illegal use of variable name: " +
                                       buffer;
                    instance.tokens.length = 0;
                    return;
                }
            }
        }
        mark = c;
        switch (q) {
            case 3:  // '('
                if (instance.tokens.length > 0) {
                    if (t.mark === 'V') {
                        instance.varList.pop();
                        instance.message = "Unrecognized function: " + buffer;
                        instance.tokens.length = 0;
                        return;
                    }
                }
                break;
            case 5:  //  '^' || '*' || '/'  (Operator)
                mark = 'O';
                break;
            case 6:  //  ','                (Comma or Argument Separator)
                if (q0 === 3 || q0 === 6)
                    // "(,"   ->   "(0,"   ||   ",,"   ->   ",0,"
                    instance.tokens.push(new Token(new Number(0.0), 'N'));
                break;
            case 7:  //  ')'                (Right-Parenthesis)
                if (q0 === 6)  // ",)"   ->   ",0)"
                    instance.tokens.push(new Token(new Number(0.0), 'N'));
                break;
            case 8:   //  '+'                (Plus Sign)
            case 9:   //  '-'                (Minus Sign)
                mark = 'S';
                break;
            case 10:  //  '+'                (Addition Operator)
            case 11:  //  '-'                (Subtraction Operator)
                mark = 'O';
                break;
            case 15:  //  '='
                if (isAssign) {
                    instance.message = "Already assigned: " + buffer + "=";
                    instance.tokens.length = 0;
                    return;
                }
                else
                    isAssign = true;
                if (instance.tokens.length > 0) {
                    if (t.mark === 'F') {
                        instance.message = "Can't assign function: " + 
                                buffer + " " + c;
                        instance.tokens.length = 0;
                        return;
                    }
                }
                break;
        }
        t = new Token(c, mark, Parser.getPriority(mark, c));
        instance.tokens.push(t);
    }
};

Parser.deltaQ = function(q, c) {
    var col;
    if (c >= '0' && c <= '9') col = 0;
    else if (c >= 'A' && c <= 'Z' || c === '_') {
        if (c === 'E' ) col = 2;
        else            col = 3;
    }
    else {
        switch (c) {
            case  '.': col =  1; break;
            case  '(': col =  4; break;
            case  '%': col =  5; break;
            case  '^':
            case  '*':
            case  '/': col =  6; break;
            case  '+': col =  7; break;
            case  '-': col =  8; break;
            case  ',': col =  9; break;
            case  ')': col = 10; break;
            case  '=': col = 11; break;
            case  ' ': 
            case '\n': col = 12; break;
            case  ';': col = 13; break;
            default  : return -4;  // Unknown symbol error
        }
    }
    return Parser.dfaStates[q][col];
};

Parser.check = function(instance) {
    if (instance.tokens.length === 0) return;
    var st = [], si = [];
    var t, f, commaCtr, args, minArgs, maxArgs, idx, c;
    for (var i = 0; i < instance.tokens.length; i++) {
        t = instance.tokens[i];
        c = t.mark;
        if (c === 'F') {
            st.push(t);
            si.push(i);
            i++; // bypass an open parenthesis after a function
        }
        else if (c === '(') {
            st.push(t);
            si.push(i);
        }
        else if (c === ',') {
            if (st.length === 0) {
                instance.message = "Unknown arguments: " +
                        Parser.tokensString(instance, i - 1, 3);
                return;
            }
            st.push(t);
        }
        else if (c === ')') {
            commaCtr = 0;
            while (true) {
                if (st.length === 0) {
                    instance.message = "Unmatching parentheses: excess of " +
                                       "closed parenthesis";
                    return;
                }
                t = st.pop();
                if (t.mark === ',') {
                    commaCtr++;
                    continue;
                }
                break;
            }
            if (instance.tokens[i - 1].mark === '(')
                args = 0;
            else
                args = commaCtr + 1;
            idx = si.pop();
            if (t.mark === '(') {
                if (commaCtr > 0) {
                    instance.message = "Arguments without function: " +
                             Parser.tokensString(instance, idx, i - idx + 1);
                    return;
                }
                if (args === 0) {
                    instance.message = "Detected an empty parentheses: " +
                             Parser.tokensString(instance, idx - 1, 4);
                    return;
                }
                continue;
            }
            // when t.mark() == 'F'
            f = t.object;
            minArgs = f.numArgs;
            maxArgs = minArgs >> 8;
            minArgs &= 0x00ff;
            if (maxArgs === 0) maxArgs = minArgs;
            if (args < minArgs || args > maxArgs) {
                instance.message = "Unmatching arguments: " +
                         Parser.tokensString(instance, idx, i - idx + 1);
                return;
            }
            if (minArgs !== maxArgs)
                instance.tokens[idx].object.numArgs = args;
        }
    }
    if (st.length > 0)
        instance.message = "Unmatching parentheses: excess of open parenthesis";
};

Parser.tokensString = function(instance, position, length) {
    var s = "";
    var begin = position,
        end   = begin + length,
        size  = instance.tokens.length;
    if (begin < 0)  begin = 0;
    if (end > size) end   = size;
    for (var i = begin; i < end; i++)
        s += instance.tokens[i].toString(instance);
    if (begin > 0)  s  = "..." + s;
    if (end < size) s += "...";
    return s;
};

Parser.buildRPN = function(instance) {
    var s = [], t, t0, c, isAssign = false;
    instance.rpnTree.length = 0;
    for (var i = 0; i < instance.tokens.length; i++) {
        t  = instance.tokens[i];
        c  = t.mark;
        if (c === '=') {
            if (i === 1) {
                isAssign = true;
                instance.rpnTree.length = 0;
            }
            continue;
        }
        if (c === 'N' || c === 'V') {
            instance.rpnTree.push(t);
            continue;
        }
        if (c === '(' || c === 'F') {
            s.push(t);
            continue;
        }
        if (c === ',') {
            while (Parser.peekMark(s) !== '(') {
                instance.rpnTree.push(s.pop());
            }
            continue;
        }
        if (c === ')') {
            while (Parser.peekMark(s) !== '(') {
                instance.rpnTree.push(s.pop());
            }
            s.pop(); // remove '(' from stack
            if (Parser.peekMark(s) === 'F')
                instance.rpnTree.push(s.pop());
            continue;
        }
        while (s.length > 0) {
            t0 = s[s.length - 1];
            if (t0.mark === 'S' && t.mark === 'S')
                break;
            if (t0.mark !== '(' && t0.priority <= t.priority) {
                instance.rpnTree.push(s.pop());
                continue;
            }
            break;
        }
        s.push(t);
    }
    while (s.length > 0) {
        instance.rpnTree.push(s.pop());
    }
    return isAssign;
};

Parser.peekMark = function(s) {
    if (s.length === 0) return '_';
    return s[s.length - 1].mark;
};

Parser.execute = function(instance) {
    var s = [], args = [];
    var t, f, numArgs, oprn1, oprn2, c;
    for (var i = 0; i < instance.rpnTree.length; i++) {
        t = instance.rpnTree[i];
        c = t.mark;
        args.length = 0;
        if (c === 'V')
            instance.result = instance.varList[t.object].value;
        else if (c === 'N')
            instance.result = t.object;
        else if (c === 'F') {
            f = t.object;
            numArgs = f.numArgs;
            if (numArgs > 0) {
                for (var j = numArgs; j > 0; j--) {
                    args.push(s.pop());
                }
            }
            instance.result = Parser.evalFunction(f, args);
            if (Parser.isErrorGenerated(instance)) {
                instance.message += t.toString(instance) + "(";
                for (var j = numArgs; j > 0; j--)
                    instance.message += args[j - 1] + ",";
                instance.message = instance.message.substr(0,
                                   instance.message.length - 1) + ")";
                return;
            }
        }
        else if (c === 'S') {
            instance.result = s.pop();
            if (t.object === '-')
                instance.result = -instance.result;
        }
        else if (c === '%')
            instance.result = s.pop() / 100.0;
        else { // c == 'O'
            oprn2 = s.pop();
            oprn1 = s.pop();
            instance.result = Parser.evalBasicOpr(t.object, oprn1, oprn2);
            if (Parser.isErrorGenerated(instance)) {
                instance.message += oprn1 + t.object + oprn2;
                return;
            }
        }
        if (i < instance.rpnTree.length - 1) {
            s.push(instance.result);
        }
    }
};

Parser.isErrorGenerated = function(instance) {
    if (instance.message !== "") return true;
    if (isNaN(instance.result))
        instance.message = "Undefined result: ";
    else if (!isFinite(instance.result))
        instance.message = "Infinite result: ";
    return (instance.message !== "");
};

Parser.evalBasicOpr = function(oprt, oprn1, oprn2) {
    if (oprt === '*') return oprn1 * oprn2;
    if (oprt === '/') return oprn1 / oprn2;
    if (oprt === '+') return oprn1 + oprn2;
    if (oprt === '-') return oprn1 - oprn2;
    return Math.pow(oprn1, oprn2);
};

Parser.evalFunction = function(f, args) {
    if (f.code === 46) // PI
        return Math.PI;
    if (f.code === 50) // RAND
        return Math.random();
    var numArgs = args.length;
    var a = [];
    for (var i = 0; i < numArgs; i++)
        a[i] = args[numArgs - 1 - i];
        switch (f.code) {
        case  0: return Math.abs(a[0]);
        case  1: return Math.acos(a[0]);
        case  2: return ExtMath.acosh(a[0]);
        case  3: return Math.asin(a[0]);
        case  4: return ExtMath.asinh(a[0]);
        case  5: return Math.atan(a[0]);
        case  6: return Math.atan2(a[1], a[0]);
        case  7: return ExtMath.atanh(a[0]);
        case  8: return ExtMath.aveDev(a);
        case  9: return ExtMath.average(a);
        case 10: if (numArgs === 1) return Math.ceil(a[0]);
                 return ExtMath.ceiling(a[0], a[1]);
        case 11: return ExtMath.combin(a[0], a[1]);
        case 12: return Math.cos(a[0]);
        case 13: return ExtMath.cosh(a[0]);
        case 14: return ExtMath.degrees(a[0]);
        case 15: return ExtMath.devSq(a);
        case 16: return ExtMath.distance(a[0], a[1], a[2], a[3]);
        case 17: return ExtMath.dms2dec(a);
        case 18: return ExtMath.even(a[0]);
        case 19: return Math.exp(a[0]);
        case 20: return ExtMath.fact(a[0]);
        case 21: return ExtMath.factDouble(a[0]);
        case 22: return ExtMath.fisher(a[0]);
        case 23: return ExtMath.fisherInv(a[0]);
        case 24: if (numArgs === 1) return Math.floor(a[0]);
                 return ExtMath.floor(a[0], a[1]);
        case 25: return ExtMath.frac(a[0]);
        case 26: return ExtMath.gcd(a);
        case 27: return ExtMath.geoMean(a);
        case 28: return ExtMath.heading(a[0], a[1], a[2], a[3]);
        case 29: return Math.floor(a[0]); // INT
        case 30: return ExtMath.latitude(a[0], a[1], a[2], a[3]);
        case 31: return ExtMath.lcm(a);
        case 32: return Math.log(a[0]); // LN
        case 33: if (numArgs === 1) return ExtMath.log10(a[0]); // LOG
                 return ExtMath.log(a[0], a[1]);
        case 34: return ExtMath.log10(a[0]);
        case 35: return ExtMath.longitude(a[0], a[1], a[2], a[3]);
        case 36: return Math.max(a);
        case 37: return ExtMath.average(a); // MEAN
        case 38: return ExtMath.median(a);
        case 39: return Math.min(a);
        case 40: return ExtMath.mod(a[0], a[1]);
        case 41: return ExtMath.mode(a);
        case 42: return ExtMath.mRound(a[0], a[1]);
        case 43: return ExtMath.multiNomial(a);
        case 44: return ExtMath.odd(a[0]);
        case 45: return ExtMath.permut(a[0], a[1]);
        case 47: return Math.pow(a[0], a[1]);
        case 48: return ExtMath.product(a);
        case 49: return ExtMath.radians(a[0]);
        case 51: return ExtMath.randBetween(a[0], a[1]);
        case 52: if (numArgs === 1) return ExtMath.round(a[0]);
                 return ExtMath.round2(a[0], a[1]);
        case 53: return ExtMath.roundDown(a[0], a[1]);
        case 54: if (numArgs === 1) return ExtMath.roundUp(a[0]);
                 return ExtMath.roundUp2(a[0], a[1]);
        case 55: return ExtMath.sign(a[0]);
        case 56: return Math.sin(a[0]);
        case 57: return ExtMath.sinh(a[0]);
        case 58: return Math.sqrt(a[0]);
        case 59: return ExtMath.sqrtPi(a[0]);
        case 60: return ExtMath.stDev(a);
        case 61: return ExtMath.stDevP(a);
        case 62: return ExtMath.sum(a);
        case 63: return ExtMath.sumSq(a);
        case 64: return Math.tan(a[0]);
        case 65: return ExtMath.tanh(a[0]);
        case 66: if (numArgs === 1) return ExtMath.trunc(a[0]);
                 return ExtMath.trunc2(a[0], a[1]);
        case 67: return ExtMath.variance(a); // VAR
        case 68: return ExtMath.varP(a);
        default: return 0.0;
    }
};
