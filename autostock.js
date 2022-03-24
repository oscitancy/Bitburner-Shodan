// Literally the laziest way I could think off to automate buying and selling stocks.
// Buy when it goes up, sell when it goes down.
// Fully /r/wallstreetbets approved.

const FORECAST_BUY = 0.62;
const FORECAST_SELL = 0.58;

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog('disableLog');
    ns.disableLog('sleep');
    ns.tail();

    var player = ns.getPlayer();
    if(!player.hasTixApiAccess || !player.has4SDataTixApi)
    {
        ns.print("This script requires the 4S TIX API.");
        ns.exit();
    }

    var symbols = ns.stock.getSymbols();
    while (true)
    {
        symbols.forEach((symbol) =>
        {
            var position = ns.stock.getPosition(symbol);
            var forecast = ns.stock.getForecast(symbol);
            var hasStocks = position[0] > 0;
            var highForecast = forecast >= FORECAST_BUY;
            var lowForecast  = forecast <  FORECAST_SELL;
            if (hasStocks)
            {
                ns.printf("Symbol: %s Forecast: %s",
                    symbol.padEnd(5),
                    forecast.toFixed(6)
                );
                if (lowForecast)
                {
                    ns.stock.sell(symbol, position[0]);
                    ns.print("Emergency sold stocks: " + symbol);
                }
            }
            else
            {
                if (highForecast)
                {
                    var amount = ns.stock.getMaxShares(symbol);
                    ns.stock.buy(symbol, amount);
                    ns.print("Buying stocks: " + symbol);
                }
            }
        });
        await ns.sleep(4000);
    }
}
