import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet, Modal, TouchableHighlight } from 'react-native';
import {Button, Text, Icon} from 'native-base';
const COLS = 9;
const ROWS = 9;
//test
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      showAll: false,
      totalMines: '',
      failed: false,
      secondsCounter: 0,
    };
    this.handleAttempt = this.handleAttempt.bind(this);
    this.setUpGrid = this.setUpGrid.bind(this);
    this.tick = this.tick.bind(this);
    this.exposeFurther = this.exposeFurther.bind(this);
  }

  componentDidMount() {
    this.setUpGrid();
  }

  setUpGrid() {
    let arr = new Array(COLS);
    for (let p = 0; p < arr.length; p++) {
      arr[p] = new Array(ROWS);
    }
    for (let q = 0; q < COLS; q++) {
      for (let r = 0; r < ROWS; r++) {
        let currentCell = {
          cellId: q + '_' + r,
          isMine: Math.random() < 0.2,
          position: [q, r],
          revealed: false,
          neighborsWithMine: '',
          isClicked: false,
        };
        arr[q][r] = currentCell;
      }
    }

    const arrWithCounts = [];
    let totalMines = 0;
    for (let x = 0; x < COLS; x++) {
      const rowsArray = [];
      for (let y = 0; y < ROWS; y++) {
        let data = Object.assign({}, arr[x][y]);
        if (data.isMine) {
          totalMines = totalMines + 1;
        }
        let gridObj = [...arr];
        const i = data.position[0];
        const j = data.position[1];
        const neighbours = [];
        let minedNeighbourCount = 0;
        if (i > 0 && j > 0) {
          neighbours.push(gridObj[i - 1][j - 1]);
        }

        if (i > 0 && j >= 0) {
          neighbours.push(gridObj[i - 1][j]);
        }
        if (i > 0 && j < COLS - 1) {
          neighbours.push(gridObj[i - 1][j + 1]);
        }

        if (i >= 0 && j > 0) {
          neighbours.push(gridObj[i][j - 1]);
        }

        if (i >= 0 && j < COLS - 1) {
          neighbours.push(gridObj[i][j + 1]);
        }
        if (i < ROWS - 1 && j > 0) {
          neighbours.push(gridObj[i + 1][j - 1]);
        }

        if (i < ROWS - 1 && j >= 0) {
          neighbours.push(gridObj[i + 1][j]);
        }

        if (i < ROWS - 1 && j < COLS - 1) {
          neighbours.push(gridObj[i + 1][j + 1]);
        }

        neighbours.forEach((e) => {
          if (e.isMine) {
            minedNeighbourCount = minedNeighbourCount + 1;
          }
        });
        data.neighborsWithMine = minedNeighbourCount || '';
        rowsArray.push(data);
      }
      arrWithCounts.push(rowsArray);
    }
    this.setState({
      showAll: false,
      failed: false,
      totalMines: totalMines,
      grid: arrWithCounts || [],
      secondsCounter: 0,
      timerStarted: false,
      timeTaken: ''
    });
  }

  handleAttempt(data) {
    if (!this.state.timerStarted) {
      this.intervalID = setInterval(() => {
        this.tick();
      }, 1000);
    }
    if (data && data.isMine) {
      const { secondsCounter } = this.state;
      this.setState({showAll: true, failed: true, timeTaken: secondsCounter, secondsCounter: 0 });
      clearInterval(this.intervalID);
    } else if (data && data.position) {
      const currentRow = data.position && data.position[0];
      const currentColumn = data.position[1];
      try {
        let gridObj = [...this.state.grid];
        let temp = Object.assign({}, data, {revealed: true, isClicked: true });
        gridObj[currentRow][currentColumn] = temp;
        if (!temp.neighborsWithMine) {
          this.exposeFurther(gridObj, currentRow, currentColumn, (finalData) => {
            this.setState({grid: finalData, timerStarted: true, timeTaken: ''});
          });
        } else {
          this.setState({grid: gridObj, timerStarted: true, timeTaken: ''});
        }
      } catch (ex) {}
    }
  }
  exposeFurther(arr, x, y, callback, isRetry) {
    let gridObj = [...arr];
    // check neighbors;
    let neighbor
    let i = x; 
    let j = y;
    let secondaryCheck = [];
    if (i > 0 && j > 0) {
      neighbor = gridObj[i - 1][j - 1]
      if (!neighbor.isMine) {
        neighbor.revealed = true;
      }
      if (!neighbor.neighborsWithMine) {
        secondaryCheck.push(neighbor.position)
      }
      gridObj[i - 1][j - 1] = neighbor;
      neighbor = {}
    }

    if (i > 0 && j >= 0) {
      neighbor = gridObj[i - 1][j]
      if (!neighbor.isMine) {
        neighbor.revealed = true;
      }
      if (!neighbor.neighborsWithMine) {
        secondaryCheck.push(neighbor.position)
      }
      gridObj[i - 1][j] = neighbor;
      neighbor = {}
    }
    if (i > 0 && j < COLS - 1) {
      neighbor = gridObj[i - 1][j + 1]
      if (!neighbor.isMine) {
        neighbor.revealed = true;
      }
      if (!neighbor.neighborsWithMine) {
        secondaryCheck.push(neighbor.position)
      }
      gridObj[i - 1][j + 1] = neighbor;
      neighbor = {}
    }

    if (i >= 0 && j > 0) {
      neighbor = gridObj[i][j - 1]
      if (!neighbor.isMine) {
        neighbor.revealed = true;
      }
      if (!neighbor.neighborsWithMine) {
        secondaryCheck.push(neighbor.position)
      }
      gridObj[i][j - 1] = neighbor;
      neighbor = {}
    }

    if (i >= 0 && j < COLS - 1) {
      neighbor = gridObj[i][j + 1]
      if (!neighbor.isMine) {
        neighbor.revealed = true;
      }
      if (!neighbor.neighborsWithMine) {
        secondaryCheck.push(neighbor.position)
      }
      gridObj[i][j + 1] = neighbor;
      neighbor = {}
    }
    if (i < ROWS - 1 && j > 0) {
      neighbor = gridObj[i + 1][j - 1]
      if (!neighbor.isMine) {
        neighbor.revealed = true;
      }
      if (!neighbor.neighborsWithMine) {
        secondaryCheck.push(neighbor.position)
      }
      gridObj[i + 1][j - 1] = neighbor;
      neighbor = {}
    }

    if (i < ROWS - 1 && j >= 0) {
      neighbor = gridObj[i + 1][j]
      if (!neighbor.isMine) {
        neighbor.revealed = true;
      }
      if (!neighbor.neighborsWithMine) {
        secondaryCheck.push(neighbor.position)
      }
      gridObj[i + 1][j] = neighbor;
      neighbor = {}
    }

    if (i < ROWS - 1 && j < COLS - 1) {
      neighbor = gridObj[i + 1][j + 1]
      if (!neighbor.isMine) {
        neighbor.revealed = true;
      }
      if (!neighbor.neighborsWithMine) {
        secondaryCheck.push(neighbor.position)
      }
      gridObj[i + 1][j + 1] = neighbor;
      neighbor = {}
    }
    callback && callback(gridObj)
  }

  tick() {
    let sec = JSON.parse(JSON.stringify(this.state.secondsCounter));
    this.setState({
      secondsCounter: parseInt(sec) + 1,
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    const {grid, showAll, totalMines, failed, secondsCounter, timeTaken } = this.state;
    return (
      <SafeAreaView>
        <Text style={styles.mainTitle}>{'Minesweeper'}</Text>
        <View style={styles.mainView}>
        <Button small style={styles.minesButton}>
            <Text>{'Mines: ' + totalMines}</Text>
        </Button>
        <Button
          onPress={() => {
            this.setUpGrid();
            clearInterval(this.intervalID);
          }}
          small
          style={[styles.emojiButton, {backgroundColor: failed ? 'red' : 'blue'}]}>
          <Icon name={failed ? 'emoji-sad' : 'emoji-happy'} type={'Entypo'}/>
        </Button>
        <Button small style={{
            alignSelf: 'flex-start',
            backgroundColor: failed ? 'red' : 'blue',
            width: 50
          }}>
            <Text>{timeTaken || secondsCounter}</Text>
        </Button>
        </View>
        {grid.map((row, index) => {
          return (
            <View
              key={index + 'first'}
              style={styles.cellView}>
              {row &&
                row.map((c) => {
                  let myTitle = '';
                  if (c.isMine) {
                    myTitle = 'X';
                  } else {
                    myTitle = c.neighborsWithMine ? (c.neighborsWithMine + '') : '';
                  }
                  return (
                    <View
                      style={styles.rowContainer}
                      key={c.cellId + 'SubRow'}>
                      <Button
                        style={[styles.cellButton, { backgroundColor: (c.revealed || showAll) && c.isMine ? 'red' : c.isClicked && !c.neighborsWithMine ? '#d3d3d3': 'transparent'}]}
                        onPress={() => this.handleAttempt(c)}
                        disabled={c.isClicked}>
                        <Text style={{color: !c.isMine ? 'blue' : null, fontWeight: 'bold'}}>
                          {c.revealed || showAll ? myTitle : ''}
                        </Text>
                      </Button>
                    </View>
                  );
                })}
            </View>
          );
        })}
      </SafeAreaView>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  mainTitle: {textAlign: 'center', fontWeight: 'bold', marginBottom: 50},
  mainView: {
    alignItems: 'flex-start', 
    justifyContent: 'space-around', 
    flexDirection: 'row', 
    marginVertical: 10
  },
  minesButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'blue',
  },
  emojiButton: {
    // alignSelf: 'center',
    // alignContent: 'center',
    justifyContent: 'center',
    width: '20%'
  },
  rowContainer: {
    borderWidth: 1,
    borderColor: 'white',
    flex: 1,
    height: 50,
    backgroundColor: '#D3D3D3',
    borderBottomRightRadius: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cellView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderColor: 'black',
    borderWidth: 0,
  },
  cellButton: {
    height: 50,
    width: '100%',
  }

})
