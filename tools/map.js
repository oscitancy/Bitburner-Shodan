const HOSTNAMES_DATA_PATH = '/data/hostnames.dat';

var silent = false;

/** @param {NS} ns **/
export async function main(ns)
{
	ns.disableLog('disableLog');
	ns.disableLog("scan");

	if (ns.args[0] == "silent") {silent = true;}

	var depth = 0;
	var hostname = 'home';
	var knownHostnames = new Set();
	knownHostnames.add(hostname);
	mapHost(ns, hostname, knownHostnames, depth);
	var json = JSON.stringify([...knownHostnames]);
	await ns.write(HOSTNAMES_DATA_PATH, json, 'w');
	if (!silent) ns.tprint("Total found hosts: " + [...knownHostnames].length);
}

function mapHost(ns, hostname, knownHostnames, depth)
{
	knownHostnames.add(hostname);
	var ip = ns.getServer(hostname)['ip'];
	var indent = '|   '.repeat(depth);
	if (!silent) ns.tprintf("%s\t%s%s (%s)", depth, indent, hostname, ip);
	var links = ns.scan(hostname);
	links.forEach((link) =>
	{
		if (!knownHostnames.has(link))
		{
			mapHost(ns, link, knownHostnames, depth+1);
		}
	});
}
