import tkinter as tk
import random

# --- Game Config ---
GAME_WIDTH = 400
GAME_HEIGHT = 400
SPACE_SIZE = 20
SPEED_START = 100
SPEED_INCREMENT = -2
MAX_SPEED = 50
INITIAL_BODY_PARTS = 3

SNAKE_COLOR = "#00FF00"
APPLE_COLORS = ["#FF0000", "#FFA500"]
BG_COLOR = "#000000"

WRAP_AROUND = False  # Set True if you want snake to wrap around edges

class SnakeGame:
    def __init__(self):
        self.window = tk.Tk()
        self.window.title("Snake Game")
        self.window.resizable(False, False)

        self.canvas = tk.Canvas(self.window, bg=BG_COLOR,
                                width=GAME_WIDTH, height=GAME_HEIGHT)
        self.canvas.pack()

        self.restart_button = tk.Button(self.window, text="Play Again",
                                        font=("Consolas", 14),
                                        command=self.restart_game, state="disabled")
        self.restart_button.pack(pady=10)

        self.window.bind("<Key>", self.change_direction)

        self.high_score = 0
        self.start_game()
        self.window.mainloop()

    def start_game(self):
        self.score = 0
        self.speed = SPEED_START
        self.direction = "Right"
        self.running = True
        self.current_apple_color = 0
        self.snake = [(SPACE_SIZE * i, 0) for i in reversed(range(INITIAL_BODY_PARTS))]
        self.apple_position = self.generate_apple()
        self.game_loop()

    def restart_game(self):
        self.canvas.delete("all")
        self.restart_button.config(state="disabled")
        self.start_game()

    def generate_apple(self):
        while True:
            x = random.randint(0, (GAME_WIDTH // SPACE_SIZE) - 1) * SPACE_SIZE
            y = random.randint(0, (GAME_HEIGHT // SPACE_SIZE) - 1) * SPACE_SIZE
            if (x, y) not in self.snake:
                return (x, y)

    def draw_elements(self):
        self.canvas.delete("all")

        # Draw snake
        for x, y in self.snake:
            self.canvas.create_rectangle(x, y, x + SPACE_SIZE, y + SPACE_SIZE, fill=SNAKE_COLOR)

        # Draw apple
        ax, ay = self.apple_position
        self.canvas.create_oval(ax, ay, ax + SPACE_SIZE, ay + SPACE_SIZE,
                                fill=APPLE_COLORS[self.current_apple_color])

        # Score and high score
        self.canvas.create_text(60, 10, text=f"Score: {self.score}", fill="white", font=("Consolas", 14))
        self.canvas.create_text(320, 10, text=f"High: {self.high_score}", fill="yellow", font=("Consolas", 14))

    def move_snake(self):
        head_x, head_y = self.snake[0]
        if self.direction == "Right":
            head_x += SPACE_SIZE
        elif self.direction == "Left":
            head_x -= SPACE_SIZE
        elif self.direction == "Up":
            head_y -= SPACE_SIZE
        elif self.direction == "Down":
            head_y += SPACE_SIZE

        if WRAP_AROUND:
            head_x %= GAME_WIDTH
            head_y %= GAME_HEIGHT
        else:
            if head_x < 0 or head_x >= GAME_WIDTH or head_y < 0 or head_y >= GAME_HEIGHT:
                self.running = False
                return

        new_head = (head_x, head_y)

        # Self-collision
        if new_head in self.snake:
            self.running = False
            return

        self.snake = [new_head] + self.snake[:-1]

    def grow_snake(self):
        self.snake.append(self.snake[-1])

    def check_apple_collision(self):
        if self.snake[0] == self.apple_position:
            self.score += 1
            self.apple_position = self.generate_apple()
            self.current_apple_color = 1 - self.current_apple_color
            self.grow_snake()
            if self.speed + SPEED_INCREMENT >= MAX_SPEED:
                self.speed += SPEED_INCREMENT

    def change_direction(self, event):
        new_dir = event.keysym
        opposites = {"Left": "Right", "Right": "Left", "Up": "Down", "Down": "Up"}
        if new_dir in opposites and new_dir != opposites.get(self.direction):
            self.direction = new_dir

    def game_loop(self):
        if not self.running:
            self.canvas.create_text(GAME_WIDTH // 2, GAME_HEIGHT // 2 - 20,
                                    text="GAME OVER", fill="red", font=("Consolas", 28))
            self.canvas.create_text(GAME_WIDTH // 2, GAME_HEIGHT // 2 + 20,
                                    text=f"Score: {self.score}", fill="white", font=("Consolas", 18))
            if self.score > self.high_score:
                self.high_score = self.score
            self.restart_button.config(state="normal")
            return

        self.move_snake()
        self.check_apple_collision()
        self.draw_elements()
        self.window.after(self.speed, self.game_loop)

# --- Run the game ---
if __name__ == "__main__":
    SnakeGame()
