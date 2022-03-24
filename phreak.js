/** @param {NS} ns **/
export async function main(ns)
{
	var target = ns.args[0];
	phreak(ns, ns.getServer(target));
}

export function phreak(ns, host)
{
	var hostname = host['hostname'];

	if (!host['httpPortOpen'])
	{
		if(ns.fileExists("httpworm.exe"))
		{
			ns.httpworm(hostname);
			host['httpPortOpen'] = true;
			host['openPortCount'] = host['openPortCount'] + 1;
		}
	}
	if (!host['ftpPortOpen'])
	{
		if(ns.fileExists("ftpcrack.exe"))
		{
			ns.ftpcrack(hostname);
			host['ftpPortOpen'] = true;
			host['openPortCount'] = host['openPortCount'] + 1;
		}
	}
	if (!host['sshPortOpen'])
	{
		if(ns.fileExists("brutessh.exe"))
		{
			ns.brutessh(hostname);
			host['sshPortOpen'] = true;
			host['openPortCount'] = host['openPortCount'] + 1;
		}
	}
	if (!host['smtpPortOpen'])
	{
		if(ns.fileExists("relaysmtp.exe"))
		{
			ns.relaysmtp(hostname);
			host['smtpPortOpen'] = true;
			host['openPortCount'] = host['openPortCount'] + 1;
		}
	}
	if (!host['sqlPortOpen'])
	{
		if(ns.fileExists("sqlinject.exe"))
		{
			ns.sqlinject(hostname);
			host['sqlPortOpen'] = true;
			host['openPortCount'] = host['openPortCount'] + 1;
		}
	}
	if (!host['hasAdminRights'])
	{
		if (host['openPortCount'] >= host['numOpenPortsRequired'])
		{
			//ns.print("Nuking: " + hostname);
			ns.nuke(hostname);
		}
		else
		{
			//ns.print("Not enough open ports to Nuke: " + hostname);
		}
	}
	if (host['hasAdminRights'] && !host['backdoorInstalled'])
	{
		//ns.print("-- Installing backdoor...");
		//ns.installBackdoor();
	}
}
