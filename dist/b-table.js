(function () {
    var BTableColumnTogglePrototype = Object.create(HTMLElement.prototype, {
            table: {
                enumerable: true,
                get: function () {
                    return document.getElementById(this.getAttribute('for'));
                }
            },
            thead: {
                enumerable: true,
                get: function () {
                    if (!this.table)
                        return;
                    return this.table.querySelector('thead');
                }
            },
            hiddenColumns: {
                enumerable: true,
                get: function () {
                    return [].filter.call(this.querySelectorAll('input'), function (input) {
                        return !input.checked;
                    }).map(function (input) {
                        return input.dataset;
                    });
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    if (!this.table)
                        return;
                    if (this.table.data) {
                        this.render();
                    } else {
                        this.renderListener = this.render.bind(this);
                        this.table.addEventListener('data-set', this.renderListener);
                    }
                }
            },
            render: {
                enumerable: true,
                value: function () {
                    if (this.renderListener) {
                        this.table.removeEventListener('data-set', this.renderListener);
                    }
                    if (!this.thead || !this.thead.columns)
                        return;
                    this.thead.columns.forEach(function (col) {
                        var label = document.createElement('label'), input = document.createElement('input');
                        input.type = 'checkbox';
                        input.checked = true;
                        input.dataset.key = col.key;
                        input.dataset.index = col.index;
                        label.appendChild(input);
                        label.appendChild(document.createTextNode(col.label));
                        this.appendChild(label);
                        input.addEventListener('change', this.toggle.bind(this), false);
                    }, this);
                    this.table.addEventListener('data-change', this.restoreHiddenColumns.bind(this));
                }
            },
            toggle: {
                enumerable: true,
                value: function (e) {
                    this.toggleDisplay(e.target.dataset.key, e.target.dataset.index, e.target.checked);
                }
            },
            toggleDisplay: {
                enumerable: true,
                value: function (key, index, show) {
                    var display = show ? 'table-cell' : 'none';
                    th = this.thead.querySelector('th[data-key="' + key + '"]');
                    th.style.display = display;
                    [].forEach.call(this.table.querySelectorAll('td[data-index="' + index + '"]'), function (cell) {
                        cell.style.display = display;
                    });
                }
            },
            restoreHiddenColumns: {
                enumerable: true,
                value: function () {
                    this.hiddenColumns.forEach(function (col) {
                        this.toggleDisplay(col.key, col.index, false);
                    }, this);
                }
            }
        });
    window.BTableColumnToggle = document.registerElement('b-table-column-toggle', { prototype: BTableColumnTogglePrototype });
}());
(function () {
    var BTablePrototype = Object.create(HTMLTableElement.prototype, {
            sortable: {
                enumerable: true,
                get: function () {
                    return this.hasAttribute('sortable');
                }
            },
            data: {
                enumerable: true,
                get: function () {
                    return this._data;
                },
                set: function (data) {
                    var event = this._data ? 'data-change' : 'data-set';
                    this._data = data;
                    this.render(data);
                    this.dispatchEvent(new CustomEvent(event));
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
                    var oldTbody = this.querySelector('tbody');
                    if (oldTbody) {
                        this.removeChild(oldTbody);
                    }
                    var tbody = document.createElement('tbody');
                    this.appendChild(tbody);
                    data.forEach(function (row, index) {
                        this.renderRow(tbody, row, index);
                    }, this);
                }
            },
            renderRow: {
                enumerable: true,
                value: function (tbody, rowData, index) {
                    var row = tbody.insertRow(index);
                    if (Array.isArray(rowData)) {
                        rowData.forEach(function (cellData, cellIndex) {
                            this.renderCell(row, cellData, cellIndex);
                        }, this);
                    } else {
                        Object.keys(rowData).forEach(function (key, cellIndex) {
                            this.renderCell(row, rowData[key], cellIndex);
                        }, this);
                    }
                }
            },
            renderCell: {
                enumerable: true,
                value: function (row, cellData, cellIndex) {
                    var cell = row.insertCell(cellIndex), cellContent = document.createTextNode(cellData);
                    cell.appendChild(cellContent);
                    cell.dataset.index = cellIndex;
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
(function () {
    var BTheadPrototype = Object.create(HTMLTableSectionElement.prototype, {
            data: {
                enumerable: true,
                get: function () {
                    return this.parentNode.data;
                }
            },
            columns: {
                enumerable: true,
                get: function () {
                    return [].map.call(this.querySelectorAll('th'), function (th, index) {
                        return {
                            index: index,
                            key: th.dataset.key,
                            label: th.querySelector('button').textContent
                        };
                    });
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    if (this.parentNode.sortable) {
                        this.addSortListeners();
                    }
                }
            },
            sort: {
                enumerable: true,
                value: function (e) {
                    var old = this.querySelector('th[sort]'), th = e.target.parentNode, key = th.dataset.key, direction = th.getAttribute('sort') === 'desc' ? 'asc' : 'desc';
                    if (old) {
                        old.removeAttribute('sort');
                    }
                    th.setAttribute('sort', direction);
                    var sorted = this.data.sort(function (a, b) {
                            if (a[key] > b[key])
                                return 1;
                            if (a[key] < b[key])
                                return -1;
                            return 0;
                        });
                    if (direction === 'asc')
                        sorted.reverse();
                    this.parentNode.data = sorted;
                }
            },
            addSortListeners: {
                enumerable: true,
                value: function () {
                    var buttons = this.querySelectorAll('th button');
                    for (var i = 0; i < buttons.length; i++) {
                        buttons[i].addEventListener('click', this.sort.bind(this), false);
                    }
                }
            }
        });
    window.BThead = document.registerElement('b-thead', {
        prototype: BTheadPrototype,
        extends: 'thead'
    });
    Object.defineProperty(BThead.prototype, '_super', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: HTMLTableSectionElement.prototype
    });
}());