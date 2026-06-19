import pygame, sys

# --- Init ---
pygame.init()
WIDTH, HEIGHT = 800, 400
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("🔥 Pong Game - Enhanced 🔥")
clock = pygame.time.Clock()

# --- Colors ---
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (66, 135, 245)
RED = (230, 57, 70)
GREEN = (46, 204, 113)
BG_COLOR = (30, 30, 30)

# --- Fonts ---
font = pygame.font.SysFont("arial", 30)
big_font = pygame.font.SysFont("arial", 50)

# --- Constants ---
PADDLE_WIDTH, PADDLE_HEIGHT = 10, 80
BALL_SIZE = 20
PADDLE_SPEED = 6
BALL_SPEED_X = 5
BALL_SPEED_Y = 5

# --- Game State ---
score_p1 = 0
score_p2 = 0
high_score = 0

# --- Game Objects ---
paddle1 = pygame.Rect(50, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
paddle2 = pygame.Rect(WIDTH - 50 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
ball = pygame.Rect(WIDTH // 2 - BALL_SIZE // 2, HEIGHT // 2 - BALL_SIZE // 2, BALL_SIZE, BALL_SIZE)
ball_dx, ball_dy = BALL_SPEED_X, BALL_SPEED_Y

# --- Helper Functions ---
def reset_ball():
    global ball_dx, ball_dy
    ball.center = (WIDTH // 2, HEIGHT // 2)
    ball_dx *= -1
    ball_dy *= -1

def draw_scores():
    p1_text = font.render(f"P1: {score_p1}", True, BLUE)
    p2_text = font.render(f"P2: {score_p2}", True, RED)
    hs_text = font.render(f"High Score: {high_score}", True, GREEN)
    screen.blit(p1_text, (30, 20))
    screen.blit(p2_text, (WIDTH - 130, 20))
    screen.blit(hs_text, (WIDTH // 2 - 100, 20))

def draw_play_again():
    button_rect = pygame.Rect(WIDTH//2 - 100, HEIGHT//2 - 25, 200, 50)
    pygame.draw.rect(screen, GREEN, button_rect)
    text = font.render("Play Again", True, BLACK)
    screen.blit(text, (WIDTH//2 - 70, HEIGHT//2 - 10))
    return button_rect

def wait_for_click():
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit(); sys.exit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                if draw_play_again().collidepoint(event.pos):
                    return

# --- Game Loop ---
while True:
    # --- Event Handling ---
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit(); sys.exit()

    # --- Key Presses ---
    keys = pygame.key.get_pressed()
    if keys[pygame.K_w] and paddle1.top > 0:
        paddle1.y -= PADDLE_SPEED
    if keys[pygame.K_s] and paddle1.bottom < HEIGHT:
        paddle1.y += PADDLE_SPEED
    if keys[pygame.K_UP] and paddle2.top > 0:
        paddle2.y -= PADDLE_SPEED
    if keys[pygame.K_DOWN] and paddle2.bottom < HEIGHT:
        paddle2.y += PADDLE_SPEED

    # --- Ball Movement ---
    ball.x += ball_dx
    ball.y += ball_dy

    # Wall bounce
    if ball.top <= 0 or ball.bottom >= HEIGHT:
        ball_dy *= -1

    # Paddle bounce
    if ball.colliderect(paddle1) or ball.colliderect(paddle2):
        ball_dx *= -1

    # Score Check
    if ball.left <= 0:
        score_p2 += 1
        high_score = max(high_score, score_p2)
        screen.fill(BG_COLOR)
        draw_scores()
        pygame.display.flip()
        pygame.time.delay(500)
        reset_ball()
        draw_play_again()
        pygame.display.flip()
        wait_for_click()

    elif ball.right >= WIDTH:
        score_p1 += 1
        high_score = max(high_score, score_p1)
        screen.fill(BG_COLOR)
        draw_scores()
        pygame.display.flip()
        pygame.time.delay(500)
        reset_ball()
        draw_play_again()
        pygame.display.flip()
        wait_for_click()

    # --- Drawing ---
    screen.fill(BG_COLOR)
    draw_scores()
    pygame.draw.rect(screen, BLUE, paddle1)
    pygame.draw.rect(screen, RED, paddle2)
    pygame.draw.ellipse(screen, WHITE, ball)
    pygame.draw.aaline(screen, WHITE, (WIDTH // 2, 0), (WIDTH // 2, HEIGHT))

    # --- Update ---
    pygame.display.flip()
    clock.tick(60)
