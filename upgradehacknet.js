/** @param {NS} ns **/
export async function main(ns)
{
	var type = ns.args[0];
	var level = ns.args[1];

	var count = ns.hacknet.numNodes();
	ns.print("Nodes: " + count);
	for (var i = 0; i < count; i++)
	{
		var nodeStats = ns.hacknet.getNodeStats(i)
		switch (type)
		{
			case "cache":
				ns.printf("Upgrading %1$s Cache to %2$s [ Current: %3$s ]", nodeStats['name'], level, nodeStats['cache']);
				ns.hacknet.upgradeCache(i, level - nodeStats['cache']);
				break;
			case "cores":
				ns.printf("Upgrading %1$s Cores to %2$s [ Current: %3$s ]", nodeStats['name'], level, nodeStats['cores']);
				ns.hacknet.upgradeCore(i, level - nodeStats['cores']);
				break;
			case "level":
				ns.printf("Upgrading %1$s Level to %2$s [ Current: %3$s ]", nodeStats['name'], level, nodeStats['level']);
				ns.hacknet.upgradeLevel(i, level - nodeStats['level']);
				break;
			case "ram":
				ns.printf("Upgrading %1$s RAM to %2$s [ Current: %3$s ]", nodeStats['name'], level, nodeStats['ram']);
				ns.hacknet.upgradeRam(i, level - nodeStats['ram']);
				break;
			default:
				ns.print("Unknown resource type to upgrade.");
				break;
		}
	}
}
