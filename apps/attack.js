/** @param {NS} ns **/
export async function main(ns)
{
	var target = ns.args[0];
	var type = ns.args[1];
	switch (type)
	{
		case 'weaken':
			while(true){await ns.weaken(target);}
			break;
		case 'grow':
			while(true){await ns.grow(target);}
			break;
		case 'hack':
			while(true){await ns.hack(target);}
			break;
		default:
			ns.tail();
			ns.print("Unknown attack type! " + type);
			break;
	}
}
