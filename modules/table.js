const _TABLE_HORIZONTAL      = "═";
const _TABLE_VERTICAL        = "║";

const _TABLE_TOP_LEFT        = "╔";
const _TABLE_TOP_T           = "╦";
const _TABLE_TOP_RIGHT       = "╗";

const _TABLE_SEPERATOR_LEFT  = "╠";
const _TABLE_SEPERATOR_CROSS = "╬";
const _TABLE_SEPERATOR_RIGHT = "╣";

const _TABLE_BOTTOM_LEFT     = "╚";
const _TABLE_BOTTOM_T        = "╩";
const _TABLE_BOTTOM_RIGHT    = "╝";


/** @param {NS} ns **/
export async function main(ns)
{
	ns.print("This module should be imported for use in another script and not run directly.");
}

class Table
{
	constructor (ns)
	{
		this._ns = ns;
		this._top = "";
		this._seperator = "";
		this._empty = "";
		this._bottom = "";
		this._columns = [];
		this._rows = [];
	}

	addColumn(columnName, columnWidth, columnAlign)
	{
		this._columns.push({columnName, columnWidth, columnAlign});
	}

	getColumns()
	{
		this._ns.print("Get columns is not implemented yet.");
	}

	removeColumn(index)
	{
		//delete this._columns[index];
		this._ns.print("Remove column is not implemented yet.");
	}

	clearRows()
	{
		this._rows = [];
	}

	addRow(rowData)
	{
		this._ns.print();
	}

	_buildPredefinedLines()
	{
		this._top       = this._buildPredefinedLine(_TABLE_TOP_LEFT, _TABLE_HORIZONTAL, _TABLE_TOP_T, _TABLE_TOP_RIGHT);
		this._seperator = this._buildPredefinedLine(_TABLE_SEPERATOR_LEFT, _TABLE_HORIZONTAL, _TABLE_SEPERATOR_CROSS, _TABLE_SEPERATOR_RIGHT);
		this._empty     = this._buildPredefinedLine(_TABLE_VERTICAL, " ", _TABLE_VERTICAL, _TABLE_VERTICAL);
		this._bottom    = this._buildPredefinedLine(_TABLE_BOTTOM_LEFT, _TABLE_HORIZONTAL, _TABLE_BOTTOM_T, _TABLE_BOTTOM_RIGHT);
	}

	_buildPredefinedLine(lineStart, lineFill, lineSplit, lineEnd)
	{
		var line = "";
		var columnCount = this._columns.length;
		line += lineStart;
		for (var i = 0; i < columnCount; i++)
		{
			var width = this._columns[i][2] + 2
			line += "".padEnd(width, lineFill);
			line += lineSplit;
		}
		line = line.slice(0, line.length-1);
		line += lineEnd;
		return line;
	}
}
