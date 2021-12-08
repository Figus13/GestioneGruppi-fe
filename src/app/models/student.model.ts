export class Student
{
  name;
  firstName;
  id;

  constructor(id, name, firstName)
  {
    this.name = name;
    this.firstName = firstName;
    this.id = id;
  }

  static equals(s: Student, s2: Student){
    return s.id === s2.id && s.name === s2.name && s.firstName === s2.firstName;
  }
}
