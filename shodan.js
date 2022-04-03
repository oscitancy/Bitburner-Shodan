const APP_ATTACK_PATH = '/apps/attack.js';

const HOSTNAMES_DATA_PATH = '/data/hostnames.dat';
const HIGH_DIFFICULTY_MULTIPLIER = 1.2;
const LOW_MONEY_MULTIPLIER = 0.95;

var hostnames = null;
var servers = null;
var player = null;

///** @param {NS} ns **/
/** @param {import(".").NS } ns */
export async function main(ns)
{
	ns.disableLog('disableLog');
	ns.disableLog("scan");
	ns.disableLog('scp');
	ns.disableLog('killall');
	ns.disableLog('sleep');
	ns.disableLog('exec');
	ns.disableLog('getHackingLevel');

	ns.clearLog();
	ns.tail();

	servers = new Set();
	await ns.exec('/tools/map.js', 'home', 1, 'silent');
	fetchHostnames(ns);
	rebuildMeta(ns);

	while(true)
	{
		ns.clearLog();
		fetchHostnames(ns);
		player = ns.getPlayer();

		for (const server of new Array(...servers))
		{
			servers[server]['state'] = ns.getServer(server);
			var state = servers[server]['state'];
			var hackable = ns.getHackingLevel() >= state['requiredHackingSkill'];
			var hasRam = state['maxRam'] > 0;

			await autophreak(ns, server);
			if (hasRam) microStatus(ns, server);
			if (hackable && hasRam)
			{
				await autoAttack(ns, server);
			}
		}
		await ns.sleep(2000);
	}
}

function fetchHostnames(ns)
{
	var data = ns.read(HOSTNAMES_DATA_PATH);
    hostnames = JSON.parse(data);
}

function removeIntra(ns)
{
	// hostsmeta.delete('home');
	// hostsmeta.delete('darkweb');
	// for (var i = 1; i <= 25; i++)
	// {
	// 	hostsmeta.delete('sv-' + i.toString().padStart(2, '0'));
	// }
}

function rebuildMeta(ns)
{
	hostnames.forEach((hostname) =>
	{
		servers.add(hostname);
		servers[hostname] = new Set();

		var serverState = ns.getServer(hostname);
		servers[hostname]['state'] = serverState;

		var isHack   = ns.getRunningScript(APP_ATTACK_PATH, hostname, hostname, 'hack');
		var isGrow   = ns.getRunningScript(APP_ATTACK_PATH, hostname, hostname, 'grow');
		var isWeaken = ns.getRunningScript(APP_ATTACK_PATH, hostname, hostname, 'weaken');

		if (isHack)
		{
			servers[hostname]['pid'] = isHack['pid'];
			servers[hostname]['attackType'] = 'hack';
		}
		else if (isGrow)
		{
			servers[hostname]['pid'] = isGrow['pid'];
			servers[hostname]['attackType'] = 'grow';
		}
		else if (isWeaken)
		{
			servers[hostname]['pid'] = isWeaken['pid'];
			servers[hostname]['attackType'] = 'weaken';
		}
		else if (serverState['maxRam'] <= 0)
		{
			servers[hostname]['pid'] = '-';
			servers[hostname]['attackType'] = '-';
		}
		else
		{
			servers[hostname]['pid'] = '-';
			servers[hostname]['attackType'] = 'idle';
		}
	});

}

function microStatus(ns, hostname)
{
	var state = servers[hostname]['state'];

	var difficulty = (state['hackDifficulty'] - state['minDifficulty']).toFixed(2).padStart(5, '0');
	if (state['baseDifficulty'] === 0) { difficulty = '--.--'; }

	var moneyPercentage = ((100 / state['moneyMax']) * state['moneyAvailable']).toFixed(2).padStart(5, '0');
	if (state['moneyMax'] === 0) { moneyPercentage = '--.--'; }

	ns.printf("%s %s %s %s [%s]",
	state['hostname'].padEnd(18),
		("(" + state['ip'] + ")").padEnd(10),
		difficulty.padEnd(6),
		(moneyPercentage + "%").padEnd(7),
		servers[hostname]['attackType']
	);
}

async function autophreak(ns, hostname)
{
	var state = servers[hostname]['state'];
	var args = new Array();
	args.push(hostname);
	if (!state['sshPortOpen']) args.push('ssh');
	if (!state['ftpPortOpen']) args.push('ftp');
	if (!state['httpPortOpen']) args.push('http');
	if (!state['smtpPortOpen']) args.push('smtp');
	if (!state['sqlPortOpen']) args.push('sql');
	var nukeAvailable = state['openPortCount'] > state['numOpenPortsRequired'];
	if (!state['hasAdminRights'] && nukeAvailable) args.push('nuke');
	//if (!state['backdoorInstalled']) args.push('backdoor');
	if (args.length > 1)
	{
		await ns.exec("/apps/phreak.js", 'home', 1, ...args);
	}
}

async function autoAttack(ns, hostname)
{
	var state = servers[hostname]['state'];
	if (state['maxRam'] === 0) return;

	var maxThreads = state['maxRam'] / 2;
	var lowSkill = state['requiredHackingSkill'] > player.hacking;
	var lowMoney = state['moneyAvailable'] <= (state['moneyMax'] * LOW_MONEY_MULTIPLIER);
	var highDifficulty = state['hackDifficulty'] >= (state['minDifficulty'] * HIGH_DIFFICULTY_MULTIPLIER);
	var attackType = 'hack';
	if (lowSkill) { attackType = 'lowskill'}
	if (lowMoney) { attackType = 'grow'; }
	if (highDifficulty) { attackType = 'weaken'; }
	//if (!ns.fileExists(APP_ATTACK_PATH, hostname))
	{
		if (!ns.fileExists(APP_ATTACK_PATH, 'home'))
		{
			ns.print("Attack app is missing!");
			ns.exit();
		}
		await ns.scp(APP_ATTACK_PATH, hostname);
	}
	if (attackType != servers[hostname]['attackType'])
	{
		ns.print("    Changing attack type to: " + attackType);
		ns.scriptKill(APP_ATTACK_PATH, hostname);
		var pid = ns.exec(APP_ATTACK_PATH, hostname, maxThreads, hostname, attackType);
		servers[hostname]['pid'] = pid;
		servers[hostname]['attackType'] = attackType;
	}
}
