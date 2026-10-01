export interface Teacher {
  id: number;
  name_th: string;
  name_en?: string | null;
  photo?: string | null;
  advise_years?: string[];
  contact?: string | null;
}
