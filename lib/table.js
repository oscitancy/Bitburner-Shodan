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
	ns.tprint("This module should be imported for use in another script and not run directly.");
}

export class Table
{
	constructor (ns)
	{
		this._ns = ns;
		this._top = "";
		this._header = "";
		this._seperator = "";
		this._empty = "";
		this._bottom = "";
		this._columns = [];
		this._rows = [];
	}

	generate()
	{
		var table = "";
		table += this._top + "\n";
		table += this._header + "\n";
		table += this._seperator + "\n";
		table += this._buildRows();
		table += this._bottom;
		return table;
	}

	addColumn(columnName, columnWidth, columnAlign)
	{
		if (columnName.length > columnWidth)
		{
			this._ns.tprint("WARNING Column name: " + columnName + " is wider than the column width: " + columnWidth + "!");
		}
		columnAlign = columnAlign.toLowerCase();
		this._columns.push({columnName, columnWidth, columnAlign});
		this._buildPredefinedLines();
	}

	// getColumns()
	// {
	// 	this._ns.print("Get columns is not implemented yet.");
	// }

	// removeColumn(index)
	// {
	// 	//delete this._columns[index];
	// 	this._ns.print("Remove column is not implemented yet.");
	// 	this._buildPredefinedLines();
	// }

	clearRows()
	{
		this._rows = [];
	}

	addRow(rowData)
	{
		this._rows.push(rowData);
	}

	_buildPredefinedLines()
	{
		this._top       = this._buildPredefinedLine(_TABLE_TOP_LEFT, _TABLE_HORIZONTAL, _TABLE_TOP_T, _TABLE_TOP_RIGHT);
		this._header   = this._buildHeader();
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
			var width = this._columns[i]['columnWidth'] + 2
			line += "".padEnd(width, lineFill);
			line += lineSplit;
		}
		line = line.slice(0, line.length-1);
		line += lineEnd;
		return line;
	}

	_limitCellWidth(data, width)
	{
		if (data.length > width)
		{
			return data.slice(0, width-2) + "..";
		}
		return data;
	}

	_alignCellLeft(data, width)
	{
		return " " + data.padEnd(width) + " ";
	}

	_alignCellCentre(data, width)
	{
		var difference = width - data.length;
		var leftPad = Math.floor(difference / 2);
		data = data.padStart(leftPad + data.length);
		return " " + data.padEnd(width) + " ";
	}

	_alignCellCenter(data, width)
	{
		return this._alignCellCentre(data, width);
	}

	_alignCellRight(data, width)
	{
		return " " + data.padStart(width) + " ";
	}

	_buildHeader()
	{
		var line = "";
		var columnCount = this._columns.length;
		line += _TABLE_VERTICAL;
		for (var i = 0; i < columnCount; i++)
		{
			var name = this._columns[i]['columnName'];
			var width = this._columns[i]['columnWidth'];
			if (name == null) name = "";
			if (width == null) width = 2;
			name = this._limitCellWidth(name, width);
			line += this._alignCellCentre(name, width);
			line += _TABLE_VERTICAL;
		}
		line = line.slice(0, line.length-1);
		line += _TABLE_VERTICAL;
		return line;
	}

	_buildRow(rowData, width, alignment)
	{
		var line = "";
		var columnCount = this._columns.length;
		line += _TABLE_VERTICAL;
		for (var i = 0; i < columnCount; i++)
		{
			var cell = rowData[i];
			if (cell == null) cell = "  ";
			var width = this._columns[i]['columnWidth'];
			var alignment = this._columns[i]['columnAlign'];
			cell = this._limitCellWidth(cell, width);
			switch (alignment)
			{
				case 'left':
					line += this._alignCellLeft(cell, width);
					break;
				case 'centre':
					line += this._alignCellCentre(cell, width);
					break;
				case 'center':
					line += this._alignCellCentre(cell, width);
					break;
				case 'right':
					line += this._alignCellRight(cell, width);
					break;
				default:
					this._ns.print("wtf");
					line += this._alignCellLeft(cell, width);
			}
			line += _TABLE_VERTICAL;
		}
		line = line.slice(0, line.length-1);
		line += _TABLE_VERTICAL;
		line += "\n";
		return line;
	}
	_buildRows()
	{
		var rows = "";
		this._rows.forEach((row) =>
		{
			rows += this._buildRow(row);
		});
		return rows;
	}
}
