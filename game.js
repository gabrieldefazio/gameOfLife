'use strict';

var gameOfLife = {

  width: 25,
  height: 25,
  stepInterval: null,

  createAndShowBoard: function () {
    var goltable = document.createElement("tbody");
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    var board = document.getElementById('board');
    board.appendChild(goltable);
    this.setupBoardEvents();
  },

  getCell: function(row, col) {
    let theCell = document.getElementById(`${col}-${row}`);
    if(!theCell) return null;
    theCell.row = row;
    theCell.col = col;
    return theCell;
  },

  forEachCell: function (iteratorFunc) {
    for(let col = 0; col < this.width; col++) {
      for(let row = 0; row < this.height; row++) {
        let theCell = this.getCell(row, col);
        iteratorFunc(theCell, row, col)
      }
    }
  },

  neighborhood : function(cell) {
    let neighbors = [];
    for (let col = cell.col - 1; col <= cell.col + 1; col++) {
      for (let row = cell.row -1; row <= cell.row + 1; row++) {
        let thisCell = this.getCell(row, col);
        if (thisCell !== cell) neighbors.push(thisCell);
      }
    }
    return neighbors;
  },

  setupBoardEvents: function() {
    let self = this;
    let onCellClick = function (e) {
      if (this.dataset.status == 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
    };

    this.forEachCell((cell) => cell.addEventListener('click', onCellClick));
    window.step_btn.addEventListener('click', (e)=> self.step())
    window.play_btn.addEventListener('click', (e)=> self.enableAutoPlay())
    window.clear_btn.addEventListener('click', (e)=> self.clear());
    window.reset_btn.addEventListener('click', (e)=> self.randomize());
  },

  getNextState : function(cell, row, col) {
    let livingNeighbors = this.neighborhood(cell).map((cell)=>{
      if(cell) return cell.dataset.status === 'dead' ? 0 : 1
      else return 0;
    }).reduce((a,c)=>a+c);
    if (cell.dataset.status === 'dead') return (livingNeighbors === 3);
    else return (livingNeighbors === 2 || livingNeighbors === 3)
  },

  applyState: function(state) {
    this.forEachCell((cell)=>{
      let status = state.shift() ? 'alive' : 'dead';
      cell.className = status;
      cell.dataset.status = status;
    })
  },

  step: function (cell) {
    let state = []
    this.forEachCell(cell=> {
      state.push(this.getNextState(cell))
    })
    this.applyState(state)
  },

  enableAutoPlay: function () {
    if(this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
    } else this.stepInterval = setInterval(() => this.step(), 300)
  },

  clear : function() {
    if (this.stepInterval) {
      clearInterval(this.stepInterval);
      this.stepInterval = null;
      this.forEachCell((cell) => {
        cell.className = 'dead';
        cell.dataset.status = 'dead';
      })
    }
  },

  randomize : function() {
    this.forEachCell((cell) => {
      cell.className = (!!Math.floor((Math.random() * 100) % 2)) ? 'dead' : 'alive';
      cell.dataset.status = (!!Math.floor((Math.random() * 100) % 2)) ? 'dead' : 'alive';
    })
  }
};

gameOfLife.createAndShowBoard();
gameOfLife.randomize()