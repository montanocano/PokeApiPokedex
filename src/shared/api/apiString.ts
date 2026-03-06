// url base de la pokeapi
// si algún dia cambia solo hay que tocar aqui

export class ApiString {
  private static readonly BASE_URL = "https://pokeapi.co/api/v2";

  static getAPIBase(): string {
    return this.BASE_URL;
  }
}