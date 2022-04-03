const MAX_RAM = 1048576;

var player = null;
var servers = null;

/** @param {import(".").NS } ns */
export async function main(ns)
{
    ns.tail();
    ns.clearLog();
    player = ns.getPlayer();
	servers = ns.getPurchasedServers();

    if (servers.length < 25)
    {
        var name = "sv-" + (servers.length + 1).toString().padStart(2, '0');
        var level = getMaxAffordableLevel(ns);
        if (level > 0) purchaseAServer(ns, name, level);
    }
    else
    {
        servers.forEach((server) =>
        {
            var upgradeLevel = getMaxAffordableLevel(ns);
            var upgradeRam = Math.pow(2, upgradeLevel);
            if (upgradeRam < MAX_RAM) upgradeAServer(ns, server, upgradeLevel);
        });
    }
}

function getMaxAffordableLevel(ns)
{
    var level = 20;
    while(ns.getPurchasedServerCost(Math.pow(2, level)) > (player.money * 0.1) && level > 1)
    {
        level--;
    }
    return level;
}

function purchaseAServer(ns, name, level)
{
    var money = player.money;
    var level = 20;
    if (getMaxAffordableLevel(ns) > 0)
    {
        ns.purchaseServer(name, Math.pow(2, level));
    }
    ns.exec('/tools/map.js', 'home', 1, 'silent');
}

function upgradeAServer(ns, name, level)
{
    ns.deleteServer(name);
    purchaseAServer(ns, name, level);
}
