import { ProfileParticipantModel } from './register-form-profile-participant.model'

export interface RegisterFormModel {
  name: string | null,
  profileType: string | null,
  participants: ProfileParticipantModel[],
  profileName: string | null,
  city: string | null,
  email: string | null,
  password: string | null
}

