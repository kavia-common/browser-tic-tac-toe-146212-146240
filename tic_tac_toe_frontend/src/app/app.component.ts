import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * AppComponent is the root component rendering the Tic Tac Toe game board,
 * status message, and restart controls. It manages game state, detects wins,
 * prevents invalid moves, and applies themed styling.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  /** Title for header and metadata */
  title = 'Tic Tac Toe';

  // Signals to manage reactive state
  private board = signal<Array<('X' | 'O' | null)>>(Array(9).fill(null));
  private xIsNext = signal<boolean>(true);
  private gameOver = signal<boolean>(false);
  private _winner = signal<'X' | 'O' | null>(null);
  private winningLine = signal<number[] | null>(null);

  /**
   * PUBLIC_INTERFACE
   * statusMessage computes the current status string (turn, win, or draw).
   */
  statusMessage = computed(() => {
    if (this.winner()) {
      return `Player ${this.winner()} wins!`;
    }
    if (this.gameOver()) {
      return "It's a draw!";
    }
    return `Player ${this.xIsNext() ? 'X' : 'O'}'s turn`;
  });

  /**
   * PUBLIC_INTERFACE
   * winner exposes the current winner value for the template.
   */
  winner(): 'X' | 'O' | null {
    return this._winner();
  }

  /**
   * PUBLIC_INTERFACE
   * getCell returns the value at a given index in the board.
   */
  getCell(i: number): 'X' | 'O' | null {
    return this.board()[i];
  }

  /**
   * PUBLIC_INTERFACE
   * isWinningIndex checks if an index is part of the winning combination.
   */
  isWinningIndex(i: number): boolean {
    const line = this.winningLine();
    return !!line && line.includes(i);
  }

  /**
   * PUBLIC_INTERFACE
   * onCellClick handles a user's move, preventing moves after game end
   * or in filled squares. It toggles players and checks for winner or draw.
   */
  onCellClick(i: number): void {
    if (this.gameOver()) return;
    const current = this.board();
    if (current[i] !== null) return;

    const nextBoard = current.slice();
    nextBoard[i] = this.xIsNext() ? 'X' : 'O';
    this.board.set(nextBoard);

    const result = this.calculateWinner(nextBoard);
    if (result) {
      this._winner.set(result.player);
      this.winningLine.set(result.line);
      this.gameOver.set(true);
      return;
    }

    if (nextBoard.every((c) => c !== null)) {
      this.gameOver.set(true);
      return;
    }

    this.xIsNext.set(!this.xIsNext());
  }

  /**
   * PUBLIC_INTERFACE
   * restart resets the game to initial state.
   */
  restart(): void {
    this.board.set(Array(9).fill(null));
    this.xIsNext.set(true);
    this.gameOver.set(false);
    this._winner.set(null);
    this.winningLine.set(null);
  }

  // Check all winning lines for a winner
  private calculateWinner(
    squares: Array<'X' | 'O' | null>
  ): { player: 'X' | 'O'; line: number[] } | null {
    const lines: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: [a, b, c] };
      }
    }
    return null;
  }
}
