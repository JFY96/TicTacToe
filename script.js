const gameBoard = (() => {
    // 0,1,2
    // 3,4,5
    // 6,7,8
    const _defaultState = new Array(9).fill(null);

    let _state;
    let _playerTurn; // 0 - O, 1 - X

    const get = () => {
        return _state;
    };

    const reset = (firstPlayerNoughts = false) => {
        _state = { ..._defaultState };
        _playerTurn = firstPlayerNoughts ? 0 : 1;
    };

    const play = (position) => {
        if (position > 8 || position < 0 || _state[position] !== null) return false;
        _state[position] = playerTurn;
        _playerTurn = _playerTurn ? 0 : 1; // switch player
        return true;
    };

    reset();

    return {
        get,
        reset,
        play,
    };
})();