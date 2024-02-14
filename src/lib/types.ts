export type ProjectMessage = {
  Id: number,
  DeploymentCode: number,
  ProjectId: string,
  User: string,
  Assistant: string,
  Prompt_tokens: number,
  Completion_tokens: number,
  Total_tokens: number,
  CreatedAt: string,
  UpdatedAt: string,
  IsDeleted: boolean
}
