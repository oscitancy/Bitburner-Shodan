/** @param {NS} ns **/

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
}

export async function main(ns)
{
	var hostname = ns.args[0];
	if(hostname != null)
	{
		status(ns, ns.getServer(hostname));
	}
	else
	{
		var hosts = ns.scan();
		for (const host of hosts)
		{
			status(ns, ns.getServer(host));
			ns.print("");
		}
	}
	ns.tail();
}

export function status(ns, host)
{
	ns.printf("Host: %s (%s) | CPU: %s | RAM: %s/%s | Company: %s",
		host['hostname'],
		host['ip'],
		host['cpuCores'],
		host['ramUsed'],
		host['maxRam'],
		host['organizationName']);
	ns.printf("    Difficulty: %s (%s)",
		host['hackDifficulty'].toFixed(2),
		host['minDifficulty']);
	ns.printf("    Money: %s/%s (%s%%)",
		host['moneyAvailable'].toFixed(2),
		host['moneyMax'],
		((100/host['moneyMax'])*host['moneyAvailable']).toFixed(2));
	ns.printf("    Admin[%s] Backdoor[%s] HTTP[%s] FTP[%s] SSH[%s] SMTP[%s] SQL[%s]",
		host['hasAdminRights'],
		host['backdoorInstalled'],
		host['httpPortOpen'],
		host['ftpPortOpen'],
		host['sshPortOpen'],
		host['smtpPortOpen'],
		host['sqlPortOpen']
	);
	ns.printf("    Ports[%s(%s)] Skill[%s] Growth[%s]",
		host['openPortCount'],
		host['numOpenPortsRequired'],
		host['requiredHackingSkill'],
		host['serverGrowth']);
	ns.print(host);
}
