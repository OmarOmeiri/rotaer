interface IMETARResponse {
    status: boolean;
    message: number;
    data: {
      current_page: number;
      data: {
        id_localidade: string;
        validade_inicial: string;
        mens: string;
        recebimento: string;
      }[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      next_page_url: null;
      path: string;
      per_page: number;
      prev_page_url: null;
      to: number;
      total: number;
    };
}
