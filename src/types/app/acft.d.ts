interface IAcft {
  registration: string;
  owner?: string | null;
  operator?: strinf | null;
  serialNumber?: string | null;
  type?: string | null;
  model?: string | null;
  manufacturer?: string | null;
  minCrew?: number | null;
  maxPax?: number | null;
  year?: number | null;
  cvaValidDate?: string | null;
  caValidDate?: string | null;
  registrationDate?: string | null;
  gravame?: string | null;
  cancelDate?: string | null;
}

interface IUserAcft {
  acftId: string,
  userId: string,
  registration: string;
  model?: string | null;
  type?: string | null;
  manufacturer?: string | null;
  ias?: number,
  climbFuelFlow?: number,
  descentFuelFlow?: number,
  cruiseFuelFlow?: number,
  climbRate?: number,
  descentRate?: number,
  usableFuel?: number
}