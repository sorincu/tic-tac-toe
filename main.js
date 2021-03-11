const DOM = (() => {
    return {
        // Get radio buttons
        oppRadio: document.querySelectorAll('input[name="opp"]'),
        signRadio: document.querySelectorAll('input[name="sign"]'),
        rbDisplay: document.querySelector('.radio-buttons'),
        winnerBanner: document.querySelector('#winner'),

        // New game button
        newGame: document.querySelector('#new-game'),

        boardContainer: document.querySelector('#gameboard'),

        getCells: () => {
			return DOM.boardContainer.querySelectorAll('.cell');
		},

        newCell: (content) => {
			const cell = document.createElement('div');
			cell.className = 'cell';
			cell.innerHTML = content;
			return cell;
		},

        newCellInner: (mark) => {
			return `<span>${mark}</span>`;
		},

        clearBoard: () => {
			DOM.getCells().forEach((cell) => {
				DOM.boardContainer.removeChild(cell);
			});
		},
        
        render: function (board) {
            DOM.clearBoard();
            board.forEach((cell) => {
                DOM.boardContainer.appendChild(
                    DOM.newCell(DOM.newCellInner(cell.mark))
                )
            })
        },

        winDisplay: function (winner) {
			if (winner) {
				this.winnerBanner.textContent = `${winner} wins!`;
			} else {
				this.winnerBanner.textContent = "It's a tie!";
			}
			const playAgainContainer = document.createElement('div');
			playAgainContainer.className = 'playagaincontainer';
			const playAgain = document.createElement('button');
			playAgain.textContent = 'Play Again';
			playAgain.className = 'playagain';
			playAgainContainer.appendChild(playAgain);
			this.winnerBanner.appendChild(playAgainContainer);
			playAgain.addEventListener('click', () => {
				location.reload();
				return false;
			});
		}
    }
})();

const Gameboard = (() => {
    const board = [];
    const cell = {
        mark: ''
    };

    const getBoard = () => {
		return board;
	};

    const newMarker = (mark, index) => {
        board[index] = { mark };
        DOM.render(board);
    }

    const init = () => {
		for (let i = 1; i <= 9; i++) {
			board.push(cell);
		}
		DOM.render(getBoard());
	};

    return {
		getBoard,
		init,
		newMarker,
	};
})();

const Controller = (() => {
    const player1 = {
		name: 'Player 1',
		marker: 'X',
		type: '',
	};

    const player2 = {
		name: 'Player 2',
		marker: 'O',
		type: '',
	};

	const init = () => {
        DOM.newGame.addEventListener('click', () => {
            for (const rb of DOM.signRadio) {
                if (rb.checked) {
                    if (rb.value == player1.marker)
                        player1.type = 'human';
                    else player2.type = 'human';
                }
            }

            for (const rb of DOM.oppRadio) {
                if (rb.checked) {
                    if (player1.type == '')
                        player1.type = rb.value;
                    else player2.type = rb.value;
                }
            }
  
            if (selectionCheck()) {
                startGame();
            } else {
                alert('Please select your options !');
            }
        });
	};

    const selectionCheck = () => {
		return Boolean(player1.type && player2.type);
	};

    let player1turn = true;

    playerToggle = () => {
		player1turn = !player1turn;
	};

    const startGame = () => {
		DOM.rbDisplay.style.display = 'none';
        DOM.newGame.style.display = 'none';
        DOM.boardContainer.style.display = 'grid'; 
		Gameboard.init();
		takeTurn();
	};

	const checkWinner = () => {
		const board = Gameboard.getBoard();
		const winConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		if (
			winConditions.some((array) => {
				let winCheck = [];
				array.forEach((box) => {
					if (board[box].mark !== '') {
						winCheck.push(board[box]);
					}
				});
				if (winCheck.length == 3) {
					if (
						winCheck.every((cell) => {
							return cell.mark == 'X';
						})
					) {
						DOM.winDisplay(player1.name);
						return true;
					} else if (
						winCheck.every((cell) => {
							return cell.mark == 'O';
						})
					) {
						DOM.winDisplay(player2.name);
						return true;
					} else {
						return false;
					}
				}
			})
		) {
			return true;
		} else if (
			board.filter((cell) => {
				return cell.mark !== '';
			}).length == 9
		) {
			DOM.winDisplay();
			return true;
		} else return false;
	};

    const computerPlay = (marker) => {
		let choices = Gameboard.getBoard().map((cell, index) => {
			if (cell.mark !== '') {
				return false;
			} else {
				return index;
			}
		});

		choices = choices.filter((item) => {
			return item !== false;
		});

		const selection = Math.floor(Math.random() * choices.length);
		Gameboard.newMarker(marker, choices[selection]);
		playerToggle();
		takeTurn();
	};

	const humanPlay = (marker) => {
		DOM.getCells().forEach((cell) => {
			cell.addEventListener('click', (e) => {
				if (e.currentTarget.textContent == '') {
					const index = Array.from(e.currentTarget.parentNode.children).indexOf(
						e.currentTarget
					);
					Gameboard.newMarker(marker, index);
					playerToggle();
					takeTurn();
				}
			});
		});
	};

	const takeTurn = () => {
		if (!checkWinner()) {
			let player;
			if (player1turn) {
				player = player1;
			} else {
				player = player2;
			}

			if (player.type == 'computer') {
				computerPlay(player.marker);
			} else {
				humanPlay(player.marker);
			}
		} else console.log('Winner found, stopping game');
	};

    init();

	return {
		player1,
		player2,
	};
})();