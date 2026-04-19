export type Roles = 'hotwife' | 'cuckold' | 'dominador' | 'bull'

export interface ProfileParticipantModel {
  name: string | null,
  genre: string | null,
  birthDate: string | null,
  bodyType: string | null,
  role: Roles[],
}
