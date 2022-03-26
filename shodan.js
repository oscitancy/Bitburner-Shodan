import * as Status from "status.js";
import * as Phreak from "phreak.js";

var HIGH_DIFFICULTY_MULTIPLIER = 1.2;
var LOW_MONEY_MULTIPLIER = 0.95;

var hostsmeta = new Set();

/** @param {NS} ns **/
export async function main(ns)
{
	ns.disableLog('disableLog');
	ns.disableLog('scp');
	ns.disableLog('killall');
	ns.disableLog('sleep');
	ns.disableLog('exec');
	ns.disableLog('getHackingLevel');

	ns.tail();

	getAllHostnames(ns);
	rebuildMeta(ns);
	while(true)
	{
		ns.clearLog();
		for (const hostname of new Array(...hostsmeta))
		{
			var host = ns.getServer(hostname);
			Phreak.phreak(ns, host);
			//if (ns.getHackingLevel() >= (host['requiredHackingSkill'] / 3))
			{
				microStatus(ns, host, hostsmeta[hostname]);
				var hasRam = host['maxRam'] > 0;
				//var hackable = ns.getHackingLevel() >= host['requiredHackingSkill'] / 2;
				if (hasRam)// && hackable)
				{
					await autoAttack(ns, host);
				}
			}
		}
		await ns.sleep(1000);
	}
}

function getAllHostnames(ns)
{
	ns.disableLog("scan");
	mapHost(ns, 'home');
	hostsmeta.delete('home');
	hostsmeta.delete('darkweb');
	for (var i = 1; i <= 25; i++)
	{
		hostsmeta.delete('sv-' + i.toString().padStart(2, '0'));
	}
	ns.print("Total found hosts: " + new Array(...hostsmeta).length);
}

function mapHost(ns, hostname)
{
	hostsmeta.add(hostname);
	hostsmeta[hostname] = new Set();
	hostsmeta[hostname]['pid'] = 0;
	hostsmeta[hostname]['attackType'] = '    ';
	var links = ns.scan(hostname);
	links.forEach((link) =>
	{
		if (!hostsmeta.has(link))
		{
			mapHost(ns, link);
		}
	});
}

function rebuildMeta(ns)
{
	for (const hostname of new Array(...hostsmeta))
	{
		var host = ns.getServer(hostname);
		var isHack   = ns.print(ns.getRunningScript('attack.js', hostname, 'hack',   hostname));
		var isGrow   = ns.print(ns.getRunningScript('attack.js', hostname, 'grow',   hostname));
		var isWeaken = ns.print(ns.getRunningScript('attack.js', hostname, 'weaken', hostname));

		if (isHack != null)
		{
			hostsmeta[hostname]['pid'] = isHack['pid'];
			hostsmeta[hostname]['attackType'] = 'hack';
		}
		else if (isGrow != null)
		{
			hostsmeta[hostname]['pid'] = isGrow['pid'];
			hostsmeta[hostname]['attackType'] = 'grow';
		}
		else if (isWeaken != null)
		{
			hostsmeta[hostname]['pid'] = isWeaken['pid'];
			hostsmeta[hostname]['attackType'] = 'weaken';
		}
		else if (host['maxRam'] === 0)
		{
			hostsmeta[hostname]['pid'] = '-';
			hostsmeta[hostname]['attackType'] = '----';
		}
	}
}

function microStatus(ns, host, metadata)
{
	var portFlags = "";
	portFlags += (host['hasAdminRights']) ? 'AD ' : '   ';
	portFlags += (host['backdoorInstalled']) ? 'BD ' : '   ';
	portFlags += (host['sshPortOpen']) ? 'SH ' : '   ';
	portFlags += (host['ftpPortOpen']) ? 'FT ' : '   ';
	portFlags += (host['httpPortOpen']) ? 'HT ' : '   ';
	portFlags += (host['smtpPortOpen']) ? 'SM ' : '   ';
	portFlags += (host['sqlPortOpen']) ? 'SQ' : '  ';

	var difficulty = (host['hackDifficulty'] - host['minDifficulty']).toFixed(2).padStart(5, '0');
	if (host['baseDifficulty'] === 0) { difficulty = '--.--'; }
	var moneyPercentage = ((100 / host['moneyMax']) * host['moneyAvailable']).toFixed(2).padStart(5, '0');
	if (host['moneyMax'] === 0) { moneyPercentage = '--.--'; }
	ns.printf("%s %s [%s] %s %s [%s]",
		host['hostname'].padEnd(18),
		("(" + host['ip'] + ")").padEnd(10),
		portFlags,
		difficulty.padEnd(6),
		(moneyPercentage + "%").padEnd(7),
		metadata['attackType']
	);
}

async function autoAttack(ns, host)
{
	if (host['maxRam'] === 0) return;

	var maxThreads = host['maxRam'] / 2;
	var highDifficulty = host['hackDifficulty'] >= (host['minDifficulty'] * HIGH_DIFFICULTY_MULTIPLIER);
	var lowMoney = host['moneyAvailable'] <= (host['moneyMax'] * LOW_MONEY_MULTIPLIER);
	var attackType = 'hack';
	if (lowMoney) { attackType = 'grow'; }
	if (highDifficulty) { attackType = 'weaken'; }
	if (!ns.fileExists('attack.js', host['hostname']))
	{
		ns.print("    Pushing attack script...");
		await ns.scp("attack.js", host['hostname']);
	}
	if (attackType != hostsmeta[host['hostname']]['attackType'])
	{
		//ns.print("    Changing attack type to: " + attackType);
		ns.scriptKill('attack.js', host['hostname']);
		var pid = ns.exec("attack.js", host['hostname'], maxThreads, attackType, host['hostname']);
		hostsmeta[host['hostname']]['pid'] = pid;
		hostsmeta[host['hostname']]['attackType'] = attackType;
	}
}
