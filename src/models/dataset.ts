class Dataset {
  private name: string;
  private label: string;
  private color: string;
  private index: number;
  private values: number[];

  constructor(name: string, label: string, index: number, color?: string) {
    this.name = name;
    this.label = label;
    this.index = index;
    this.color = color;
    this.values = [];
    this.color = color != undefined ? color : '#FF0000';
  }

  public add(value:number): void {
    this.values.push(value);
  }

  public getValues(): number[] {
    return this.values;
  }

  public getLength(): number {
    return this.values.length;
  }

  public getLastValue(): number {
    return this.values[this.values.length - 1];
  }

  public getName(): string {
    return this.name;
  }

  public getLabel(): string {
    return this.label;
  }

  public getColor(): string {
    return this.color;
  }

  public getIndex(): number {
    return this.index;
  }
}