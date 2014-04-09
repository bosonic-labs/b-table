(function () {
    var BTablePrototype = Object.create(HTMLElement.prototype, {
            data: {
                enumerable: true,
                set: function (data) {
                    this.render(data);
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    this.table = document.createElement('table');
                    this.appendChild(this.table);
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
                    var row = this.table.insertRow(index);
                    rowData.forEach(function (cellData, cellIndex) {
                        var cell = row.insertCell(cellIndex), cellContent = document.createTextNode(cellData);
                        cell.appendChild(cellContent);
                    });
                }
            }
        });
    window.BTable = document.registerElement('b-table', { prototype: BTablePrototype });
    Object.defineProperty(BTable.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLElement.prototype
    });
    Object.defineProperty(BTablePrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());