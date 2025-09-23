import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomNumbers{
  getRandomNumber(min:number, max: number) {
    if (min > max) {
      throw new Error('El mínimo no puede ser mayor que el máximo');
    }

    return Math.floor((Math.random() *(max - min + 1)) + min);
  }
}
