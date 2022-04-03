import * as Table from "/modules/table.js";

const HOSTNAMES_DATA_PATH = '/data/hostnames.dat';
var hostnames = null;

///** @param {NS} ns **/
/** @param {import(".").NS } ns */
export async function main(ns)
{
	ns.disableLog("disableLog");
	ns.disableLog("scan");
	ns.disableLog("sleep");
	ns.clearLog();
	ns.tail();

	var table = new Table.Table(ns);
	table.addColumn('Hostname', 18, 'left');
	table.addColumn('IP', 8, 'right');
	table.addColumn('Memory (GiB)', 17, 'centre');
	table.addColumn('Diff', 6, 'right');
	table.addColumn('Cash', 6, 'right');
	table.addColumn('AD', 2, 'right');
	table.addColumn('BD', 2, 'right');
	table.addColumn('SS', 2, 'right');
	table.addColumn('FT', 2, 'right');
	table.addColumn('SM', 2, 'right');
	table.addColumn('HT', 2, 'right');
	table.addColumn('SQ', 2, 'right');

	while (true)
	{
		fetchHostnames(ns);
		table.clearRows();

		hostnames.forEach((hostname) =>
		{
			var rowData = [];
			var server = ns.getServer(hostname);
			rowData.push(server['hostname']);
			rowData.push(server['ip']);
			var memory = server['ramUsed'].toFixed(0).toString().padStart(7) + " / " + server['maxRam'].toString().padStart(7);
			if (server['maxRam'] === 0) memory = '-';
			rowData.push(memory);
			var difficulty = (server['hackDifficulty'] - server['minDifficulty']).toFixed(2);
			if (difficulty < 0) difficulty = '-';
			rowData.push(difficulty);
			var cash = ((100 / server['moneyMax']) * server['moneyAvailable']).toFixed(2) + "%";
			if (server['moneyAvailable'] == server['moneyMax']) cash = '100%';
			if (server['moneyMax'] === 0) cash = '-';
			rowData.push(cash);
			rowData.push(server['hasAdminRights'] ? '■■' : '  ');
			rowData.push(server['backdoorInstalled'] ? '■■' : '  ');
			rowData.push(server['sshPortOpen'] ? '■■' : '  ');
			rowData.push(server['ftpPortOpen'] ? '■■' : '  ');
			rowData.push(server['smtpPortOpen'] ? '■■' : '  ');
			rowData.push(server['httpPortOpen'] ? '■■' : '  ');
			rowData.push(server['sqlPortOpen'] ? '■■' : '  ');
			table.addRow(rowData);
		});

		ns.clearLog();
		ns.print(table.generate());
		await ns.sleep(1000);
	}
}

function fetchHostnames(ns)
{
	var data = ns.read(HOSTNAMES_DATA_PATH);
    hostnames = JSON.parse(data);
}
