export interface PersonForm {
  name: string;
  nickName: string | null;
  description: string | null;
  active: boolean;
}

export interface PersonList {
  id: string;
  name: string;
  nickName: string | null;
  description: string | null;
  active: boolean;
}
