export interface Duration {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function calculateDuration(startDateStr: string): Duration {
  const dataInicio = new Date(startDateStr);
  const agora = new Date();
  const diferenca = agora.getTime() - dataInicio.getTime();

  if (diferenca < 0) {
    return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const segundosTotal = Math.floor(diferenca / 1000);
  const minutosTotal = Math.floor(segundosTotal / 60);
  const horasTotal = Math.floor(minutosTotal / 60);

  const years = Math.floor(horasTotal / (24 * 365.25));
  const days = Math.floor((horasTotal / 24) % 365.25);
  const hours = horasTotal % 24;
  const minutes = minutosTotal % 60;
  const seconds = segundosTotal % 60;

  return { years, days, hours, minutes, seconds };
}
