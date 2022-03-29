/** @param {NS} ns **/
export async function main(ns)
{
	if (ns.args.length < 2) { ns.exit(); }

	var target = ns.args[0];
	var methods = ns.args.slice(1);

	methods.forEach((method) =>
	{
		switch (method)
		{
			case 'ssh':
				ns.brutessh(target);
				break;
			case 'ftp':
				ns.ftpcrack(target);
				break;
			case 'smtp':
				ns.relaysmtp(target);
				break;
			case 'http':
				ns.httpworm(target);
				break;
			case 'sql':
				ns.sqlinject(target);
				break;
			case 'nuke':
				ns.nuke(target);
				break;
			default:
				ns.print("Unknown phreak method");
				break;
		}
	});
}
