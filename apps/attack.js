/** @param {NS} ns **/
export async function main(ns)
{
	var type = ns.args[0];
	var host = ns.args[1];
	switch (type)
	{
		case 'weaken':
			while(true){await ns.weaken(host);}
			break;
		case 'grow':
			while(true){await ns.grow(host);}
			break;
		case 'hack':
			while(true){await ns.hack(host);}
			break;
		default:
			ns.print("Unknown attack type!");
			break;
	}
}
