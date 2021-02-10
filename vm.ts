/*
    URCL VM:
        virtual machine based on cpu built in minecraft
*/

type int = number;

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

export default class URCL8
{
    registers : Uint8Array;
    memory : Uint8Array;
    ip: int;
    cf: boolean = false;
    zf: boolean = true;
    constructor(bitness : int, minregs : int, minram : int, stackneeded: boolean = false) 
    {
        if(bitness > 8) {
            throw new TypeError(`This VM isn't supporting more than 8 bits!`)
        }
        if(stackneeded) {
            throw new TypeError(`This VM isn't supporting stack!`);
        }
        this.registers = new Uint8Array(minregs);
        this.memory = new Uint8Array(minram);
        this.ip = 0
    };
    fetch() : int {
        //this.ip += 1;
        return this.memory[this.ip++];
    }
    execute() : boolean {
        let result = false;
        let instruction : int = this.fetch();
       // console.log(this.ip)
        switch(instruction) {
            case IS.addrr: {
                let dest = this.fetch();
                let r1 = this.fetch();
                let r2 = this.fetch();
                this.registers[dest] = this.registers[r1] + this.registers[r2];
                this.cf = this.registers[r1] + this.registers[r2] > 255;
                this.zf = this.registers[r1] + this.registers[r2] == 0;
                console.log(`[Exec] [Instruction: ${instruction}(ADD), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.addrl: {
                let dest = this.fetch();
                let r1 = this.fetch();
                let l1 = this.fetch();
                this.registers[dest] = this.registers[r1] + l1;
                this.cf = this.registers[r1] + l1 > 255;
                this.zf = this.registers[r1] + l1 == 0;
                console.log(`[Exec] [Instruction: ${instruction}(ADD), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.addll: {
                let dest = this.fetch();
                let l1 = this.fetch();
                let l2 = this.fetch();
                this.registers[dest] = l1 + l2;
                this.cf = l1 + l2 > 255;
                this.zf = l1 + l2 == 0;
                console.log(`[Exec] [Instruction: ${instruction}(ADD), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.subrr: {
                let dest = this.fetch();
                let r1 = this.fetch();
                let r2 = this.fetch();
                this.registers[dest] = this.registers[r1] - this.registers[r2];
                this.cf = this.registers[r1] - this.registers[r2] > 255;
                this.zf = this.registers[r1] - this.registers[r2] == 0;
                console.log(`[Exec] [Instruction: ${instruction}(SUB), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.subrl: {
                let dest = this.fetch();
                let r1 = this.fetch();
                let l1 = this.fetch();
                this.registers[dest] = this.registers[r1] - l1;
                this.cf = this.registers[r1] - l1 > 255;
                this.zf = this.registers[r1] - l1 == 0;
                console.log(`[Exec] [Instruction: ${instruction}(SUB), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.sublr: {
                let dest = this.fetch();
                let l1 = this.fetch();
                let r1 = this.fetch();
                this.registers[dest] = l1 - this.registers[r1];
                this.cf = l1 - this.registers[r1] > 255;
                this.zf = l1 - this.registers[r1] == 0;
                console.log(`[Exec] [Instruction: ${instruction}(SUB), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.subll: {
                let dest = this.fetch();
                let l1 = this.fetch();
                let l2 = this.fetch();
                this.registers[dest] = l1 - l2;
                this.cf = l1 - l2 > 255;
                this.zf = l1 - l2 == 0;
                console.log(`[Exec] [Instruction: ${instruction}(SUB), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.rshl: {
                let dest = this.fetch();
                let l1 = this.fetch();
                this.registers[dest] = l1 >> 1;
                console.log(`[Exec] [Instruction: ${instruction}(RSH), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.rshr: {
                let dest = this.fetch();
                let r1 = this.fetch();
                this.registers[dest] = this.registers[r1] >> 1;
                console.log(`[Exec] [Instruction: ${instruction}(RSH), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.lshl: {
                let dest = this.fetch();
                let l1 = this.fetch();
                this.registers[dest] = l1 << 1;
                console.log(`[Exec] [Instruction: ${instruction}(LSH), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.lshr: {
                let dest = this.fetch();
                let r1 = this.fetch();
                this.registers[dest] = this.registers[r1] << 1;
                console.log(`[Exec] [Instruction: ${instruction}(LSH), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.incl: {
                let dest = this.fetch();
                let l1 = this.fetch();
                this.registers[dest] = l1 + 1;
                this.cf = l1 + 1 > 255;
                this.zf = l1 + 1 == 0;
                console.log(`[Exec] [Instruction: ${instruction}(INC), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.incr: {
                let dest = this.fetch();
                let r1 = this.fetch();
                this.registers[dest] = this.registers[r1] + 1;
                this.cf = this.registers[r1] + 1 > 255;
                this.zf = this.registers[r1] + 1 == 0;
                console.log(`[Exec] [Instruction: ${instruction}(INC), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.decl: {
                let dest = this.fetch();
                let l1 = this.fetch();
                this.registers[dest] = l1-1;
                this.cf = l1-1 > 255;
                this.zf = l1-1 == 0;
                console.log(`[Exec] [Instruction: ${instruction}(DEC), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.decr: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                this.registers[dest] = r1-1;
                this.cf = r1-1 > 255;
                this.zf = r1-1 == 0;
                console.log(`[Exec] [Instruction: ${instruction}(DEC), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.xorrr: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let r2 = this.registers[this.fetch()];
                this.registers[dest] = r1 ^ r2;
                this.cf = (r1 ^ r2) > 255;
                this.zf = (r1 ^ r2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(XOR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.xorrl: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let l1 = this.fetch();
                this.registers[dest] = r1 ^ l1;
                this.cf = (r1 ^ l1) > 255;
                this.zf = (r1 ^ l1) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(XOR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.xorll: {
                let dest = this.fetch();
                let l1 = this.fetch();
                let l2 = this.fetch();
                this.registers[dest] = l1 ^ l2;
                this.cf = (l1 ^ l2) > 255;
                this.zf = (l1 ^ l2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(XOR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.andll: {
                let dest = this.fetch();
                let l1 = this.fetch();
                let l2 = this.fetch();
                this.registers[dest] = l1 & l2;
                this.cf = (l1 & l2) > 255;
                this.zf = (l1 & l2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(AND), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.andrl: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let l1 = this.fetch();
                this.registers[dest] = r1 & l1;
                this.cf = (l1 & r1) > 255;
                this.zf = (l1 & r1) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(AND), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.andrr: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let r2 = this.registers[this.fetch()];
                this.registers[dest] = r1 & r2;
                this.cf = (r1 & r2) > 255;
                this.zf = (r1 & r2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(AND), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.orll: {
                let dest = this.fetch();
                let l1 = this.fetch();
                let l2 = this.fetch();
                this.registers[dest] = l1 | l2;
                this.cf = (l1 | l2) > 255;
                this.zf = (l1 | l2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(OR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.orrl: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let l1 = this.fetch();
                this.registers[dest] = r1 | l1;
                this.cf = (l1 | r1) > 255;
                this.zf = (l1 | r1) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(OR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.orrr: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let r2 = this.registers[this.fetch()];
                this.registers[dest] = r1 | r2;
                this.cf = (r1 | r2) > 255;
                this.zf = (r1 | r2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(OR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.nandll: {
                let dest = this.fetch();
                let l1 = this.fetch();
                let l2 = this.fetch();
                this.registers[dest] = ~(l1 & l2);
                this.cf = ~(l1 & l2) > 255;
                this.zf = ~(l1 & l2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(NAND), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.nandrl: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let l1 = this.fetch();
                this.registers[dest] = ~(r1 & l1);
                this.cf = ~(l1 & r1) > 255;
                this.zf = ~(l1 & r1) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(NAND), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.nandrr: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let r2 = this.registers[this.fetch()];
                this.registers[dest] = ~(r1 & r2);
                this.cf = ~(r1 & r2) > 255;
                this.zf = ~(r1 & r2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(NAND), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.norll: {
                let dest = this.fetch();
                let l1 = this.fetch();
                let l2 = this.fetch();
                this.registers[dest] = ~(l1 | l2);
                this.cf = ~(l1 | l2) > 255;
                this.zf = ~(l1 | l2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(NOR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.norrl: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let l1 = this.fetch();
                this.registers[dest] = ~(r1 | l1);
                this.cf = ~(l1 | r1) > 255;
                this.zf = ~(l1 | r1) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(NOR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.norrr: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let r2 = this.registers[this.fetch()];
                this.registers[dest] = ~(r1 | r2);
                this.cf = ~(r1 | r2) > 255;
                this.zf = ~(r1 | r2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(NOR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.xnorll: {
                let dest = this.fetch();
                let l1 = this.fetch();
                let l2 = this.fetch();
                this.registers[dest] = ~(l1 ^ l2);
                this.cf = ~(l1 ^ l2) > 255;
                this.zf = ~(l1 ^ l2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(XNOR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.xnorrl: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let l1 = this.fetch();
                this.registers[dest] = ~(r1 & l1);
                this.cf = ~(l1 ^ r1) > 255;
                this.zf = ~(l1 ^ r1) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(XNOR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.xnorrr: {
                let dest = this.fetch();
                let r1 = this.registers[this.fetch()];
                let r2 = this.registers[this.fetch()];
                this.registers[dest] = ~(r1 & r2);
                this.cf = ~(r1 ^ r2) > 255;
                this.zf = ~(r1 ^ r2) == 0;
                console.log(`[Exec] [Instruction: ${instruction}(XNOR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.notl: {
                let dest = this.fetch();
                let l1 = this.fetch();
                this.registers[dest]= ~l1;
                this.cf = ~l1 > 255;
                this.zf = ~l1 == 0;
                console.log(`[Exec] [Instruction: ${instruction}(NOT), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.notr: {
                let dest = this.fetch();
                let r1 = this.fetch();
                this.registers[dest] = ~this.registers[r1];
                this.cf = ~this.registers[r1] > 255;
                this.zf = ~this.registers[r1] == 0;
                console.log(`[Exec] [Instruction: ${instruction}(NOT), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.mov: {
                let src = this.fetch();
                let dest = this.fetch();
                this.registers[dest] = this.registers[src];
                console.log(`[Exec] [Instruction: ${instruction}(MOV), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.imm: {
                let src = this.fetch();
                let dest = this.fetch();
                this.registers[dest] = src;
                console.log(`[Exec] [Instruction: ${instruction}(IMM), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.lodl: {
                let dest = this.fetch();
                let addr = this.fetch();
                this.registers[dest] = this.memory[addr];
                console.log(`[Exec] [Instruction: ${instruction}(LOD), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.lodr: {
                let dest = this.fetch();
                let r1 = this.fetch();
                this.registers[dest] = this.memory[this.registers[r1]];
                console.log(`[Exec] [Instruction: ${instruction}(LOD), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.strrmr: {
                let src = this.fetch();
                let addr = this.fetch();
                this.memory[addr] = this.registers[src];
                console.log(`[Exec] [Instruction: ${instruction}(STR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.strrr: {
                let src = this.fetch();
                let addr = this.registers[this.fetch()];
                this.memory[addr] = this.registers[src];
                console.log(`[Exec] [Instruction: ${instruction}(STR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.strrml: {
                let src = this.fetch();
                let addr = this.fetch();
                this.memory[addr] = src;
                console.log(`[Exec] [Instruction: ${instruction}(STR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.strrl: {
                let src = this.fetch();
                let addr = this.registers[this.fetch()];
                console.log(`[Exec] [Instruction: ${instruction}(STR), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                this.memory[addr] = src;
                break;
            }
            case IS.brarl: {
                let reladdr = this.fetch();
                this.ip += reladdr;
                console.log(`[Exec] [Instruction: ${instruction}(BRA), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.bral: {
                let addr = this.fetch();
                this.ip = addr;
                console.log(`[Exec] [Instruction: ${instruction}(BRA), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.brar: {
                let addr = this.registers[this.fetch()];
                this.ip = addr;
                console.log(`[Exec] [Instruction: ${instruction}(BRA), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            }
            case IS.brcrl: {
                let reladdr = this.fetch();
                if (this.cf) {
                    this.ip += reladdr;
                    console.log(`[Exec] [Instruction: ${instruction}(BRС), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                }
                break;
            }
            case IS.brcl: {
                let addr = this.fetch();
                if ( this.cf ) {
                    this.ip = addr;
                    console.log(`[Exec] [Instruction: ${instruction}(BRС), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                }
                break;
            }
            case IS.brcr: {
                let addr = this.registers[this.fetch()];
                if(this.cf) {
                    this.ip = addr;
                    console.log(`[Exec] [Instruction: ${instruction}(BRС), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                }
                break;
            }
            case IS.bncrl: {
                let reladdr = this.fetch();
                if (!this.cf) {
                    this.ip += reladdr;
                    console.log(`[Exec] [Instruction: ${instruction}(BNС), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                }
                break;
            }
            case IS.bncl: {
                let addr = this.fetch();
                if (! this.cf ) {
                    this.ip = addr;
                    console.log(`[Exec] [Instruction: ${instruction}(BNС), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                }
                break;
            }
            case IS.bncr: {
                let addr = this.registers[this.fetch()];
                if(!this.cf) {
                    this.ip = addr;
                    console.log(`[Exec] [Instruction: ${instruction}(BNС), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                }
                break;
            }
            case IS.brzrl: {
                let reladdr = this.fetch();
                if (this.zf) {
                    this.ip += reladdr;
                    console.log(`[Exec] [Instruction: ${instruction}(BRZ), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                }
                break;
            }
            case IS.brzl: {
                let addr = this.fetch();
                if ( this.zf ) {
                    this.ip = addr;
                    console.log(`[Exec] [Instruction: ${instruction}(BRZ), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                }
                break;
            }
            case IS.brzr: {
                let addr = this.registers[this.fetch()];
                if(this.zf) {
                    this.ip = addr;
                    console.log(`[Exec] [Instruction: ${instruction}(BRZ), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                }
                break;
            }
            case IS.nop: {
                console.log(`[Exec] [Instruction: ${instruction}(NOP), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                break;
            };
            case IS.hlt: {
                console.log(`[Exec] [Instruction: ${instruction}(HLT), Zero Flag: ${this.zf ? 1 : 0}, Carry Flag ${this.cf ? 1 : 0}]`)
                result = true;
                break;
            }
            default:
                console.log(`[Exec] [Illegal operator ${instruction}!]`)
                result = true;
        }
        return result;
    }
    load(data : Uint8Array, offset: int = 0) : void {
        for(let o : int = 0; o < data.length; o++) {
            this.memory[o+offset] = data[o];
        }
    }
    start(ip: int = 0) {
        this.ip = ip;
        let i = false;
        while (!i) {
            i = this.execute();
            console.log(`[ REGISTER DATA: [ ${this.registers} ] ]`)
            if(i) break;
        }
    }
};