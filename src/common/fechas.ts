export function esFechaCalendario(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [anio, mes, dia] = value.split('-').map(Number);

  if (mes < 1 || mes > 12 || dia < 1) {
    return false;
  }

  const fecha = new Date(Date.UTC(anio, mes - 1, dia));

  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

export function rangoDelMes(mes: string): { desde: string; hasta: string } {
  const [anio, numeroMes] = mes.split('-').map(Number);
  const ultimoDia = new Date(Date.UTC(anio, numeroMes, 0)).getUTCDate();

  return {
    desde: `${mes}-01`,
    hasta: `${mes}-${String(ultimoDia).padStart(2, '0')}`,
  };
}
