import * as Table from "/lib/table.js";

const HISTORY_LENGTH = 10;
const FORECAST_BUY = 0.1;
const FORECAST_SELL = 0.06;

var stockData = null;

/** @param {NS} ns **/
export async function main(ns)
{
    ns.disableLog('disableLog');
    ns.disableLog('sleep');
    ns.tail();

    var rawData = ns.read('/data/stocks.dat');
    stockData = JSON.parse(rawData);
    buildInitialHistory(ns);

    var table = new Table.Table(ns);
	table.addColumn('Symbol', 6, 'left');
	table.addColumn('Shares', 8, 'right');
	table.addColumn('Max', 8, 'right');
    table.addColumn('Price', 10, 'right');
	table.addColumn('History', 10, 'centre');
    table.addColumn('Run Vol', 10, 'right');
    table.addColumn('Forecast', 8, 'right')
    table.addColumn('State', 10, 'right');

    while (true)
    {
        ns.clearLog();
        table.clearRows();
        stockData.forEach((stock) =>
        {
            var symbol = stock['symbol'];
            var shares = ns.stock.getPosition(symbol)[0];
            var maxShares = stock['maxShares'];
            var volatility = stock['volatility'];
            var price = ns.stock.getPrice(symbol);
            var history = stock['history'];
            history.shift();
            history.push(price);
            stock['history'] = history;
            var runningAverage = calculateRunningAverage(history);
            var runningAveragePercentage = (100.0 / price) * runningAverage; //calculateRunningAveragePercentage(volatility, price, runningAverage);
            var runningVolatility = (100.0 / volatility) * runningAveragePercentage;
            var highIncrease = runningVolatility > volatility * 0.25;
            var forecast = ns.stock.getForecast(symbol) - 0.5;
            var highForecast = forecast >= FORECAST_BUY;
            var lowForecast  = forecast <  FORECAST_SELL;
            if (shares > 0)
            {
                //if (lowForecast || runningAverage < 0)
                if (runningVolatility < -0.2 || forecast < FORECAST_SELL)
                {
                    ns.stock.sell(symbol, shares);
                    ns.print("Emergency sold stocks: " + symbol);
                }
            }
            else
            {
                //if (highForecast && runningAverage > 0)
                if (runningVolatility > 0.2 && forecast > FORECAST_BUY)
                {
                    ns.stock.buy(symbol, maxShares);
                    ns.print("Buying stocks: " + symbol);
                }
            }
            table.addRow([
                symbol,
                shares,
                maxShares,
                price.toFixed(2),
                generateHistoryTrack(history),
                runningVolatility.toFixed(2),
                forecast.toFixed(2),
                "--"
            ]);
        });
        ns.print(table.generate());
        await ns.sleep(4000);
    }
}

function buildInitialHistory(ns)
{
    stockData.forEach((stock) =>
    {
        var currentPrice = ns.stock.getPrice(stock['symbol']);
        var history = new Array();
        for (var i = 0; i < HISTORY_LENGTH+1; i++)
        {
            history.push(currentPrice);
        }
        stock['history'] = history;
    });
}

function generateHistoryTrack(history)
{
    var track = "";
    for (var i = 1; i <= HISTORY_LENGTH; i++)
    {
        var rising = history[i] > history[i-1];
        track += (rising) ? '/' : '\\';
    }
    return track;
}

function calculateRunningAverage(history)
{
    var average = 0;
    for (var i = 1; i <= HISTORY_LENGTH; i++)
    {
        var difference = history[i] - history[i-1];
        average += difference;
    }
    average /= HISTORY_LENGTH;
    return average;
}

function calculateRunningAveragePercentage(volatility, price, runningAverage)
{
    var percentage = (100 / price) * runningAverage;
}
