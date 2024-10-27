import pygame
import sys
import random

pygame.init()

WIDTH, HEIGHT = 1350, 750
GRID_SIZE = 25
FPS = 10
BACKGROUND_COLOR = (51, 51, 51)
SNAKE_COLOR = (0, 128, 0)
GOOD_FOOD_COLOR = (0, 255, 0)
BAD_FOOD_COLOR = (255, 0, 0)
OBSTACLE_COLOR = (255, 255, 255)
RED = (255, 0, 0)
WHITE = (255, 255, 255)

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snake Game")

font = pygame.font.Font(None, 36)
question_font = pygame.font.Font(None, 28)

clock = pygame.time.Clock()

# Load images
snake_img = pygame.image.load("skin.jpg").convert_alpha()
snake_img = pygame.transform.scale(snake_img, (GRID_SIZE, GRID_SIZE))
background_img = pygame.image.load("background.jpg").convert()

snake = [(100, 100), (90, 100), (80, 100)]
snake_direction = (GRID_SIZE, 0)

good_food = (random.randrange(0, WIDTH, GRID_SIZE), random.randrange(0, HEIGHT, GRID_SIZE))
bad_food = (random.randrange(0, WIDTH, GRID_SIZE), random.randrange(0, HEIGHT, GRID_SIZE))

obstacles = [(300, 300), (350, 350), (400, 400)]

questions = [
    {"question": "who is the father of nation?",
     "options": ["A: Mahatma gandhi ", "B: Nehru"], "correct_option": "A", "color": GOOD_FOOD_COLOR},
    {"question": "What is the time complexity of inserting an element into a hash table?",
     "options": ["A: O(1)", "B: O(log n)"], "correct_option": "A", "color": GOOD_FOOD_COLOR},
    {"question": "Which data structure uses LIFO order?",
     "options": ["A: Queue", "B: Stack"], "correct_option": "B",  "color": BAD_FOOD_COLOR},
    {"question": "What is the main purpose of a linked list?",
     "options": ["A: Efficient searching", "B: Dynamic memory allocation"],
     "correct_option": "B", "color": GOOD_FOOD_COLOR},
]

# Load sound effects
eat_sound = pygame.mixer.Sound("static/eat_sound.mp3")
hit_sound = pygame.mixer.Sound("static/hi.mp3")

# Load background music
pygame.mixer.music.load("static/back.mp3")
pygame.mixer.music.set_volume(0.5)  
pygame.mixer.music.play(-1)  

current_question = None
score = 0

# Restart button
restart_button = pygame.Rect(WIDTH // 2 - 50, HEIGHT - 40, 100, 30)
restart_text = font.render("Play Again", True, WHITE)

def restart_game():
    global snake, snake_direction, good_food, bad_food, current_question, score
    snake = [(100, 100), (90, 100), (80, 100)]
    snake_direction = (GRID_SIZE, 0)
    good_food = (random.randrange(0, WIDTH, GRID_SIZE), random.randrange(0, HEIGHT, GRID_SIZE))
    bad_food = (random.randrange(0, WIDTH, GRID_SIZE), random.randrange(0, HEIGHT, GRID_SIZE))
    current_question = None
    score = 0

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.mixer.music.stop()  
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP and snake_direction != (0, GRID_SIZE):
                snake_direction = (0, -GRID_SIZE)
            elif event.key == pygame.K_DOWN and snake_direction != (0, -GRID_SIZE):
                snake_direction = (0, GRID_SIZE)
            elif event.key == pygame.K_LEFT and snake_direction != (GRID_SIZE, 0):
                snake_direction = (-GRID_SIZE, 0)
            elif event.key == pygame.K_RIGHT and snake_direction != (-GRID_SIZE, 0):
                snake_direction = (GRID_SIZE, 0)
        
        if event.type == pygame.MOUSEBUTTONDOWN:
            if restart_button and restart_button.collidepoint(event.pos):
                restart_game()

    if current_question is None:
        current_question = random.choice(questions)
        good_food_color = current_question["color"]
        bad_food_color = GOOD_FOOD_COLOR if good_food_color == BAD_FOOD_COLOR else BAD_FOOD_COLOR

        good_food = (random.randrange(0, WIDTH, GRID_SIZE), random.randrange(0, HEIGHT, GRID_SIZE))
        bad_food = (random.randrange(0, WIDTH, GRID_SIZE), random.randrange(0, HEIGHT, GRID_SIZE))

    new_head = (snake[0][0] + snake_direction[0], snake[0][1] + snake_direction[1])
    snake = [new_head] + snake[:-1]

    if new_head[0] < 0 or new_head[0] >= WIDTH or new_head[1] < 0 or new_head[1] >= HEIGHT:
        restart_button = pygame.Rect(WIDTH // 2 - 50, HEIGHT - 40, 100, 30)  
        current_question = None
        continue

    if new_head in snake[1:]:
        restart_button = pygame.Rect(WIDTH // 2 - 50, HEIGHT - 40, 100, 30)  
        current_question = None
        continue

    if new_head in obstacles:
        restart_button = pygame.Rect(WIDTH // 2 - 50, HEIGHT - 40, 100, 30)  
        current_question = None
        continue

    if (new_head[0] == good_food[0] and new_head[1] == good_food[1]):
        score += 10
        snake.extend([snake[-1], snake[-1]])
        current_question = None
        good_food = (random.randrange(0, WIDTH, GRID_SIZE), random.randrange(0, HEIGHT, GRID_SIZE))
        eat_sound.play()

    if (new_head[0] == bad_food[0] and new_head[1] == bad_food[1]):
        if len(snake) > 2:
            score -= 10
            snake = snake[:-2]
        current_question = None
        bad_food = (random.randrange(0, WIDTH, GRID_SIZE), random.randrange(0, HEIGHT, GRID_SIZE))
        hit_sound.play()

    screen.blit(background_img, (0, 0))

    pygame.draw.rect(screen, RED, (0, 0, WIDTH, HEIGHT), 5)

    for obstacle in obstacles:
        pygame.draw.rect(screen, OBSTACLE_COLOR, (obstacle[0], obstacle[1], GRID_SIZE, GRID_SIZE))

    for segment in snake:
        screen.blit(snake_img, (segment[0], segment[1]))

    pygame.draw.rect(screen, GOOD_FOOD_COLOR, (good_food[0], good_food[1], GRID_SIZE, GRID_SIZE))
    pygame.draw.rect(screen, BAD_FOOD_COLOR, (bad_food[0], bad_food[1], GRID_SIZE, GRID_SIZE))

    score_text = font.render(f"Score: {score}", True, WHITE)
    screen.blit(score_text, (10, 10))

    if current_question:
        question_text = question_font.render(current_question["question"], True, WHITE)
        screen.blit(question_text, (50, 50))

        for i, option in enumerate(current_question["options"]):
            option_text = question_font.render(option, True, WHITE)
            screen.blit(option_text, (50, 100 + i * 30))

    if restart_button:
        restart_button = pygame.Rect(WIDTH // 2 - 50, HEIGHT - 40, 100, 30)  
        screen.blit(restart_text, (WIDTH // 2 - restart_text.get_width() // 2, HEIGHT - 35))

    pygame.display.flip()

    clock.tick(FPS)
