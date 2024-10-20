import { useEffect, useState } from "react";

type Card = {
    id: number;
    number: number;
};

const MemoryGame = () => {
    const [gridSize, setGridSize] = useState<number>(4);
    const [maxMoves, setMaxMoves] = useState<number>(5);
    const [initialMaxMoves, setInitialMaxMoves] = useState<number>(5);
    const [cards, setCards] = useState<Card[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [solved, setSolved] = useState<number[]>([]);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [won, setWon] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    // Update function for grid size
    const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(e.target.value);
        if (size >= 2 && size <= 10) {
            setGridSize(size);
        }
    };

    // Update function for max moves
    const handleMaxMovesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const moves = parseInt(e.target.value);
        setInitialMaxMoves(moves);
        setMaxMoves(moves);
    };

    // Initialize the game board
    const initializeGame = () => {
        const totalCards = gridSize * gridSize;
        const pairCount = Math.floor(totalCards / 2);
        const numbers = [...Array(pairCount).keys()].map((x) => x + 1);
        const shuffledCards = [...numbers, ...numbers]
            .sort(() => Math.random() - 0.5)
            .slice(0, totalCards)
            .map((number, index) => ({
                id: index,
                number,
            }));

        setCards(shuffledCards);
        setGameStarted(false);
        setFlipped([]);
        setSolved([]);
        setWon(false);
        setGameOver(false);
        setDisabled(false);
    };

    // Check for match between two flipped cards
    const checkMatch = (secondId: number) => {
        const [firstId] = flipped;
        if (cards[firstId].number === cards[secondId].number) {
            setSolved((prevSolved) => [...prevSolved, firstId, secondId]);
            setFlipped([]);
            setDisabled(false);
        } else {
            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
            }, 1000);
        }
    };

    // Handle card click
    const handleClick = (id: number) => {
        setGameStarted(true);
        if (disabled || won || gameOver) return;

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            if (id !== flipped[0]) {
                setFlipped((prevFlipped) => [...prevFlipped, id]);
                setDisabled(true);
                checkMatch(id);

                // Only decrease moves if maxMoves is greater than 0 (unlimited if maxMoves is 0)
                if (maxMoves > 0) {
                    setMaxMoves((prevMoves) => prevMoves - 1);
                }
            } else {
                setFlipped([]);
                setDisabled(false);
            }
        }
    };

    // Determine if card is flipped
    const isFlipped = (id: number) => {
        return flipped.includes(id) || solved.includes(id);
    };

    // Determine if card is solved
    const isSolved = (id: number) => {
        return solved.includes(id);
    };

    // Check if all cards are solved
    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true);
        }
    }, [solved, cards]);

    // Handle maxMoves reaching 0 for game over
    useEffect(() => {
        if (maxMoves === 0 && gameStarted) {
            setGameOver(true);
            setDisabled(true);
        }
    }, [maxMoves, gameStarted]);

    // Initialize game on gridSize change or reset
    useEffect(() => {
        initializeGame();
    }, [gridSize]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100 p-4">
            <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

            {/* Input */}
            <div className="flex flex-col gap-3">
                <div>
                    <label htmlFor="gridSize" className="mr-2">Grid Size:</label>
                    <input
                        type="number"
                        id="gridSize"
                        min={2}
                        max={10}
                        value={gridSize}
                        onChange={handleGridSizeChange}
                        className="border-2 border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>

                <div>
                    <label htmlFor="maxMoves" className="mr-2">Max Moves (0 for unlimited)</label>
                    <input
                        type="number"
                        id="maxMoves"
                        value={maxMoves}
                        disabled={gameStarted}
                        onChange={handleMaxMovesChange}
                        className="border-2 border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>
            </div>

            {/* Max Moves */}
            {maxMoves > 0 && !gameOver && (
                <div className="mt-4 text-2xl font-bold">Max Moves: {maxMoves} / {initialMaxMoves}</div>
            )}

            {/* Game Board */}
            <div
                className={`grid gap-2 my-4`}
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                    width: `min(100%, ${gridSize * 5.5}rem)`,
                }}
            >
                {cards.map((card) => {
                    return (
                        <div
                            key={card.id}
                            onClick={() => handleClick(card.id)}
                            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                                isFlipped(card.id)
                                    ? isSolved(card.id)
                                        ? "bg-green-500 text-white"
                                        : "bg-blue-500 text-white"
                                    : "bg-gray-300 text-gray-400"
                            }`}
                        >
                            {isFlipped(card.id) ? card.number : "?"}
                        </div>
                    );
                })}
            </div>

            {/* Game Status */}
            <div>
                {won && (
                    <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
                        'You won!'
                    </div>
                )}
                {gameOver && (
                    <div className="mt-4 text-4xl font-bold text-red-600 animate-bounce">
                        'Game Over'
                    </div>
                )}
            </div>

            {/* Reset / Play Again Btn */}
            <button
                onClick={initializeGame}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                {won || gameOver ? "Play Again" : "Reset"}
            </button>
        </div>
    );
};

export default MemoryGame;
