import { FavoriteSeries } from './favorite-series.interface';

export interface User {
  id: string;
  username: string;
  favoriteSeries: FavoriteSeries[];
}
