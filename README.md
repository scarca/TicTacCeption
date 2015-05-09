# TicTacCeption
Play tic tac toe inside of tic tac toe. 
Play online at https://scarca.github.io/TicTacCeption/

Rules of the Game: 
==================
1. The first player may play in any tiny cell. 
2. All players after that must play in a large cell corresponding to that small cell's section. (see clarification) 
3. If someone wins a tiny board, they win that cell on the large board 
4. Win 3 adjacent cells on the big board to win! 

####Clarification: 
Imagine each cell is a matrix: 
        
        0  1  2
    0   __|__|__
    1   __|__|__
    2     |  | 

If Player 1 plays in (1, 2), then Player 2 must play in any cell of the tiny board at (1, 2) ON THE LARGE BOARD. Example: 

    __|__|__  |  __|__|__  |  __|__|__    Player 1 (X) played in (1, 1) of the top left corner for his first move.
    __|_X|__  |  __|__|__  |  __|__|__    Thus, Player 2 could play anywhere in the center tile of the large board 
      |  |    |    |  |    |    |  |              and chose to play in the bottom-center of the center tile. 
    -----------------------------------
    __|__|__  |  __|__|__  |  __|__|__
    __|__|__  |  __|__|__  |  __|__|__
      |  |    |    |_O|    |    |  |   
    -----------------------------------
    __|__|__  |  __|__|__  |  __|__|__
    __|__|__  |  __|__|__  |  __|__|__
      |  |    |    |  |    |    |  |   
  
Instructions to use
===================
1. Download the repository. There is a little button on the right-hand bar of the page that says "download zip" 
2. Unzip and open "index.html" 
3. Enjoy! 

NOTE: IE 8 AND BELOW ARE NOT SUPPORTED. 
