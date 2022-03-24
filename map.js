var MAX_DEPTH = 20;
var knownHosts = null;

/** @param {NS} ns **/
export async function main(ns)
{
	ns.disableLog('disableLog');
	ns.disableLog("scan");

	var count = 0;
	var depth = 0;
	var indent = "";
	var host = ns.getServer();
	knownHosts = new Set();
	knownHosts.add(host['hostname']);
	count = count + mapHost(ns, depth, indent, knownHosts, host);
	ns.print("Total found hosts: " + count);
	//ns.print(new Array(...knownHosts));//.join(','));
	ns.tail();
}

function mapHost(ns, depth, indent, knownHosts, host)
{
	knownHosts.add(host['hostname']);
	var count = 0;
	depth += 1;
	ns.printf("%1$s\t%2$s%3$s (%4$s)",
		depth,
		indent,
		host['hostname'],
		host['ip']
	);
	var links = ns.scan(host['hostname']);
	links.forEach((link) =>
	{
		if (!knownHosts.has(link) && depth <= MAX_DEPTH-1)
		{
			count = count + 1 + mapHost(ns, depth, indent + "|   ", knownHosts, ns.getServer(link));
		}
	});
	return count;
}
