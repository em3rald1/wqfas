const trim = (d:string) => {
    if(d.startsWith(' ') || d.startsWith('\n')) {
        while(d[0] == ' ' || d[0] == '\n') {
            d = d.slice(1);
        }
    }
    if(d.endsWith(' ') || d.endsWith('\n')) {
        while(d[d.length] == ' ' || d[d.length] == '\n') {
            d = d.slice(0, -1);
        }
    }
    return d
}

const islabel = (d:string) => {
    if(d.startsWith('.')) return true;
    return false;
}

const isaddr = (d:string) => {
    if((Number(d.slice(1)) || d.slice(1) == '0') && d[0] == '$') return true;
    return false;
}

const split = (d:string) => {
    return d.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
}

function compile(data: string) : Uint8Array {
    const IS = {
        'addrr': 1, // a + b
        'addrl': 2, //  a + 5
        'addll': 3, // add 5 + 45
        'subrr': 4,
        'subrl': 5,
        'sublr': 6,
        'subll': 7,
        'rshr': 8,
        'rshl': 9,
        'lshr': 10,
        'lshl': 11,
        'incr': 12,
        'incl': 13,
        'decr': 14,
        'decl': 15,
        'xorrr': 16,
        'xorrl': 17,
        'xorll': 18,
        'andrr': 19,
        'andrl': 20,
        'andll': 21,
        'orrr': 22,
        'orrl': 23,
        'orll': 24,
        'norrr': 25,
        'norrl': 26,
        'norll': 27,
        'nandrr': 28,
        'nandrl': 29,
        'nandll': 30,
        'xnorrr': 31,
        'xnorrl': 32,
        'xnorll': 33,
        'notr':  34,
        'notl': 35,
        'mov': 36,
        'imm': 37,
        'lodl': 38,
        'lodr': 39,
        'strrmr': 40,
        'strrr': 41,
        'strrml': 42,
        'strrl': 43,
        'brarl': 44,
        'bral': 45,
        'brar': 46,
        'brcrl': 47,
        'brcl': 48,
        'brcr': 49,
        'bncrl': 50,
        'bncl': 51,
        'bncr': 52,
        'brzrl': 53,
        'brzl': 54,
        'brzr': 55,
        'bnzrl': 56,
        'bnzl': 57,
        'bnzr': 58,
        'brnrl': 59,
        'brnl': 60,
        'brnr': 61,
        'brprl': 62,
        'brpl': 63,
        'brpr': 64,
        'nop': 65,
        'hlt': 0xff
    };
    let compiled = [];
    let tokens : string[] = split(data);
    let labels = new Map<string, number>();
    console.log(tokens)
    let cti = 0;
    let cci = 3;
    let fetch = () => {
        return tokens[cti++];
    }
    let push = (data: number | string) => {
        compiled[cci] = data;
        cci ++;
    }
    let isreg = (d : string) => d.startsWith('r');
    let isnum = (d : string) => Boolean(Number(d) || d == '0');
    let ct = fetch();
    while(ct) {
        if(ct.startsWith('.')) {

        }
        ct = fetch();
    }
    cti = 0;
    while(ct) {
        if(trim(ct).startsWith(".")) {
            labels.set(trim(ct), cci);
        }
        //console.log();
        switch(trim(ct)) {
            case 'BITS': {
                let eqs = fetch();
                if(eqs == '==' || eqs == '>=' || eqs == '<=') {
                    let bits = fetch();
                    if(isnum(bits)) {
                        compiled[0] = Number(bits);
                    }
                }
                break;
            }
            case 'MINREGS': {
                let eqs = fetch();
                if(eqs == '==' || eqs == '>=' || eqs == '<=') {
                    let regs = fetch();
                    if(isnum(regs)) {
                        compiled[1] = Number(regs);
                    }
                }
                break;
            }
            case "INC": {
                let dest = fetch();
                let src = fetch();
                if(isnum(src)) {
                    push(IS.incl);
                    push(Number(dest.slice(1))-1);
                    push(Number(src));
                } else if(isreg(src)) {
                    push(IS.incr);
                    push(Number(dest.slice(1))-1);
                    push(Number(src.slice(1))-1);
                } else if(islabel(src)) {
                    push(IS.incl);
                    push(Number(dest.slice(1))-1);
                    push(src);
                }
                break;
            }
            case "DEC": {
                let dest = fetch();
                let src = fetch();
                if(isnum(src)) {
                    push(IS.decl);
                    push(Number(dest.slice(1))-1);
                    push(Number(src));
                } else if(isreg(src)) {
                    push(IS.decr);
                    push(Number(dest.slice(1))-1);
                    push(Number(src.slice(1))-1);
                } else if(islabel(src)) {
                    push(IS.decl);
                    push(Number(dest.slice(1))-1);
                    push(src);
                }
                break;
            }
            case 'LOD': {
                let src = fetch();
                let dest = fetch();
                if(isaddr(src) && isreg(dest)) {
                    push(IS.lodl);
                    push(Number(dest.slice(1))-1);
                    push(Number(src.slice(1)));
                } else if(isreg(src) && isreg(dest)) {
                    push(IS.lodr);
                    push(Number(dest.slice(1))-1);
                    push(Number(src.slice(1))-1);
                }
                break;
            }
            case "STORE": {
                let src = fetch();
                let dest = fetch();
                if(isaddr(dest) && isreg(src)) {
                    push(IS.strrmr);
                    push(Number(dest.slice(1)));
                    push(Number(src.slice(1))-1);
                }
                else if(isaddr(dest) && isnum(src)) {
                    push(IS.strrml);
                    push(Number(dest.slice(1)));
                    push(Number(src));
                } else if(isreg(dest) && isnum(src)) {
                    push(IS.strrl);
                    push(Number(dest.slice(1))-1);
                    push(Number(src));
                } else if(isreg(dest) && isreg(src)) {
                    push(IS.strrr);
                    push(Number(dest.slice(1))-1);
                    push(Number(src.slice(1))-1);
                }
            }
            case 'MINRAM': {
                let eqs = fetch();
                if(eqs == '==' || eqs == '>=' || eqs == '<=') {
                    let ram = fetch();
                    if(isnum(ram)) {
                        compiled[2] = Number(ram) & 0xff;
                    }
                }
                break;
            }
            case 'ADD': {
                let dest = fetch();
                let op1 = fetch();
                let op2 = fetch();
                if(isnum(op1) && isnum(op2)) {
                    push(IS.addll);
                    push(Number(dest.slice(1))-1);
                    push(Number(op1));
                    push(Number(op2));
                } else if(isreg(op1) && isnum(op2)) {
                    push(IS.addrl);
                    push(Number(dest.slice(1))-1);
                    push(Number(op1.slice(1))-1);
                    push(Number(op2));
                } else if(isreg(op1) && isreg(op2)) {
                    push(IS.addrr);
                    push(Number(dest.slice(1))-1);
                    push(Number(op1.slice(1))-1);
                    push(Number(op2.slice(1))-1);
                }
                break;
            }
            case 'SUB': {
                let dest = fetch();
                let op1 = fetch();
                let op2 = fetch();
                if(isnum(op1) && isnum(op2)) {
                    push(IS.subll);
                    push(Number(dest.slice(1))-1);
                    push(Number(op1));
                    push(Number(op2));
                } else if(isreg(op1) && isnum(op2)) {
                    push(IS.subrl);
                    push(Number(dest.slice(1))-1);
                    push(Number(op1.slice(1))-1);
                    push(Number(op2));
                } else if(isnum(op1) && isreg(op2)) {
                    push(IS.sublr);
                    push(Number(dest.slice(1))-1);
                    push(Number(op1));
                    push(Number(op2.slice(1))-1);
                } else if(isreg(op1) && isreg(op2)) {
                    push(IS.subrr);
                    push(Number(dest.slice(1))-1);
                    push(Number(op1.slice(1))-1);
                    push(Number(op2.slice(1))-1);
                }
                break;
            }
            case "IMM": {
                let dest = fetch();
                let src = fetch();
                if ((Number(src) || src == '0') && dest.startsWith('r')) {
                    // actually immediate
                    push(37);
                    push(Number(src));
                    push(Number(dest.slice(1))-1);
                }
                break;
            }
            case "HLT": {
                push(IS.hlt);
                break;
            }
            case "RSH": {
                let dest = fetch();
                let src = fetch();
                if(isnum(src)) {
                    push(IS.rshl);
                    push(Number(dest.slice(1))-1)
                    push(Number(src));
                } else if(isreg(src)) {
                    push(IS.rshr);
                    push(Number(dest.slice(1))-1);
                    push(Number(src.slice(1))-1);
                }
                break;
            }
            case "LSH": {
                let dest = fetch();
                let src = fetch();
                if(isnum(src)) {
                    push(IS.lshl);
                    push(Number(dest.slice(1))-1)
                    push(Number(src));
                } else if(isreg(src)) {
                    push(IS.lshr);
                    push(Number(dest.slice(1))-1);
                    push(Number(src.slice(1))-1);
                }
                break;
            }
            case 'MOV': {
                let src = fetch();
                let dest = fetch();
                if(src.startsWith('r') && dest.startsWith('r')) {
                    push(36);
                    push(Number(src.slice(1))-1);
                    push(Number(dest.slice(1))-1);
                }
                break;
            }
            ct = fetch();
        }
        ct = fetch();
    }
    return Uint8Array.from(compiled);
}

let code = Deno.readTextFileSync(Deno.args[0])
let data = compile(code);
Deno.writeFileSync(Deno.args[1], data);