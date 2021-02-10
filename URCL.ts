import VM from "./vm.ts"

let data = Deno.readFileSync(Deno.args[0]);

let vm = new VM(data[0], data[1], data[2]);
vm.load(data.slice(3));
vm.start();