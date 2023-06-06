class Sequence {
  constructor(
    private start: number,
    private step: number,
  ) {}

  get(index: number) {
    return this.start + (index * this.step);
  }
}

export default Sequence;

