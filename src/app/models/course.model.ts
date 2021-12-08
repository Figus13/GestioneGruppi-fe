export class Course
{
  name;
  acronimo;
  min;
  max;
  enabled;
  constructor(name, acronimo, min, max, enabled)
  {
    this.name = name;
    this.acronimo = acronimo;
    this.min = min;
    this.max = max;
    this.enabled = enabled
  }

  static equals(c1: Course, c2: Course){
    return c1.name === c2.name;
  }
}
