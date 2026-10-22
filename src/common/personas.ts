export const PERSONAS = ['papa', 'hermano'] as const;

export type Persona = (typeof PERSONAS)[number];
