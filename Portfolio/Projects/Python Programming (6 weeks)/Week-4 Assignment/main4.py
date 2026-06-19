import random

print("Welcome to Connect Four")
print("-----------------------")

possibleLetters = ["A","B","C","D","E","F","G",]
gameBoard = [["","","","","","",""], ["","","","","","",""], ["","","","","","",""], ["","","","","","",""], ["","","","","","",""], ["","","","","","",""]]

rows = 6
cols = 7

def printGameBoard():
    print("\n     A    B    C    D    E    F    G    ", end="")
    for x in range(rows):
        print("\n   +----+----+----+----+----+----+----+")
        print(x, " |", end="")
        for y in range(cols):
            if(gameBoard[x][y] == "🔵"):
                print("", gameBoard[x][y], end=" |")
            elif(gameBoard[x][y] == "🔴"):
                print("", gameBoard[x][y], end=" |")
            else:
                print(" ", gameBoard[x][y], end="  |")
    print("\n   +----+----+----+----+----+----+----+")

def modifyArray(row, col, turn):
    gameBoard[row][col] = turn

def checkForWinner(chip):
    # Horizontal check
    for r in range(rows):
        for c in range(cols - 3):
            if all(gameBoard[r][c + i] == chip for i in range(4)):
                print(f"\nGame Over! {chip} wins!")
                return True

    # Vertical check
    for r in range(rows - 3):
        for c in range(cols):
            if all(gameBoard[r + i][c] == chip for i in range(4)):
                print(f"\nGame Over! {chip} wins!")
                return True

    # Diagonal /
    for r in range(3, rows):
        for c in range(cols - 3):
            if all(gameBoard[r - i][c + i] == chip for i in range(4)):
                print(f"\nGame Over! {chip} wins!")
                return True

    # Diagonal \
    for r in range(rows - 3):
        for c in range(cols - 3):
            if all(gameBoard[r + i][c + i] == chip for i in range(4)):
                print(f"\nGame Over! {chip} wins!")
                return True

    return False

def coordinateParse(inputString):
    if len(inputString) < 2:
        return None
    column_char = inputString[0].upper()
    if column_char not in possibleLetters:
        return None
    try:
        row = int(inputString[1])
    except:
        return None
    col = possibleLetters.index(column_char)
    return (row, col)

def getAvailableRow(col):
    for r in range(rows - 1, -1, -1):
        if gameBoard[r][col] == "":
            return r
    return None

turnCounter = 0
while True:
    printGameBoard()
    winner = False

    if turnCounter % 2 == 0:
        # Player turn
        while True:
            move = input("\nChoose a space (e.g., A0 - A5): ").strip().upper()
            coord = coordinateParse(move)
            if coord is None:
                print("Invalid input. Try again.")
                continue
            row, col = coord
            row = getAvailableRow(col)
            if row is not None:
                modifyArray(row, col, '🔵')
                break
            else:
                print("Column full. Pick another.")

        winner = checkForWinner('🔵')
    else:
        # CPU turn
        while True:
            col = random.randint(0, 6)
            row = getAvailableRow(col)
            if row is not None:
                modifyArray(row, col, '🔴')
                print(f"\nCPU dropped in column {possibleLetters[col]}")
                break

        winner = checkForWinner('🔴')

    if winner:
        printGameBoard()
        break

    turnCounter += 1
