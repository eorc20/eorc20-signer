class State {
    public approve = 0;
    public error = 0;
    public retry = 0;
    public finalBlocks = new Set<string>();
}

export default new State();
