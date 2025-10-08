export type SortKey = "name" | "position" | "nationality";
export type SortDir = "asc" | "desc";

export type Player = {
    id: number;
    name: string;
    position?: string;
    nationality?: string;
    dateOfBirth?: string;
    image?: string | null; // from TheSportsDB
};