import { mockSubjects } from "@/providers/mockSubjects";

export const DEPARTMENTS = Array.from(
    new Set(mockSubjects.map((subject) => subject.department))
).sort();

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
}));
