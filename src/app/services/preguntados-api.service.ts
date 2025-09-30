import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreguntadosApiService {
  private apiUrl = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';

  async getPreguntas() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      return data.results.map((pregunta: any) => {
        pregunta.question = this.decodificarHTML(pregunta.question);

        pregunta.opciones = [
          ...pregunta.incorrect_answers,
          pregunta.correct_answer
        ]
          .map((opcion) => this.decodificarHTML(opcion))
          .sort(() => Math.random() - 0.5);

        return pregunta;
      });
    } catch (error) {
      console.error('Error cargando preguntas:', error);
      return [];
    }
  }

  private decodificarHTML(html: string) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
