import { describe, test, expect } from 'bun:test';
import Game, { Direction } from './game';

describe('Game', () => {
  test('should return next cell if allowed', () => {
    // Initialise a board of 3 by 3
    const game = new Game(3, 3, 2);

    // Game's current location is always the snake head
    // Current snake head => (0,1)
    // Move right should be allowed
    // Move down should be allowed

    expect(game.getUserMove(Direction.RIGHT)).not.toBeNull();
    expect(game.getUserMove(Direction.DOWN)).not.toBeNull();
  });

  test('should return null if next cell is NOT allowed', () => {
    // Initialise a board of 2 by 2
    const game = new Game(2, 2, 2);

    // Game's current location is always the snake head
    // Current snake head => (0,1)
    // Move right should NOT be allowed
    // Move up should NOT be allowed

    expect(game.getUserMove(Direction.RIGHT)).toBeNull();
    expect(game.getUserMove(Direction.UP)).toBeNull();
  });

  test('should be gameover if moves into snake body', () => {
    // Initialise a board of 3 by 3
    const game = new Game(3, 3, 2);

    // Game's current location is always the snake head
    // Current snake head => (0,1)
    // Move left should end the game

    expect(game.play(game.getUserMove(Direction.LEFT)!)).toBeTrue();
  });

  test('should be NOT be gameover if DOESNT moves into snake body', () => {
    // Initialise a board of 3 by 3
    const game = new Game(3, 3, 2);

    // Game's current location is always the snake head
    // Current snake head => (0,1)
    // Move right should continue the game

    expect(game.play(game.getUserMove(Direction.RIGHT)!)).toBeFalse();
  });
});
