import Game, { Direction } from './entities/game';

// Ask the user for input
// Move the snake
// on each move,
// If move allowed
// Where the current head
// Length of snake

const convertDirection = (input: string): Direction | null => {
  if (input.toLowerCase() === 'w') return Direction.UP;
  else if (input.toLowerCase() === 'a') return Direction.LEFT;
  else if (input.toLowerCase() === 's') return Direction.DOWN;
  else if (input.toLowerCase() === 'd') return Direction.RIGHT;

  return null;
};

// Game of 3x3
// snake length of 2

const game = new Game(3, 3, 2);

console.log('Welcome to Snake game');
console.log('Use these keys for playing');
console.log('W => UP');
console.log('A => LEFT');
console.log('S => DOWN');
console.log('D => RIGHT');

console.log('-----------------');
console.log('Snake Length: ' + game.getSnake().getSize());
console.log(
  `Snake Head: (${game.getSnake().getHead()?.row},${
    game.getSnake().getHead()?.col
  })`
);
console.log('-----------------');
while (true) {
  console.log('Enter your Move: ');

  let input = '';
  for await (const line of console) {
    console.log(`You typed: ${line}`);
    input = line;
    break;
  }

  const direction = convertDirection(input);
  console.log('-----------------');
  console.log('Direction: ' + direction);
  if (direction === null) {
    console.log('Sorry invalid input. Please try again');
    continue;
  }

  const nextCell = game.getUserMove(direction);

  if (!nextCell) {
    console.log('Sorry u have reached board end. Please try again');
    continue;
  }

  const moveResult = game.play(nextCell);

  if (moveResult) {
    console.log('Sorry u crashed. Game over !!!');
    break;
  } else {
    console.log('Snake Length: ' + game.getSnake().getSize());
    console.log(
      `Snake Head: (${game.getSnake().getHead()?.row},${
        game.getSnake().getHead()?.col
      })`
    );
  }
  console.log('-----------------');
}
