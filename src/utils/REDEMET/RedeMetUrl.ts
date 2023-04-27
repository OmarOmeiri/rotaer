class RedeMetUrl {
  private METAR_URL = (from: string, to: string, icao: string) => (
    `https://api-redemet.decea.mil.br/mensagens/metar/${icao.toUpperCase()}`
    + `?api_key=${process.env.NEXT_PUBLIC_REDEMET_API_KEY}&data_ini=${from}&data_fim=${to}`
  );

  private parseDate(date: Date) {
    const d = {
      y: date.getUTCFullYear(),
      m: String(date.getUTCMonth() + 1).padStart(2, '0'),
      d: String(date.getUTCDate()).padStart(2, '0'),
      h: String(date.getUTCHours()).padStart(2, '0'),
    };
    return `${d.y}${d.m}${d.d}${d.h}`;
  }

  metar({
    from,
    to,
    icao,
  }: {from?: Date, to?: Date, icao: string}) {
    const now = new Date();
    const t = to || new Date(now.getTime() + 3.6e+6);
    const f = from || new Date(now.getTime() - 3.6e+6);
    return this.METAR_URL(this.parseDate(f), this.parseDate(t), icao);
  }
}

const redeMetUrl = new RedeMetUrl();
export default redeMetUrl;
