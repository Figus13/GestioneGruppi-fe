import {Team} from "./team.model";
import {Student} from "./student.model";
import {StudentWithStatus} from './studentWithStatus.model';

export class PropostaTeam
{
  teamDTO: Team;
  studentWithStatusDTOS: StudentWithStatus[];
  token: string;


  constructor(teamDTO, studentWithStatus, token)
  {
    this.teamDTO = teamDTO;
    this.studentWithStatusDTOS = studentWithStatus;
    this.token = token;
  }

}
