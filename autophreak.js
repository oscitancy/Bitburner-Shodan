import * as Phreak from "phreak.js";

var hostnames = null;

/** @param {NS} ns **/
export async function main(ns)
{
	ns.disableLog("disableLog");
	ns.disableLog("scan");
	ns.disableLog("sleep");
	ns.clearLog();
	ns.tail();

	ns.print("---------------------------------------------");

	hostnames = new Set();
	mapHostnames(ns, 'home');
	cleanHostnames(ns);
	ns.print("Found hosts: " + hostnames.size);
	while (true)
	{
		ns.clearLog();
		buildTable(ns, hostnames);
		await ns.sleep(1000);
	}
}

function mapHostnames(ns, hostname)
{
	hostnames.add(hostname);
	var links = ns.scan(hostname);
	links.forEach((link) =>
	{
		if (!hostnames.has(link))
		{
			mapHostnames(ns, link);
		}
	});
}

function cleanHostnames(ns)
{
	hostnames.delete('home');
	for (var i = 1; i <= 25; i++)
	{
		hostnames.delete('sv-' + i.toString().padStart(2, '0'));
	}
}

function buildTable(ns, hostnames)
{
	ns.print(buildTableHeader());
	for(var i = 0; i < 45; i++)
	{
		var hostA = null;
		var hostB = null;
		if ([...hostnames][i])
		{
			hostA = ns.getServer([...hostnames][i]);
			Phreak.phreak(ns, hostA);
		}
		if ([...hostnames][i+45])
		{
			hostB = ns.getServer([...hostnames][i+45]);
			Phreak.phreak(ns, hostB);
		}
		ns.print(buildRow(ns, hostA, hostB));
	}
	ns.print(buildTableFooter());
}

function buildTableHeader()
{
	var tableHeader = "";
	tableHeader += "╔════════════════════╦══════════╦════╦════╦════╦════╦════╦════╦════╗  ╔════════════════════╦══════════╦════╦════╦════╦════╦════╦════╦════╗\n";
	tableHeader += "║      Hostname      ║    IP    ║ AD ║ BD ║ SS ║ FT ║ HT ║ SM ║ SQ ║  ║      Hostname      ║    IP    ║ AD ║ BD ║ SS ║ FT ║ HT ║ SM ║ SQ ║\n";
	tableHeader += "╠════════════════════╬══════════╬════╬════╬════╬════╬════╬════╬════╣  ╠════════════════════╬══════════╬════╬════╬════╬════╬════╬════╬════╣";
	return tableHeader;
}

function buildRow(ns, hostA, hostB)
{
	return buildHalfRow(ns, hostA) + "  " + buildHalfRow(ns, hostB);
}

function buildHalfRow(ns, host)
{
	var emptyRow = "║                    ║          ║    ║    ║    ║    ║    ║    ║    ║";
	if (host === null) return emptyRow;
	var halfRow = "║ ";
	halfRow += host['hostname'].padEnd(18) + " ║ ";
	halfRow += host['ip'].padEnd(8) + " ║";
	halfRow += (host['hasAdminRights']) ? ' ■■ ║' : '    ║';
	halfRow += (host['backdoorInstalled']) ? ' ■■ ║' : '    ║';
	halfRow += (host['sshPortOpen']) ? ' ■■ ║' : '    ║';
	halfRow += (host['ftpPortOpen']) ? ' ■■ ║' : '    ║';
	halfRow += (host['httpPortOpen']) ? ' ■■ ║' : '    ║';
	halfRow += (host['smtpPortOpen']) ? ' ■■ ║' : '    ║';
	halfRow += (host['sqlPortOpen']) ? ' ■■ ║' : '    ║';
	return halfRow;
}

function buildTableFooter()
{
	var tableFooter = "╚════════════════════╩══════════╩════╩════╩════╩════╩════╩════╩════╝";
	return tableFooter + "  " + tableFooter;
}

// function union(setA, setB)
// {
//     let _union = new Set(setA);
//     for (let elem of setB)
// 	{
//         _union.add(elem);
//     }
//     return _union;
// }
