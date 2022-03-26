/** @param {NS} ns **/
export async function main(ns)
{
	ns.disableLog('disableLog');
	ns.disableLog("scan");

	var depth = 0;
	var hostname = 'home';
	var knownHostnames = new Set();
	knownHostnames.add(hostname);
	mapHost(ns, hostname, knownHostnames, depth);
	ns.tprint("Total found hosts: " + [...knownHostnames].length);
}

function mapHost(ns, hostname, knownHostnames, depth)
{
	knownHostnames.add(hostname);
	var ip = ns.getServer(hostname)['ip'];
	var indent = '|   '.repeat(depth);
	ns.tprintf("%s\t%s%s (%s)", depth, indent, hostname, ip);
	var links = ns.scan(hostname);
	links.shift(); // Remove parent link
	links.forEach((link) =>
	{
		mapHost(ns, link, knownHostnames, depth+1);
	});
}
