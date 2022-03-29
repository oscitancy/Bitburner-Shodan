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

	addColumn(columnName, columncolumnWidth, columnAlign)
	{
		if (columnName.length > columncolumnWidth)
		{
			this._ns.tprint("WARNING Column name: " + columnName + " is wider than the column columnWidth: " + columncolumnWidth + "!");
		}
		columnAlign = columnAlign.toLowerCase();
		this._columns.push({columnName, columncolumnWidth, columnAlign});
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
			var columnWidth = this._columns[i]['columncolumnWidth'] + 2
			line += "".padEnd(columnWidth, lineFill);
			line += lineSplit;
		}
		line = line.slice(0, line.length-1);
		line += lineEnd;
		return line;
	}

	_limitCellColumnWidth(data, columnWidth)
	{
		if (data.length > columnWidth)
		{
			return data.slice(0, columnWidth-2) + "..";
		}
		return data;
	}

	_alignCellLeft(data, columnWidth)
	{
		return " " + data.padEnd(columnWidth) + " ";
	}

	_alignCellCentre(data, columnWidth)
	{
		var difference = columnWidth - data.length;
		var leftPad = Math.floor(difference / 2);
		data = data.padStart(leftPad + data.length);
		return " " + data.padEnd(columnWidth) + " ";
	}

	_alignCellCenter(data, columnWidth)
	{
		return this._alignCellCentre(data, columnWidth);
	}

	_alignCellRight(data, columnWidth)
	{
		return " " + data.padStart(columnWidth) + " ";
	}

	_buildHeader()
	{
		var line = "";
		var columnCount = this._columns.length;
		line += _TABLE_VERTICAL;
		for (var i = 0; i < columnCount; i++)
		{
			var name = this._columns[i]['columnName'];
			var columnWidth = this._columns[i]['columncolumnWidth'];
			if (name == null) name = "";
			if (columnWidth == null) columnWidth = 2;
			name = this._limitCellColumnWidth(name, columnWidth);
			line += this._alignCellCentre(name, columnWidth);
			line += _TABLE_VERTICAL;
		}
		line = line.slice(0, line.length-1);
		line += _TABLE_VERTICAL;
		return line;
	}

	_buildRow(rowData, columnWidth, alignment)
	{
		var line = "";
		var columnCount = this._columns.length;
		line += _TABLE_VERTICAL;
		for (var i = 0; i < columnCount; i++)
		{
			var cell = rowData[i].toString();
			if (cell == null) cell = "  ";
			var columnWidth = this._columns[i]['columncolumnWidth'];
			var alignment = this._columns[i]['columnAlign'];
			cell = this._limitCellColumnWidth(cell, columnWidth);
			switch (alignment)
			{
				case 'left':
					line += this._alignCellLeft(cell, columnWidth);
					break;
				case 'centre':
					line += this._alignCellCentre(cell, columnWidth);
					break;
				case 'center':
					line += this._alignCellCentre(cell, columnWidth);
					break;
				case 'right':
					line += this._alignCellRight(cell, columnWidth);
					break;
				default:
					this._ns.print("wtf");
					line += this._alignCellLeft(cell, columnWidth);
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
