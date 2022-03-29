const STOCK_DATA_PATH = '/data/stocks.dat';
const STOCK_MANAGER_SCRIPT = 'stockman.js';

/** @param {NS} ns **/
export async function main(ns)
{
    var player = ns.getPlayer();
    if(!player.hasTixApiAccess)
    {
        ns.print("This script requires the TIX API.");
        ns.exit();
    }
    if(!player.has4SDataTixApi)
    {
        ns.print("This script requires the 4S Data TIX API.");
        ns.exit();
    }

    var stockData = new Array();
    var symbols = ns.stock.getSymbols();
    symbols.forEach((symbol) =>
    {
        var maxShares = ns.stock.getMaxShares(symbol);
        var volatility = ns.stock.getVolatility(symbol) * 100;
        stockData.push({symbol, maxShares, volatility});
    });
    var json = JSON.stringify(stockData);
    ns.kill(STOCK_MANAGER_SCRIPT, 'home')
    await ns.write(STOCK_DATA_PATH, json, 'w');
    ns.spawn(STOCK_MANAGER_SCRIPT);
}
