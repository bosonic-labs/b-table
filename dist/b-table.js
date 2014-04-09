(function () {
    var BTablePrototype = Object.create(HTMLTableElement.prototype, {
            data: {
                enumerable: true,
                set: function (data) {
                    this.render(data);
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                }
            },
            render: {
                enumerable: true,
                value: function (data) {
                    data.forEach(function (row, index) {
                        this.renderRow(row, index);
                    }, this);
                }
            },
            renderRow: {
                enumerable: true,
                value: function (rowData, index) {
                    var row = this.insertRow(index);
                    rowData.forEach(function (cellData, cellIndex) {
                        var cell = row.insertCell(cellIndex), cellContent = document.createTextNode(cellData);
                        cell.appendChild(cellContent);
                    });
                }
            }
        });
    window.BTable = document.registerElement('b-table', {
        prototype: BTablePrototype,
        extends: 'table'
    });
    Object.defineProperty(BTable.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLTableElement.prototype
    });
}());