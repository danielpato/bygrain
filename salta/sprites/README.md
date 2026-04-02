# Sprite Size Guide

These placeholder files are included so you can replace them with your own art:

- `player-idle.png` - **88 x 100 px**
- `player-run-1.png` - **88 x 100 px**
- `player-run-2.png` - **88 x 100 px**
- `obstacle.png` - **64 x 128 px**

Optional backward-compatibility file:

- `player.png` (single-frame sprite API)

The game renders these into in-game sizes:

- Player render box: `62 x 72`
- Obstacles: variable (about `30-48` wide and `58-102` high), so obstacle art should still look good when scaled.

Animation behavior:

- While waiting/game over: uses `player-idle.png`
- While playing (running or jumping): alternates `player-run-1.png` and `player-run-2.png`

Tips:

- Use transparent PNG backgrounds.
- Keep the character and obstacle centered with a little padding.
- Keep all 3 player frames aligned to avoid visual jitter.
- If your art is blurry, export at 2x or 3x while keeping the same aspect ratio.
