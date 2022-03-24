/** @param {NS} ns **/
export async function main(ns)
{
	ns.tail();
	var target1 = ns.args[0];
	var target2 = ns.args[1];
	var target3 = ns.args[2];
	ns.exec('attack.js', 'sv-01', 3072, 'grow', target1);
	ns.exec('attack.js', 'sv-01', 1024, 'weaken', target1);
	ns.exec('attack.js', 'sv-02', 3072, 'grow', target2);
	ns.exec('attack.js', 'sv-02', 1024, 'weaken', target2);
	ns.exec('attack.js', 'sv-03', 3072, 'grow', target3);
	ns.exec('attack.js', 'sv-03', 1024, 'weaken', target3);
}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
}
