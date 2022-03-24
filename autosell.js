// Todo: Works for simple AFK emergencies but... Make this not suck.
// A table of all stocks? Perhaps just a log of events for all stocks?

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog('disableLog');
    ns.disableLog('sleep');
	ns.tail();

    var symbol = ns.args[0].toUpperCase();
    if (symbol === null)
    {
        ns.print("Missing stock symbol arg.");
        ns.exit();
    }

    var player = ns.getPlayer();
    if(!player.hasTixApiAccess || !player.has4SDataTixApi)
    {
        ns.print("This script requires the 4S TIX API.");
        ns.exit();
    }
    while (true)
    {
        var position = ns.stock.getPosition(symbol);
        var forecast = ns.stock.getForecast(symbol);
        ns.printf("Stocks: %s  Forecast: %s",position[0].toString().padEnd(10), forecast.toFixed(6));
        if (position[0] > 0 && forecast < 0.6)
        {
            ns.stock.sell(symbol, position[0]);
            ns.print("Emergency sold stocks.");
        }

        // The game says I need some bitnode thing to use the getorders function.
        // Presumably some later game thing.
        //var orders = ns.stock.getOrders();
        //orders.forEach((order) =>
        //{
        //    ns.print(order);
        //});

        await ns.sleep(4000);
    }
}
